import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [degree, setDegree] = useState('');

    const reqFields = [username, email, name, password, degree];

    const history = useHistory();

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
        };
        httpService.postRequest(URLS.USERS, body).subscribe((accountLink) => {
            // TODO: Change this when exiting test mode in stripe
            const stateToMaintain = JSON.stringify({
                email
            })

            window.location.href = `https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_KfhYejJvknzeT11hZpLgSWuzeVxTOkxT&state=${stateToMaintain}`;

            // if (accountLink) {
            // window.location.href = accountLink.url;
            // }
            // history.push('/signup/success');
        });
    };

    const signUpForm = () => {
        return (
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
                {/* <div className="form-group switch-field">
                    <p>List as Tutor</p>
                    <InputSwitch checked={appliedAsTutor} onChange={(e) => setAppliedAsTutor(e.value)} />
                </div>
                {appliedAsTutor && fieldsForTutor()} */}
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

                <p className="login-message">
                    Already have an account
                    <span
                        onClick={() => {
                            history.push('/login');
                        }}
                    >
                        Login
                    </span>
                </p>
            </form>
        );
    };

    return (
        <div className="signup-component user-page-bg">
            <div className="container-fluid bg-overlay">
                <div className="signup-card-div d-flex j-center row">
                    <div className="signup-card col-md-4">
                        {signUpForm()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
