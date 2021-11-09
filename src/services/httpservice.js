import axios from 'axios';
import { Observable } from 'rxjs';
import CONSTANTS from '../constants/constants';
import miscService from './miscService';
import userService from './userservice';

const httpService = {
    getRequest(url, queryParams, pathParams, showLoader = true, options) {
        let apiUrl = CONSTANTS.API_PATH + url;
        apiUrl = this.replaceParamsWithValues(apiUrl, pathParams);
        apiUrl = this.addQueryParamsToUrl(apiUrl, queryParams);
        if (showLoader) {
            miscService.showLoader();
        }
        return new Observable((obs) => {
            axios
                .get(apiUrl)
                .then((response) => {
                    if (showLoader) {
                        miscService.hideLoader();
                    }
                    if (response.data && response.data.success) {
                        obs.next(response.data.data);
                        obs.complete();
                    } else {
                        obs.error();
                        obs.complete();
                        miscService.handleError(response.data.message);
                    }
                })
                .catch((error) => {
                    obs.error();
                    obs.complete();
                    const message =
                        error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    if (showLoader) {
                        miscService.hideLoader();
                    }
                    miscService.handleError(message);
                });
        });
    },
    postRequest(url, data, isMultipart = false, showLoader = true, showToast = true) {
        const apiUrl = CONSTANTS.API_PATH + url;
        if (showLoader) {
            miscService.showLoader();
        }
        let formData = data;
        formData = this.setCommonParams(formData);
        if (isMultipart) {
            formData = this.convertToFormData(data);
        }
        return new Observable((obs) => {
            axios
                .post(apiUrl, formData)
                .then((response) => {
                    console.log(response);
                    miscService.hideLoader();
                    if (response.data.success) {
                        if (showToast) {
                            miscService.handleSuccess(response.data.message);
                        }
                        obs.next(response.data.data);
                        obs.complete();
                    } else {
                        obs.error();
                        obs.complete();
                        if (showToast) {
                            miscService.handleError(response.data.message);
                        }
                    }
                })
                .catch((error) => {
                    obs.error();
                    obs.complete();
                    const message =
                        error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    miscService.hideLoader();
                    if (showToast) {
                        miscService.handleError(message);
                    }
                });
        });
    },
    putRequest(url, data, isMultipart = false, showLoader = true, showToast = true) {
        const apiUrl = CONSTANTS.API_PATH + url;
        if (showLoader) {
            miscService.showLoader();
        }
        let formData = data;
        formData = this.setCommonParams(formData);
        if (isMultipart) {
            formData = this.convertToFormData(data);
        }
        return new Observable((obs) => {
            axios
                .put(apiUrl, formData)
                .then((response) => {
                    console.log(response);
                    miscService.hideLoader();
                    if (response.data.success) {
                        if (showToast) {
                            miscService.handleSuccess(response.data.message);
                        }
                        obs.next(response.data.data);
                        obs.complete();
                    } else {
                        obs.error();
                        obs.complete();
                        if (showToast) {
                            miscService.handleError(response.data.message);
                        }
                    }
                })
                .catch((error) => {
                    obs.error();
                    obs.complete();
                    const message =
                        error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    miscService.hideLoader();
                    if (showToast) {
                        miscService.handleError(message);
                    }
                });
        });
    },
    deleteRequest(url, data, isMultipart = false) {
        const apiUrl = CONSTANTS.API_PATH + url;
        miscService.showLoader();
        let formData = data;
        formData = this.setCommonParams(formData);
        if (isMultipart) {
            formData = this.convertToFormData(data);
        }
        return new Observable((obs) => {
            axios
                .delete(apiUrl, { data: formData })
                .then((response) => {
                    console.log(response);
                    miscService.hideLoader();
                    if (response.data.success) {
                        miscService.handleSuccess(response.data.message);
                        obs.next(response.data.data);
                        obs.complete();
                    } else {
                        obs.error();
                        obs.complete();
                        miscService.handleError(response.data.message);
                    }
                })
                .catch((error) => {
                    obs.error();
                    obs.complete();
                    const message =
                        error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    miscService.hideLoader();
                    miscService.handleError(message);
                });
        });
    },
    addQueryParamsToUrl(url, queryParams) {
        if (queryParams && Object.keys(queryParams).length > 0) {
            let toReturn = url + '?';
            Object.keys(queryParams).forEach((key, index, arr) => {
                toReturn += `${key}=${queryParams[key]}`;
                toReturn += index === arr.length - 1 ? '' : '&';
            });
            return toReturn;
        }
        return url;
    },
    convertToFormData(data) {
        const formData = new FormData();
        Object.keys(data).forEach((k) => {
            formData.append(k, data[k]);
        });
        return formData;
    },
    replaceParamsWithValues(url, data) {
        if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach((k) => {
                url = url.replace(`{${k}}`, data[k]);
            });
        }
        return url;
    },
    setCommonParams(data) {
        if (userService.isLoggedIn()) {
            data = data || {};
            data['userId'] = userService.getCurrentUserId();
            data['isAdmin'] = userService.isCurrentUserAdmin();
        }
        return data;
    },
};

export default httpService;
