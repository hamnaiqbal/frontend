import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useState } from 'react';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [degree, setDegree] = useState('');
    const [appliedAsTutor, setAppliedAsTutor] = useState(false);
    const [tutorReason, setTutorReason] = useState('');
    const [cvLink, setCvLink] = useState('');

    const reqFields = [username, email, name, password, degree];

    const degrees = [
        { label: 'Computer Science', value: 'CS' },
        { label: 'Software Engineering', value: 'SE' },
    ];

    const validateForm = () => {
        let validForm = true;

        reqFields.forEach((field) => {
            if (!field) {
                validForm = false;
                return;
            }
        });
        return validForm;
    };

    const signUp = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            miscService.handleError('Empty Fields');
            return;
        }

        const body = {
            username,
            email,
            name,
            password,
            degree,
            appliedAsTutor,
            tutorReason,
            cvLink,
        };
        httpService.postRequest(URLS.USERS, body).subscribe();
    };

    const uploadCV = (event) => {
        const data = { cvLink: event.target.files[0] };
        httpService.postRequest(URLS.UPLOAD_CV, data, true).subscribe((data) => {
            console.log(data);
            setCvLink(data.cvLink);
        });
    };

    const fieldsForTutor = () => {
        return (
            <div>
                <div className="form-group p-float-label">
                    <textarea
                        rows="5"
                        value={tutorReason}
                        id="tutorReason"
                        className="form-control single-control"
                        onChange={(e) => {
                            setTutorReason(e.target.value);
                        }}
                    />
                    <label htmlFor="tutorReason">Tell Us Why You should be listed as tutor?</label>
                </div>
                <div className="form-group">
                    <div className="upload-attachment-wrapper">
                        <p>
                            <i className="pi pi-upload"></i>
                            Upload Your CV
                        </p>
                    </div>
                    <input
                        type="file"
                        id="attachmentLink"
                        className="form-control-file attachment-input"
                        name="attachmentLink"
                        onChange={(e) => {
                            uploadCV(e);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="signup-component d-flex a-center">
            <div className="container">
                <div className="signup-card-div d-flex j-center row">
                    <div className="signup-card col-md-5">
                        <form>
                            <h2>Sign Up</h2>
                            <div className="sp-20"></div>
                            <div className="form-group p-float-label">
                                <InputText
                                    value={email}
                                    type="text"
                                    required
                                    id="email"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-group p-float-label">
                                <InputText
                                    value={username}
                                    type="text"
                                    id="username"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="form-group p-float-label">
                                <InputText
                                    value={name}
                                    type="text"
                                    id="name"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="form-group p-float-label">
                                <Password
                                    value={password}
                                    id="password"
                                    className="single-control"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="form-group">
                                <Dropdown
                                    value={degree}
                                    options={degrees}
                                    filter
                                    placeholder="Select Degree"
                                    className="single-control"
                                    onChange={(e) => {
                                        setDegree(e.value);
                                    }}
                                />
                            </div>
                            <div className="form-group switch-field">
                                <p>List as Tutor</p>
                                <InputSwitch checked={appliedAsTutor} onChange={(e) => setAppliedAsTutor(e.value)} />
                            </div>
                            {appliedAsTutor && fieldsForTutor()}
                            <div className="form-group">
                                <button
                                    onClick={(e) => {
                                        signUp(e);
                                    }}
                                    className="btn submit-button form-control primary-gradient"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
