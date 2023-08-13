import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";

const Friends = () => {
    const { user } = ChatState();
    const [searchAdd, setSearchAdd] = useState('');
    const [searchAddResult, setSearchAddResult] = useState([]);
    const [friendResult, setFriendResult] = useState([]);

    const { setSelectedChat, setMessageIsLoading } = useOutletContext();
    const searchAddEl = useRef();
    const navigate = useNavigate()

    useEffect(()=>{
        const friends = user.data?.friends;
        friends.sort((a, b) => {
            if ( a.username < b.username ){
                return -1;
            }
            if ( a.username > b.username ){
                return 1;
            }
            return 0;
        });
        setFriendResult(friends);
    }, [user]);

    // Search friend
    const searchFriends = (search)=>{
        const re = new RegExp(search, 'i');
        const filteredFriends = user.data?.friends.filter(friend => friend.username.match(re));
        setFriendResult(filteredFriends);
    }

    // Search user
    const searchAddSubmit = async (e)=>{
        e.preventDefault();

        if(searchAdd){
            await axios.get(`/api/users?search=${searchAdd}`)
                .then(res=>setSearchAddResult(res.data.data))
                .catch(err=>console.error(err.response));
        } else{
            setSearchAddResult([]);
        }
    }

    // Select friend
    const handleSelectFriend = async (id) => {
        setMessageIsLoading(true);
        await axios.post('/api/chat', {userId: id})
            .then(res => {
                setSelectedChat(res.data.data);
                setMessageIsLoading(false);
                navigate('/');
            })
            .catch(err => console.error(err.response));
    }

    return(
        <>
            <div className='search d-flex justify-content-between align-items-center px-2 py-2 gap-1' style={{height: '60px'}}>
                <div className='position-relative w-100'>
                    <label htmlFor="search" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                        <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                    </label>
                    <input type="search" id='search' className='input-theme ps-5 rounded-pill' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} onChange={(e)=>searchFriends(e.target.value)} />
                </div>
                <button className='cool-btn' data-bs-toggle="modal" data-bs-target="#addFriendModal" onClick={()=>setTimeout(()=>{searchAddEl.current?.focus()}, 500)}>
                    <i className="fa-solid fa-user-plus unselectable" style={{fontSize: '15px'}}></i>
                </button>
            </div>

            {friendResult.map(friend=>(
            <div key={friend._id} onClick={()=>handleSelectFriend(friend._id)} className='person'>
                <div className='person-avatar'>
                    <div className={friend.online ? 'online' : 'offline'}></div>
                    <img src={friend.avatar} alt="" />
                </div>
                <div>
                    <span>{friend.username}</span>
                </div>
            </div>
            ))}

            {/* Modal */}
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
                                        <label htmlFor="search-add" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                                            <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                                        </label>
                                        <input type="search" id='search-add' ref={searchAddEl} className='input-theme ps-5' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} autoComplete="off" onChange={(e)=>setSearchAdd(e.target.value)} />
                                    </div>
                                </form>
                                <hr className="text-white mb-0" />
                            </div>
                            {searchAddResult[0] ? (searchAddResult.map(u=>(
                            <div key={u._id}>
                                <div className="d-flex justify-content-start align-items-center gap-2 py-2" style={{height: '70px'}}>
                                    <img src={u.avatar} alt="" style={{height: '100%'}} />
                                    <h6>{u.username}</h6>
                                        {!user.data.friends.includes(u._id) ? (
                                        <button className="btn btn-primary ms-auto" onClick={()=>console.log('add')}>
                                            <i className="fa-solid fa-user-plus"></i> Add
                                        </button>
                                        ) : (
                                        <button className="btn btn-outline-primary ms-auto" onClick={()=>console.log('remove')}>
                                            <i className="fa-solid fa-user-minus"></i> Remove
                                        </button>
                                        )}
                                </div>
                                <hr className="text-white m-0" />
                            </div>
                            ))) : (
                            <h5 className="text-center mt-3">User not found</h5>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Friends;