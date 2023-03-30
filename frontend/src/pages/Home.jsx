import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import moment from 'moment';

import avatar from '../assets/default-avatar.png';
import send from '../assets/send.svg';

const Home = ()=>{
  const [ws, setWs] = useState('');
  const [online, setOnline] = useState([]);
  const [offline, setOffline] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const inputEl = useRef();
  const chatContent = useRef();
  const auth = useOutletContext();
  
  useEffect(()=>{
    const domain = process.env.NODE_ENV==='production' ? 'wss://jeremyjfn-chat.up.railway.app/' : 'ws://localhost:3001';
    const ws = new WebSocket(`${domain}`);
    setWs(ws);
    console.log('Connected to Websocket');

    // Show online & offline people
    const showPeople = async (dataOnline)=>{
      const onlineExceptMe = dataOnline.filter(({id})=>id!==auth._id && id!==undefined);
      setOnline(onlineExceptMe);

      await axios.get('/api/users')
        .then(res=>{
          const users = res.data;
          const offlinePeople = users.filter(user=>!dataOnline.find(({id})=>user._id===id));
          setOffline(offlinePeople);
        })
    }

    // Handle Message from websocket server
    const handleMessage = (e)=>{
      const data = JSON.parse(e.data);
      if('online' in data){
        showPeople(data.online);
      } else if('message' in data){
        setMessages(prev=>[...prev, {...data.message}]);
      }
    }

    ws.addEventListener('message', handleMessage);

    return ()=>ws.close();
  }, [auth]);

  // Automatic scroll to bottom
  useEffect(()=>{
    chatContent.current?.scrollTo(0, chatContent.current.scrollHeight);
    inputEl.current?.focus();
  }, [messages, selectedConversation])

  // Conversation (message)
  const selectedConversationMessage = (id)=>{
    const conversation = messages.filter(m=>m.sender===id || m.recipient===id);
    return conversation;
  }

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

      setMessages(prev=>[...prev, myMessage]);
      setNewMessage('');
    }
  }

  // Log out
  const logout = ()=>{
    axios.get('/api/auth/logout')
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
        <div className="col-lg-4 col-sm-6 contact p-0">
          <div className="header p-3">
            <img src="/logo512.png" alt="" height='40px' />
            <h4 className='fw-bold'>Chat App</h4>
          </div>

          <div className='contact-content'>
            {online.map(onlinePerson=>(
            <div className={`person-wrapper ${selectedConversation===onlinePerson.id ? 'active' : ''}`} key={onlinePerson.id}>
              <div className='cool-active'></div>
              <div onClick={()=>setSelectedConversation(onlinePerson.id)} className='person'>
                <div className='person-avatar'>
                  <div className="online"></div>
                  <img src={avatar} alt="" />
                </div>
                <div>
                  <span>{onlinePerson.username}</span>
                  <span className='person-chat'>
                    {selectedConversationMessage(onlinePerson.id)[0] ? selectedConversationMessage(onlinePerson.id)[selectedConversationMessage(onlinePerson.id).length-1].sender!==onlinePerson.id && 'You: ' : ''}
                    {selectedConversationMessage(onlinePerson.id)[selectedConversationMessage(onlinePerson.id).length-1]?.text}
                  </span>
                </div>
              </div>
            </div>
            ))}

            {offline.map(offlinePerson=>(
            <div className={`person-wrapper ${selectedConversation===offlinePerson._id ? 'active' : ''}`} key={offlinePerson._id}>
              <div className='cool-active'></div>
              <div onClick={()=>setSelectedConversation(offlinePerson._id)} className='person'>
                <div className='person-avatar'>
                  <div className="offline"></div>
                  <img src={avatar} alt="" />
                </div>
                <div>
                  <span>{offlinePerson.username}</span>
                  <span className='person-chat'>
                    {selectedConversationMessage(offlinePerson._id)[0] ? selectedConversationMessage(offlinePerson._id)[selectedConversationMessage(offlinePerson._id).length-1].sender!==offlinePerson._id && 'You: ' : ''}
                    {selectedConversationMessage(offlinePerson._id)[selectedConversationMessage(offlinePerson._id).length-1]?.text}
                  </span>
                </div>
              </div>
            </div>
            ))}
          </div>

          <div className='profile p-3'>
            <div className='d-flex column-gap-2 align-items-center'>
              <img src={avatar} alt="" height='40px' />
              <span>{auth.username}</span>
              <sup><i className="fa-solid fa-pen-to-square"></i></sup>
            </div>
            <div className='cool-btn' onClick={logout}>
              <i className="fa-solid fa-right-from-bracket text-danger"></i>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="chat col-lg-8 col-sm-6 p-0">

          {selectedConversation ? (
          <>
          <div className='recipient p-3'>
            <img src={avatar} alt="" height='40px' />
            <span>{online[selectedConversation]}</span>
          </div>

          <div className="chat-content" ref={chatContent}>
            <div className='container my-3'>
              {selectedConversationMessage(selectedConversation).map((m, index)=>(
                <div className='chat-message' key={index} style={m.sender===auth._id ? {marginLeft: 'auto', background: 'white'} : {marginRight: 'auto'}}>
                  <p className={`text-${m.sender===auth._id ? 'black' : 'white'}`}>{m.text} <sub className={`text-${m.sender===auth._id ? 'black' : 'white'}`}>{moment(m.createdAt).format('HH:mm')}</sub></p>
                </div>
              ))}
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
          <div className='d-flex justify-content-center align-items-center flex-column gap-4' style={{height: '100%'}}>
            <i className="fa-solid fa-message text-center" style={{fontSize: '100px', color: 'gray'}}></i>
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