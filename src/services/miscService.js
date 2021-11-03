import { toast } from 'react-toastify';
import URLS from '../constants/api-urls';
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
            return new Date(strDate).toLocaleDateString()
        }
        if (dateOnly && !strDate) {
            return (new Date()).toLocaleDateString()
        }
        if (strDate) {
            return new Date(strDate).toLocaleString()
        }
        return (new Date()).toLocaleString()
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
                resolve([])
            });
        })
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
    }

};

export default miscService;
