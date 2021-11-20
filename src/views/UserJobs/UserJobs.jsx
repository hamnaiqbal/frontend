import React, { useCallback, useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

const SingleJob = ({ job, isUserBuyer, onActionPerform }) => {

    const markJobAs = (status) => {
        if (![0, 1, 2, 3, 4, 5, 6].includes(status)) {
            return;
        }

        if (status === 3) {
            // TODO
            // payment logic here
        }

        const data = { ...job, status };

        httpService.putRequest(URLS.JOB, data).subscribe(() => {
            if (onActionPerform) {
                onActionPerform();
            }
        });
    };

    const editJob = () => {

    };


    return (
        <div className="single-job-item">
            <div className="app-card single-job-card">
                <div className="row">
                    {/* Job Status Formatted */}
                    <div className="col-md-2 job-status-wrapper">

                        <p className={"job-status status-" + job.status}>
                            <i className={CONSTANTS.JOB_STATUSES[job.status]?.icon}></i>
                            {CONSTANTS.JOB_STATUSES[job.status].name}
                        </p>

                    </div>

                    {/* Job Name and Poster */}
                    <div className="col-md-3 single-job-name-column">
                        <div className="name-poster-wrapper">
                            <p className="job-title">
                                {job.title}
                            </p>
                            <p className="posted-by">
                                {
                                    // if the user is seller, then buyer should be shown here
                                    !isUserBuyer && `Buyer: ${job.postedBy?.name}`
                                }
                                {
                                    // If the user is buyer, then seller should be shown here
                                    isUserBuyer && job.acceptedBid?.bidderId?.name && `Seller: ${job.acceptedBid?.bidderId?.name}`
                                }
                                {
                                    // If the user is buyer, and the item is not yet accepted, then we should display a message here
                                    isUserBuyer && !job.acceptedBid?.bidderId?.name && 'No Bid Accepted Yet'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Job Features 1st Column */}
                    <div className="col-md-2">
                        {/* Job Start Date and Expected Deadline */}

                        {
                            job.status === 0 &&
                            <div>
                                <div className="job-feature">
                                    <p className="job-feature-heading">
                                        <i className="far fa-calendar"></i>
                                        Job Post Date
                                    </p>
                                    <p className="job-feature-value">
                                        {miscService.getFormattedDate(job.createdOn, true)}
                                    </p>
                                </div>
                                <div className="job-feature">
                                    <p className="job-feature-heading">
                                        <i className="far fa-calendar-times"></i>
                                        Expected Deadline
                                    </p>
                                    <p className="job-feature-value">
                                        {miscService.getFormattedDate(job.deadline, true)}
                                    </p>
                                </div>
                            </div>
                        }
                        {
                            [1, 2, 3, 4, 5, 6].includes(job.status) &&
                            <div>
                                <div className="job-feature">
                                    <p className="job-feature-heading">
                                        <i className="far fa-calendar"></i>
                                        Job Start Date
                                    </p>
                                    <p className="job-feature-value">
                                        {miscService.getFormattedDate(job.startDate, true)}
                                    </p>
                                </div>
                                {
                                    // if in progress, delivered or disputed, show number of days expected
                                    [1, 2, 5].includes(job.status) &&
                                    <div className="job-feature">
                                        <p className="job-feature-heading">
                                            <i className="fas fa-hourglass-half"></i>
                                            No of Days Required
                                        </p>
                                        <p className="job-feature-value">
                                            {job.acceptedBid?.daysNeeded} Days
                                        </p>
                                    </div>
                                }
                                {
                                    // for paid, completed and cancelled jobs, show end date
                                    [3, 4, 6].includes(job.status) &&
                                    <div className="job-feature">
                                        <p className="job-feature-heading">
                                            <i className="far fa-calendar-check"></i>
                                            Job Ended On
                                        </p>
                                        <p className="job-feature-value">
                                            {miscService.getFormattedDate(job.endedDate)}
                                        </p>
                                    </div>
                                }
                            </div>
                        }


                    </div>

                    {/* Job Features 2nd Column */}
                    <div className="col-md-2">
                        {
                            // if there is an accepted bid, then we will show the amount that was accepted as the project price
                            job.acceptedBid &&
                            <div className="job-feature">
                                <p className="job-feature-heading">
                                    <i className="far fa-file-invoice-dollar"></i>
                                    Accepted Bid Value
                                </p>
                                <p className="job-feature-value">
                                    {job.acceptedBid?.bidAmount} PKR
                                </p>
                            </div>
                        }
                        {
                            // if there is no accepted bid, then we show the approximate budget of the project
                            !job.acceptedBid &&
                            <div className="job-feature">
                                <p className="job-feature-heading">
                                    <i className="fas fa-coins"></i>
                                    Budget
                                </p>
                                <p className="job-feature-value">
                                    {job.budget} PKR
                                </p>
                            </div>
                        }
                        <div className="job-feature">
                            <p className="job-feature-heading">
                                <i className="fas fa-tag"></i>
                                Type
                            </p>
                            <p className="job-feature-value">
                                {miscService.getJobTypeName(job.type)}
                            </p>
                        </div>
                    </div>

                    {/* Job Actions  */}
                    <div className="col-md-3 job-actions-column">
                        {
                            // these actions are for buyer
                            isUserBuyer &&
                            <div className="single-job-actions">

                                {
                                    // if the job is new, the user can edit it or cancel it
                                    job.status === 0 &&
                                    <>
                                        <button onClick={editJob} className="btn job-action-btn edit-btn">
                                            <i className="fas fa-pencil-alt"></i>
                                            Edit
                                        </button>
                                        <button onClick={() => { markJobAs(6); }} className="btn job-action-btn cancel-btn">
                                            <i className="fas fa-times"></i>
                                            Cancel Job
                                        </button>
                                    </>
                                }
                                {
                                    // if the job is in progress, the buyer can cancel it
                                    job.status === 1 &&
                                    <>
                                        <button onClick={() => { markJobAs(6); }} className="btn job-action-btn cancel-btn">
                                            <i className="fas fa-times"></i>
                                            Cancel Job
                                        </button>
                                    </>
                                }
                                {
                                    // if the job is delivered, the user can either pay it or mark it in progress again or mark it disputed
                                    job.status === 2 &&
                                    <>
                                        <button onClick={() => { markJobAs(3); }} className="btn job-action-btn paid-btn">
                                            <i className="fas fa-file-invoice-dollar"></i>
                                            Mark as Paid
                                        </button>
                                        <button onClick={() => { markJobAs(1); }} className="btn job-action-btn paid-btn">
                                            <i className="fas fa-redo-alt"></i>
                                            Mark as In Progress
                                        </button>
                                        <button onClick={() => { markJobAs(5); }} className="btn job-action-btn disputed-btn">
                                            <i className="fas fa-balance-scale-right"></i>
                                            Mark as Disputed
                                        </button>
                                    </>
                                }
                                {
                                    // once job is mark paid, no further actions for buyer
                                    job.status === 3 &&
                                    <>

                                    </>
                                }


                            </div>
                        }
                        {
                            // 
                            !isUserBuyer &&
                            <div className="single-job-actions">
                                {
                                    // if the job is in progress, seller can mark it delivered
                                    job.status === 1 &&
                                    <>
                                        <button onClick={() => { markJobAs(2); }} className="btn job-action-btn deliver-btn">
                                            <i className="fas fa-check-circle"></i>
                                            Mark as Delivered
                                        </button>
                                    </>
                                }
                                {
                                    // if the job is marked paid by the buyer, the seller can confirm by marking it complete or disputed
                                    job.status === 3 &&
                                    <>
                                        <button onClick={() => { markJobAs(4); }} className="btn job-action-btn complete-btn">
                                            <i className="fas fa-check-circle"></i>
                                            Mark as Completed
                                        </button>
                                        <button onClick={() => { markJobAs(5); }} className="btn job-action-btn disputed-btn">
                                            <i className="fas fa-balance-scale-right"></i>
                                            Mark as Disputed
                                        </button>
                                    </>
                                }
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default function UserJobs() {

    const [jobsByUser, setJobsByUser] = useState([]);
    const [jobsForUser, setJobsForUser] = useState([]);

    const userId = userService.getCurrentUserId();

    const fetchRequests = useCallback(
        () => {
            httpService.getRequest(URLS.GET_USER_PROJECTS, { userId }).subscribe(data => {
                if (data.forUser) {
                    setJobsForUser(data.forUser);
                }
                if (data.byUser) {
                    setJobsByUser(data.byUser);
                }
            });
        },
        [userId],
    );

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);



    return (
        <div className="user-jobs-component">

            <p className="job-section-heading">
                Jobs Posted By User
            </p>

            {
                // Meaning the jobs that user posted and he/she is the Buyer
                jobsByUser.map((j, i) => {
                    return <SingleJob onActionPerform={fetchRequests} job={j} isUserBuyer={true} key={i} />;
                })
            }

            <p className="job-section-heading">
                Jobs Accepted By User
            </p>

            {
                // Meaning that the user placed a bid and got the bid accepted for these projects
                // so here, the user is selling the services instead of buying
                jobsForUser.map((j, i) => {
                    return <SingleJob onActionPerform={fetchRequests} job={j} isUserBuyer={false} key={i} />;
                })
            }

        </div>
    );
}
