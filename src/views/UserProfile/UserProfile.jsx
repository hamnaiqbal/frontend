import GoogleMapReact from 'google-map-react';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';
import MapMarker from '../../components/MapMarker/MapMarker';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';



export default function UserProfile(props) {
    const [editable, setEditable] = useState(false);
    const [user, setUser] = useState(userService.getLoggedInUser());

    const [cvLink, setCvLink] = useState('');

    const [profileImage, setProfileImage] = useState('');

    const [isDialog, setIsDialog] = useState(false);

    const [passwords, setPasswords] = useState({});

    const [userLocation, setUserLocation] = useState({ longitude: user.longitude ?? 0, latitude: user.latitude ?? 0 });

    const [courseOptions, setCourseOptions] = useState([]);

    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;


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
    ];

    const passwordFields = [
        { label: 'Current Password', key: 'password', type: 'password' },
        { label: 'New Password', key: 'newPassword', type: 'password' },
    ];


    const socialLinksFields = [
        { label: 'Facebook', key: 'fbLink', type: 'text' },
        { label: 'Twitter', key: 'twitterLink', type: 'text' },
        { label: 'LinkedIn', key: 'linkedInLink', type: 'text' },
        { label: 'GitHub', key: 'githubLink', type: 'text' },
    ];

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
            setIsDialog(true);
            setEditable(false);
        } else if (userService.isLoggedIn()) {
            setUser(userService.getLoggedInUser());
            setIsDialog(false);
            setEditable(true);
        }
        if (!courseOptions[0]) {
            fetchCourses();
        }

        navigator.geolocation.getCurrentPosition((position) => {
            if (!user.latitude || !user.longitude) {
                console.log({
                    long: position.coords.longitude,
                    lat: position.coords.latitude
                });
                setUserLocation({
                    latitude: user.latitude || position.coords.latitude,
                    longitude: user.longitude || position.coords.longitude
                });

                onValuesChange('latitude', position.coords.latitude);
                onValuesChange('longitude', position.coords.longitude);
            }
        });
    }, [props.user, userLocation]);

    const onMapClick = (obj) => {
        // console.log(obj);

        onValuesChange('latitude', obj.lat);
        onValuesChange('longitude', obj.lng);

        setUserLocation({
            latitude: obj.lat,
            longitude: obj.lng
        });
    };


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

    const fetchCourses = async () => {
        const options = await miscService.getCourseOptions();
        setCourseOptions(options);
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

    const onValuesChange = (field, value, isPassword = false) => {
        if (isPassword) {
            setPasswords({ ...passwords, [field]: value });
        } else {
            if (['latitude', 'longitude'].includes(field)) {
                user[field] = value;
                setUser(user);
            } else {
                setUser(user => {
                    return { ...user, [field]: value };
                });
            }
        }
    };

    const pageContent = () => {
        return (
            <div className="profile-page-content row">

                <div className="col-md-6">
                    {/* PERSONAL INFO CARD */}
                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="name-heading">
                                    <i className="fas fa-user"></i> Personal Information
                                </p>
                            </div>
                            <hr />
                            <div className="profile-form">
                                <form>
                                    <div className="image-form row form-group">
                                        <div className="current-image-wrapper col-sm-4">
                                            <img className="profile-image" src={profileImage || user.imageLink || CONSTANTS.DEFAULT_USER_IMAGE} alt="" />
                                        </div>
                                        <div className="form-group col-sm-8">
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
                                                accept="image/*"
                                                onChange={(e) => {
                                                    profileImageUploader(e);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {personalInfoFields(pageProfileFields)}

                                    <div className="form-group p-float-label col-sm-12 text-left">
                                        <Dropdown
                                            value={user.degree}
                                            required
                                            filter
                                            display="chip"
                                            options={CONSTANTS.DEPARTMENTS}
                                            className="form-cotntrol single-control"
                                            id="degree"
                                            onChange={(e) => {
                                                onValuesChange('degree', e.target.value);
                                            }}
                                        />
                                        <label htmlFor="degree">Your Department</label>

                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    {/* SOCIAL LINKS CARD */}
                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="name-heading">
                                    <i className="fas fa-share-square"></i> Social Links
                                </p>
                            </div>
                            <hr />
                            <div className="profile-form">
                                <form>
                                    {personalInfoFields(socialLinksFields)}
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="name-heading">
                                    <i className="fas fa-chalkboard-teacher"></i> Tutor Fields
                                </p>
                            </div>
                            <hr />
                            <div className="tutor-form">
                                <form>
                                    <div className="col-sm-12">
                                        <div className="upload-attachment-wrapper">
                                            <p>
                                                {
                                                    (!user.cvLink && !cvLink) && <span>
                                                        <i className="pi pi-upload"></i>
                                                        Upload Your CV Here
                                                    </span>
                                                }
                                                {
                                                    (user.cvLink || cvLink) && <span>
                                                        <i className="pi pi-check-circle"></i>
                                                        You have uploaded your CV
                                                    </span>
                                                }
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            id="attachmentLink"
                                            className="form-control-file attachment-input"
                                            name="attachmentLink"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                cvUpload(e);
                                            }}
                                        />
                                    </div>

                                    <div className="form-group p-float-label col-sm-12 text-left">
                                        <Dropdown
                                            value={user.expertIn}
                                            required
                                            filter
                                            display="chip"
                                            options={courseOptions}
                                            disabled={user.appliedAsTutor}
                                            className="form-cotntrol single-control"
                                            id="course"
                                            onChange={(e) => {
                                                onValuesChange('expertIn', e.target.value);
                                            }}
                                        />
                                        <label htmlFor="course">Courses You are Expert in</label>

                                    </div>

                                    <div className="form-group p-float-label">
                                        <InputTextarea
                                            rows="5"
                                            value={user.tutorReason || ''}
                                            id="tutorReason"
                                            disabled={user.appliedAsTutor}
                                            className="form-control single-control"
                                            onChange={(e) => {
                                                onValuesChange('tutorReason', e.target.value);
                                            }}
                                        />
                                        <label htmlFor="tutorReason">Why Do You Want to Become a Tutor?</label>
                                    </div>
                                    {
                                        user.appliedAsTutor && !user.listedAsTutor &&

                                        <div className="form-group">
                                            <div className="applied-success-message">
                                                <p className="text-left row">
                                                    <span className="col-md-2 applied-message-icon">
                                                        <i className="fas fa-check-circle"></i>
                                                    </span>
                                                    <span className="col-md-10">
                                                        We have received your request for the tutor and we are currently reviewing it. You will be notified when the process completes.
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-md-6">
                    {/* CONTACT INFO CARD */}
                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="name-heading">
                                    <i className="fas fa-address-card"></i> Contact Information
                                </p>
                            </div>

                            <hr />

                            <div className="contact-form">
                                <form>
                                    <div className="form-group p-float-label">
                                        <InputText
                                            type="text"
                                            value={user.mobileNo || ''}
                                            className="form-control"
                                            name="mobileNo"
                                            onChange={(e) => {
                                                onValuesChange('mobileNo', e.target.value);
                                            }}
                                        />
                                        <label>Mobile No.</label>
                                    </div>
                                    <div className="form-group switch-field">
                                        <label>Make Contact Public</label>
                                        <InputSwitch checked={user.publicContact} onChange={(e) => onValuesChange('publicContact', e.value)} />
                                    </div>
                                    <div className="form-group p-float-label">
                                        <InputText
                                            type="text"
                                            value={user.address || ''}
                                            className="form-control"
                                            name="address"
                                            onChange={(e) => {
                                                onValuesChange('address', e.target.value);
                                            }}
                                        />
                                        <label>Address</label>
                                    </div>
                                    <div className="form-group p-float-label">
                                        <InputText
                                            type="text"
                                            value={user.city || ''}
                                            className="form-control"
                                            name="city"
                                            onChange={(e) => {
                                                onValuesChange('city', e.target.value);
                                            }}
                                        />
                                        <label>City</label>
                                    </div>
                                    <div className="form-group p-float-label">
                                        <InputText
                                            type="text"
                                            value={user.country || ''}
                                            className="form-control"
                                            name="country"
                                            onChange={(e) => {
                                                onValuesChange('country', e.target.value);
                                            }}
                                        />
                                        <label>Country</label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* LOCATION CARD */}
                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="password-heading">
                                    <i className="fas fa-map-marker-alt"></i> Your Location
                                </p>
                            </div>

                            <hr />

                            <div className="password-form">
                                <form>

                                    <div style={{ height: '60vh', width: '100%' }}>

                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: API_KEY }}
                                            center={{
                                                lat: user.latitude || userLocation.latitude,
                                                lng: user.longitude || userLocation.longitude
                                            }}
                                            zoom={15}
                                            onClick={onMapClick}
                                            onBoundsChange={onMapClick}
                                        >
                                            <MapMarker user={user} userLocation={userLocation} />
                                        </GoogleMapReact>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>


                    {/* CHANGE PASSWORD CARD */}
                    <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="password-heading">
                                    <i className="fas fa-lock"></i> Change Password
                                </p>
                            </div>

                            <hr />

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

                    {/* USER STATUS CARD */}
                    {/* <div className="col-md-12">
                        <div className="form-card">
                            <div className="heading-wrapper">
                                <p className="password-heading">
                                    <i className="fas fa-user"></i> User Details
                                </p>
                            </div>

                            <hr />

                            <div className="row">

                                <div className="col-md-6">
                                    <p className="userTypeText">User Type</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="userType">
                                        {userService.isCurrentUserAdmin() ? 'Admin' : 'Studet'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}


                </div>


                {/* SUBMIT BUTTONS */}
                <div className="col-md-12 profile-buttons-row">
                    <button className="profile-btn btn primary-button" onClick={submitForm}>
                        Update Profile
                    </button>

                    {
                        (!user.appliedAsTutor && !user.listedAsTutor) &&
                        <button className="profile-btn btn btn-success" onClick={(e) => { submitForm(e, false, true); }}>
                            Submit for a Tutor
                        </button>
                    }

                </div>
            </div>
        );
    };


    const profileImageUploader = (event) => {
        if (event.target && event.target.files) {

            httpService.postRequest(URLS.UPLOAD_PP, { image: event.target.files[0] }, true, true).subscribe(data => {
                console.log(data);
                setProfileImage(data.imageLink);
            });
        }
    };

    const cvUpload = (event) => {
        if (event.target && event.target.files) {

            httpService.postRequest(URLS.UPLOAD_CV, { cvLink: event.target.files[0] }, true, true).subscribe(data => {
                setCvLink(data.cvLink);
                onValuesChange('cvLink', data.cvLink);
            });
        }
    };

    const submitForm = (event, isPassword = false, isTutorSubmission = false) => {
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
            const updatedUser = { ...user };

            if (isTutorSubmission && !validateTutorFields()) {
                return;
            }

            if (profileImage) {
                updatedUser.imageLink = profileImage;
            }

            if (cvLink) {
                updatedUser.cvLink = cvLink;
            }

            if (isTutorSubmission) {
                updatedUser.appliedAsTutor = true;
            }

            updatedUser._id = user._id;

            httpService.putRequest(URLS.USERS, updatedUser, false).subscribe((data) => {
                userService.saveLoggedInUser(updatedUser);
            });
        }
    };

    const validateTutorFields = () => {
        const { username, email, expertIn, name, address, city, country, latitude, tutorReason, longitude, cvLink, fbLink, twitterLink, linkedInLink, githubLink } = user;
        const requireds = { username, email, expertIn, name, address, city, country, latitude, tutorReason, longitude, cvLink };
        let valid = true;
        Object.keys(requireds).forEach(k => {
            if (!valid) {
                return;
            }
            if (!requireds[k]) {
                valid = false;
                if (k === 'cvLink') {
                    miscService.handleError('Please Upload CV First');
                    return;
                }
                if (k === 'expertIn') {
                    miscService.handleError('Please Select Subjects you are expert in');
                    return;
                }
                if (k === 'longitude') {
                    miscService.handleError('Please Select Your Location on Map');
                    return;
                } else {
                    miscService.handleError(`Please provide ${k} before submitting`);
                    return;
                }
            }
        });

        if (!valid) {
            return false;
        }


        if (!fbLink && !twitterLink && !githubLink && !linkedInLink) {
            miscService.handleError('You need to provide at least one social link to apply for tutor');
            return false;
        }

        return valid;

    };

    return (
        <div>
            {isDialog && dialogContent()} {!isDialog && pageContent()}
        </div>
    );
}
