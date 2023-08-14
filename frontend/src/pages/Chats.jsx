import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import CreateGroupModal from "../components/CreateGroupModal";

const Chats = () => {
    const { user, chats } = ChatState();
    const [chatResults, setChatResults] = useState([]);

    const { selectedChat, setSelectedChat } = useOutletContext();

    const navigate = useNavigate();
    const newChatModal = useRef();

    useEffect(() => {
        setChatResults(chats);
    }, [chats]);
    

    const searchChats = (search) => {
        const re = new RegExp(search, 'i');

        const filteredChats = chats.filter(c => {
            if (c.isGroupChat) {
                return c.chatName.match(re);
            } else {
                if (c.users[0] !== user.data?.username) {
                    return c.users[1].username.match(re);
                } else {
                    return c.users[0].username.match(re);
                }
            }
        });

        setChatResults(filteredChats);
    }

    return (
        <>
        <div className='search d-flex justify-content-between align-items-center px-2 py-2 gap-1' style={{height: '60px'}}>
            <div className='position-relative w-100'>
                <label htmlFor="search" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                    <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                </label>
                <input type="search" id='search' className='input-theme ps-5 rounded-pill' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} onChange={(e) => searchChats(e.target.value)} />
            </div>
            <button className='cool-btn' data-bs-toggle="modal" data-bs-target="#newChatModal">
                <i className="fa-solid fa-plus unselectable" style={{fontSize: '15px'}}></i>
            </button>
        </div>

        { chatResults.map(chat => (
        <div key={chat._id} className={`chat-wrapper ${selectedChat?._id===chat._id ? 'active' : ''}`}>
            <div className="cool-active"></div>
            <div className="chat" onClick={() => setSelectedChat(chat)}>
                <img src={chat.isGroupChat ? '/default-group.jpg' : '/default-avatar.png'} className="rounded-circle" alt="" />
                <div className="d-flex align-items-center">
                    <div>
                        <p>{(chat.isGroupChat) ?
                        (chat.chatName) : (chat.users[0].username===user.data?.username) ?
                        (chat.users[1].username) :
                        (chat.users[0].username)}</p>
                        <p style={{fontSize: '13px'}}>{chat.latestMessage?.text}</p>
                    </div>
                </div>
            </div>
        </div>
        ))
        }

        {/* Modal New Chat */}
        <div className="modal fade" id="newChatModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={newChatModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">New Chat</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <button className="btn btn-outline-light w-100 border p-3 rounded-pill mb-3" data-bs-toggle="modal" data-bs-target="#createGroupModal">Create Group</button>
                        <button className="btn btn-outline-light w-100 border p-3 rounded-pill" onClick={()=>{
                            window.bootstrap.Modal.getInstance(newChatModal.current).hide();
                            navigate('/friends')
                        }}>Chat with a friend</button>
                    </div>
                </div>
            </div>
        </div>

        <CreateGroupModal chats={chatResults} setChats={setChatResults} />
        </>
    )
}

export default Chats;