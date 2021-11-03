import { Route, Switch } from 'react-router-dom';
import AddPostForm from '../../components/AddPostForm/AddPostForm';
import Sidebar from '../../components/Sidebar/Sidebar';
import CONSTANTS from '../../constants/constants';
import PostDetails from '../PostDetails/PostDetails';
import PostFeed from '../PostFeed/PostFeed';
import ScholarshipFeed from '../ScholarshipFeed/ScholarshipFeed';
import UserProfile from '../UserProfile/UserProfile';
import ViewUsers from '../ViewUsers/ViewUser';
import Header from '../../components/Header/Header';
import AddTutor from '../AddTutor/AddTutor';
import AttemptQuiz from '../AttemptQuiz/AttemptQuiz';
import ChatComponent from '../ChatComponent/ChatComponent';
import chatService from '../../services/chatService';
import { useEffect } from 'react';
import NearbyTutors from '../NearbyTutors/NearbyTutors';
import RequestedQuotes from '../RequestedQuotes/RequestedQuotes';

const Main = ({ match }) => {


    useEffect(() => {
        chatService.subscribeToMessages()
        return () => { }
    }, [])

    return (
        <div>
            <div className={CONSTANTS.MAIN_WIDTH_CLASS + ' p-0'} >

                <Header />

                <div className="row m-0">
                    <div className="col-md-3 pl-0 d-none d-md-block">
                        <div className="sidebar-wrapper">
                            <Sidebar />
                        </div>
                    </div>

                    <div className="col-md-9 main-app-content">
                        <div className="container-fluid">
                            <Switch>
                                <Route path={match.url + '/'} exact component={PostFeed} />
                                <Route path={match.url + '/myPosts'} exact component={PostFeed} />
                                <Route path={match.url + '/addPost'} component={AddPostForm} />
                                <Route path={match.url + '/post/:postId'} component={PostDetails} />
                                <Route path={match.url + '/profile'} component={UserProfile} />
                                <Route path={match.url + '/scholarships'} component={ScholarshipFeed} />
                                <Route path={match.url + '/viewUsers'} component={ViewUsers} />
                                <Route path={match.url + '/becomeTutor'} component={AddTutor} />
                                <Route path={match.url + '/nearbyTutos'} component={NearbyTutors} />
                                <Route path={match.url + '/quotes/tutor'} component={RequestedQuotes} />
                                <Route path={match.url + '/attempt-quiz'} component={AttemptQuiz} />
                                <Route path={match.url + '/messages'} component={ChatComponent} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
