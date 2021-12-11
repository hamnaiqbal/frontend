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
    SEARCH_USERS_BY_NAMES: '/users/searchUsersByName',
    USER_OAUTH_VERIFICATION: '/users/verifyOAuth',
    USER_PAY: '/users/pay',

    COURSE: '/courses',

    QUOTE: '/quote',

    POST: '/post',
    GET_SINGLE_POST: '/post/get/{_id}',
    POST_UPVOTE: '/post/upvote',
    
    REPLY: '/reply',
    REPLY_UPVOTE: '/reply/upvote',
    
    JOB: '/job',
    GET_SINGLE_JOB: '/job/get/{_id}',
    GET_USER_PROJECTS: '/job/getUserProjects',
    GET_JOB_LISTING: '/job/getJobs',

    BID: '/bid',
    ACCEPT_BID: '/bid/accept',

    GET_NOTIFICATIONS: '/notifications/get',

    REPORT: '/file-report',
    REPORT_ACTION: '/report/action',

    GENERATE_QUESTIONS: '/questions',
    CHECK_QUESTIONS: '/questions/check',
    GET_AVAILABLE_SUBJECTS: '/questions/availableSubjects',
    GET_EXPERT_QUIZ: '/questions/expert/{subjectId}',

    INTERNATIONAL_SCHOLARSHIPS: '/scholarships/international',
};

export default URLS;
