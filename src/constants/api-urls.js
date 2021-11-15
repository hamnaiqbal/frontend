const URLS = {
    USERS: '/users',
    LOGIN: '/users/login',
    DEACTIVATE: '/users/deactivate',
    UPLOAD_CV: '/users/uploadCV',
    UPLOAD_PP: '/users/uploadProfImg',
    GET_TUTORS: '/users/getTutors',
    CHANGE_PASSWORD: '/users/changePassword',
    RESET_PASSWORD: '/users/resetPassword',

    COURSE: '/courses',

    QUOTE: '/quote',

    POST: '/post',
    GET_SINGLE_POST: '/post/get/{_id}',
    POST_UPVOTE: '/post/upvote',
    
    REPLY: '/reply',
    
    JOB: '/job',
    GET_SINGLE_JOB: '/job/get/{_id}',
    GET_USER_PROJECTS: '/job/getUserProjects',

    BID: '/bid',

    GENERATE_QUESTIONS: '/questions',
    CHECK_QUESTIONS: '/questions/check',

    INTERNATIONAL_SCHOLARSHIPS: '/scholarships/international',
};

export default URLS;
