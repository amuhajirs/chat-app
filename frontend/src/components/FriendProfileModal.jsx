import React, { useRef } from 'react'

const FriendProfileModal = ({ friend, handleSelectFriend }) => {
    const myModal = useRef();

    return (
        <div className="modal fade" id="friendProfileModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={myModal}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content bg-theme-primary" style={{overflow: 'hidden'}}>
                    <img src={friend.avatar} alt="" className='w-100' style={{aspectRatio: '1/1', objectFit: 'cover'}} />
                    <button type="button" className="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{top: '20px', right: '20px'}}></button>

                    <div className="modal-body">
                        <div className='text-center mb-3'>
                            <h5 className='mb-1'>{friend.username}</h5>
                            <p className='text-secondary'>{friend.email}</p>
                        </div>

                        <button className='btn btn-primary w-100' onClick={() => {
                            window.bootstrap.Modal.getInstance(myModal.current).hide();
                            handleSelectFriend(friend._id);
                        }}><i className="fa-solid fa-message me-1"></i> Start Chat</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendProfileModal