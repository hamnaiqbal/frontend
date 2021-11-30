import { Route, Switch } from 'react-router-dom';
import ResetPassword from '../../components/ResetPassword/ResetPassword';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Signup from '../Signup/Signup';
import StripeStatus from '../StripeStatus/StripeStatus';

const AppRouter = () => (
    <Switch>
        {/* Pages Other than Main App */}
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/stripe/status" component={StripeStatus} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/resetPassword" component={ResetPassword} />

        {/* Main App Pages */}
        <Route path="/home" component={Main} />
    </Switch>
);

export default AppRouter;
