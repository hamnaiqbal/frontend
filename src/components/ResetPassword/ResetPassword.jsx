import React, { useState } from 'react';
import { useHistory } from 'react-router';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

export default function ResetPassword() {

    // 0: Email Step, 1: Token Step, 2: Password Step

    const [step, setStep] = useState(0);

    const [userEmail, setUserEmail] = useState('');

    const history = useHistory();

    const EmailStep = () => {
        const [email, setEmail] = useState('');

        const sendResetRequest = () => {

            const isValid = miscService.validateForm([email]);
            if (!isValid) {
                return;
            }

            const data = { email };

            httpService.postRequest(URLS.RESET_PASSWORD, data).subscribe(d => {
                // Move to next step
                setUserEmail(email);
                setStep(1);
            });
        };

        return (
            <div className="email-step">

                <form>
                    <h2>Enter Your Email</h2>

                    <div className="sp-20"></div>

                    <div className="form-group">
                        <input
                            value={email}
                            type="email"
                            placeholder="Your Email"
                            className="form-control single-control"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                sendResetRequest();
                            }}
                            className="btn btn-primary submit-button form-control"
                        >
                            Send Password Reset Requst
                        </button>
                    </div>
                </form>

                <p className="login-message">
                    <span
                        onClick={() => {
                            history.push('/login');
                        }}
                    >
                        Go Back to Login
                    </span>
                </p>


            </div>
        );

    };

    const TokenStep = () => {

        const [token, setToken] = useState('');

        const checkToken = () => {
            const data = { email: userEmail, resetToken: token };
            httpService.getRequest(URLS.USERS, data).subscribe(d => {
                if (d && d.length > 0) {
                    miscService.handleSuccess('Token Verification Successful');
                    setStep(2);
                } else {
                    miscService.handleSuccess('Please Enter Correct Token');
                }
            });
        };

        return (
            <div className="token-step">

                <form>
                    <h2>Enter Your Token</h2>

                    <div className="sp-20"></div>

                    <div className="form-group">
                        <input
                            value={token}
                            type="text"
                            placeholder="Your Token Here"
                            className="form-control single-control"
                            onChange={(e) => {
                                setToken(e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                checkToken();
                            }}
                            className="btn btn-primary submit-button form-control"
                        >
                            Verify Token
                        </button>
                    </div>
                </form>

            </div>
        );
    };

    const PasswordStep = () => {

        const [password, setPassword] = useState('');
        const [cPassword, setCPassword] = useState('');


        const changePassword = () => {

            if (!password || !cPassword) {
                miscService.handleError('Please Fill all fields');
                return;
            }
            if (password.length < 8) {
                miscService.handleError('Please make password at least 8 characters long');
                return;
            }
            if (password !== cPassword) {
                miscService.handleError('Passwords do not match');
                return;
            }

            const data = { email: userEmail, newPassword: password, isReset: true };
            httpService.postRequest(URLS.CHANGE_PASSWORD, data).subscribe(d => {
                history.push('/login');
            });
        };

        return (
            <div className="token-step">

                <form>
                    <h2>Enter Your New Password</h2>

                    <div className="sp-20"></div>

                    <div className="form-group">
                        <input
                            value={password}
                            type="text"
                            placeholder="New Password"
                            className="form-control single-control"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            value={cPassword}
                            type="text"
                            placeholder="Confirm Password"
                            className="form-control single-control"
                            onChange={(e) => {
                                setCPassword(e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                changePassword();
                            }}
                            className="btn btn-primary submit-button form-control"
                        >
                            Update Password
                        </button>
                    </div>
                </form>

            </div>
        );
    };

    return (
        <div className="login-component">
            <div className="bg-overlay">
                <div className="container">
                    <div className="login-card-div d-flex j-center row">
                        <div className="login-card col-md-4">

                            {/* STEP 1: Enter Your Email */}
                            {step === 0 &&
                                <EmailStep />
                            }


                            {/* STEP 2: Enter Your Reset Token */}
                            {step === 1 &&
                                <TokenStep />
                            }


                            {/* STEP 3: Enter Your New Password */}
                            {step === 2 &&
                                <PasswordStep />
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
