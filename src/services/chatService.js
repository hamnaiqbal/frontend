import { BehaviorSubject } from 'rxjs';
import openSocket from 'socket.io-client';
import CONSTANTS from '../constants/constants';
import userService from './userservice';

const socket = openSocket(CONSTANTS.API_PATH);

export const MESSAGE_OBSERVER = new BehaviorSubject();

const chatService = {
    sendMessage(data) {
        const messageData = {
            receiver: data.sentTo,
            sender: userService.getCurrentUserId(),
            text: data.text
        }
        socket.emit('message-server', messageData);

    },

    subscribeToMessages() {
        console.log('Listening on ' + userService.getCurrentUserId())
        socket.on(userService.getCurrentUserId(), (data) => {
            MESSAGE_OBSERVER.next(data);
            console.log(data);
        });
    }
}


export default chatService;