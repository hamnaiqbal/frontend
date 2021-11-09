import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function RequestQuote(props) {

    const { tutor, onClose, courses, quoteToEdit, isAnswer = false } = props;

    const DURATION_OPTIONS = CONSTANTS.DURATION_OPTIONS;

    const [courseOptions, setCourseOptions] = useState([]);

    const [course, setCourse] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        fetchCourses();

        if (quoteToEdit) {
            setCourse(quoteToEdit.course._id);
            setDescription(quoteToEdit.description);
            setDuration(quoteToEdit.duration);
        }

    }, [quoteToEdit]);

    const fetchCourses = async () => {
        if (!courses) {
            const cOptions = await miscService.getCourseOptions();
            setCourseOptions(cOptions);
        } else {
            setCourseOptions(courses);
        }
    };

    const onFormSubmit = () => {
        const dataToVerify = [course, duration, description];
        const isValid = miscService.validateForm(dataToVerify);

        if (!isValid) {
            miscService.handleError('Missing Fields');
            return;
        }


        if (quoteToEdit) {
            const data = { _id: quoteToEdit._id, course, duration, description };
            if (isAnswer) {
                if (!price) {
                    miscService.handleError('Please Add Price');
                    return;
                }
                data.quotedAmount = price;
                data.status = 1; // Means Replied
            }

            httpService.putRequest(URLS.QUOTE, data).subscribe(() => {
                onClose();
            });
        } else {
            const data = { course, duration, description, requestedBy: userService.getCurrentUserId(), requestedTo: tutor._id };
            httpService.postRequest(URLS.QUOTE, data).subscribe(d => {
                onClose();
            });
        }

    };

    return (
        <div className="request-quote-component">

            <form>

                <div className="form-group row">
                    <div className="col-md-3">
                        <label htmlFor="course">Subject</label>
                    </div>

                    <div className="col-md-9">
                        <Dropdown
                            value={course}
                            required
                            filter
                            disabled={isAnswer}
                            options={courseOptions}
                            placeholder="Select Course"
                            className="form-cotntrol single-control"
                            id="course"
                            onChange={(e) => {
                                setCourse(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-md-3">
                        <label htmlFor="duration">Expected Duration</label>
                    </div>

                    <div className="col-md-9">
                        <Dropdown
                            value={duration}
                            required
                            filter
                            disabled={isAnswer}
                            options={DURATION_OPTIONS}
                            placeholder="Expected Duration"
                            className="form-cotntrol single-control"
                            id="duration"
                            onChange={(e) => {
                                setDuration(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-md-3">
                        <label htmlFor="duration">Write Some Description</label>
                    </div>

                    <div className="col-md-9">
                        <InputTextarea disabled={isAnswer} rows={5} className="form-control single-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>

                {isAnswer &&
                    <div className="form-group row">
                        <div className="col-md-3">
                            <label htmlFor="quotedAmount">Your Price</label>
                        </div>

                        <div className="col-md-7">
                            <InputText
                                value={price}
                                type="text"
                                required
                                id="quotedAmount"
                                className="form-control single-control"
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
                            />
                        </div>
                        <div className="col-md-2">
                            PKR per Hour
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col-md-7"></div>

                    <div className="col-md-2">
                        <div className="btn btn-secondary btn-cancel form-control" onClick={onClose}>
                            Cancel
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="btn btn-primary btn-submit form-control" onClick={onFormSubmit}>
                            {isAnswer ? 'Quote Price' : 'Request Quote'}
                        </div>
                    </div>
                </div>


            </form>

        </div>
    );
}


