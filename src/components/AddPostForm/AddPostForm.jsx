import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

function AddPostForm(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseId, setCourse] = useState('');
    const [attachmentLink, setAttatchmentLink] = useState('');

    const [courseOptions, setCourseOptions] = useState([]);

    const editorHeader = (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-code-block" aria-label="Code Block"></button>
        </span>
    );

    const required = { title, description, courseId };

    const checkFormValid = (formBody) => {
        let valid = true;
        Object.keys(required).forEach((k) => {
            if (!formBody[k]) {
                miscService.handleError('Missing Fields. Please Fill All Fields');
                valid = false;
            }
        });

        if (props.type === enums.RESOURCE && !attachmentLink) {
            miscService.handleError('Please Upload the Material First');
            valid = false;
        }

        return valid;
    };

    const submitForm = (e) => {
        e.preventDefault();

        const formBody = { title, description, courseId, attachmentLink, postType: props.type };

        if (!checkFormValid(formBody)) {
            return;
        }

        httpService.postRequest(URLS.POST, formBody, true).subscribe();
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        httpService.getRequest(URLS.COURSE).subscribe((data) => {
            if (data.length > 0) {
                const coursesData = data.map((d) => {
                    return { label: `${d.code}-${d.name}`, value: d._id };
                });
                setCourseOptions(coursesData);
            }
        });
    };

    const fileUploadHandler = (event) => {
        event.preventDefault();
        if (event.target && event.target.files) {
            setAttatchmentLink(event.target.files[0]);
        }
    };

    return (
        <div className="add-post-card">
            <div className="add-post-form-wrapper">
                <div className="add-post-form">
                    <form>
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
                            <label htmlFor="title">{props.type === enums.QUESTION ? 'Question' : 'Title'}</label>
                        </div>
                        <div className="col-sm-12 row p-0 m-0">
                            <div className="form-group p-float-label col-sm-12 p-0">
                                <Dropdown
                                    value={courseId}
                                    required
                                    filter
                                    options={courseOptions}
                                    className="form-cotntrol single-control"
                                    id="course"
                                    onChange={(e) => {
                                        setCourse(e.target.value);
                                    }}
                                />
                                <label htmlFor="course">Course</label>
                            </div>
                            {/* <div className="col-sm-3 form-group pr-0">
                                <Button className="form-control full-height primary-button" label={'Add New'} />
                            </div> */}
                        </div>
                        <div className="form-group col-sm-12">
                            <Editor
                                value={description}
                                required
                                headerTemplate={editorHeader}
                                className="form-cotntrol single-control editor-control"
                                id="description"
                                onTextChange={(e) => {
                                    setDescription(e.htmlValue);
                                }}
                            />
                        </div>
                        <div className="form-group col-sm-12">
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
                        <div className="form-group col-sm-12">
                            <Button
                                type="submit"
                                label="Submit"
                                className="form-control btn primary-button"
                                onClick={(e) => {
                                    submitForm(e);
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPostForm;
