import { Menubar } from 'primereact/menubar';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';

const unAuthItems = [
    { label: 'Login', icon: 'pi pi-fw pi-plus', link: '/login' },
    { label: 'Signup', icon: 'pi pi-fw pi-trash', link: '/signup', className: 'signup' },
];

const adminItems = [
    { label: 'Home', icon: 'pi pi-fw pi-eye', link: '/home/' },
    { label: 'View Users', icon: 'pi pi-fw pi-eye', link: '/home/viewUsers' },
    { label: 'Scholarships', icon: 'pi pi-fw pi-eye', link: '/home/scholarships' },
    { label: 'Logout', icon: 'pi pi-fw pi-eye' },
];

const studentItems = [
    { label: 'Home', icon: 'pi pi-fw pi-eye', link: '/home/' },
    { label: 'View Users', icon: 'pi pi-fw pi-eye', link: '/home/viewUsers' },
    { label: 'Scholarships', icon: 'pi pi-fw pi-eye', link: '/home/scholarships' },
    { label: 'Logout', icon: 'pi pi-fw pi-eye' },
];

function Header() {
    const history = useHistory();

    const logout = () => {
        userService.logout();
        history.push('/login');
    };

    const [currentMenuItems, setCurrentMenuItems] = useState([]);

    useEffect(() => {
        const isLoggedIn = userService.isLoggedIn();
        const isAdmin = userService.isCurrentUserAdmin();
        let menuItems = isLoggedIn ? (isAdmin ? adminItems : studentItems) : unAuthItems;

        menuItems = menuItems.map((menu) => {
            return {
                ...menu,
                command: () => {
                    if (menu.link) {
                        history.push(menu.link);
                    } else if (menu.label === 'Logout') {
                        logout();
                    }
                },
            };
        });

        setCurrentMenuItems(menuItems);
    }, []);

    const onMessageClick = () => {
        history.push('/home/messages');
    }

    return (
        <div className="header">
            <div className={CONSTANTS.MAIN_WIDTH_CLASS}>
                <div className="header-wrapper">
                    <div className="header-icon-wrapper">
                        <i className='header-icon pi pi-search'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onMessageClick}>
                        <i className='header-icon pi pi-comments'></i>
                    </div>
                    <div className="header-icon-wrapper">
                        <i className='header-icon pi pi-user'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={logout}>
                        <i className='header-icon pi pi-sign-out'></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
