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
};

export default miscService;
