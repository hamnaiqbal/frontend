import { useEffect, useRef, useState } from "react";
import URLS from "../../constants/api-urls";
import CONSTANTS from "../../constants/constants";
import chatService, { MESSAGE_OBSERVER } from "../../services/chatService";
import httpService from "../../services/httpservice";
import miscService from "../../services/miscService";
import userService from "../../services/userservice";

const ChatComponent = () => {

    const [recentChats, setRecentChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    const [alreadyObserved, setAlreadyObserved] = useState(false);

    const [fetchedMessagesData, setFetchedMessagesData] = useState([]);

    const messagesEndRef = useRef(null)



    useEffect(() => {
        // Fetch Recent Chats from DB

        fetchMessages();
        observeMessages();

    }, [])


    const observeMessages = () => {
        if (!alreadyObserved) {

            setAlreadyObserved(true);

            MESSAGE_OBSERVER.subscribe(msg => {
                let tempSC = null;
                setSelectedChat(sc => {
                    tempSC = sc;
                    return sc
                })
                if (!msg) {
                    return
                }
                // Sending Message to Self. Do Nothing
                if (msg.sender === msg.receiver) {
                    return;
                }

                if (msg.sender === tempSC?._id) {
                    // IF SAME CHAT IS OPEN
                    const newMsg = {
                        isUserSender: msg.sender === userService.getCurrentUserId(),
                        text: msg.text
                    };
                    addMessageToWindow(newMsg);
                } else {
                    // IF SOME OTHER CHAT IS OPEN
                    const newChatIndex = recentChats.findIndex(rc => rc._id === msg.sentFrom);

                    if (newChatIndex >= 0) {
                        // CASE IF THE SENDER HAD ALREADY CONTACTED THE USER
                        const newRecentChats = [...recentChats];
                        const updatedChat = newRecentChats[newChatIndex];
                        updatedChat.hasUnred = true;
                        newRecentChats[newChatIndex] = updatedChat;
                        setRecentChats(newRecentChats);
                    } else {
                        miscService.handleSuccess('Please Refresh Your Chats. You have a message from a new User');
                    }
                }
            })
        }
    }

    const addMessageToWindow = (msg) => {
        setChatMessages((cm) => [...cm, msg])
    }

    const fetchMessages = () => {
        const data = { userId: userService.getCurrentUserId() };

        httpService.getRequest(URLS.GET_USER_MESSAGES, data).subscribe(msgData => {
            const recChats = msgData.map(m => {
                m.user.textedLast = miscService.getTimeDifference(null, m.lastMessaged, true);
                return m.user
                
            });
            setRecentChats(recChats);
            setFetchedMessagesData(msgData);
        })
    }

    const showSelectedChatMessages = (chat) => {
        setSelectedChat(chat);
        const chMessages = fetchedMessagesData.find(m => m.user._id === chat._id);

        if (chMessages) {
            const msgs = chMessages.messages;
            setChatMessages(msgs);
        }
    }

    const sendNewMessage = () => {
        if (message === '') {
            return;
        }
        const newMsg = {
            text: message,
            isUserSender: true,
        };
        addMessageToWindow(newMsg);
        setMessage('');
        chatService.sendMessage({ sentTo: selectedChat._id, text: message });
    }

    const renderRecentChats = () => {

        return recentChats.map((rc, i) => {
            return <div className={"recent-chat-item row " + (rc.hasUnred ? 'unread' : '')} key={i} onClick={() => showSelectedChatMessages(rc)}>
                <div className="col-sm-3">
                    <img className="rec-chat-image" src={rc.imageLink ?? CONSTANTS.DEFAULT_USER_IMAGE} alt={rc.name} />
                </div>
                <div className="col-sm-6">
                    <h6>{rc.name}</h6>
                </div>
                <div className="col-sm-1">
                    <small className="last-message">
                        {rc.textedLast ?? '5m'}
                    </small>
                </div>
                {
                    i !== recentChats.length - 1
                    && <hr className="rec-chat-hr" />
                }
            </div>
        })
    }

    const renderChatMessages = () => {

        return chatMessages.map((m, i) => {
            return <div key={i}>
                <p className={"single-message " + (m.isUserSender ? "own" : "other")}>
                    {m?.text}
                </p>
                {(i === chatMessages.length - 1) && <div className="scrollchat" ref={messagesEndRef} />}
            </div>

        })
    }

    const ChatWindow = () => {
        return <div className="chat-window">

            <div className="chat-window-header">
                <div className="chat-user-info">
                    <img src={selectedChat.imageLink ?? CONSTANTS.DEFAULT_USER_IMAGE} alt={selectedChat.name} />
                    <h5 className="userinfo">{selectedChat.name}</h5>
                </div>

                <div className="chat-header-actions">
                    <i className="pi pi-ban block-icon"></i>
                </div>
            </div>


            <div className="chat-messages-window">
                <div className="messages-wrapper">
                    {renderChatMessages()}
                </div>
            </div>


            <div className="chat-send-message-window">
                <input placeholder="Type your message here" type="text" value={message} className="form-control" onChange={(e) => setMessage(e.target.value)} />

                <button className="send-msg-button" onClick={sendNewMessage}>
                    <i className="pi pi-send"></i>
                </button>

            </div>

        </div>
    }


    return (
        <div className="chat-component">
            <div className="row">

                <div className="col-md-3 chat-sidebar-wrapper">
                    {/* Chat Sidebar - To Show the Recent Chats of the User */}
                    <div className="chat-sidebar">
                        {renderRecentChats()}
                    </div>
                </div>

                {
                    selectedChat.name &&
                    <div className="col-md-6">
                        {ChatWindow()}
                    </div>
                }

            </div>


        </div>
    )


}


export default ChatComponent;