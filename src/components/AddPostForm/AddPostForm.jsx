import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';


function AddPostForm({ type, post, closeDialog, isAddingResource }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseId, setCourse] = useState('');
    const [attachmentLink, setAttatchmentLink] = useState('');
    const [postId, setPostId] = useState('');

    const [isPaidResource, setIsPaidResource] = useState(false);
    const [resourceRefLink, setResourceRefLink] = useState('');

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
            if (!valid) {
                return;
            }
            if (!formBody[k]) {
                miscService.handleError('Missing Fields. Please Fill All Fields');
                valid = false;
            }
        });

        if (!valid) {
            return;
        }

        if (type === enums.RESOURCE && !attachmentLink) {
            miscService.handleError('Please Upload the Material First');
            return false;
        }

        if (isPaidResource && resourceRefLink === '') {
            miscService.handleError('Please give URL of original resource');
            return false;
        }
        if (resourceRefLink && !CONSTANTS.REGEXES.URL.test(resourceRefLink)) {
            miscService.handleError('Link of original resource is invalid');
            return false;
        }

        return true;
    };

    const submitForm = (e) => {
        e.preventDefault();

        const formBody = { title, description, courseId, attachmentLink, postType: type, isPaidResource, resourceRefLink };

        if (!isAddingResource && !checkFormValid(formBody)) {
            return;
        }

        if (isAddingResource && !attachmentLink) {
            return miscService.handleError('Please Uploade the file');
        }
        // It means that the dialog is opened in edit mode. Hence we already have the 
        // ID and we will send the PUT request

        if (isAddingResource) {
            const data = { _id: postId, attachmentLink };
            httpService.putRequest(URLS.POST, data, true).subscribe((d) => {
                if (closeDialog) {
                    closeDialog();
                }
            });
        }
        else if (post) {
            formBody._id = postId;
            httpService.putRequest(URLS.POST, formBody, true).subscribe((d) => {
                if (closeDialog) {
                    closeDialog();
                }
            });
        } else {
            httpService.postRequest(URLS.POST, formBody, true).subscribe((d) => {
                if (closeDialog) {
                    closeDialog();
                }
            });
        }
    };

    useEffect(() => {
        if (post) {
            console.log(post);
            setTitle(post.title);
            setDescription(post.description);
            setCourse(post.courseId._id);
            setPostId(post._id);
            setIsPaidResource(post.isPaidResource ?? false);
            setResourceRefLink(post.resourceRefLink);
        }
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const cOptions = await miscService.getCourseOptions();
        setCourseOptions(cOptions);
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
                        {!isAddingResource &&
                            <>
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
                                    <label htmlFor="title">{type === enums.QUESTION ? 'Question' : 'Title'}</label>
                                </div>
                                {type === enums.ASK_RESOURCE &&
                                    <>
                                        <div className="form-group p-float-label col-sm-12">
                                            <div className="switch-field">
                                                <p className='bold'>Do you want a paid resource?</p>
                                                <InputSwitch checked={isPaidResource} onChange={(e) => setIsPaidResource(e.value)} />
                                            </div>
                                        </div>
                                    </>
                                }

                                {type === enums.ASK_RESOURCE && isPaidResource &&
                                    <>
                                        <div className="form-group p-float-label col-sm-12">
                                            <InputText
                                                value={resourceRefLink}
                                                required
                                                className="form-cotntrol single-control"
                                                id="resourceRefLink"
                                                onChange={(e) => {
                                                    setResourceRefLink(e.target.value);
                                                }}
                                            />
                                            <label htmlFor="resourceRefLink">Original Resource Link</label>
                                        </div>
                                    </>
                                }

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
                            </>

                        }

                        {((type !== enums.ASK_RESOURCE) || (type === enums.ASK_RESOURCE && isAddingResource)) &&
                            <div className="form-group col-sm-12">
                                <div className="upload-attachment-wrapper">
                                    {!attachmentLink && (
                                        <p>
                                            <i className="pi pi-upload"></i>
                                            Upload Your Files
                                        </p>
                                    )}
                                    {attachmentLink && (
                                        <p>
                                            <i className="pi pi-check-circle"></i>
                                            File Uploaded Successfully
                                        </p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="attachmentLink"
                                    className="form-control-file attachment-input"
                                    name="attachmentLink"
                                    accept="image/*, application/pdf"
                                    onChange={(e) => {
                                        fileUploadHandler(e);
                                    }}
                                />
                            </div>
                        }

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
