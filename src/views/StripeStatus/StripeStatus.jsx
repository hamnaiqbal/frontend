import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import URLS from "../../constants/api-urls";
import httpService from "../../services/httpservice";

const StripeStatus = ({ location }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [btnText, setBtnText] = useState('');

    useEffect(() => {
        const process = new URLSearchParams(location.search).get("process");
        const success = new URLSearchParams(location.search).get("success");


        if (process === 'payment' && success === '1') {
            setTitle('Payment Process Successful');
            setDescription('You have successfully completed the Payment Process. You can now go back to the Login Screen')
            setBtnText('Go to Home')
            setLink('/home');
            setIsSuccess(true);
        }
        else if (process === 'payment' && success === '0') {
            setTitle('Payment Process Failed');
            setDescription('There were some errors when processing your payment requests. Kindly retry in a while')
            setBtnText('Go to Home')
            setLink('/home');
            setIsSuccess(false);
        }
        else if (process === 'signup' && success === '1') {
            const stateStr = new URLSearchParams(location.search).get("state");
            const code = new URLSearchParams(location.search).get("code");

            if (!code || !stateStr) {
                return;
            }


            const stateObj = JSON.parse(stateStr);

            const email = stateObj.email;


            setTitle('Awaiting Token Authentication');
            setDescription('Please wait while your token is being authenticated');

            httpService.postRequest(URLS.USER_OAUTH_VERIFICATION, { email, code }).subscribe(() => {
                setTitle('You Have Successfully Signed Up');
                setDescription('You Sign Up Form has been submitted. Now you can login to our website using the given credentials. Happy Time Enjoying Our Services !!')
                setBtnText('Go to Login')
                setLink('/login');
                setIsSuccess(true);
            })

        }
        else if (process === 'singup' && success === '0`') {
            setTitle('There were some issues while creating your stripe account');
            setDescription('We were able to create your account on SEA Platform but could not complete Stripe account creation. ')
            setBtnText('Go to Login')
            setLink('/login');
            setIsSuccess(false);
        }

    }, [location]);

    const history = useHistory();

    return (

        <div className="signup-component user-page-bg">
            <div className="container-fluid bg-overlay">
                <div className="signup-card-div d-flex j-center row">
                    <div className="signup-card col-md-4">
                        <div className="signed-up-message">
                            <p className="success-heading">
                                <span className={isSuccess ? "pi pi-check-circle" : "pi pi-times-circle"}></span>
                                {title}
                            </p>
                            <hr />
                            <p className="success-description">
                                {description}
                            </p>
                            <button
                                onClick={() => {
                                    history.push(link);
                                }}
                                className="btn primary-button form-control"
                            >
                                {btnText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default StripeStatus;