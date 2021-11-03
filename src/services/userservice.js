const userService = {
    saveLoggedInUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    isLoggedIn() {
        return localStorage.getItem('user') !== null;
    },
    getLoggedInUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : undefined;
    },
    getCurrentUserId() {
        let user = localStorage.getItem('user');
        if (!user) {
            return undefined;
        }
        user = JSON.parse(user);
        return user ? user._id : undefined;
    },
    isCurrentUserAdmin() {
        let user = localStorage.getItem('user');
        return user ? JSON.parse(user).userType === 1 : false;
    },
    logout() {
        localStorage.removeItem('user');
    },
};

export default userService;
