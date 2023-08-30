import axios from 'axios';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

const FriendProfileModal = ({ friend }) => {
    const myModal = useRef();
    const { friends, setFriends, chats, setChats, selectedChat, setSelectedChat } = ChatState();
    const navigate = useNavigate();

    // Start chat with friend
    const startPrivateChat = async (id) => {
        await axios.post('/api/chats', {userId: id})
            .then(res => {
                window.bootstrap.Modal.getInstance(myModal.current).hide();

                setSelectedChat(res.data.data);
                if(!chats.find(c => c._id===res.data.data._id)){
                    setChats([res.data.data, ...chats]);
                };
                navigate('/');
            })
            .catch(err => console.error(err.response));
    }

    // Add or Remove from friendlist
    const handleEditFriends = async (userId) => {
        await axios.put('/api/users/friends/edit', {userId})
            .then(res => {
                // Add friend
                if (!friends.find(f => f._id === userId)) {
                    setFriends([...friends, res.data.data]);
                } else {
                // Remove friend
                    if(!selectedChat?.isGroupChat) {
                        if((selectedChat?.users)?.find(u => u._id === userId)) {
                            setSelectedChat(undefined);
                        }
                    }
                    setFriends(friends.filter(f => f._id !== userId));
                    window.bootstrap.Modal.getInstance(myModal.current).hide();
                }
            })
            .catch(err => console.error(err.response));
    }

    return (
        <div className="modal fade" id="friendProfileModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={myModal}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content bg-theme-primary" style={{overflow: 'hidden'}}>
                    <div className="modal-body p-0">
                        <button type="button" className="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{top: '20px', right: '20px'}}></button>
                        <img src={friend?.avatar} alt="" className='w-100' style={{aspectRatio: '1/1', objectFit: 'cover'}} />

                        <div className='text-center my-4'>
                            <h5 className='mb-0'>{friend?.displayName}</h5>
                            <p className='text-secondary'>{friend?.username}</p>
                        </div>

                        <div className="d-flex">
                            {!friends.find(f => f._id === friend?._id) ? (
                            <button className="btn w-100 py-2" onClick={()=>handleEditFriends(friend?._id)}>
                                <i className="fa-solid fa-user-plus"></i> Add
                            </button>
                            ) : (
                            <>
                            <button className='btn-profile w-100' onClick={() => startPrivateChat(friend?._id)}><i className="fa-solid fa-message me-1"></i> Start Chat</button>

                            <div className='border'></div>

                            <button className="btn-profile w-100 text-danger" onClick={()=>handleEditFriends(friend?._id)}>
                                <i className="fa-solid fa-user-minus text-danger"></i> Remove
                            </button>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendProfileModal