import React, { useState, useEffect } from 'react';

function JobFeed() {
    const [jobs, setJobs] = useState([]);

    const jobFeed = () => {
        return [1, 2, 3, 4, 5, 6].map((job, index, arr) => {
            return (
                <div className="sidebar-single-job-wrapper" key={index}>
                    <div className="sidebar-single-job">
                        <div className="title-and-time">
                            <p className="job-title">Frontend Task</p>
                            <p className="job-time">30 Mins Ago</p>
                        </div>
                        <div className="budget-wrapper">
                            <p className="job-budget">PKR 500</p>
                        </div>
                    </div>
                    {index !== arr.length - 1 && <hr />}
                </div>
            );
        });
    };

    return (
        <div className="job-feed-sidebar">
            <div className="job-feed-sidebar-card">
                <p className="job-feed-heading">
                    <span className="pi pi-list"></span>
                    Latest Jobs
                </p>
            </div>
            <div className="sidebar-jobs-list">{jobFeed()}</div>
        </div>
    );
}

export default JobFeed;
