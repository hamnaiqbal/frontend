import React from 'react';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';

const unAuthItems = [
    { label: 'Login', icon: 'pi pi-fw pi-plus', url: '/login' },
    { label: 'Signup', icon: 'pi pi-fw pi-trash', url: '/signup', className: 'signup' },
];

const adminItems = [
    { label: 'Home', icon: 'pi pi-fw pi-eye', url: '/home/' },
    { label: 'View Users', icon: 'pi pi-fw pi-eye', url: '/home/viewUsers' },
    { label: 'Scholarships', icon: 'pi pi-fw pi-eye', url: '/home/scholarships' },
];

const studentItems = [
    { label: 'Home', icon: 'pi pi-fw pi-eye', url: '/home/' },
    { label: 'View Users', icon: 'pi pi-fw pi-eye', url: '/home/viewUsers' },
    { label: 'Scholarships', icon: 'pi pi-fw pi-eye', url: '/home/scholarships' },
];

const menu = () => {
    const menuItems = userService.isLoggedIn()
        ? userService.isCurrentUserAdmin()
            ? adminItems
            : studentItems
        : unAuthItems;
    return menuItems.map((mi) => {
        return (
            <Link to={mi.url} key={mi.url} className={'menu-item ' + (mi.className || '')}>
                <i className={mi.icon}></i> {mi.label}
            </Link>
        );
    });
};

function Header() {
    return (
        <div className="header">
            <div className={CONSTANTS.MAIN_WIDTH_CLASS}>
                <div className="header-wrapper">
                    <div className="header-logo">
                        <img className="logo" src="/logo.png" alt="SEA" />
                    </div>

                    <div className="header-menu">{menu()}</div>
                </div>
            </div>
        </div>
    );
}

export default Header;
