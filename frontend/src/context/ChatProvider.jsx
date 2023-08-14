import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState({login: true});
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchChats();
    }, [user])

    // Get user login info and friends
    const fetchUser = async () => {
        await axios.get('/api/auth/loggedIn')
            .then(res => {
                setFriends(res.data.data.friends);
                delete res.data.data.friends;
                setUser(res.data);
            })
            .catch(err => {
                setUser({login: false});
                console.error(err.response);
            })
    }

    // Get all the personal and group chats
    const fetchChats = async () => {
        await axios.get('/api/chat')
            .then(res => {
                setChats(res.data.data);
            })
            .catch(err => console.error(err.response));
    }

    return(
        <ChatContext.Provider value={{user, setUser, friends, setFriends, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;