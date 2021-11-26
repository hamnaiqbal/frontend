const URLS = {
    USERS: '/users',
    LOGIN: '/users/login',
    DEACTIVATE: '/users/deactivate',
    UPLOAD_CV: '/users/uploadCV',
    UPLOAD_PP: '/users/uploadProfImg',
    GET_TUTORS: '/users/getTutors',
    CHANGE_PASSWORD: '/users/changePassword',
    RESET_PASSWORD: '/users/resetPassword',
    GET_USER_MESSAGES: '/users/getUserMessages',

    COURSE: '/courses',

    QUOTE: '/quote',

    POST: '/post',
    SEARCH_POSTS: '/post/search',
    GET_SINGLE_POST: '/post/get/{_id}',
    POST_UPVOTE: '/post/upvote',
    
    REPLY: '/reply',
    
    JOB: '/job',
    GET_SINGLE_JOB: '/job/get/{_id}',
    GET_USER_PROJECTS: '/job/getUserProjects',

    BID: '/bid',
    ACCEPT_BID: '/bid/accept',

    GET_NOTIFICATIONS: '/notifications/get',

    REPORT: '/file-report',
    REPORT_ACTION: '/report/action',

    GENERATE_QUESTIONS: '/questions',
    CHECK_QUESTIONS: '/questions/check',

    INTERNATIONAL_SCHOLARSHIPS: '/scholarships/international',
};

export default URLS;
