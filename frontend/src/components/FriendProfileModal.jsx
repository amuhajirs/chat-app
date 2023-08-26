import axios from 'axios';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

const FriendProfileModal = ({ friend }) => {
    const myModal = useRef();
    const { chats, setChats, setSelectedChat } = ChatState();
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

    return (
        <div className="modal fade" id="friendProfileModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={myModal}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content bg-theme-primary" style={{overflow: 'hidden'}}>
                    <img src={friend?.avatar} alt="" className='w-100' style={{aspectRatio: '1/1', objectFit: 'cover'}} />
                    <button type="button" className="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{top: '20px', right: '20px'}}></button>

                    <div className="modal-body">
                        <div className='text-center mb-3'>
                            <h5 className='mb-1'>{friend?.displayName}</h5>
                            <p className='text-secondary'>{friend?.username}</p>
                        </div>

                        <button className='btn btn-primary w-100' onClick={() => startPrivateChat(friend?._id)}><i className="fa-solid fa-message me-1"></i> Start Chat</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendProfileModal