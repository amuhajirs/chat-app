import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import avatar from '../assets/default-avatar.png';

import send from '../assets/send.svg';

const Home = ()=>{
  const [ws, setWs] = useState('');
  const [online, setOnline] = useState({});
  const [selectedConversation, setSelectedConversation] = useState();
  const [newMessage, setNewMessage] = useState('');

  const navigate = useNavigate();
  const inputEl = useRef();
  const auth = useOutletContext();

  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:3001');
    setWs(ws);

    const handleMessage = (e)=>{
      const data = JSON.parse(e.data);
      if('online' in data){
        showOnline(data.online);
      }
    }

    ws.addEventListener('message', handleMessage);
  }, []);

  const showOnline = (peopleArray)=>{
    const people = {};
    peopleArray.forEach(({id, username})=>{
      people[id] = username;
    });
    setOnline(people);
  }

  const selectConversation = (id)=>{
    setSelectedConversation(id);

    setTimeout(()=>{
      inputEl.current?.focus();
    }, 500)
  }

  const sendMessage = (e)=>{
    e.preventDefault();

    if(newMessage){
      ws.send(JSON.stringify({
        message: {
          sender: auth._id,
          recipient: selectedConversation,
          text: newMessage
        }
      }));

      setNewMessage('');
    }
  }

  const logout = ()=>{
    axios.get('/api/auth/logout')
      .then(res=>{
        ws.close();
        navigate('/login');
      })
      .catch(err=>console.error(err.response));
  }

  const onlineExceptMe = {...online};
  delete onlineExceptMe[auth._id];

  return (
    <div className='container-fluid bg-theme-primary rounded-2'>
      <div className="row">

        {/* Contact */}
        <div className="col-lg-4 col-sm-6 contact p-0">
          <div className="header p-3">
            <img src="/logo512.png" alt="" height='40px' />
            <h3 className='fw-bold'>Chat App</h3>
          </div>

          <div className='contact-content'>
            {Object.keys(onlineExceptMe).map(id=>(
            <div className={`person-wrapper ${selectedConversation===id ? 'active' : ''}`} key={id}>
              <div className='cool-active'></div>
              <div onClick={()=>selectConversation(id)} className='person'>
                <div className='person-avatar'>
                  <div className="online"></div>
                  <img src={avatar} alt="" />
                </div>
                <div>
                  <span>{onlineExceptMe[id]}</span>
                  <span className='person-chat'>halooo</span>
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
        <div className="col-lg-8 col-sm-6 chat p-0">

          {selectedConversation ? (
          <>
          <div className='recipient p-3'>
            <img src={avatar} alt="" height='40px' />
            <span>{online[selectedConversation]}</span>
          </div>

          <div className="chat-content">
            <div></div>
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