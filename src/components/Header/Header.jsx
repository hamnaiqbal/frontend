import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';
import { useEffect } from 'react';
import { useState } from 'react';

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

    const isLoggedIn = userService.isLoggedIn();

    useEffect(() => {
        let menuItems = userService.isLoggedIn()
            ? userService.isCurrentUserAdmin()
                ? adminItems
                : studentItems
            : unAuthItems;

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

    return (
        <div className="header">
            <div className={CONSTANTS.MAIN_WIDTH_CLASS}>
                <div className="header-wrapper">
                    <div className="header-logo">
                        <img className="logo" src="/logo.png" alt="SEA" />
                    </div>

                    <div className="header-menu">
                        <Menubar model={currentMenuItems} />;
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
