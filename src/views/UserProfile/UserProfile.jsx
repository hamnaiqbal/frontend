import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import userService from '../../services/userservice';

export default function UserProfile(props) {
    const [editable, setEditable] = useState(false);
    const [user, setUser] = useState({});

    const [profileImage, setProfileImage] = useState('');

    const [isDialog, setIsDialog] = useState(false);

    const [passwords, setPasswords] = useState({});

    const dialogProfileFields = [
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Username', key: 'username', type: 'text' },
        { label: 'Email', key: 'email', type: 'email' },
        { label: 'Department', key: 'degree', type: 'text' },
        { label: 'Reason to Become Tutor', key: 'tutorReason', type: 'textarea' },
    ];

    const pageProfileFields = [
        { label: 'Name', key: 'name', type: 'text', disabled: false },
        { label: 'Username', key: 'username', type: 'text', disabled: true },
        { label: 'Email', key: 'email', type: 'email', disabled: false },
        { label: 'Department', key: 'degree', type: 'text', disabled: false },
    ];
    
    const addressFields = [
        { label: 'City', key: 'city', type: 'text', disabled: false },
        { label: 'Country', key: 'country', type: 'text', disabled: false },
    ]

    const passwordFields = [
        { label: 'Current Password', key: 'password', type: 'password' },
        { label: 'New Password', key: 'newPassword', type: 'password' },
    ];

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
            setIsDialog(true);
            setEditable(false);
        } else {
            if (userService.isLoggedIn()) {
                setUser(userService.getLoggedInUser());
                setIsDialog(false);
                setEditable(true);
            }
        }
    }, []);

    const personalInfoFields = (fields) => {
        return fields.map((f) => {
            return (
                <div className="form-group p-float-label" key={f.key}>
                    {(f.type === 'text' || f.type === 'email' || f.type === 'password') && (
                        <InputText
                            disabled={!editable || f.disabled}
                            type={f.type}
                            value={(f.type === 'password' ? passwords[f.key] : user[f.key]) || ''}
                            className="form-control"
                            name={f.key}
                            onChange={(e) => {
                                onValuesChange(f.key, e.target.value, f.type === 'password');
                            }}
                        />
                    )}
                    {f.type === 'textarea' && (
                        <InputTextarea
                            disabled={!editable}
                            type={f.type}
                            value={user[f.key] || ''}
                            className="form-control"
                            name={f.key}
                        />
                    )}
                    {/* {f.type === 'password' && <Password disabled={!editable} name={f.key} />} */}
                    <label>{f.label}</label>
                </div>
            );
        });
    };

    const dialogContent = () => {
        return (
            <div className="profile-dialog-content">
                <div className="profile-form">
                    <form>{personalInfoFields(dialogProfileFields)}</form>
                </div>
            </div>
        );
    };

    const imageCard = () => {
        return (
            <div className="form-card col-md-6">
                <div className="heading-wrapper">
                    <p className="password-heading">Change Image</p>
                </div>

                <div className="image-form row">
                    <div className="current-image-wrapper col-sm-5">
                        <img className="profile-image" src={user.imageLink || CONSTANTS.DEFAULT_USER_IMAGE} alt="" />
                    </div>
                    <div className="form-group col-sm-7">
                        <div className="upload-attachment-wrapper">
                            <p>
                                <i className="pi pi-upload"></i>
                                Upload Your Files
                            </p>
                        </div>
                        <input
                            type="file"
                            id="attachmentLink"
                            className="form-control-file attachment-input"
                            name="attachmentLink"
                            onChange={(e) => {
                                fileUploadHandler(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const onValuesChange = (field, value, isPassword = false) => {
        if (isPassword) {
            setPasswords({ ...passwords, [field]: value });
        } else {
            setUser({ ...user, [field]: value });
        }
    };

    const pageContent = () => {
        return (
            <div className="profile-page-content row">

                <div className="col-md-12 profile-buttons-row">
                    <button className="profile-btn btn primary-button" onClick={submitForm}>
                        Update Profile
                    </button>

                    <button className="profile-btn btn btn-success" onClick={submitForm}>
                        Submit for a Tutor
                    </button>

                </div>

                {/* {imageCard()} */}

                <div className="col-md-6">
                    <div className="form-card">
                        <div className="heading-wrapper">
                            <p className="name-heading">Personal Information</p>
                        </div>
                        <hr />
                        <div className="profile-form">
                            <form>
                                {personalInfoFields(pageProfileFields)}
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-card col-md-12">
                        <div className="heading-wrapper">
                            <p className="password-heading">Change Password</p>
                        </div>

                        <div className="password-form">
                            <form>
                                {personalInfoFields(passwordFields)}{' '}
                                <button
                                    className="form-control primary-button"
                                    onClick={(e) => {
                                        submitForm(e, true);
                                    }}
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const fileUploadHandler = (event) => {
        if (event.target && event.target.files) {
            setProfileImage(event.target.files[0]);
        }
    };

    const submitForm = (event, isPassword = false) => {
        event.preventDefault();

        if (isPassword) {
            const data = {};

            data.username = user.username;
            data.password = passwords.password;
            data.newPassword = passwords.newPassword;

            httpService.postRequest(URLS.CHANGE_PASSWORD, data, false).subscribe((data) => {
                setPasswords({});
            });
        } else {
            const data = {};
            pageProfileFields.forEach((ppf) => {
                data[ppf.key] = user[ppf.key];
            });
            data._id = user._id;

            httpService.putRequest(URLS.USERS, data, false).subscribe((data) => {
                userService.saveLoggedInUser(user);
            });
        }
    };

    return (
        <div>
            {isDialog && dialogContent()} {!isDialog && pageContent()}
        </div>
    );
}
