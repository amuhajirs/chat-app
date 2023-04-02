import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Friends = () => {
    const [searchAdd, setSearchAdd] = useState('');
    const [result, setResult] = useState([]);

    const { auth, online, friends, setFriends, selectedConversation, setSelectedConversation, setMessages, setIsLoading } = useOutletContext();
    const searchAddEl = useRef();

    const fetchFriends = async (search)=>{
        await axios.get(`/api/users/friends${search ? `?search=${search}` : ''}`)
            .then(res=>{
                const resFriends = res.data.friends;

                resFriends.map(friend=>{
                    friend.online = false;
                    return(
                        online.find(({_id})=>{
                            if(friend._id===_id){
                                friend.online=true;
                            }
                            return false;
                        })
                    )
                });

                resFriends.sort((a, b)=>b.online - a.online);
                setFriends(resFriends);
            })
            .catch(err=>console.error(err.response));
    }

    useEffect(()=>{
        fetchFriends();
    }, [online])

    const selectConversation = async (id)=>{
        setIsLoading(true);
        setSelectedConversation(id);
        await axios.get(`/api/chat/history/${id}`)
            .then(res=>setMessages(res.data.messages))
            .catch(err=>console.error(err.response))
            .finally(()=>setIsLoading(false));
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(searchAdd){
            await axios.get(`/api/users?search=${searchAdd}`)
                .then(res=>setResult(res.data))
                .catch(err=>console.error(err.response));
        } else{
            setResult([]);
        }
    }

    const handleFriend = async (id)=>{
        await axios.patch('/api/users/friends/edit', {user: id})
            .then(res=>{
                const oldFriends = auth.friends.find((friend)=>friend===id);
                if(oldFriends){
                    const newFriendList = auth.friends.filter((friend)=>friend!==id);
                    auth.friends = newFriendList;
                } else{
                    auth.friends = [...auth.friends, id];
                }
                fetchFriends();
                console.log(res.data);
            })
            .catch(err=>console.error(err.response));
    }

    return(
        <>
            <div className='search d-flex justify-content-between align-items-center px-2 py-2 gap-1' style={{height: '60px'}}>
                <div className='position-relative w-100'>
                    <label htmlFor="search" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                        <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                    </label>
                    <input type="search" id='search' className='input-theme ps-5' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} onChange={(e)=>fetchFriends(e.target.value)} />
                </div>
                <button className='cool-btn' data-bs-toggle="modal" data-bs-target="#addFriendModal" onClick={()=>setTimeout(()=>{searchAddEl.current?.focus()}, 500)}>
                    <i className="fa-solid fa-user-plus unselectable" style={{fontSize: '15px'}}></i>
                </button>
            </div>

            {friends.map(friend=>(
            <div className={`person-wrapper ${selectedConversation===friend._id ? 'active' : ''}`} key={friend._id}>
                <div className='cool-active'></div>
                <div onClick={()=>selectConversation(friend._id)} className='person'>
                    <div className='person-avatar'>
                        <div className={friend.online ? 'online' : 'offline'}></div>
                        <img src={friend.avatar} alt="" />
                    </div>
                    <div>
                        <span>{friend.username}</span>
                    </div>
                </div>
            </div>
            ))}

            {/* Modal */}
            <div className="modal fade" id="addFriendModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-theme-primary">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add Friend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className='position-relative w-100'>
                                    <label htmlFor="search" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                                        <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                                    </label>
                                    <input type="search" id='search' ref={searchAddEl} className='input-theme ps-5' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} autoComplete="off" onChange={(e)=>setSearchAdd(e.target.value)} />
                                </div>
                            </form>
                            <hr className="text-white mb-0" />
                            {result[0] ? (result.map(user=>(
                                <div key={user._id}>
                                    <div className="d-flex justify-content-start align-items-center gap-2 py-2" style={{height: '70px'}}>
                                        <img src={user.avatar} alt="" style={{height: '100%'}} />
                                        <h6>{user.username}</h6>
                                        {user._id!==auth._id ? (
                                            <>
                                            {!auth.friends.includes(user._id) ? (
                                            <button className="btn btn-primary ms-auto" onClick={()=>handleFriend(user._id)}>
                                                <i className="fa-solid fa-user-plus"></i> Add
                                            </button>
                                            ) : (
                                            <button className="btn btn-outline-primary ms-auto" onClick={()=>handleFriend(user._id)}>
                                                <i className="fa-solid fa-user-minus"></i> Remove
                                            </button>
                                            )}
                                            </>) : (
                                            <div className="ms-auto p-3">
                                                <span className="text-center">You</span>
                                            </div>
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