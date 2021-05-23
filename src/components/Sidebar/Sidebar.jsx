import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';

function Sidebar() {
    const [user, setUser] = useState({});
    const history = useHistory();

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
            label: 'Your Posts',
            icon: 'pi pi-comment',
            link: '/home/profile',
        },
        {
            label: 'Your Jobs',
            icon: 'pi pi-list',
            link: '/home/profile',
        },
        {
            label: 'Your Payments',
            icon: 'pi pi-dollar',
            link: '/home/profile',
        },
        {
            label: 'Your Profile',
            icon: 'pi pi-user',
            link: '/home/profile',
        },
    ];

    const sidebarLinks = () => {
        return links.map((link, index) => {
            return (
                <div
                    className="sidebar-link-wrapper"
                    key={index}
                    onClick={() => {
                        onLinkClick(link.link);
                    }}
                >
                    <div className="sidebar-link">
                        <i className={`link-icon ${link.icon}`}></i>
                        <p className="sidebar-link-label">{link.label}</p>
                    </div>
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
            <div className="sidebar-user-section">
                <div className="user-info">
                    <div className="user-image-wrapper">
                        <img className="user-image" src={user.imageLink} alt="" />
                    </div>
                    <div className="user-text-wrapper">
                        <p className="user-name center">{user.name}</p>
                        <p className="user-degree center">{user.degree}</p>
                    </div>
                </div>
            </div>
            <hr />
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
            <div className="sidebar-bottom-section">{middleSection()}</div>
        </div>
    );
}

export default Sidebar;
