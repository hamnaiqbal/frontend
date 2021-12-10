import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import AddPostForm from '../../components/AddPostForm/AddPostForm';
import JobFeed from '../../components/JobFeed/JobFeed';
import Post from '../../components/PostComponent/Post';
import ReportItem from '../../components/ReportItem/ReportItem';
import URLS from '../../constants/api-urls';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';
import userService from '../../services/userservice';

function PostFeed() {
    const [showAddDialig, setShowAddDialig] = useState(false);
    const [addPostType, setAddPostType] = useState(enums.QUESTION);

    const [showReportDialog, setShowReportDialog] = useState(false);
    const [postToReport, setPostToReport] = useState({});

    const [postsList, setPostsList] = useState([]);

    const [postsToShow, setPostsToShow] = useState([]);
    const [postToEdit, setPostToEdit] = useState('');

    const [allPostsFeed, setAllPostsFeed] = useState(true);

    const location = useLocation();

    const POSTS_PER_PAGE = 5;

    const showDialog = (type) => {
        setPostToEdit(null);
        setShowAddDialig(true);
        setAddPostType(type);
    };

    const viewReportsDialog = (post) => {
        setPostToReport(post);
        setShowReportDialog(true);
    }

    const fetchPosts = () => {
        const filter = {};
        const showAllPosts = !location.pathname?.includes('myPosts');
        setAllPostsFeed(showAllPosts)
        if (!showAllPosts) {
            filter.userId = userService.getCurrentUserId();
        }
        httpService.getRequest(URLS.POST, filter).subscribe((data) => {
            data.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
            setPostsList(data);
            setPostsToShow(data.slice(0, POSTS_PER_PAGE));
        });
    };

    const posts = () => {
        return postsToShow.map((post) => {
            return <Post fetchPosts={fetchPosts} showEditDialog={showEditDialog} showReportDialog={viewReportsDialog} post={post} key={post._id} />;
        });
    };

    const showNextPosts = () => {
        const currentIndex = postsToShow.length;
        const nextPosts = [...postsList.slice(0, currentIndex + POSTS_PER_PAGE)];
        setPostsToShow(nextPosts);
    };

    useEffect(() => {
        fetchPosts();
    }, [location]);

    const closeDialog = () => {
        setShowAddDialig(false);
        setAddPostType(null);

        fetchPosts();
    };

    const showEditDialog = (post) => {
        setPostToEdit(post);
        setShowAddDialig(true);
        setAddPostType(post.postType);
    }

    return (
        <div className="post-feed-component row">
            <div>
                <Dialog
                    header={addPostType === enums.QUESTION ? 'Ask a Question ' : addPostType === enums.RESOURCE ? 'Share a Resource' : 'Request for a Resource'}
                    visible={showAddDialig}
                    onHide={() => setShowAddDialig(false)}
                    modal={true}
                    className="add-post-dialog custom-scrollbar"
                >
                    <div className="add-post-dialog-wrapper">
                        <AddPostForm post={postToEdit} type={addPostType} closeDialog={closeDialog} />
                    </div>
                </Dialog>

                <Dialog visible={showReportDialog} className="report-dialog" header="Report a Post" onHide={() => { setShowReportDialog(false) }}>
                    <ReportItem id={postToReport._id} type="P" onClose={() => setShowReportDialog(false)} />
                </Dialog>
            </div>
            <div className="col-md-8">
                {/* This will be only shown when the user is on post feed page */}
                {allPostsFeed &&
                    <div className="add-post-card">
                        <div
                            className="add-post-div add-question"
                            onClick={() => {
                                showDialog(enums.QUESTION);
                            }}
                        >
                            <p className="add-post center subtext">Getting Stuck?</p>
                            <p className="add-post center main-text question">Ask a Question</p>
                        </div>
                        <div
                            className="add-post-div add-resource"
                            onClick={() => {
                                showDialog(enums.RESOURCE);
                            }}
                        >
                            <p className="add-post center subtext">Got Something to Share?</p>
                            <p className="add-post center main-text resource">Post a Resource</p>
                        </div>
                        <div
                            className="add-post-div ask-resource"
                            onClick={() => {
                                showDialog(enums.ASK_RESOURCE);
                            }}
                        >
                            <p className="add-post center subtext">Looking for a resource?</p>
                            <p className="add-post center main-text ask-resource">Request a Resource</p>
                        </div>
                    </div>
                }
                <div className="post-feed-wrapper">{posts()}</div>
                {
                    postsToShow.length < postsList.length && (
                        <div
                            className="load-more-bar"
                            onClick={() => {
                                showNextPosts();
                            }}
                        >
                            <div className="load-more-card">
                                <p className="load-more">
                                    <i className="pi pi-chevron-down"></i>
                                    Load More
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
            {allPostsFeed && <div className="col-md-4">
                <JobFeed />
            </div>}
        </div>
    );
}

export default PostFeed;
