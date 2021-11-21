import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';


function Post(props) {
    const post = props.post;
    const history = useHistory();
    const op = useRef(null);

    const [upvotes, setUpvotes] = useState(post.upvotes);

    const redirectToPost = () => {
        history.push(`/home/post/${post._id}`);
    };

    const postDescription = (post) => {
        return { __html: post.description };
    };

    const upvote = (event) => {
        event.stopPropagation();
        httpService.postRequest(URLS.POST_UPVOTE, { _id: post._id, upvote: true }).subscribe(data => {
            setUpvotes(upvote => upvote + 1);
        });
    };

    const showEditDialog = (event) => {
        event.stopPropagation();
        if (props.showEditDialog) {
            props.showEditDialog(post);
        }
    };

    const showReportDialog = (event) => {
        event.stopPropagation();
        if (props.showReportDialog) {
            props.showReportDialog(post);
        }
    };

    const showOptions = (event) => {
        event.stopPropagation();
        op.current.toggle(event);
    };

    // This method is used to show the confirm delete dialog box
    const confirmDeleteDialog = (event) => {
        event.stopPropagation();

        confirmDialog({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deletePost(),
        });
    };

    // This method will be executed when the user presses confirm on delete dialog
    const deletePost = () => {
        const data = { _id: post._id };
        httpService.deleteRequest(URLS.POST, data).subscribe(() => {
            if (props.fetchPosts) {
                props.fetchPosts();
            }
        });
    };

    // This will tell whether to show the delte and edit options or not
    // Currently, they are set for admins and authors
    const shouldShowOptions = () => {
        return userService.isCurrentUserAdmin() || post?.userId?._id === userService.getCurrentUserId();
    };


    return (
        <div
            className="single-post-wrapper"
            onClick={(e) => {
                redirectToPost();
            }}
        >
            <div className="post-card">
                <div className="post-top-section d-flex a-center j-sp-between">
                    <div className="post-user-info d-flex a-center">
                        <img className="user-image" src={post.userId?.imageLink || CONSTANTS.DEFAULT_USER_IMAGE} alt="" />
                        <div className="post-user">
                            <p className="post-username">{post.userId?.name || 'Hamna Iqbal'}</p>
                            <p className="post-meta">
                                <span className="post-time">{miscService.getTimeDifference(post.createdOn)}</span> -{' '}
                                <span className="post-subject">{post.courseId?.name}</span>
                            </p>
                        </div>
                    </div>
                    <div className="post-type-wrapper">
                        {/* <div className={'post-type ' + post.postType}>{post.postType}</div> */}
                        <div className={'post-type ' + post.postType}>
                            <i className={post.postType === 'question' ? "pi pi-question-circle" : "pi pi-file"}></i>
                        </div>
                    </div>
                </div>
                <div className="post-content">
                    <div className="post-title-wrapper">
                        <p className="post-title">{post.title}</p>
                    </div>
                    <div className="post-desc-wrapper">
                        <p className="post-desc" dangerouslySetInnerHTML={postDescription(post)}></p>
                    </div>
                </div>
                <div className="post-bottom-section">
                    <div className="post-numbers-wrapper">
                        <div className="upvotes-count" onClick={upvote}>
                            <p>
                                <i className="pi pi-fw pi-chevron-up"></i>
                                {upvotes} Upvotes
                            </p>
                        </div>
                        <div className="replies-count">
                            <p>
                                <i className="pi pi-fw pi-comments"></i>
                                {post.repliesCount} Replies
                            </p>
                        </div>
                        {
                            <div className="options-div" onClick={showOptions}>
                                <p>
                                    <i className="pi pi-fw pi-ellipsis-v"></i>Options
                                </p>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <OverlayPanel ref={op}>
                <div className="options-overlay-div">
                    {
                        shouldShowOptions() &&
                        <div>
                            <p className="edit-option" onClick={showEditDialog}>
                                <i className="pi pi-fw pi-pencil"></i>Edit
                            </p>
                            <hr />
                        </div>
                    }
                    {
                        shouldShowOptions() &&
                        <div>

                            <p className="delete-option" onClick={confirmDeleteDialog}>
                                <i className="pi pi-fw pi-trash"></i>Delete
                            </p>
                            <hr />
                        </div>
                    }
                    <p className="report-option" onClick={showReportDialog}>
                        <i className="far fa-flag"></i>Report
                    </p>
                </div>
            </OverlayPanel>
        </div>
    );
}

export default Post;
