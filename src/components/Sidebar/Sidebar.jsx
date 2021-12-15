import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService, { onUserChange } from '../../services/userservice';

function Sidebar() {
    const [user, setUser] = useState({});
    const history = useHistory();

    const isUserAdmin = userService.isCurrentUserAdmin();
    const isUserTutor = userService.getLoggedInUser()?.listedAsTutor;

    // const userLocalStorage = localStorage.getItem('user');

    useEffect(() => {
        fetchUser();
        onUserChange().subscribe(() => {
            fetchUser();
        })
    }, []);

    const fetchUser = () => {
        const user = userService.getLoggedInUser() || {};
        if (user) {
            user.imageLink = user.imageLink || CONSTANTS.DEFAULT_USER_IMAGE;
            user.userType = userService.isCurrentUserAdmin() ? 'Admin' : user.listedAsTutor ? 'Tutor' : 'Student';
        }
        setUser(user);
    };

    const links = [
        {
            label: 'Overview',
            isTitle: true,
            showTo: ['A']
        },
        {
            label: 'Admin Dashboard',
            icon: 'fas fa-chart-bar',
            link: '/home/admin-dashboard',
            showTo: ['A']
        },
        {
            label: 'View all Jobs Status',
            icon: 'fas fa-briefcase',
            link: '/home/admin-jobs',
            showTo: ['A']
        },
        {
            label: 'Reports',
            isTitle: true,
            showTo: ['A']
        },
        {
            label: 'Reported Items',
            icon: 'fas fa-flag',
            link: '/home/reportedItems',
            showTo: ['A']
        },
        {
            label: 'Users',
            isTitle: true,
            showTo: ['A']
        },
        {
            label: 'Manage Users',
            icon: 'pi pi-users',
            link: '/home/viewUsers',
            showTo: ['A']
        },
        {
            label: 'Feed',
            isTitle: true,
        },
        {
            label: 'View Feed',
            icon: 'fas fa-copy',
            link: '/home',
        },
        {
            label: 'Search Posts',
            icon: 'pi pi-search',
            link: '/home/posts/searchPosts',
        },
        {
            label: 'View My Posts',
            icon: 'pi pi-list',
            link: '/home/myPosts',
            showTo: ['T', 'S']
        },
        {
            label: 'Tutor',
            isTitle: true,
            showTo: ['T', 'S']
        },
        {
            label: 'Dashboard',
            icon: 'fas fa-file-invoice-dollar',
            link: '/home/quotes/tutor',
            showTo: ['T', 'S']
        },
        {
            label: 'Nearby Tutors',
            icon: 'pi pi-map',
            link: '/home/nearbyTutos',
            showTo: ['T', 'S']
        },
        {
            label: 'Become a Tutor',
            icon: 'pi pi-user',
            link: '/home/profile',
            showTo: ['S']
        },
        {
            label: 'Jobs',
            isTitle: true,
            showTo: ['T', 'S']
        },

        {
            label: 'Jobs Dashboard',
            icon: 'pi pi-briefcase',
            link: '/home/jobs/myJobs',
            showTo: ['T', 'S']
        },
        {
            label: 'View Jobs Feed',
            icon: 'pi pi-list',
            link: '/home/jobs',
            showTo: ['T', 'S']
        },
        {
            label: 'Quiz',
            isTitle: true,
            showTo: ['T', 'S']
        },
        {
            label: 'Attempt Practice Quiz',
            icon: 'pi pi-th-large',
            link: '/home/attempt-quiz',
            showTo: ['T', 'S']
        },
        {
            label: 'Take Skill Quiz',
            icon: 'pi pi-th-large',
            link: '/home/skill-quiz',
            showTo: ['T', 'S']
        },
        {
            label: 'Scholarships',
            isTitle: true,
            showTo: ['T', 'S']
        },
        {
            label: 'View Scholarships',
            icon: 'pi pi-money-bill',
            link: '/home/scholarships',
            showTo: ['T', 'S']
        },
        {
            label: 'Profile',
            isTitle: true,
        },
        {
            label: 'Manage Your Profile',
            icon: 'pi pi-user-edit',
            link: '/home/profile',
        },
    ];

    const sidebarLinks = () => {
        return links.map((link, index) => {
            return (
                (
                    // we do not mention who it is for
                    (!link.showTo) ||

                    // we mentioned that it is for admin and the logged in user is admin
                    (link.showTo && isUserAdmin && link.showTo.includes('A')) ||

                    // we mentioned that it is for not for admin and it is either for tutor or student
                    (link.showTo && !isUserAdmin &&
                        (
                            (link.showTo.includes('T') && isUserTutor) ||
                            (link.showTo.includes('S') && !isUserTutor)
                        )
                    )
                ) &&

                <div
                    className="sidebar-link-wrapper"
                    key={index}
                    onClick={() => {
                        onLinkClick(link.link);
                    }}
                >
                    {link.isTitle && <hr></hr>}

                    {
                        !link.isTitle && <div className="sidebar-link">
                            <i className={`link-icon ${link.icon}`}></i>
                            <p className="sidebar-link-label">{link.label}</p>
                        </div>
                    }

                    {
                        link.isTitle &&
                        <p className="sidebar-link-title">
                            {link.label}
                        </p>
                    }

                </div>
            );
        });
    };

    const onLinkClick = (link) => {
        history.push(link);
    };

    return (
        <div className="sidebar">

            <div className="d-flex sidebar-logo-section">
                <img className="app-logo" src="/logo.png" alt="SEA" />
            </div>

            <div className="sidebar-user-section">
                <div className="user-info">
                    <div className="user-image-wrapper">
                        <img className="user-image" src={user.imageLink} alt="" />
                    </div>
                    <div className="user-text-wrapper">
                        <p className="user-name">{user.name}</p>
                        <p className="user-degree">{user.degree} - {user.userType}</p>
                    </div>
                </div>
            </div>
            {sidebarLinks()}
        </div>
    );
}

export default Sidebar;
