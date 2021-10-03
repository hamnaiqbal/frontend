import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';


function AddTutor() {

    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

    const [tutorReason, setTutorReason] = useState('');
    const [cvLink, setCvLink] = useState('');

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);

            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

        });
    }, []);

    const uploadCV = (event) => {
        const data = { cvLink: event.target.files[0] };
        httpService.postRequest(URLS.UPLOAD_CV, data, true).subscribe((data) => {
            console.log(data);
            setCvLink(data.cvLink);
        });
    };


    const onMapClick = (obj) => {
        console.log(obj);

        setLatitude(obj.lat);
        setLongitude(obj.lng);
    }

    const onFormSubmit = (event) => {
        event.preventDefault();

        if (latitude == 0 && longitude == 0) {
            miscService.handleError('Please Give Location');
            return;
        }

        const isValid = miscService.validateForm();

        if (!isValid) {
            miscService.handleError('Empty Fields');
        }
    }

    return (
        <div className="add-tutor-component">
            <h1 className="padge-heading">Become a Tutor</h1>

            <div className="row">
                <div className="col-md-6">
                    <h4 className="section-heading">Fill the Fields Below</h4>
                    <div className="add-tutor-form">
                        <form>
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
                            <div className="submit-button-div">
                                <button className="submit-button btn btn-primary" onClick={onFormSubmit}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    <div style={{ height: '60vh', width: '100%' }}>
                        <h4 className="section-heading">Select Your Location on the Map</h4>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: API_KEY }}
                            center={{
                                lat: latitude,
                                lng: longitude
                            }}
                            zoom={15}
                            onClick={onMapClick}
                        >
                            {/* <div className="marker"
                        // lat={latitude}
                        // lng={longitude}
                        // text="My Marker"
                    >
                    </div> */}
                        </GoogleMapReact>
                    </div>

                </div>
            </div>


        </div>
    )

}

export default AddTutor