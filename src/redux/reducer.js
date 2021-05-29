import userService from '../services/userservice';

const initState = {
    isLoggedIn: userService.isLoggedIn(),
    isAdmin: userService.isCurrentUserAdmin(),
};

export const loginReducer = function (state = initState, action) {
    switch (action.type) {
        case 'ADMIN_LOGIN':
            state.isAdmin = true;
            state.isLoggedIn = true;
            return state;
        case 'STUDENT_LOGIN':
            state.isAdmin = false;
            state.isLoggedIn = true;
            return state;
        default:
            return state;
    }
};
