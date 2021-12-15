import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import URLS from '../../constants/api-urls'
import httpService from '../../services/httpservice'
import userService from '../../services/userservice';

export default function AdminDashboard() {

    const [stats, setStats] = useState({});

    const user = userService.getLoggedInUser();

    const history = useHistory();

    useEffect(() => {
        getAdminStats();
    }, []);

    const getAdminStats = () => {

        httpService.getRequest(URLS.USER_GET_ADMIN_STATS).subscribe(stats => {
            setStats(stats);
        })
    }

    const goToReports = () => {
        history.push('/home/reportedItems')
    }

    const goToJobs = () => {
        history.push('/home/admin-jobs')
    }

    return (
        <div className='admin-dashboard'>

            <div className="row">
                <div className="col-md-12">
                    <div className="app-card">
                        <h4>
                            👋 Welcome <span className='bold'>{user.name}</span>
                        </h4>
                    </div>
                </div>
            </div>

            <br />

            {/* Admin Stats Row */}

            <div className="row">

                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.userCount}</p>
                        <i className="admin-stat-icon far fa-user" />
                        <p className="admin-stat-heading">Users</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.tranCount}</p>
                        <i className="admin-stat-icon fas fa-coins" />
                        <p className="admin-stat-heading">Transactions</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.jobsCount}</p>
                        <i className="admin-stat-icon far fa-file" />
                        <p className="admin-stat-heading">Jobs</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.postCount}</p>
                        <i className="admin-stat-icon far fa-copy" />
                        <p className="admin-stat-heading">Posts</p>
                    </div>
                </div>

            </div>
            <div className="row">

                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.tutorCount}</p>
                        <i className="admin-stat-icon fas fa-user-graduate" />
                        <p className="admin-stat-heading">Tutors</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.expertCount}</p>
                        <i className="admin-stat-icon fas fa-certificate" />
                        <p className="admin-stat-heading">Exprts</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.jobsPrevWeekCount}</p>
                        <i className="admin-stat-icon far fa-file-alt" />
                        <p className="admin-stat-heading">Jobs in Last Week</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.postsPrevWeekCount}</p>
                        <i className="admin-stat-icon far fa-question-circle" />
                        <p className="admin-stat-heading">Posts in Last week</p>
                    </div>
                </div>

            </div>

            <br />


            {/* Actionable items */}
            <div className="row">

                {/* Pending Payouts */}
                {
                    stats.pendingPayoutsCount > 0 &&
                    <div className="col-md-12">
                        <div className="app-card action-item-card">
                            <div className="row">
                                <div className="col-md-10 action-item-wrapper">
                                    <p className="action-item-text">
                                        <i className="fas fa-info-circle"></i> There are {stats.pendingPayoutsCount} pending payouts
                                    </p>
                                </div>

                                <div className="col-md-2 action-btn-wrapper">
                                    <button className='btn action-btn' onClick={goToJobs}>Pay Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {/* Unresolved reports */}
                {
                    stats.unresolvedReportsCount > 0 &&
                    <div className="col-md-12">
                        <div className="app-card action-item-card">
                            <div className="row">
                                <div className="col-md-10 action-item-wrapper">
                                    <p className="action-item-text">
                                        <i className="fas fa-info-circle"></i> There are {stats.unresolvedReportsCount} reported items that need to be resolved.
                                    </p>
                                </div>

                                <div className="col-md-2 action-btn-wrapper">
                                    <button className='btn action-btn' onClick={goToReports}>Resolve Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>

        </div>
    )
}
