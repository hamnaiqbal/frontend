import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import userService from '../../services/userservice';
import Notifications from '../Notifications/Notifications';

function Header() {
    const history = useHistory();

    const [showNotificationsModal, setShowNotificationsModal] = useState(false);

    const logout = () => {
        userService.logout();
        history.push('/login');
    };

    const onMessageClick = () => {
        history.push('/home/messages');
    }

    const onNotificationClick = () => {
        setShowNotificationsModal(true);
    }

    const onProfileClick = () => {
        history.push('/home/profile');
    }

    const onSearchClick = () => {
        history.push('/home/posts/searchPosts');
    }

    return (
        <div className="header">
            <div className={CONSTANTS.MAIN_WIDTH_CLASS}>
                <div className="header-wrapper">
                    <div className="header-icon-wrapper" onClick={onSearchClick}>
                        <i className='header-icon pi pi-search'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onNotificationClick}>
                        <i className='header-icon fas fa-bell'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onMessageClick}>
                        <i className='header-icon pi pi-comments'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onProfileClick}>
                        <i className='header-icon pi pi-user'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={logout}>
                        <i className='header-icon pi pi-sign-out'></i>
                    </div>
                </div>
            </div>

            <Dialog header='Notifications' visible={showNotificationsModal} className="notifications-dialog custom-scrollbar" onHide={() => { setShowNotificationsModal(false) }}>
                <Notifications closeDialog={() => { setShowNotificationsModal(false) }} />
            </Dialog>
        </div>
    );
}

export default Header;
