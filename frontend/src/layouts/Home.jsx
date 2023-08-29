import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { socket } from '../socket';
import { ChatState } from '../context/ChatProvider';
import ChatContent from '../components/ChatContent';

import send from '../assets/send.svg';
import ProfileModal from '../components/ProfileModal';
import { showChat } from '../config/ChatLogics';
import UserProfileModal from '../components/UserProfileModal';

const Home = ()=>{
  const { user, setUser, chats, setChats, friends, setFriends, selectedChat, setSelectedChat } = ChatState();
  const [messageIsLoading, setMessageIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const navigate = useNavigate();
  const inputEl = useRef();

  useEffect(() => {
    // Connect to socket.io
    socket.connect();

    // On connect to socket.io
    socket.on('connect', () => {
      console.log('connected to socket.io');
    });

    // On disconnect to socket.io
    socket.on('disconnect', () => {
      console.log('disconnected to socket.io');
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    socket.emit('setup', user.data);
  }, [user, setUser]);
  

  // Online or offline update
  useEffect(() => {
    const onOnline = userId => {
      const updatedFriends = friends.map(f => {
        if(f._id === userId) {
          f.isOnline = true;
        }
        return f;
      });

      setFriends(updatedFriends);
    }

    const onOffline = userId => {
      const updatedFriends = friends.map(f => {
        if(f._id === userId) {
          f.isOnline = false;
        }
        return f;
      });

      setFriends(updatedFriends);
    }

    // When someone online
    socket.on('online', onOnline);

    // When someone offline
    socket.on('offline', onOffline);
  
    return () => {
      socket.off('online', onOnline);
      socket.off('offline', onOffline);
    }
  }, [friends, setFriends]);
  

  // Join to all group chats room
  useEffect(() => {
    const chatsId = chats.filter(c => c.isGroupChat).map(c => c._id);
    socket.emit('join group chats', chatsId);
  }, [chats]);

  // Log out
  const logout = async ()=>{
    await axios.get('/api/auth/logout')
      .then(()=>{
        setUser({login: false});
        setFriends([]);
        setChats([]);
        socket.disconnect();
        navigate('/login');
      })
      .catch(err=>console.error(err));
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    // make sure the message not empty
    if(!inputEl.current.value.trim()){
      return
    }

    const message = {
      sender: user.data,
      chat: selectedChat._id,
      text: inputEl.current.value
    }

    inputEl.current.value = "";

    await axios.post('/api/chats/messages/send', message)
      .then(() => {
        if(selectedChat.isGroupChat) {
          socket.emit('group message', message);
        } else {
          socket.emit('private message', {...message, recipient: selectedChat.users});
        }
      })
      .catch(err => console.error(err));

  }

  return (
    <>
    <div className='bg-theme-primary rounded-2'>
      <div className="d-flex">

        {/* Contact */}
        <div className={`contact p-0 ${selectedChat && 'deactive'}`}>
          <div className="header">

            <div className='p-3'>
              <img src="/logo512.png" alt="" height='40px' />
              <h4 className='fw-bold'>ChatApp</h4>
            </div>

            <div className='menu'>
              <NavLink to='/'><i className="fa-solid fa-comment"></i> Chats</NavLink>
              <NavLink to='/friends'><i className="fa-solid fa-user-group"></i> Friends</NavLink>
              <NavLink to='/notification' className='notif'><i className="fa-solid fa-bell"></i></NavLink>
              <div className='line'></div>
            </div>

          </div>

          <div className='contact-content'>
            <Outlet context={{ setSelectedUser }} />
          </div>

          <div className='profile p-3'>
            <div className='d-flex column-gap-2 align-items-center' data-bs-toggle="modal" data-bs-target="#profileModal" style={{cursor: 'pointer'}}>
              <img src={user.data?.avatar} alt="" style={{height: '40px'}} className='avatar' />
              <span>{user.data?.displayName}</span>
              <sup><i className="fa-solid fa-pen-to-square"></i></sup>
            </div>
            <div className='cool-btn' onClick={logout}>
              <i className="fa-solid fa-right-from-bracket text-danger"></i>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className='messages p-0'>

          {selectedChat ? (
            <>
            <div className='recipient p-3'>
              {!messageIsLoading ? (
                <>
                {/* Mobile */}
                <button onClick={() => setSelectedChat(undefined)} className='back-btn'>
                  <i className="fa-solid fa-chevron-left"></i>
                  <img src={selectedChat.isGroupChat ? selectedChat.picture : showChat(selectedChat, user.data?._id).avatar} alt="" style={{height: '40px'}} className='avatar' />
                </button>

                <img src={selectedChat.isGroupChat ? selectedChat.picture : showChat(selectedChat, user.data?._id).avatar} alt="" style={{height: '40px'}} className='avatar' />
                <span>{selectedChat.isGroupChat ? selectedChat.chatName : showChat(selectedChat, user.data?._id).displayName}</span>
                </>
                ) : (
                <>
                  <img src={selectedChat.isGroupChat ? '/default-group.jpg' : '/default-avatar'} alt="" style={{height: '40px', objectFit: 'cover', aspectRatio: '1/1', borderRadius: '50%'}} />
                  <div className='w-100 placeholder-glow'>
                    <span className='placeholder col-lg-1 col-3'></span>
                  </div>
                </>
              )}
            </div>

            <div className="messages-content">
              <div className='container my-3'>
                <ChatContent setMessageIsLoading={setMessageIsLoading} setSelectedUser={setSelectedUser} />
              </div>
            </div>

            <div className='input-message p-3'>
              <form onSubmit={sendMessage}>
                <button type='button' className='cool-btn'>
                  <i className="fa-solid fa-paperclip"></i>
                </button>
                <input id='inputEl' ref={inputEl} className='input-theme w-100' type="text" placeholder='Type your message' autoComplete="off" />
                <button type='submit' className='cool-btn'>
                  <img src={send} alt=""  />
                </button>
              </form>
            </div>
            </>
          ) : (
          <>
          <div className='d-flex justify-content-center align-items-center flex-column gap-4' style={{height: '100%', backgroundColor: 'black'}}>
            <i className="fa-solid fa-message text-center user-select-none" style={{fontSize: '100px', color: 'gray'}}></i>
            <h1 className='user-select-none text-center' style={{color: 'gray'}}>Start Conversation</h1>
          </div>
          </>
          )}

        </div>

      </div>
    </div>

    {/* Modal Profile */}
    <ProfileModal />

    {/* Modal Friend Profile */}
    <UserProfileModal user={selectedUser} />
    </>
  )
}

export default Home;