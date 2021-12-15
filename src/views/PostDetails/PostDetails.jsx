import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddPostForm from '../../components/AddPostForm/AddPostForm';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

function PostDetails() {
    const [replies, setReplies] = useState([]);
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [replyContent, setReplyContent] = useState('');

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isAddingResource, setIsAddingResource] = useState(false);

    // 0: Not voted, 1: Upvoted, 2: Downvoted
    const [hasAlreadyVoted, setHasAlreadyVoted] = useState(0);

    const userId = userService.getCurrentUserId();

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = () => {
        httpService.getRequest(URLS.GET_SINGLE_POST, { userId }, { _id: postId }).subscribe((data) => {
            if (data) {
                data.post.createdOn = miscService.getFormattedDate(data.post.createdOn);
                setPost(data.post);
                setReplies(data.replies || []);
                // TODO: ADD IT TO BACKEND
                const upvotedBy = data.post.upvotedBy ?? [];
                const downvotedBy = data.post.downvotedBy ?? [];

                if (upvotedBy.includes(userId)) {
                    // data.post.hasUpvoted = true;
                    setHasAlreadyVoted(1);
                } else if (downvotedBy.includes(userId)) {
                    // data.post.hasDownvoted = true;
                    setHasAlreadyVoted(2);
                }


            }
        });
    };

    const addReply = () => {
        if (replyContent) {
            const data = { replyContent, postId };
            httpService.postRequest(URLS.REPLY, data).subscribe(d => {

                data.userId = userService.getLoggedInUser();
                data.upvotes = 0;
                data.createdOn = new Date();


                const newReplies = [...replies, data];
                setReplies(newReplies);
                setReplyContent('');
            });
        }
    };

    const upDownVoteReply = (reply, upvote = true) => {
        httpService.postRequest(URLS.REPLY_UPVOTE, { replyId: reply._id, upvote: !!upvote }).subscribe(() => {
            const originalCount = reply.upvotes;
            const newCount = upvote ? originalCount + 1 : originalCount - 1;
            reply.upvotes = newCount;

            const newRepliesList = [...replies];
            const index = newRepliesList.findIndex(r => r._id === reply._id);
            newRepliesList[index] = reply;
            setReplies(newRepliesList);
        });
    }

    const upDownVote = (upvote = true) => {

        if (hasAlreadyVoted === 1 && upvote) {
            return;
        }
        if (hasAlreadyVoted === 2 && !upvote) {
            return;
        }

        httpService.postRequest(URLS.POST_UPVOTE, { _id: postId, upvote: !!upvote, userId: userService.getCurrentUserId() }).subscribe(() => {
            const originalCount = post.upvotes;
            const newCount = upvote ? originalCount + 1 : originalCount - 1;
            setHasAlreadyVoted(upvote ? 1 : 2);
            setPost(p => { return { ...p, upvotes: newCount }; });
        });
    };

    const isImage = () => {
        return (
            post.attachmentLink.endsWith('jpg') ||
            post.attachmentLink.endsWith('png') ||
            post.attachmentLink.endsWith('jpeg')
        );
    };

    const uploadResource = () => {
        setIsAddingResource(true);
        setShowEditDialog(true);
    }

    const repliesList = () => {
        if (replies.length === 0) {
            return <p>No Replies Yet</p>;
        }
        return replies.map((reply, i) => (
            <div className="single-reply-wrapper row" key={i}>
                <div className="upvotes-div col-sm-2">
                    <p className="reply-votes-count center">{reply.upvotes}</p>
                    <i onClick={() => { upDownVoteReply(reply, true) }} className="pi pi-thumbs-up reply-vote-icon upvote"></i>
                    <i onClick={() => { upDownVoteReply(reply, false) }} className="pi pi-thumbs-down reply-vote-icon downvote"></i>
                </div>
                <div className="reply-content-div col-sm-10">
                    <div className="user-info d-flex">
                        <div className="replier-img-wrapper">
                            <img src={reply.userId?.imageLink} alt="" className="replier-img" />
                        </div>
                        <div className="replier-name-and-time">
                            <p className="replier-name">{reply.userId?.name || 'Kashif'}</p>
                            <p className="reply-time">{miscService.getFormattedDate(reply.createdOn)}</p>
                        </div>
                    </div>
                    <div className="reply-content-wrapper">
                        <p className="reply-text">{reply.replyContent}</p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="post-details-component">

            <Dialog visible={showEditDialog} header='Upload a resource' onHide={() => { setShowEditDialog(false) }}>
                <AddPostForm post={post} closeDialog={() => { setShowEditDialog(false) }} isAddingResource={isAddingResource} type={post.postType} />
            </Dialog>

            <div className="row">
                <div className="col-md-8">
                    <div className="post-details-wrapper">
                        <div className="post-details-card">
                            <div className="post-top-section d-flex">
                                <div className="post-votes">
                                    <i
                                        className={"pi pi-caret-up vote-icon upvote c-pointer" + (hasAlreadyVoted === 1 ? ' selected' : '')}
                                        onClick={() => {
                                            upDownVote(true);
                                        }}
                                    ></i>
                                    <p className="votes-count center">{post.upvotes}</p>
                                    <i
                                        className={"pi pi-caret-down vote-icon downvote c-pointer" + (hasAlreadyVoted === 2 ? ' selected' : '')}
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
                                            src={post.userId?.imageLink ?? CONSTANTS.DEFAULT_USER_IMAGE}
                                            alt={post.userId?.name}
                                        />
                                        <p>
                                            <span className="posted-by-name bold">{post.userId?.name} ({post.userId?.username})</span> -{' '}
                                            <span className="posted-on">{post.createdOn}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="post-details">
                                <p className="post-description" dangerouslySetInnerHTML={{ __html: post.description }}></p>

                                {
                                    post.postType === enums.ASK_RESOURCE && !post.attachmentLink &&
                                    <>
                                        {
                                            post.isPaidResource && post.resourceRefLink &&
                                            <div className='form-group'>
                                                <a href={post.resourceRefLink} target="_blank" rel="noreferrer">
                                                    <button className="btn btn-primary">
                                                        <i className="fas fa-link"></i>
                                                        Visit Original Resource Page
                                                    </button>
                                                </a>
                                            </div>
                                        }
                                        <div className='form-group' onClick={uploadResource}>
                                            <button className="btn btn-primary">
                                                <i className="fas fa-upload"></i> Provide the Resource
                                            </button>
                                        </div>
                                    </>
                                }
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

                </div>

                <div className="col-md-4">
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
            </div>

        </div>
    );
}

export default PostDetails;
