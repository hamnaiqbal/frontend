import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

function JobFeed() {
    const [jobs, setJobs] = useState([]);

    const history = useHistory();

    const goToJob = (j) => {
        history.push(`/home/job/${j._id}`);
    }

    useEffect(() => {
        const data = { status: 0 };
        httpService.getRequest(URLS.JOB, data, null, false).subscribe(jobs => {

            if (jobs.length > 5) {
                jobs = jobs.slice(0, 5);
            }

            jobs.forEach(j => {
                j.passedTime = miscService.getTimeDifference(j.createdOn);
            });

            setJobs(jobs);
        });
    }, []);

    const jobFeed = () => {
        return jobs.map((job, index, arr) => {
            return (
                <div className="sidebar-single-job-wrapper" key={index} onClick={() => { goToJob(job) }}>
                    <div className="sidebar-single-job">
                        <div className="title-and-time">
                            <p className="job-title">{job.title}</p>
                            <p className="job-time">{job.passedTime}</p>
                        </div>
                        <div className="budget-wrapper">
                            <p className="job-budget">{job.budget}</p>
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
