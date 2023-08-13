import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState({username: 'anonymous'});

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchUser = async () => {
        await axios.get('/api/auth/loggedIn')
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error(err.response);
            })
    }

    return(
        <ChatContext.Provider value={{user, setUser}}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;