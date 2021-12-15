import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CONSTANTS from '../../constants/constants';
import { MESSAGE_OBSERVER } from '../../services/chatService';
import userService from '../../services/userservice';
import HelpComponent from '../HelpComponent/HelpComponent';
import Notifications from '../Notifications/Notifications';

function Header() {
    const history = useHistory();

    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showHelpDialog, setShowHelpDialog] = useState(false);

    const [hasNewMessage, setHasNewMessage] = useState(false);


    useEffect(() => {
        const subs = [];
        const s = MESSAGE_OBSERVER.subscribe(m => {
            if (m) {
                setHasNewMessage(true);
            }
        })
        subs.push(s);
        return () => {
            subs.forEach(s => {
                s.unsubscribe();
            })
        }
    }, []);

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

    const onHelpClick = () => {
        setShowHelpDialog(true);   
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
                    <div className="header-icon-wrapper" onClick={onHelpClick}>
                        <i className='header-icon far fa-question-circle'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onSearchClick}>
                        <i className='header-icon pi pi-search'></i>
                    </div>
                    <div className="header-icon-wrapper" onClick={onNotificationClick}>
                        <i className='header-icon fas fa-bell'></i>
                    </div>
                    <div className={"header-icon-wrapper"} onClick={onMessageClick}>
                        {
                            hasNewMessage && <div className='new-messages'>

                            </div>
                        }
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

            <Dialog header='Contact for help' visible={showHelpDialog} className="help-dialog custom-scrollbar" onHide={() => { setShowHelpDialog(false) }}>
                <HelpComponent closeDialog={() => { setShowHelpDialog(false) }} />
            </Dialog>
        </div>
    );
}

export default Header;
