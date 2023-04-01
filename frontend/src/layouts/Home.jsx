import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import send from '../assets/send.svg';

const Home = ()=>{
  const [ws, setWs] = useState('');
  const [friends, setFriends] = useState([]);
  const [online, setOnline] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const inputEl = useRef();
  const chatContent = useRef();
  const { auth } = useOutletContext();
  
  useEffect(()=>{
    const domain = process.env.NODE_ENV==='production' ? 'wss://jeremyjfn-chat.up.railway.app/' : 'ws://localhost:3001';
    const ws = new WebSocket(`${domain}`);
    setWs(ws);
    console.log('Connected to Websocket');

    // Handle Message from websocket server
    const handleMessage = (e)=>{
      const data = JSON.parse(e.data);
      if('online' in data){
        setOnline(data.online);
      } else if('message' in data){
        setMessages(prev=>[...prev, {...data.message}]);
      }
    }

    ws.addEventListener('message', handleMessage);

    return ()=>ws.close();
  }, []);

  // Automatic scroll to bottom
  useEffect(()=>{
    chatContent.current?.scrollTo(0, chatContent.current.scrollHeight);
    inputEl.current?.focus();
  }, [messages, selectedConversation]);

  // Send message to recipient
  const sendMessage = (e)=>{
    e.preventDefault();

    if(newMessage){
      const myMessage = {
        sender: auth._id,
        recipient: selectedConversation,
        text: newMessage,
        createdAt: Date.now()
      };

      ws.send(JSON.stringify(myMessage));
      setNewMessage('');
    }
  }

  // Log out
  const logout = async ()=>{
    await axios.get('/api/auth/logout')
      .then(()=>{
        ws.close();
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
              <h4 className='fw-bold'>Chat App</h4>
            </div>

            <div className='menu'>
              <NavLink to='/'>Rooms</NavLink>
              <NavLink to='/friends'><i className="fa-solid fa-user-group"></i> Friends</NavLink>
              <NavLink to='/notification' className='notif'><i className="fa-solid fa-bell"></i></NavLink>
              <div className='line'></div>
            </div>

          </div>

          <div className='contact-content'>
            <Outlet context={{auth, online, friends, setFriends, selectedConversation, setSelectedConversation, setMessages, setIsLoading}} />
          </div>

          <div className='profile p-3'>
            <div className='d-flex column-gap-2 align-items-center'>
              <img src={auth.avatar} alt="" height='40px' />
              <span>{auth.username}</span>
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
                  <img src={friends.find(p=>p._id===selectedConversation)?.avatar} alt="" height='40px' />
                  <span>{friends.find(p=>p._id===selectedConversation)?.username}</span>
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
                {!isLoading && (
                  messages.map((m, index)=>(
                    <div className='chat-message' key={index} style={m.sender===auth._id ? {marginLeft: 'auto', background: 'white'} : {marginRight: 'auto'}}>
                      <p className={`text-${m.sender===auth._id ? 'black' : 'white'}`}>{m.text} <sub className={`text-${m.sender===auth._id ? 'black' : 'white'}`}>{moment(m.createdAt).format('HH:mm')}</sub></p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className='input p-3'>
              <form method="POST" onSubmit={sendMessage}>
                <button type='submit' className='cool-btn'>
                  <i className="fa-solid fa-paperclip"></i>
                </button>
                <input ref={inputEl} className='input-theme' type="text" placeholder='Type your message' value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} autoComplete="false" />
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