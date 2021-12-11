import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
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

    const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
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

    const startChatWithNewUser = (user) => {

        setShowNewMessageDialog(false);

        const rcObj = { ...user };
        rcObj.textedLast = '';
        rcObj.hasUnred = false;

        showSelectedChatMessages(rcObj);

        const index = recentChats.findIndex(rc => rc._id === rcObj._id);
        if (index < 0) {
            recentChats.unshift(rcObj);
        }
    }

    const AddNewChat = ({ onUserSelect }) => {

        const [newChatUsername, setNewChatUsername] = useState('');
        const [searchedUsers, setSearchedUsers] = useState([]);


        const searchUsers = () => {
            if (!newChatUsername || newChatUsername === '') {
                return miscService.handleError('Please enter some text');
            }

            httpService.getRequest(URLS.SEARCH_USERS_BY_NAMES, { searchText: newChatUsername }).subscribe(users => {
                setSearchedUsers(users);
            })

        }


        const SingleUserRow = ({ user: u }) => {
            return <div className="single-user">
                <div className="row">
                    <div className="col-md-2">
                        <img src={u.imageLink ?? CONSTANTS.DEFAULT_USER_IMAGE} alt={u.name} />
                    </div>

                    <div className="col-md-7 name-wrapper">
                        {u.name} - ({u.username})
                    </div>

                    <div className="col-md-3 btn-wrapper">
                        <button className="btn start-chat-btn" onClick={() => { onUserSelect(u) }}>
                            <i className="far fa-comments"></i> Start Chat
                        </button>
                    </div>
                </div>
            </div>
        }

        return (
            <div className="add-new-chat">
                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group p-float-label">
                            <InputText
                                value={newChatUsername}
                                required
                                className="form-cotntrol single-control"
                                id="resourceRefLink"
                                onChange={(e) => {
                                    setNewChatUsername(e.target.value);
                                }}
                            />
                            <label htmlFor="resourceRefLink">Enter User Name Here</label>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <button style={{ padding: '8px' }} className="btn btn-primary fw" onClick={searchUsers}>Search Users</button>
                    </div>
                </div>

                <div className="found-users row">
                    {
                        searchedUsers.map((u, i) => {
                            return <SingleUserRow key={i} user={u} />
                        })
                    }
                </div>
            </div>
        )
    }


    return (
        <div className="chat-component">

            <Dialog header='Start new chat' className="new-chat-dialog custom-scrollbar" visible={showNewMessageDialog} onHide={() => { setShowNewMessageDialog(false) }}>
                <AddNewChat onUserSelect={startChatWithNewUser} />
            </Dialog>

            <div className="row">

                <div className="col-md-3 chat-sidebar-wrapper">
                    {/* Chat Sidebar - To Show the Recent Chats of the User */}
                    <div className="chat-sidebar">

                        <div className="add-new-chat">
                            <button className="btn btn-primary fw new-msg-btn" onClick={() => { setShowNewMessageDialog(true) }}>
                                <i className="pi pi-comments"></i>  Add new Chat
                            </button>
                        </div>

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