import React, { useEffect, useState } from 'react'
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';


const ReporetedItem = ({ item }) => {
    return (
        <div className="single-report report-card app-card">
            <div className="row">

                <div className="col-md-7">
                    {/* Time calculation */}
                    {/* Post Title, reported by, reported reason */}

                    {
                        item.type === 'P' &&
                        <div className="reported-post">
                            <p className="post-title">
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


                <div className="col-md-2 report-status-wrapper">
                    {/* Report Status Formatted */}

                    <p className="report-status">
                        {item.status}
                    </p>


                </div>

                <div className="col-md-3">
                    {/* Actions - Delete Item, or Remove Report */}

                </div>

            </div>
        </div>
    )
}

export default function ReportedItems() {

    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        httpService.getRequest(URLS.REPORT).subscribe(r => {
            setReports(r);
        });
    }

    return (
        <div className="reported-items-component">
            {
                reports.map((report, i) => {
                    return <ReporetedItem key={i} item={report} />
                })
            }
        </div>
    )
}
