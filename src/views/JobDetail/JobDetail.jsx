import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function JobDetail() {

    const [job, setJob] = useState({});
    const [bids, setBids] = useState([]);

    const { jobId } = useParams();

    const [fetched, setFetched] = useState({ job: false, bids: false });


    useEffect(() => {
        const data = { _id: jobId };

        httpService.getRequest(URLS.GET_SINGLE_JOB, null, data).subscribe(j => {

            j.isPostedByUser = j.postedBy?._id === userService.getCurrentUserId();
            j.formattedDeadline = miscService.getFormattedDate(j.deadline, true);
            j.formattedCreatedOn = miscService.getFormattedDate(j.createdOn, true);
            j.typeName = miscService.getJobTypeName(j.type);

            setJob(j);
            setFetched(f => { return { ...f, job: true }; });
        });

        httpService.getRequest(URLS.BID, { jobId }).subscribe(bids => {
            setBids(bids);
            setFetched(f => { return { ...f, bids: true }; });
        });

    }, [jobId]);


    const JobInfo = ({ job: j }) => {
        return (
            <div className="job-info">
                <div className="job-info-header">
                    <p className="job-title">
                        {j.title}
                    </p>

                    <p className="job-poster">
                        By {j.postedBy?.name}
                    </p>

                </div>

                <div className="job-info-features row">
                    <div className="col-md-6">
                        <p className="job-feature"> <i className="fas fa-book" /> <span> Subject:</span> {j.subject?.name} </p>
                        <p className="job-feature"> <i className="fas fa-tag" /> <span> Type:</span> {j.typeName} </p>
                        <p className="job-feature"> <i className="far fa-calendar" /> <span> Deadline:</span>  {j.formattedDeadline} </p>
                    </div>

                    <div className="col-md-6">
                        <p className="job-feature"> <i className="far fa-calendar" /> <span> Posted On:</span>  {j.formattedCreatedOn} </p>
                        <p className="job-feature"> <i className="far fa-check-circle" /> <span> No. of Bids:</span> {bids.length} </p>
                    </div>

                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="job-info-details" dangerouslySetInnerHTML={{ __html: j.description }} />
                    </div>
                </div>



            </div>
        );
    };

    const JobDetailSidebar = ({ job, bids }) => {
        return (
            <div className="job-detail-sidebar">

                <div className="sidebar-header">
                    <p className="sidebar-heading">
                        {job.isPostedByUser ? 'Placed Bids' : 'Place a Bid'}
                    </p>
                </div>

                {job.isPostedByUser &&
                    <PlacedBids job={job} bids={bids} />
                }
                {!job.isPostedByUser &&
                    <BidJob bids={bids} job={job} />
                }
            </div>
        );
    };

    const PlacedBids = ({ job, bids }) => {
        const [bidsState, setBidsState] = useState([]);

        useEffect(() => {
            if (bids) {
                setBidsState(bids);
            } else if (job._id) {
                const data = { jobId: job._id };
                httpService.getRequest(URLS.BID, data).subscribe(b => {
                    setBidsState(b);
                });
            }
        }, [job, bids]);


        const renderBids = () => {
            return bidsState.map((b, i) => {
                return <div key={i} className="single-bid">
                    <div className="row">
                        <div className="col-md-8">
                            <p className="bidderName">
                                {b.bidderId?.name}
                            </p>
                            <p className="needed-days">
                                Will Complete in {b.daysNeeded} Days
                            </p>
                        </div>

                        <div className="col-md-4">
                            <p className="bid-budget">
                                PKR <span>{b.bidAmount}</span>
                            </p>
                        </div>
                    </div>
                </div>;
            });
        };

        return (
            <div className="placed-bids">
                {renderBids()}
            </div>
        );
    };

    const BidJob = ({ job, bids }) => {

        const [bidAmount, setBidAmount] = useState(0);
        const [daysNeeded, setdaysNeeded] = useState(0);
        const [description, setDescription] = useState('');

        const [hasAlreadyPlaced, setHasAlreadyPlaced] = useState(false);

        useEffect(() => {
            if (job._id) {
                if (bids && bids.length > 0) {
                    const foundIndex = bids.findIndex((b) => b.bidderId?._id === userService.getCurrentUserId());
                    setHasAlreadyPlaced(foundIndex >= 0);
                } else {
                    httpService.getRequest(URLS.BID, { jobId: job._id }).subscribe(bids => {
                        if (bids && bids.length > 0) {
                            const foundIndex = bids.findIndex((b) => b.bidderId?._id === userService.getCurrentUserId());
                            setHasAlreadyPlaced(foundIndex >= 0);
                        }
                    });
                }
            }
        }, [job, bids]);

        const onFormSubmit = (e) => {
            e.preventDefault();

            if (!bidAmount || !daysNeeded || !description) {
                miscService.handleError('Missing Fields');
                return;
            }

            const data = { bidAmount, daysNeeded, description, jobId: job._id, bidderId: userService.getCurrentUserId() };

            httpService.postRequest(URLS.BID, data).subscribe(() => {
                setHasAlreadyPlaced(true);
            });

        };

        return (
            <div className="place-bid-form-wrapper">
                {hasAlreadyPlaced &&
                    <div className="already-placed-bid text-center">
                        <i className="far fa-check-circle" />
                        <p className="already-placed-heading center">
                            You have already placed the bid
                        </p>
                        <p className="already-placed-description center">
                            You have successfully placed the bid on this job. If {job.postedBy?.name} likes your bid and wants you to work on this project, they will contact you soon. Best of luck!
                        </p>
                    </div>
                }

                {!hasAlreadyPlaced &&
                    <div className="place-bid-form">
                        <form>

                            <div className="form-group p-float-label col-sm-12 p-0">
                                <InputNumber
                                    value={bidAmount}
                                    type="text"
                                    required
                                    id="word"
                                    className="form-control single-control"
                                    onChange={(e) => {
                                        setBidAmount(e.value);
                                    }}
                                />
                                <label htmlFor="word">Bid Amount</label>
                            </div>

                            <div className="form-group p-float-label col-sm-12 p-0 text-left">
                                <Dropdown
                                    value={daysNeeded}
                                    required
                                    options={CONSTANTS.DAYS_REQUIRED_OPTIONS}
                                    className="form-cotntrol single-control"
                                    id="type"
                                    onChange={(e) => {
                                        setdaysNeeded(e.target.value);
                                    }}
                                />
                                <label htmlFor="type">Days Required</label>
                            </div>

                            <div className="form-group p-float-label col-sm-12 p-0 text-left">
                                <InputTextarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    className="form-control single-control"
                                    name="description"
                                />
                                <label description="type">Bid Description</label>
                            </div>

                            <div className="form-group">
                                <button onClick={onFormSubmit} className="btn btn-primary btn-submit fw">Place Bid</button>
                            </div>
                        </form>
                    </div>
                }


            </div>
        );
    };

    return (
        <div>
            {
                fetched.bids && fetched.job &&
                <div className="job-detail-component">
                    <div className="row">
                        <div className="col-md-8">
                            {/* Complete Job Information and Description */}
                            <div className="app-card job-info-card">
                                <JobInfo job={job} />
                            </div>

                        </div>

                        <div className="col-md-4">
                            {/* Placed Bids if user is poster, otherwise a form to post bids */}

                            <div className="app-card job-detail-sidebar-card">

                                <div className="job-detail-sidebar-wrapper">
                                    <JobDetailSidebar job={job} bids={bids} />
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            }
        </div>
    );
}
