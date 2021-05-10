import { Route, Switch } from 'react-router-dom';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Signup from '../Signup/Signup';

const AppRouter = () => (
    <Switch>
        {/* Pages Other than Main App */}
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        {/* Main App Pages */}
        <Route path="/home" component={Main} />
    </Switch>
);

export default AppRouter;
