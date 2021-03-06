import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';

function Sidebar() {
    const [user, setUser] = useState({});
    const history = useHistory();

    const isUserAdmin = userService.isCurrentUserAdmin();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        const user = userService.getLoggedInUser() || {};
        if (user) {
            user.imageLink = user.imageLink || CONSTANTS.DEFAULT_USER_IMAGE;
        }
        setUser(user);
    };

    const links = [
        {
            label: 'Feed',
            isTitle: true
        },
        {
            label: 'View Feed',
            icon: 'pi pi-send',
            link: '/home',
        },
        {
            label: 'Search Posts',
            icon: 'pi pi-search',
            link: '/home/profile',
        },
        {
            label: 'View My Posts',
            icon: 'pi pi-list',
            link: '/home/profile',
            separatorBelow: true
        },
        {
            label: 'Tutor',
            isTitle: true
        },
        {
            label: 'Tutor Dashboard',
            icon: 'pi pi-home',
            link: '/home/profile',
        },
        {
            label: 'Nearby Tutors',
            icon: 'pi pi-map',
            link: '/home/profile',
        },
        {
            label: 'Become a Tutor',
            icon: 'pi pi-user',
            link: '/home/becomeTutor',
        },
        {
            label: 'Jobs',
            isTitle: true
        },

        {
            label: 'Jobs Dashboard',
            icon: 'pi pi-home',
            link: '/home/profile',
        },
        {
            label: 'View Jobs Feed',
            icon: 'pi pi-list',
            link: '/home/profile',
        },
        {
            label: 'Search Jobs',
            icon: 'pi pi-search',
            link: '/home/profile',
        },
        {
            label: 'Post a New Job',
            icon: 'pi pi-plus-circle',
            link: '/home/profile',
        },
        {
            label: 'Quiz',
            isTitle: true,
        },
        {
            label: 'Attempt Practice Quiz',
            icon: 'pi pi-th-large',
            link: '/home/attempt-quiz',
        },
        {
            label: 'Scholarships',
            isTitle: true,
        },
        {
            label: 'View Scholarships',
            icon: 'pi pi-money-bill',
            link: '/home/scholarships',
        },
        {
            label: 'Users',
            isTitle: true,
            adminOnly: true
        },
        {
            label: 'Manage Users',
            icon: 'pi pi-users',
            link: '/home/viewUsers',
            adminOnly: true
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
                ((link.adminOnly && isUserAdmin) || !link.adminOnly) && <div
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

    const middleSection = () => {
        if (!user.listedAsTutor && !user.appliedAsTutor) {
            return (
                <div>
                    <hr />

                    <div className="bottom-card">
                        <p className="become-tutor-heading center">Become a Tutor</p>
                        <p className="become-tutor-desc center">
                            The new modifier instructs the compiler to use the new implementation instead of the base class
                            function.
                        </p>

                        <div className="tutor-button-wrapper">
                            <button className="become-tutor-button primary-color">Become a Tutor</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="bottom-card">
                    {/* <p className="become-tutor-heading center">Become a Tutor</p>
                    <p className="become-tutor-desc center">
                        The new modifier instructs the compiler to use the new implementation instead of the base class
                        function.
                    </p>

                    <div className="tutor-button-wrapper">
                        <button className="become-tutor-button primary-color">Become a Tutor</button>
                    </div> */}
                </div>
            );
        }
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
                        <p className="user-degree">{user.degree}</p>
                    </div>
                </div>
            </div>
            {/* <div className="sidebar-filters-section">
                <div className="filters-wrapper">
                    <div className="single-filter question-filter">
                        <div className="question-filter-color filter-circle"></div>
                        <p className="filter-by-question">Show Only Questions</p>
                    </div>
                    <div className="single-filter resource-filter">
                        <div className="resource-filter-color filter-circle"></div>
                        <p className="filter-by-resources">Show Only Resources</p>
                    </div>
                </div>
            </div> */}
            {sidebarLinks()}
            {/* <div className="sidebar-bottom-section">{middleSection()}</div> */}
        </div>
    );
}

export default Sidebar;
