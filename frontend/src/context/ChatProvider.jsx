import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState({login: true});

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchUser = async () => {
        await axios.get('/api/auth/loggedIn')
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                setUser({login: false});
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