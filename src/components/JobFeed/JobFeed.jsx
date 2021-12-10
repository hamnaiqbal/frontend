import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

function JobFeed() {
    const [jobs, setJobs] = useState([]);

    const history = useHistory();

    const goToJob = (j) => {
        history.push(`/home/job/${j._id}`);
    }

    useEffect(() => {
        const data = { userId: userService.getCurrentUserId() };
        httpService.getRequest(URLS.GET_JOB_LISTING, data, null, false).subscribe(jobs => {

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
            <div className="sidebar-jobs-list">
                {
                    jobs.length > 0 &&
                    jobFeed()
                }
                {jobs.length === 0 &&
                    <div>
                        <h6 className='bold' style={{marginTop: '20px'}}>
                            No New Jobs Found
                        </h6>

                    </div>
                }
            </div>
        </div>
    );
}

export default JobFeed;
