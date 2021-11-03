import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import RequestQuote from '../../components/RequestQuote/RequestQuote';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

export default function NearbyTutors() {

    const DISTANCE_OPTIONS = [
        { label: 'Any Distance', value: '0' },
        { label: '10 Kilometers', value: 10 },
        { label: '20 Kilometers', value: 20 },
        { label: '50 Kilometers', value: 50 },
        { label: '100 Kilometers', value: 100 },
    ]

    const [distance, setDistance] = useState('0');
    const [filteredCourse, setFilteredCourse] = useState([]);

    const [courseList, setCourseList] = useState([]);

    const [tutorsList, setTutorsList] = useState([]);

    const [showQuoteDialog, setShowQuoteDialog] = useState(false);
    const [quoteTutor, setQuoteTutor] = useState({});

    useEffect(() => {
        fetchTutors();
        fetchCourses();
    }, [])

    const hideQuoteDialog = (e) => {
        if (e) {
            e.preventDefault();
        }
        setQuoteTutor({});
        setShowQuoteDialog(false);
    }

    const viewQuoteDialog = (t) => {
        setQuoteTutor(t);
        setShowQuoteDialog(true);
    }


    const fetchCourses = async () => {
        if (courseList.length === 0) {
            const cOptions = await miscService.getCourseOptions();
            setCourseList(cOptions);
        }
    }

    const getCourseName = (courseId) => {
        return courseList?.find(cf => cf.value === courseId)?.label ?? 'HUHU';
    }

    const fetchTutors = () => {
        httpService.postRequest(URLS.GET_TUTORS, {}).subscribe(d => {
            setTutorsList(d);
        })
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
                                <h4 className="tutor-name">{t.name}</h4>
                                <small className="tutor-address">
                                    5.0 KM - From {t.city} - {t.country}
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
                                            </p>
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
                            <div className="tutor-action-wrapper">
                                <p><i className="fas fa-map-marker-alt" />Map</p>
                            </div>


                            {/* Request Quote */}
                            <div className="tutor-action-wrapper" onClick={() => { viewQuoteDialog(t) }}>
                                <p><i className="fas fa-money-bill-wave-alt" />Quote</p>
                            </div>

                            {/* Leave a review */}
                            {/* <div className="tutor-action-wrapper">
                                <p><i className="fas fa-star" />Review</p>
                            </div> */}

                        </div>
                    </div>

                </div>
            </div>
        })
    }

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
                                <div className="form-group p-float-label col-sm-12 p-0">
                                    <Dropdown
                                        value={filteredCourse}
                                        required
                                        filter
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
                                        filter
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

                    </div>
                </div>
            </div>


            <Dialog className="quote-dialog" visible={showQuoteDialog} onHide={hideQuoteDialog} header={`Get a Quote from ${quoteTutor?.name}`}>
                <RequestQuote tutor={quoteTutor} courses={courseList} onClose={hideQuoteDialog} />
            </Dialog>

        </div>
    )
}
