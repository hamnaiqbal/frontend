import { InputSwitch } from 'primereact/inputswitch';
import React, { useCallback, useEffect, useState } from 'react'
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import { useHistory } from 'react-router-dom';

const ReporetedItem = ({ item, fetchReports }) => {

    const history = useHistory();

    const takeAction = (action) => {

        // ACTION = 0 => CLEAR
        // ACTION = 1 => DEACTIVATE

        action = action === 0 ? 'CLEAR' : action === 1 ? 'DEACTIVATE' : '';

        const data = { reportId: item._id, postId: item.reportedPost?._id, action };

        httpService.postRequest(URLS.REPORT_ACTION, data).subscribe(() => {
            if (fetchReports) {
                fetchReports();
            }
        })

    }

    const goToPost = () => {
        history.push(`/home/post/${item.reportedPost?._id}`);
    }


    return (
        <div className="single-report report-card app-card">
            <div className="row">

                <div className="col-xs-8 col-sm-8 col-md-7">
                    {/* Time calculation */}
                    {/* Post Title, reported by, reported reason */}

                    {
                        item.type === 'P' &&
                        <div className="reported-post">
                            <p className="post-title" onClick={goToPost}>
                                {item.reportedPost?.title}
                            </p>

                            <p className="reported-by">
                                <span> Reported By </span> {item.reportedBy?.name}
                            </p>


                            <p className="report-reason">
                                {item.description}
                            </p>

                        </div>
                    }

                </div>


                <div className="col-xs-4 col-sm-4 col-md-2 report-status-wrapper">
                    {/* Report Status Formatted */}

                    <p className={"report-status status-" + item.status?.toLowerCase()}>
                        {item.status}
                    </p>


                </div>

                <div className="col-md-3">
                    {/* Actions - Delete Item, or Remove Report */}
                    <div className="report-actions">
                        {
                            item.status === 'REPORTED' && item.type === 'P' &&
                            <>
                                <p className="report-action deactivate" onClick={() => { takeAction(1) }}>
                                    <i className="far fa-eye-slash"></i> Deactivate Post
                                </p>

                                <p className="report-action clear" onClick={() => { takeAction(0) }}>
                                    <i className="far fa-check-circle"></i> Clear Post
                                </p>
                            </>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default function ReportedItems() {

    const [reports, setReports] = useState([]);
    const [showResolvedReports, setShowResolvedApps] = useState(false);

    const fetchReports = useCallback(() => {
        const data = {};

        if (!showResolvedReports) {
            data.status = 'REPORTED';
        }
        httpService.getRequest(URLS.REPORT, data).subscribe(r => {
            setReports(r);
        });
    }, [showResolvedReports]);


    useEffect(() => {
        fetchReports();
    }, [fetchReports]);


    return (
        <div className="reported-items-component">

            <div className="row">
                <div className="col-md-6">
                    <p className="section-heading">
                        Reported Items
                    </p>
                </div>

                <div className="col-md-6 switch-field-wrapper">
                    <div className="form-group switch-field">
                        <p className="switch-label">Show Resolved Reports</p>
                        <InputSwitch checked={showResolvedReports} onChange={(e) => setShowResolvedApps(e.value)} />
                    </div>
                </div>
            </div>

            {
                reports.map((report, i) => {
                    return <ReporetedItem key={i} item={report} fetchReports={fetchReports} />
                })
            }
        </div>
    )
}
