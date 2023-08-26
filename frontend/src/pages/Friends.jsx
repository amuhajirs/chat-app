import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";

const Friends = () => {
    const { friends, setFriends, chats, setChats, setSelectedChat } = ChatState();
    const { setSelectedFriend } = useOutletContext();

    const [searchAdd, setSearchAdd] = useState('');
    const [searchAddResult, setSearchAddResult] = useState([]);
    const [friendResult, setFriendResult] = useState([]);
    const [message, setMessage] = useState('Search by username');

    const searchAddEl = useRef();
    const navigate = useNavigate()

    useEffect(()=>{;
        friends?.sort((a, b) => {
            if ( a.displayName < b.displayName ){
                return -1;
            }
            if ( a.displayName > b.displayName ){
                return 1;
            }
            return 0;
        });
        setFriendResult(friends);
    }, [friends]);

    // Search friend
    const searchFriends = (search)=>{
        const re = new RegExp(search, 'i');
        const filteredFriends = friends?.filter(friend => friend.displayName.match(re) || friend.username.match(re));
        setFriendResult(filteredFriends);
    }

    // Search user
    const searchAddSubmit = async (e)=>{
        e.preventDefault();

        if(searchAdd){
            await axios.get(`/api/users/${searchAdd}`)
                .then(res=>{
                    setSearchAddResult(res.data.data);
                    setMessage('User not found');
                })
                .catch(err=>console.error(err.response));
        }
    }

    // Add or Remove to friendlist
    const handleEditFriends = async (userId) => {
        await axios.put('/api/users/friends/edit', {userId})
            .then(res => {
                if (!friends?.find(f => f._id === userId)) {
                    setFriends([...friends, res.data.data]);
                } else {
                    setFriends(friends?.filter(f => f._id !== userId));
                }
            })
            .catch(err => console.error(err.response));
    }

    // Start chat with friend
    const startPrivateChat = async (id) => {
        await axios.post('/api/chats', {userId: id})
            .then(res => {
                setSelectedChat(res.data.data);
                if(!chats.find(c => c._id===res.data.data._id)){
                    setChats([res.data.data, ...chats]);
                };
                navigate('/');
            })
            .catch(err => console.error(err.response));
    }

    return(
        <>
            <div className='search d-flex justify-content-between align-items-center px-2 py-2 gap-1' style={{height: '60px'}}>
                <div className='position-relative w-100'>
                    <label htmlFor="search" className='position-absolute top-50 user-select-none' style={{left: '15px', translate: '0 -50%'}}>
                        <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                    </label>
                    <input type="search" id='search' className='input-theme ps-5 rounded-pill w-100' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} onChange={(e)=>searchFriends(e.target.value)} />
                </div>
                <button className='cool-btn' data-bs-toggle="modal" data-bs-target="#addFriendModal" onClick={()=>setTimeout(()=>{searchAddEl.current?.focus()}, 500)}>
                    <i className="fa-solid fa-user-plus user-select-none" style={{fontSize: '15px'}}></i>
                </button>
            </div>

            {friendResult.map(friend=>(
            <div key={friend._id} className='person-wrapper'>
                <div className="person" data-bs-toggle="modal" data-bs-target="#friendProfileModal" onClick={() => setSelectedFriend(friend)}>
                    <div className='person-avatar'>
                        <div className={friend.online ? 'online' : 'offline'}></div>
                        <img src={friend.avatar} alt="" className="avatar" style={{height: '100%'}} />
                    </div>
                    <div>
                        <span>{friend.displayName}</span>
                    </div>
                </div>
                <button className="cool-btn" onClick={()=>startPrivateChat(friend._id)}><i className="fa-solid fa-message" style={{fontSize: '12px'}}></i></button>
            </div>
            ))}

            {/* Modal Add friend*/}
            <div className="modal fade" id="addFriendModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content bg-theme-primary">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add Friend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body pt-0">
                            <div className="sticky-top bg-theme-primary pt-3">
                                <form onSubmit={searchAddSubmit}>
                                    <div className='position-relative w-100'>
                                        <label htmlFor="search-add" className='position-absolute top-50 user-select-none' style={{left: '15px', translate: '0 -50%'}}>
                                            <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                                        </label>
                                        <input type="search" id='search-add' ref={searchAddEl} className='input-theme ps-5 w-100' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} autoComplete="off" onChange={(e)=>setSearchAdd(e.target.value)} />
                                    </div>
                                </form>
                                <hr className="text-white mb-0" />
                            </div>
                            {searchAddResult[0] ? (searchAddResult.map(u=>(
                            <div key={u._id}>
                                <div className="d-flex justify-content-start align-items-center gap-2 py-2" style={{height: '70px'}}>
                                    <img src={u.avatar} alt="" style={{height: '100%'}} className="avatar" />
                                    <div>
                                        <h6 className="mb-1">{u.username}</h6>
                                        <p className="text-seconday" style={{ fontSize: '13px' }}>{u.displayName}</p>
                                    </div>
                                    {!friends?.find(f => f._id === u._id) ? (
                                    <button className="btn btn-primary ms-auto" onClick={()=>handleEditFriends(u._id)}>
                                        <i className="fa-solid fa-user-plus"></i> Add
                                    </button>
                                    ) : (
                                    <button className="btn btn-outline-primary ms-auto" onClick={()=>handleEditFriends(u._id)}>
                                        <i className="fa-solid fa-user-minus"></i> Remove
                                    </button>
                                    )}
                                </div>
                                <hr className="text-white m-0" />
                            </div>
                            ))) : (
                            <h6 className="text-center mt-3">{message}</h6>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Friends;