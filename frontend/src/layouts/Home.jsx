import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { ChatState } from '../context/ChatProvider';

import send from '../assets/send.svg';

const Home = ()=>{
  const { user, setUser } = ChatState();
  const [selectedConversation, setSelectedConversation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const inputEl = useRef();
  const chatContent = useRef();
  
  console.log(user)

  // Automatic scroll to bottom
  useEffect(()=>{
    chatContent.current?.scrollTo(0, chatContent.current.scrollHeight);
    inputEl.current?.focus();
  }, [selectedConversation]);

  // Log out
  const logout = async ()=>{
    await axios.get('/api/auth/logout')
      .then(()=>{
        setUser({login: false});
        navigate('/login');
      })
      .catch(err=>console.error(err.response));
  }

  return (
    <div className='container-fluid bg-theme-primary rounded-2'>
      <div className="row">

        {/* Contact */}
        <div className="col-lg-3 col-md-4 col-sm-6 contact p-0">
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
            <Outlet context={{selectedConversation, setSelectedConversation, setIsLoading}} />
          </div>

          <div className='profile p-3'>
            <div className='d-flex column-gap-2 align-items-center'>
              <img src={user.data?.avatar} alt="" height='40px' />
              <span>{user.data?.username}</span>
              <sup><i className="fa-solid fa-pen-to-square"></i></sup>
            </div>
            <div className='cool-btn' onClick={logout}>
              <i className="fa-solid fa-right-from-bracket text-danger"></i>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="chat col-lg-9 col-md-8 col-sm-6 p-0">

          {selectedConversation ? (
            <>
            <div className='recipient p-3'>
              {!isLoading ? (
                <>
                  <img src="" alt="" height='40px' />
                  <span>bambang</span>
                </>
                ) : (
                <>
                  <img src='/default-avatar.png' alt="" height='40px' />
                  <div className='w-100 placeholder-glow'>
                    <span className='placeholder col-lg-1 col-3'></span>
                  </div>
                </>
              )}
            </div>

            <div className="chat-content" ref={chatContent}>
              <div className='container my-3'>
              </div>
            </div>

            <div className='input-message p-3'>
              <form method="POST">
                <button type='submit' className='cool-btn'>
                  <i className="fa-solid fa-paperclip"></i>
                </button>
                <input ref={inputEl} className='input-theme' type="text" placeholder='Type your message' autoComplete="false" />
                <button type='submit' className='cool-btn'>
                  <img src={send} alt=""  />
                </button>
              </form>
            </div>
            </>
          ) : (
          <>
          <div className='d-flex justify-content-center align-items-center flex-column gap-4' style={{height: '100%', backgroundColor: 'black'}}>
            <i className="fa-solid fa-message text-center unselectable" style={{fontSize: '100px', color: 'gray'}}></i>
            <h1 className='unselectable' style={{color: 'gray'}}>Start Conversation</h1>
          </div>
          </>
          )}

        </div>

      </div>
    </div>
  )
}

export default Home;