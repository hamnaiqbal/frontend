import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

function Post(props) {
    const post = props.post;
    let history = useHistory();
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

    const getTimeDifference = (postDate) => {
        const pDate = new Date(postDate);
        const cDate = new Date();

        const MINS_MS = 1000 * 60;
        const HOURS_MS = MINS_MS * 60;
        const DAYS_MS = HOURS_MS * 24;

        const diff = cDate.getTime() - pDate.getTime();

        if (diff > DAYS_MS) {
            return `${Math.round(diff / DAYS_MS)} days ago`
        }
        if (diff > HOURS_MS) {
            return `${Math.round(diff / HOURS_MS)} hours ago`
        }
        return `${Math.round(diff / MINS_MS)} minutes ago`
    }

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
                                <span className="post-time">{getTimeDifference(post.createdOn)}</span> -{' '}
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
                        <div className="options-div">
                            <p>
                                <i className="pi pi-fw pi-ellipsis-v"></i>Options
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
