import { useRef, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { socket } from '../socket';

const CreateGroupModal = () => {
    const { friends } = ChatState();
    const [friendResult, setFriendResult] = useState([]);

    const [picture, setPicture] = useState(undefined);
    const [chatName, setChatName] = useState("");
    const [chatDesc, setChatDesc] = useState("");
    const [addUser, setAddUser] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({});

    const myModal = useRef();

    // Search friend
    const searchFriends = (search) => {
        setAddUser(search);
        let re = new RegExp(search, 'i');
        const filteredFriends = friends?.filter(friend => friend.username.match(re));
        setFriendResult(search ? filteredFriends : []);
    }

    // Add friend to group
    const addFriendToGroup = (user) => {
        if(!(users.includes(user))) {
            setUsers([...users, user]);
        }
    }
    
    // Cancel add friend to group
    const removeFriendFromGroup = (userId) => {
        const removedFriend = users.filter(u => u._id !== userId);
        setUsers(removedFriend);
    }

    // Handle submit create group
    const createGroupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError({});

        let error = {};
        
        if(!chatName) {
            error.chatName = 'Group Name must be filled';
        }

        if(users.length < 2) {
            error.users = 'Members must be at least 3 users';
        }

        setError(error);

        let data;

        if (picture) {
            data = new FormData();
            data.append('picture', picture);
            data.append('chatName', chatName);
            data.append('chatDesc', chatDesc);
            data.append('users', JSON.stringify(users.map(u => u._id)));
        } else {
            data = {
                picture: '/default-group.jpg',
                chatName,
                chatDesc,
                users: users.map(u => u._id)
            };
        }

        await axios.post('/api/chats/group', data)
            .then(res => {
                setPicture(undefined);
                setChatName("");
                setChatDesc("");
                setAddUser("");
                setUsers([]);
                setFriendResult([]);
                socket.emit('create group', res.data.data);
                window.bootstrap.Modal.getInstance(myModal.current).hide();
            })
            .catch(err => console.error(err.response))
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="modal fade" id="createGroupModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={myModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-header">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#newChatModal" className="cool-btn me-2"><i className="fa-solid fa-arrow-left"></i></button>
                        <h1 className="modal-title fs-5">Create Group</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e)=>createGroupSubmit(e)}>

                            <div className="text-center mb-3 ">
                                <label className="position-relative d-inline-block rounded-circle change-avatar" style={{overflow: 'hidden'}}>
                                    <img src={picture ? URL.createObjectURL(picture) : '/default-group.jpg'} alt="" style={{width: '150px'}} className='avatar' /> 
                                    <div className="position-absolute bottom-0 start-50 w-100 rounded-circle" style={{transform: 'translate(-50%, 0)'}}>
                                        <div className="text-black mt-3 fw-semibold">Change Picture</div>
                                    </div>
                                    <input type="file" accept="image/*" hidden onChange={(e) => setPicture(e.target.files[0])} />
                                </label>
                            </div>

                            <div className="mb-3">
                                <input type="text" className="input-theme rounded" placeholder="Group Name" value={chatName} onChange={(e) => setChatName(e.target.value)} />
                                <span className='text-danger ms-1' style={{fontSize: '12px'}}>{error.chatName}</span>
                            </div>
                            <div className="mb-2">
                                <textarea className="input-theme rounded" placeholder="Description (optional)" value={chatDesc} onChange={(e) => setChatDesc(e.target.value)}></textarea>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="input-theme rounded" placeholder="Add Member" value={addUser} onChange={(e) => searchFriends(e.target.value)} />
                                <span className='text-danger ms-1' style={{fontSize: '12px'}}>{error.users}</span>
                            </div>
                            <div className="mb-3">
                                <p className='mb-1'>Members: </p>

                                <div className='d-flex gap-1 flex-wrap'>
                                    {users.map(u => (
                                        <div key={u._id} className='d-flex justify-content-between gap-1 bg-light rounded px-3 py-1'>
                                            <span className='text-black fw-semibold'>{u.username}</span>
                                            <button type='button' onClick={()=>removeFriendFromGroup(u._id)}><i className="fa-solid fa-xmark text-black"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-3' style={{overflowY: 'scroll', maxHeight: '280px'}}>
                                {friendResult.map(friend=>(
                                <div key={friend._id} className="person-wrapper" onClick={() => addFriendToGroup(friend)}>
                                    <div className='person'>
                                        <div className='person-avatar'>
                                            <div className={friend.online ? 'online' : 'offline'}></div>
                                            <img src={friend.avatar} alt="" className='avatar' style={{height: '100%'}} />
                                        </div>
                                        <div>
                                            <span>{friend.username}</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>

                            {isLoading ? (
                            <button type="submit" className="btn btn-primary w-100" disabled>Creating...</button>) : (
                            <button type="submit" className="btn btn-primary w-100">Create</button>)}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupModal