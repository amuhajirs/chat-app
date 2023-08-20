import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState({login: false});
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [notif, setNotif] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get user login info
        const fetchUser = async () => {
            await axios.get('/api/auth/loggedIn')
                .then(res => {
                    setUser({login: res.data.login, data: res.data.data});
                })
                .catch(() => {
                    setUser({login: false});
                })
                .finally(() => setIsLoading(false));
        }

        fetchUser();
    }, []);

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
            {!isLoading && children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;