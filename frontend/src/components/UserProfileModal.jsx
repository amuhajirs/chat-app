import axios from 'axios';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

const UserProfileModal = ({ addFriendModal, user }) => {
    const { friends, setFriends, chats, setChats, selectedChat, setSelectedChat } = ChatState();
    const navigate = useNavigate();

    const userProfileModal = useRef();

    // Start chat with friend
    const startPrivateChat = async (id) => {
        await axios.post('/api/chats', {userId: id})
            .then(res => {
                window.bootstrap.Modal.getInstance(userProfileModal.current).hide();
                document.querySelector('#addFriendModalClose')?.click();

                setSelectedChat(res.data.data);
                if(!chats.find(c => c._id===res.data.data._id)){
                    setChats([res.data.data, ...chats]);
                };
                navigate('/');
            })
            .catch(err => console.error(err.response));
    }

    // Add or Remove to friendlist
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
                }
            })
            .catch(err => console.error(err.response));
    }

    return (
        <div className="modal fade" id="userProfileModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={userProfileModal}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content bg-theme-primary" style={{overflow: 'hidden'}}>
                    <div className="modal-body p-0">
                        <button type="button" className="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{top: '20px', right: '20px'}}></button>
                        <img src={user?.avatar} alt="" className='w-100' style={{aspectRatio: '1/1', objectFit: 'cover'}} />

                        <div className='text-center my-4'>
                            <h5 className='mb-0'>{user?.displayName}</h5>
                            <p className='text-secondary'>{user?.username}</p>
                        </div>

                        <div className="d-flex">
                            {!friends.find(f => f._id === user?._id) ? (
                            <button className="btn w-100 py-2" onClick={()=>handleEditFriends(user?._id)}>
                                <i className="fa-solid fa-user-plus"></i> Add
                            </button>
                            ) : (
                            <>
                            <button className='btn w-100 py-2' onClick={() => startPrivateChat(user?._id)}><i className="fa-solid fa-message me-1"></i> Start Chat</button>

                            <div className='border'></div>

                            <button className="btn w-100 py-2" onClick={()=>handleEditFriends(user?._id)}>
                                <i className="fa-solid fa-user-minus"></i> Remove
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

export default UserProfileModal;