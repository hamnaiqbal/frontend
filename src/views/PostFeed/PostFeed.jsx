import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import AddPostForm from '../../components/AddPostForm/AddPostForm';
import JobFeed from '../../components/JobFeed/JobFeed';
import Post from '../../components/PostComponent/Post';
import ScholarshipComponent from '../../components/ScholarshipComponent/ScholarshipComponent';
import URLS from '../../constants/api-urls';
import enums from '../../constants/enums';
import httpService from '../../services/httpservice';

function PostFeed() {
    const [showAddDialig, setShowAddDialig] = useState(false);
    const [addPostType, setAddPostType] = useState(enums.QUESTION);

    const [postsList, setPostsList] = useState([]);

    const showDialog = (type) => {
        setShowAddDialig(true);
        setAddPostType(type);
    };

    const fetchPosts = () => {
        httpService.getRequest(URLS.POST).subscribe((data) => {
            setPostsList(data);
        });
    };

    const posts = () => {
        return postsList.map((post) => {
            return <Post post={post} key={post._id} />;
            // return <ScholarshipComponent scholarship={post}></ScholarshipComponent>;
        });
    };

    useEffect(() => {
        fetchPosts();
        // setPostsList([1, 2, 3, 4, 5, 6]);
    }, []);

    return (
        <div className="post-feed-component row">
            <div className="add-post-dialog">
                <Dialog
                    header={addPostType === enums.QUESTION ? 'Ask a Question ' : 'Share a Resource'}
                    visible={showAddDialig}
                    onHide={() => setShowAddDialig(false)}
                    modal={true}
                    className="add-post-dialog"
                >
                    <div className="add-post-dialog-wrapper">
                        <AddPostForm type={addPostType} />
                    </div>
                </Dialog>
            </div>
            <div className="col-md-8">
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
                </div>
                <div className="post-feed-wrapper">{posts()}</div>
            </div>
            <div className="col-md-4">
                <JobFeed />
            </div>
        </div>
    );
}

export default PostFeed;
