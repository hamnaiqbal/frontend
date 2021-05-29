import { store } from './store';

export const reduxService = {
    studentLogin() {
        this.dispatch('STUDENT_LOGIN');
    },
    adminLogin() {
        this.dispatch('ADMIN_LOGIN');
    },
    dispatch(type) {
        store.dispatch({ type });
    },
};
