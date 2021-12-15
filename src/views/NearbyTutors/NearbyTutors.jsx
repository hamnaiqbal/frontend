import GoogleMapReact from 'google-map-react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import MapMarker from '../../components/MapMarker/MapMarker';
import RequestQuote from '../../components/RequestQuote/RequestQuote';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function NearbyTutors() {

    const DISTANCE_OPTIONS = [
        { label: 'Any Distance', value: '0' },
        { label: '10 Kilometers', value: 10 },
        { label: '20 Kilometers', value: 20 },
        { label: '50 Kilometers', value: 50 },
        { label: '100 Kilometers', value: 100 },
    ];

    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const user = userService.getLoggedInUser();

    const [distance, setDistance] = useState('0');
    const [filteredCourse, setFilteredCourse] = useState('');

    const [courseList, setCourseList] = useState([]);

    const [tutorsList, setTutorsList] = useState([]);

    const [showQuoteDialog, setShowQuoteDialog] = useState(false);
    const [quoteTutor, setQuoteTutor] = useState({});

    const [userLocation, setUserLocation] = useState({ longitude: user.longitude ?? 0, latitude: user.latitude ?? 0 });

    useEffect(() => {
        fetchTutors();
        fetchCourses();

        navigator.geolocation.getCurrentPosition((position) => {
            if (!user.latitude || !user.longitude) {
                console.log({
                    long: position.coords.longitude,
                    lat: position.coords.latitude
                });
                if (position.coords.latitude != userLocation.latitude || position.coords.longitude != userLocation.longitude) {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }
            }
        });

    }, [userLocation]);

    const hideQuoteDialog = (e) => {
        if (e) {
            e.preventDefault();
        }
        setQuoteTutor({});
        setShowQuoteDialog(false);
    };

    const viewQuoteDialog = (t) => {
        setQuoteTutor(t);
        setShowQuoteDialog(true);
    };

    const onMapClick = (obj) => {
        setUserLocation({
            latitude: obj.lat,
            longitude: obj.lng
        });
    }


    const fetchCourses = async () => {
        if (courseList.length === 0) {
            const cOptions = await miscService.getCourseOptions();
            setCourseList(cOptions);
        }
    };

    const getCourseName = (courseId) => {
        return courseList?.find(cf => cf.value === courseId)?.label;
    };

    const fetchTutors = (filters) => {
        filters = filters ?? {};
        console.log(userLocation);
        if (userLocation.latitude && userLocation.longitude) {
            filters.position = {
                lat: userLocation.latitude,
                lon: userLocation.longitude
            };
        }
        httpService.postRequest(URLS.GET_TUTORS, filters ?? {}, false, true, false).subscribe(d => {
            setTutorsList(d);
        });
    };

    const filterResults = () => {
        const filters = {};
        if (filteredCourse) {
            filters.course = filteredCourse;
        }
        if (distance && distance !== '0') {
            filters.distance = distance;
        }
        fetchTutors(filters);
    };

    const openTutorMap = (lat, lng) => {
        const url = "https://maps.google.com/?q=" + lat + "," + lng;
        window.open(url, '_blank');
    }


    const renderTutorsList = () => {
        return tutorsList.map((t, i) => {
            return <div className="tutor-item app-card" key={i}>
                <div className="row">
                    <div className="col-md-2">
                        {/* TUTOR IMAGE HERE */}
                        <img className="user-image" src={t.imageLink || CONSTANTS.DEFAULT_USER_IMAGE} alt={t.name} />
                    </div>

                    <div className="col-md-7">
                        {/* TUTOR INFORMATION HERE */}
                        <div className="tutor-info text-left">

                            <div className="tutor-info-head">
                                <h4 className="tutor-name">{t.name} - ({t.username})</h4>
                                <small className="tutor-address">
                                    {
                                        t.distance != null && Math.round(t.distance) + "KM - "
                                    }
                                    From {t.city} - {t.country}
                                </small>
                            </div>

                            <div className="tutor-info-main">
                                <div className="tutor-courses">
                                    <h6>
                                        Specialized Courses
                                    </h6>

                                    {t.expertIn &&

                                        t.expertIn?.map((e, i) => {
                                            return <p className="expert-course" key={i}>
                                                <i className="fas fa-check-circle"></i> {getCourseName(e)}
                                            </p>;
                                        })
                                    }

                                    {!t.expertIn &&
                                        <p>No Courses to Show</p>
                                    }
                                </div>

                            </div>

                            <div className="tutor-info-footer">
                                <p className="tutor-contact-links">
                                    Contact Through:

                                    {t.publicContact && t.mobileNo &&
                                        <span className="contact-link-wrapper">
                                            <a href={'tel:' + t.mobileNo}>
                                                <i className="fas fa-mobile"></i>
                                            </a>
                                        </span>
                                    }

                                    {t.fbLink &&
                                        <span className="contact-link-wrapper">
                                            <a href={t.fbLink} target="_blank" rel="noreferrer">
                                                <i className="fab fa-facebook"></i>
                                            </a>
                                        </span>
                                    }

                                    {t.twitterLink &&
                                        <span className="contact-link-wrapper">
                                            <a href={t.twitterLink} target="_blank" rel="noreferrer">
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        </span>
                                    }

                                    {t.linkedInLink &&
                                        <span className="contact-link-wrapper">
                                            <a href={t.linkedInLink} target="_blank" rel="noreferrer">
                                                <i className="fab fa-linkedin"></i>
                                            </a>
                                        </span>
                                    }

                                    {t.githubLink &&
                                        <span className="contact-link-wrapper">
                                            <a href={t.githubLink} target="_blank" rel="noreferrer">
                                                <i className="fab fa-github"></i>
                                            </a>
                                        </span>
                                    }



                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-3">

                        <div className="tutor-actions">

                            {/* View on Map */}
                            <div className="tutor-action-wrapper" onClick={() => { openTutorMap(t.latitude, t.longitude) }}>
                                <p><i className="fas fa-map-marker-alt" />Map</p>
                            </div>


                            {/* Request Quote */}
                            <div className="tutor-action-wrapper" onClick={() => { viewQuoteDialog(t); }}>
                                <p><i className="fas fa-money-bill-wave-alt" />Quote</p>
                            </div>

                            {/* Leave a review */}
                            {/* <div className="tutor-action-wrapper">
                                <p><i className="fas fa-star" />Review</p>
                            </div> */}

                        </div>
                    </div>

                </div>
            </div>;
        });
    };

    return (
        <div className="nearby-tutors-component">
            <div className="row">
                <div className="col-md-8 nearby-list-wrapper">
                    {renderTutorsList()}
                </div>

                <div className="col-md-4 nearby-sidebar-wrapper text-left">
                    <div className="nearby-sidebar app-card">
                        <div className="sidebar-header">
                            <h5 className="bold">
                                <i className="fas fa-filter"></i> Filter Results
                            </h5>
                        </div>

                        <div className="sidebar-filter">
                            <div className="col-sm-12 row p-0 m-0">
                                <div className="form-group col-sm-12 p-0">
                                    <label>Your Location</label>
                                    <div style={{ height: '30vh', width: '100%' }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: API_KEY }}
                                            onClick={onMapClick}
                                            center={{
                                                lat: user.latitude,
                                                lng: user.longitude
                                            }}
                                            zoom={15}
                                        >
                                            <MapMarker user={user} userLocation={userLocation} />
                                        </GoogleMapReact>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-filter">
                            <div className="col-sm-12 row p-0 m-0">
                                <div className="form-group p-float-label col-sm-12 p-0">
                                    <Dropdown
                                        value={filteredCourse}
                                        required
                                        filter
                                        showClear
                                        options={courseList}
                                        placeholder="Select Course to Filter"
                                        className="form-cotntrol single-control"
                                        id="course"
                                        onChange={(e) => {
                                            setFilteredCourse(e.target.value);
                                        }}
                                    />
                                    {filteredCourse &&
                                        <label htmlFor="course">Course</label>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-filter">
                            <div className="col-sm-12 row p-0 m-0">
                                <div className="form-group p-float-label col-sm-12 p-0">
                                    <Dropdown
                                        value={distance}
                                        required
                                        options={DISTANCE_OPTIONS}
                                        placeholder="Max Distance from Your Position"
                                        className="form-cotntrol single-control"
                                        id="distance"
                                        onChange={(e) => {
                                            setDistance(e.target.value);
                                        }}
                                    />
                                    <label htmlFor="distance">Distance</label>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <button className="btn btn-primary form-control" onClick={filterResults}> Filter Results </button>
                        </div>

                    </div>
                </div>
            </div>


            <Dialog className="quote-dialog" visible={showQuoteDialog} onHide={hideQuoteDialog} header={`Get a Quote from ${quoteTutor?.name}`}>
                <RequestQuote tutor={quoteTutor} courses={courseList} onClose={hideQuoteDialog} />
            </Dialog>

        </div>
    );
}
