import { Route, Switch } from 'react-router-dom';
import AddPostForm from '../../components/AddPostForm/AddPostForm';
import Sidebar from '../../components/Sidebar/Sidebar';
import CONSTANTS from '../../constants/constants';
import PostDetails from '../PostDetails/PostDetails';
import PostFeed from '../PostFeed/PostFeed';
import ScholarshipFeed from '../ScholarshipFeed/ScholarshipFeed';
import UserProfile from '../UserProfile/UserProfile';
import ViewUsers from '../ViewUsers/ViewUser';

const Main = ({ match }) => {
    return (
        <div>
            <div className={CONSTANTS.MAIN_WIDTH_CLASS}>
                <div className="row">
                    <div className="col-md-3 d-none d-md-block">
                        <div className="sidebar-wrapper">
                            <Sidebar />
                        </div>
                    </div>

                    <div className="col-md-9">
                        <div className="">
                            <Switch>
                                <Route path={match.url + '/'} exact component={PostFeed} />
                                <Route path={match.url + '/addPost'} component={AddPostForm} />
                                <Route path={match.url + '/post/:postId'} component={PostDetails} />
                                <Route path={match.url + '/profile'} component={UserProfile} />
                                <Route path={match.url + '/scholarships'} component={ScholarshipFeed} />
                                <Route path={match.url + '/viewUsers'} component={ViewUsers} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
