import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function Notifications({ closeDialog }) {

    const [notifications, setNotifications] = useState([]);
    const [fetched, setFetched] = useState(false)

    const history = useHistory();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const SingleNotification = ({ notification: n }) => {


        const onNotificationClick = () => {
            if (n.link) {
                history.push(`/home${n.link}`);
                if (closeDialog) {
                    closeDialog();
                }
            }
        }

        return (
            <div className="single-notification" onClick={onNotificationClick}>
                <div className="row">
                    <div className="col-md-2 notification-icon-wrapper">
                        <i className={"notification-icon " + n.icon} />
                    </div>

                    <div className="col-md-7 notifcation-text-wrapper">
                        <div className="">
                            <small className="notification-date">
                                {n.formattedDate}
                            </small>
                            <p className="notification-text">
                                {n.text}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-3 time-difference-wrapper">
                        {n.timeDifference}
                    </div>
                </div>
            </div>
        )
    }

    const fetchNotifications = () => {
        httpService.getRequest(URLS.GET_NOTIFICATIONS, { userId: userService.getCurrentUserId() }).subscribe((n) => {

            // let n = [
            //     { type: 'J', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'R', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'J', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'B', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'J', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'Q', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'R', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'B', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'J', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'Q', text: 'Your Job was Updated', addedOn: new Date() },
            //     { type: 'J', text: 'Your Job was Updated', addedOn: new Date() },
            // ]
            setFetched(true);

            n.forEach(nf => {
                nf.icon =
                    nf.type === 'J' ? 'fas fa-briefcase' :
                        nf.type === 'B' ? 'fas fa-coins' :
                            nf.type === 'Q' ? 'fas fa-file-invoice-dollar' :
                                nf.type === 'R' ? 'fas fa-comment-alt' :
                                    nf.type === 'P' ? 'fas fa-clone' : 'fas fa-bell';
                nf.formattedDate = miscService.getFormattedDate(nf.addedOn)
                nf.timeDifference = miscService.getTimeDifference(nf.addedOn);
            });

            n.sort((a, b) => (new Date(b.addedOn)).getTime() - (new Date(a.addedOn)).getTime());
            setNotifications(n);

        })

    }

    return (
        <div className='notifications-component'>
            {
                notifications.length > 0 &&
                notifications.map((n, i) => {
                    return <SingleNotification key={i} notification={n} />
                })
            }
            {fetched &&
                notifications.length === 0 &&
                <div>
                    <p className="no-notifications-text">
                        No Notifications were found
                    </p>
                </div>
            }
        </div>
    )
}
