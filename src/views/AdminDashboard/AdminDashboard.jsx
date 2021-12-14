import React, { useEffect, useState } from 'react'
import URLS from '../../constants/api-urls'
import httpService from '../../services/httpservice'

export default function AdminDashboard() {

    const [stats, setStats] = useState({});

    useEffect(() => {
        getAdminStats();
    }, []);

    const getAdminStats = () => {

        const stats = {
            jobsCount: 12,
            postCount: 20,
            tranCount: 1,
            userCount: 26
        }
        setStats(stats);
        // httpService.getRequest(URLS.USER_GET_ADMIN_STATS).subscribe(stats => {
        //     setStats(stats);
        // })
    }

    return (
        <div className='admin-dashboard'>

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
                        <i className="admin-stat-icon fas fa-laptop" />
                        <p className="admin-stat-heading">Jobs</p>
                    </div>
                </div>
                <div className="col-md-3 admin-stat-wrapper">
                    <div className="app-card admin-stat-card">
                        <p className="admin-stat-number">{stats.postCount}</p>
                        <i className="admin-stat-icon fas fa-user" />
                        <p className="admin-stat-heading">Posts</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
