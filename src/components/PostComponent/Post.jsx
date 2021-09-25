import React from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';

function Post(props) {
    const post = props.post;
    let history = useHistory();
    const redirectToPost = () => {
        history.push(`/home/post/${post._id}`);
    };
    const postDescription = (post) => {
        return { __html: post.description };
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
                                <span className="post-time">5h</span> -{' '}
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
                        <div className="upvotes-count">
                            <p>
                                <i className="pi pi-fw pi-chevron-up"></i>
                                {post.upvotes} Upvotes
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
