import { toast } from 'react-toastify';

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
            if (field == null || field == '') {
                validForm = false;
                return;
            }
        });
        return validForm;
    },

    getFormattedDate(strDate) {
        if (!strDate) {
            return (new Date()).toLocaleString()
        }
        return new Date(strDate).toLocaleString()
    }

};

export default miscService;
