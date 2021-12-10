import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';


function PostJob({ onClose, job }) {

    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(0);
    const [deadline, setDeadline] = useState(new Date());
    const [type, setType] = useState('');

    const [jobAdded, setJobAdded] = useState(false);

    const [courseOptions, setCourseOptions] = useState([]);

    const history = useHistory();

    useEffect(() => {
        fetchCourses();

        if (job) {
            setTitle(job.title);
            setDescription(job.description);
            setSubject(job.subject?._id);
            setBudget(job.budget);
            setType(job.type);
            setDeadline(new Date(job.deadline));
        }

    }, []);

    const fetchCourses = async () => {
        const options = await miscService.getCourseOptions();
        setCourseOptions(options);
    };

    const goToJobs = () => {
        history.push('/home/jobs/myJobs');
        onClose();
    }


    const editorHeader = (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-code-block" aria-label="Code Block"></button>
        </span>
    );

    const cancelForm = (e) => {
        e.preventDefault();
        onClose();
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        const isValid = miscService.validateForm([title, subject, description, budget, deadline, type]);
        if (!isValid) {
            return miscService.handleError('Missing Fields');
        }

        if (budget < CONSTANTS.MIN_JOB_BUDGET) {
            return miscService.handleError(`Budget cannot be less than ${CONSTANTS.MIN_JOB_BUDGET}`)
        }

        const data = {
            title, subject, description, budget, deadline, type, postedBy: userService.getCurrentUserId()
        };

        if (job) {
            data._id = job._id;
            httpService.putRequest(URLS.JOB, data).subscribe(() => {
                onClose();
            })
        } else {
            httpService.postRequest(URLS.JOB, data).subscribe(() => {
                setJobAdded(true);
            });
        }

    };

    return (
        <div className="post-job-component">
            <div className="post-form-wrapper">

                {jobAdded &&

                    <>
                        <div className="job-added-div text-center">
                            <i className="far fa-check-circle" />
                            <p className="already-placed-heading center">
                                Job Added Successfully
                            </p>
                            <p className="already-placed-description center">
                                The job was added. You will need to pay PKR {budget} to make it alive.
                            </p>
                            <div>
                                <button onClick={goToJobs} className="btn btn-primary fw">Go to Jobs Page</button>
                            </div>
                        </div>
                    </>
                }

                {!jobAdded &&
                    <form className="job-form">
                        <div className="row">
                            <div className="form-group p-float-label col-sm-12">
                                <InputText
                                    value={title}
                                    required
                                    className="form-cotntrol single-control"
                                    id="title"
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                />
                                <label htmlFor="title">{'Title'}</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group p-float-label col-md-12 col-sm-12">
                                <Dropdown
                                    value={subject}
                                    required
                                    filter
                                    options={courseOptions}
                                    className="form-cotntrol single-control"
                                    id="course"
                                    onChange={(e) => {
                                        setSubject(e.target.value);
                                    }}
                                />
                                <label htmlFor="course">Course</label>
                            </div>

                            <div className="form-group p-float-label col-md-12 col-sm-12">
                                <Dropdown
                                    value={type}
                                    required
                                    filter
                                    options={CONSTANTS.JOB_TYPES}
                                    className="form-cotntrol single-control"
                                    id="type"
                                    onChange={(e) => {
                                        setType(e.target.value);
                                    }}
                                />
                                <label htmlFor="type">Job Type</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group p-float-label col-md-12 col-sm-12">
                                <InputNumber
                                    value={budget}
                                    type="text"
                                    required
                                    id="budget"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setBudget(e.value);
                                    }}
                                />
                                <label htmlFor="budget">Approximate Budget</label>
                            </div>

                            <div className="form-group p-float-label col-md-12 col-sm-12">
                                <Calendar value={deadline} minDate={new Date()} className="single-control" onChange={(e) => setDeadline(e.value)}></Calendar>

                                <label htmlFor="budget">Deadline</label>
                            </div>

                        </div>

                        <div className="row">
                            <div className="form-group col-sm-12">
                                <Editor
                                    value={description}
                                    required
                                    headerTemplate={editorHeader}
                                    placeholder="Description"
                                    className="form-cotntrol single-control editor-control"
                                    id="description"
                                    onTextChange={(e) => {
                                        setDescription(e.htmlValue);
                                    }}
                                />
                            </div>
                        </div>


                        <div className="btn-row row">

                            <div className="col-md-6 cancel-btn-wrapper">
                                <button onClick={cancelForm} className="btn btn-secondary fw">Cancel</button>
                            </div>

                            <div className="col-md-6 submit-btn-wrapper">
                                <button onClick={onFormSubmit} className="btn btn-primary fw"> <i className="fas fa-paper-plane"></i> Post Job</button>
                            </div>

                        </div>

                    </form>
                }
            </div>
        </div>
    );
}

export default PostJob;
