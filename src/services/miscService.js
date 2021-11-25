import { toast } from 'react-toastify';
import URLS from '../constants/api-urls';
import CONSTANTS from '../constants/constants';
import httpService from './httpservice';

let courseOptions = [];

const miscService = {
    handleSuccess(description) {
        toast.success(description || 'Operation Successful', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
        });
    },
    handleError(description) {
        toast.error(description || 'Operation Unsuccessful', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
        });
    },
    showLoader() {
        const loaderElement = document.querySelector('.loader');
        loaderElement.setAttribute('style', 'display: flex');
    },
    hideLoader() {
        const loaderElement = document.querySelector('.loader');
        loaderElement.setAttribute('style', 'display: none');
    },

    validateForm(reqFields) {
        let validForm = true;

        reqFields.forEach((field) => {
            if (field == null || field === '') {
                validForm = false;
                return;
            }
        });
        return validForm;
    },

    getFormattedDate(strDate, dateOnly = false) {
        if (dateOnly && strDate) {
            return new Date(strDate).toLocaleDateString();
        }
        if (dateOnly && !strDate) {
            return (new Date()).toLocaleDateString();
        }
        if (strDate) {
            return new Date(strDate).toLocaleString();
        }
        return (new Date()).toLocaleString();
    },

    getCourseOptions() {
        return new Promise((resolve, reject) => {
            if (courseOptions && courseOptions.length > 0) {
                resolve(courseOptions);
                return;
            }
            httpService.getRequest(URLS.COURSE).subscribe((data) => {
                if (data.length > 0) {
                    const options = data.map((d) => {
                        return { label: `${d.code}-${d.name}`, value: d._id };
                    });
                    courseOptions = options;
                    resolve(options);
                }
                resolve([]);
            });
        });
    },

    async getCourseName(courseId, includeCode = true) {
        if (!courseOptions) {
            await this.getCourseOptions();
        }
        if (includeCode) {
            return courseOptions?.find(c => c.value === courseId)?.label ?? '';
        } else {
            return courseOptions?.find(c => c.value === courseId)?.label.split('-')[1] ?? '';
        }
    },

    getJobTypeName(value) {
        return CONSTANTS.JOB_TYPES.find(job => job.value === value).label ?? 'Other';
    },

    getTimeDifference(postDate, diffInMS, shortVersion = false) {
        const pDate = new Date(postDate);
        const cDate = new Date();

        const MINS_MS = 1000 * 60;
        const HOURS_MS = MINS_MS * 60;
        const DAYS_MS = HOURS_MS * 24;

        const diff = diffInMS ?? cDate.getTime() - pDate.getTime();

        if (diff > DAYS_MS) {
            if (shortVersion) {
                return `${Math.floor(diff / DAYS_MS)}d`;
            }
            return `${Math.floor(diff / DAYS_MS)} days ago`;
        }
        if (diff > HOURS_MS) {
            if (shortVersion) {
                return `${Math.floor(diff / HOURS_MS)}h`; 
            }
            return `${Math.floor(diff / HOURS_MS)} hours ago`;
        }
        if (shortVersion) {
            return `${Math.floor(diff / MINS_MS)}m`; 
        }
        return `${Math.floor(diff / MINS_MS)} minutes ago`;
    }

};

export default miscService;
