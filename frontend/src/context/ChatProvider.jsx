import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState({login: true});
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [notif, setNotif] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    // Get user login info and friends
    const fetchUser = async () => {
        await axios.get('/api/auth/loggedIn')
            .then(res => {
                setUser({login: res.data.login, data: res.data.data?.user});
                setFriends(res.data.data?.friends);
                setChats(res.data.data?.chats);
            })
            .catch(err => {
                setUser({login: false});
                console.error(err);
            })
    }

    return(
        <ChatContext.Provider value={{
            user,
            setUser,
            friends,
            setFriends,
            chats,
            setChats,
            notif,
            setNotif
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;