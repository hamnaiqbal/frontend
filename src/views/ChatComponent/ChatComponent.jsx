import { useEffect, useRef, useState } from "react";
import CONSTANTS from "../../constants/constants";
import chatService, { MESSAGE_OBSERVER } from "../../services/chatService";
import miscService from "../../services/miscService";
import userService from "../../services/userservice";

const ChatComponent = () => {

    const [recentChats, setRecentChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    const [alreadyObserved, setAlreadyObserved] = useState(false);

    const messagesEndRef = useRef(null)



    useEffect(() => {
        // Fetch Recent Chats from DB
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
                            isOwn: msg.sender === userService.getCurrentUserId(),
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


        fetchRecentChats();
        observeMessages();


    }, [])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    const addMessageToWindow = (msg) => {
        setChatMessages((cm) => [...cm, msg])
        scrollToBottom();
    }

    const fetchRecentChats = () => {
        // TODO: Implement It
    }

    const fetchChatMessages = (chat) => {
        // TODO: Implement It
        setSelectedChat(chat);
        const chatMessages = [
            { isOwn: true, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: false, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: false, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: false, text: 'VERY VERY VERY VERY VEYR VERY YEYRYEYREY LONG Message' },
            { isOwn: true, text: 'VERY VERY VERY VERY VEYR VERY YEYRYEYREY LONG Message' },
            { isOwn: false, text: 'VERY VERY VERY VERY VEYR VERY YEYRYEYREY LONG Message' },
            { isOwn: true, text: 'Message' },
            { isOwn: false, text: 'Message' }
        ]

        scrollToBottom();

        setChatMessages(chatMessages);
    }

    const sendNewMessage = () => {
        if (message === '') {
            return;
        }
        const newMsg = {
            isOwn: true,
            text: message
        };
        addMessageToWindow(newMsg);
        setMessage('');
        chatService.sendMessage({ sentTo: selectedChat._id, text: message });
    }

    const renderRecentChats = () => {
        let recentChats = [
            { _id: '60b6b2bac88983254c8c6292', username: 'Hamna', image: CONSTANTS.DEFAULT_USER_IMAGE, textedLast: '15m' },
            { _id: '60b3d2c647168609a4907e24', username: 'Kashif', image: CONSTANTS.DEFAULT_USER_IMAGE, textedLast: '20m', hasUnred: true },
            { _id: '611183ad66519d24745f8d0c', username: 'Hamna 2', image: CONSTANTS.DEFAULT_USER_IMAGE, textedLast: '20m', hasUnred: true },
        ];

        return recentChats.map((rc, i) => {
            return <div className={"recent-chat-item row " + (rc.hasUnred ? 'unread' : '')} key={i} onClick={() => fetchChatMessages(rc)}>
                <div className="col-sm-3">
                    <img className="rec-chat-image" src={rc.image} alt={rc.username} />
                </div>
                <div className="col-sm-6">
                    <h6>{rc.username}</h6>
                </div>
                <div className="col-sm-1">
                    <small className="last-message">
                        {rc.textedLast}
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

        return chatMessages.map((cm, i) => {
            return <div key={i}>
                <p className={"single-message " + (cm.isOwn ? "own" : "other")}>
                    {cm.text} 
                </p>
                {(i === chatMessages.length - 1) && <div className="scrollchat" ref={messagesEndRef} />}
            </div>

        })
    }

    const chatWindow = () => {
        return <div className="chat-window">

            <div className="chat-window-header">
                <div className="chat-user-info">
                    <img src={selectedChat.image} alt={selectedChat.username} />
                    <h5 className="userinfo">{selectedChat.username}</h5>
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


                <div className="col-md-6">
                    {/* Main Chat Window - Where the User will Chat */}
                    {chatWindow()}
                </div>

            </div>


        </div>
    )


}


export default ChatComponent;