import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import miscService from '../../services/miscService';

function PostDetails(props) {
    const [replies, setReplies] = useState([]);
    const { postId } = useParams();
    const history = useHistory();
    const [post, setPost] = useState({});
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        fetchPost();
        fetchReplies();
    }, []);

    const fetchReplies = () => {};

    const fetchPost = () => {
        httpService.getRequest(URLS.GET_SINGLE_POST, null, { _id: postId }).subscribe((data) => {
            if (data) {
                data.post.createdOn = miscService.getFormattedDate(data.post.createdOn);
                setPost(data.post);
                setReplies(data.replies || []);
            }
        });
    };

    const addReply = () => {
        if (replyContent) {
            const data = { replyContent, postId };
            httpService.postRequest(URLS.REPLY, data).subscribe(d => {
                setReplyContent('');
            });
        }
    };

    const upDownVote = (upvote = true) => {
        httpService.postRequest(URLS.POST_UPVOTE, { _id: postId, upvote: !!upvote }).subscribe();
    };

    const isImage = () => {
        return (
            post.attachmentLink.endsWith('jpg') ||
            post.attachmentLink.endsWith('png') ||
            post.attachmentLink.endsWith('jpeg')
        );
    };

    const repliesList = () => {
        if (replies.length === 0) {
            return <p>No Replies Yet</p>;
        }
        return replies.map((d, i) => (
            <div className="single-reply-wrapper row" key={i}>
                <div className="upvotes-div col-sm-2">
                    <p className="reply-votes-count center">{d.upvotes}</p>
                    <i className="pi pi-thumbs-up reply-vote-icon upvote"></i>
                    <i className="pi pi-thumbs-down reply-vote-icon downvote"></i>
                </div>
                <div className="reply-content-div col-sm-10">
                    <div className="user-info d-flex">
                        <div className="replier-img-wrapper">
                            <img src={CONSTANTS.DEFAULT_USER_IMAGE} alt="" className="replier-img" />
                        </div>
                        <div className="replier-name-and-time">
                            <p className="replier-name">{d.userId?.name || 'Kashif'}</p>
                            <p className="reply-time">{miscService.getFormattedDate(d.createdOn)}</p>
                        </div>
                    </div>
                    <div className="reply-content-wrapper">
                        <p className="reply-text">{d.replyContent}</p>
                    </div>  
                </div>
            </div>
        ));
    };

    return (
        <div className="post-details-component">
            <div className="post-details-wrapper">
                <div className="post-details-card">
                    <div className="post-top-section d-flex">
                        <div className="post-votes">
                            <i
                                className="pi pi-caret-up vote-icon upvote c-pointer"
                                onClick={() => {
                                    upDownVote(true);
                                }}
                            ></i>
                            <p className="votes-count center">{post.upvotes}</p>
                            <i
                                className="pi pi-caret-down vote-icon downvote c-pointer"
                                onClick={() => {
                                    upDownVote(false);
                                }}
                            ></i>
                        </div>
                        <div className="title-and-poster">
                            <div className="title-wrapper">
                                <p className="post-heading">{post.title}</p>
                            </div>
                            <div className="poster-details d-flex">
                                <img
                                    className="posted-by-image"
                                    src={CONSTANTS.DEFAULT_USER_IMAGE}
                                    alt={post.userId?.name}
                                />
                                <p>
                                    <span className="posted-by-name bold">{post.userId?.name || 'Hamna Iqbal'}</span> -{' '}
                                    <span className="posted-on">{post.createdOn}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="post-details">
                        <p className="post-description" dangerouslySetInnerHTML={{ __html: post.description }}></p>
                        {post.attachmentLink && isImage() && (
                            <div className="post-image-wrapper">
                                <img className="post-image" src={post.attachmentLink} alt={post.title} />
                            </div>
                        )}
                        {post.attachmentLink && !isImage() && (
                            <div className="post-resource-wrapper">
                                <a href={post.attachmentLink} target="_blank" rel="noreferrer">
                                    <button className="primary-button btn">
                                        <i className="pi pi-download"></i>
                                        Download Resource
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="add-reply-card">
                <div className="add-reply-wrapper"></div>
            </div>

            <div className="replies-card">
                <p className="replies-card-heading">{post.type === enums.QUESTION ? 'Answers' : 'Replies'}</p>

                <div className="replies-wrapper">{repliesList()}</div>
                <hr />
                <div className="add-reply-wrapper">
                    <div className="form-group">
                        <p className="post-reply-heading">
                            {post.type === enums.QUESTION ? 'Answer this Question' : 'Post a Reply'}
                        </p>
                        <InputTextarea
                            rows={5}
                            className="form-control"
                            onChange={(e) => {
                                setReplyContent(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group d-flex a-i-start">
                        <Button label="Add Reply" className="primary-button" onClick={addReply} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetails;
