const CONSTANTS = {
    API_PATH: 'http://localhost:3000',
    MAIN_WIDTH_CLASS: 'container-fluid',
    DEFAULT_USER_IMAGE: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-6.jpg',

    DEPARTMENTS: [
        { label: 'Computer Science', value: 'CS' },
        { label: 'Software Engineering', value: 'SE' },
    ],

    QUOTE_STATUSES: {
        0: { name: 'Placed', icon: 'fas fa-check' },
        1: { name: 'Replied', icon: 'fas fa-reply' },
        2: { name: 'Accepted', icon: 'fas fa-check-double' },
        3: { name: 'Rejected', icon: 'fas fa-times' },
    },

    JOB_STATUSES: {
        0: { name: 'New', icon: 'far fa-check-circle' },
        1: { name: 'In Progress', icon: 'fas fa-sync' },
        2: { name: 'Delivered', icon: 'far fa-check-circle' },
        3: { name: 'Paid', icon: 'far fa-money-bill-alt' },
        4: { name: 'Completed', icon: 'far fa-check-circle' },
        5: { name: 'Disputed', icon: 'fas fa-project-diagram' },
        6: { name: 'Cancelled', icon: 'far fa-times-circle' },
    },

    DURATION_OPTIONS: [
        { label: '1 Week', value: '1w' },
        { label: '2 Weeks', value: '2w' },
        { label: '3 Weeks', value: '3w' },
        { label: '1 Month', value: '1m' },
        { label: '2 Months', value: '2w' },
        { label: '4 Months', value: '4m' },
        { label: '6 Months', value: '6m' },
        { label: 'More than 6 Months', value: '6m+' },
    ],

    JOB_TYPES: [
        { label: 'Assignment Help', value: 'A' },
        { label: 'Project Help', value: 'P' },
        { label: 'Others', value: 'O' },
    ],

    DAYS_REQUIRED_OPTIONS: [
        { label: '1 Day', value: '1' },
        { label: '2 Days', value: '2' },
        { label: '3 Days', value: '3' },
        { label: '5 Days', value: '5' },
        { label: '8 Days', value: '8' },
        { label: '10 Days', value: '10' },
        { label: 'More than 10 Days', value: '10+' },
    ],

};

export default CONSTANTS;
