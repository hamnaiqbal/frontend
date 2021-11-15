import React, { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import userService from '../../services/userservice';

const SingleJob = ({ job, isByUser }) => {
    return(
        <div className="single-job-item">
            <div className="app-card single-job-card">
                
            </div>
        </div>
    )
};

export default function UserJobs() {

    const [jobsByUser, setJobsByUser] = useState([]);
    const [jobsForUser, setJobsForUser] = useState([]);

    const userId = userService.getCurrentUserId();

    useEffect(() => {

        httpService.getRequest(URLS.GET_USER_PROJECTS, { userId }).subscribe(data => {
            if (data.forUser) {
                setJobsForUser(data.forUser);
            }
            if (data.byUser) {
                setJobsByUser(data.byUser);
            }
        });

    }, [userId]);


    return (
        <div className="user-jobs-component">

            {
                jobsByUser.map((j, i) => {
                    return <SingleJob job={j} isByUser={true} key={i} />;
                })
            }

            {
                jobsForUser.map((j, i) => {
                    return <SingleJob job={j} isByUser={false} key={i} />;
                })
            }

        </div>
    );
}
