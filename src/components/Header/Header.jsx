import { Menubar } from 'primereact/menubar';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import { reduxService } from '../../redux/actions';
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
    const store = useSelector((state) => {
        return state;
    });

    const logout = () => {
        userService.logout();
        history.push('/login');
    };

    const [currentMenuItems, setCurrentMenuItems] = useState([]);

    useEffect(() => {
        const isLoggedIn = store.isLoggedIn;
        const isAdmin = store.isAdmin;
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
    }, [store]);

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
