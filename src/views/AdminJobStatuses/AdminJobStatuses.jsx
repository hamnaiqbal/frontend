import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react'
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

/**
 * This component will show the list of jobs to admins and the admins can then take actions
 */

export default function AdminJobStatuses() {
    const [jobs, setJobs] = useState([]);

    const [showPayoutDialog, setShowPayoutDialog] = useState(false);

    const [selecteJob, setSelecteJob] = useState({});
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        httpService.getRequest(URLS.GET_JOBS_ADMIN).subscribe(jobs => {
            setJobs(jobs);
        })
    }

    const viewPayoutDialog = (j) => {
        setSelecteJob(j);
        if (j.acceptedBid?.bidderId) {
            setSelectedUser(j.acceptedBid?.bidderId)
        }
        setShowPayoutDialog(true);
    }

    const PayoutDetails = ({ user: u, job: j, onClose }) => {

        const onPayout = () => {
            const data = { jobId: j._id, sellerId: u._id }
            httpService.postRequest(URLS.MARK_AS_PAID, data, false, true, false).subscribe(() => {
                miscService.handleSuccess('Job marked as paid to the user');
                if (onClose) {
                    onClose();
                }
            })
        }
        return (

            <div className="payout-deatil">

                <div className="row">
                    <div className="col-md-6 user-detail-item">
                        <p className="user-detail-heading">Name</p>
                        <p className="user-detail-value">{u.name}</p>
                    </div>

                    <div className="col-md-6 user-detail-item">
                        <p className="user-detail-heading">Username</p>
                        <p className="user-detail-value">{u.username}</p>
                    </div>

                    <div className="col-md-6 user-detail-item">
                        <p className="user-detail-heading">Email</p>
                        <p className="user-detail-value">{u.email}</p>
                    </div>

                    <div className="col-md-6 user-detail-item">
                        <p className="user-detail-heading">Stripe Id</p>
                        <p className="user-detail-value">{u.stripeUser}</p>
                    </div>

                </div>

                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <button className='mark-as-paid btn btn-primary' onClick={onPayout}>Mark as Paid out</button>
                    </div>
                </div>
            </div>
        )


    }

    return (
        <div className='admin-job-status-component'>

            <Dialog className='payout-dialog' visible={showPayoutDialog} header={'Payout Details'} onHide={() => { setShowPayoutDialog(false) }}>
                <PayoutDetails job={selecteJob} user={selectedUser} onClose={() => { setShowPayoutDialog(false); fetchJobs(); }} />
            </Dialog>

            {
                jobs.map((j, index) => {
                    return <div key={index} className='single-job-wrapper'>
                        <div className="row single-job-card app-card">

                            <div className="col-md-2 job-status-wrapper">
                                {/* JOB STATUS */}

                                <p className={"job-status status-" + j.status}>
                                    <i className={CONSTANTS.JOB_STATUSES[j.status]?.icon}></i>
                                    {CONSTANTS.JOB_STATUSES[j.status].name}
                                </p>

                            </div>

                            <div className="col-md-5">
                                {/* JOB DETAILS */}

                                {/* Job title */}
                                <p className="job-title">{j.title}</p>
                                {
                                    j.acceptedBid &&
                                    <p className="job-feature seller">Seller: {j.acceptedBid?.bidderId?.name} ({j.acceptedBid?.bidderId?.username})</p>
                                }

                                <p className="job-feature seller">Buyer: {j.postedBy?.name} ({j.postedBy?.username})</p>
                            </div>

                            <div className="col-md-2 budget-wrapper">
                                <div>
                                    <p className="budget-text">Budget</p>
                                    <p className="budget"><span>{j.budget}</span> PKR</p>
                                </div>
                            </div>

                            <div className="col-md-3 actions-wrapper">
                                {/* JOB ACTIONS */}
                                <div className="job-actions">
                                    {j.status === 4 && !j.paidToCustomer &&
                                        <div className='job-action' onClick={() => { viewPayoutDialog(j) }}>
                                            <i className="fas fa-coins" /> Payout
                                        </div>
                                    }

                                    {j.status === 4 && j.paidToCustomer &&
                                        <div className='paid-to-seller'>
                                            <i className="fas fa-check-circle" /> Paid to Seller
                                        </div>
                                    }

                                </div>


                            </div>

                        </div>
                    </div>
                })
            }
        </div>
    )
}
