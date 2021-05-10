import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import userService from '../../services/userservice';
import './Login.scss';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const login = (event) => {
        event.preventDefault();
        const body = {
            username,
            password,
        };
        httpService.postRequest(URLS.LOGIN, body).subscribe((data) => {
            userService.saveLoggedInUser(data);
            history.push('/home');
        });
    };

    return (
        <div className="login-component">
            <div className="container">
                <div className="login-card-div d-flex j-center row">
                    <div className="login-card col-md-4">
                        <form>
                            <h2>Login</h2>
                            <div className="sp-20"></div>
                            <div className="form-group">
                                <input
                                    value={username}
                                    type="text"
                                    placeholder="Username"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    onClick={(e) => {
                                        login(e);
                                    }}
                                    className="btn btn-primary submit-button form-control"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
