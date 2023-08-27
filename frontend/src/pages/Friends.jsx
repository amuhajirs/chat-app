import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import FriendProfileModal from "../components/FriendProfileModal";

const Friends = () => {
    const { friends, chats, setChats, setSelectedChat } = ChatState();
    const { setSelectedUser } = useOutletContext();

    const [searchAdd, setSearchAdd] = useState('');
    const [friendResult, setFriendResult] = useState([]);
    const [message, setMessage] = useState('Search by username');
    const [selectedFriend, setSelectedFriend] = useState();

    const searchAddEl = useRef();
    const addFriendModal = useRef();

    const navigate = useNavigate();

    useEffect(()=>{;
        friends.sort((a, b) => {
            let result = 0;

            if ( a.displayName < b.displayName ){
                result -= 1;
            } else if ( a.displayName > b.displayName ){
                result += 1;
            }

            if(a.isOnline && !b.isOnline) {
                result -= 2;
            } else if(!a.isOnline && b.isOnline) {
                result += 2;
            }
            
            return result;
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
                    setSelectedUser(res.data.data);

                    const modalEl = document.querySelector('#userProfileModal');
                    let modal = window.bootstrap.Modal.getInstance(modalEl);
                    if(!modal) {
                        modal = new window.bootstrap.Modal(modalEl);
                    }

                    if(!res.data.data) {
                        setMessage('User not found');
                        return
                    }

                    setMessage('Search by username');
                    modal.show();

                    setTimeout(() => {
                        modalEl.focus();
                    }, 500)
                })
                .catch(err=>console.error(err.response));
        }
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
                        <div className={friend.isOnline ? 'online' : 'offline'}></div>
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
            <div className="modal fade" id="addFriendModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={addFriendModal}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content bg-theme-primary">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add Friend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="addFriendModalClose"></button>
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
                            <h6 className="text-center mt-3">{message}</h6>
                        </div>
                    </div>
                </div>
            </div>

            <FriendProfileModal friend={selectedFriend} />
        </>
    )
}

export default Friends;