import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import LoadingProgress from '../components/LoadingProgress';

const FetchData = () => {
    const { setUser } = ChatState();
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Get user login info and friends
        const fetchUser = async () => {
            setIsLoading(true);

            await axios.get('/api/auth/loggedIn', {
                onDownloadProgress: (progressEvent) => {
                    setProgress(progressEvent.progress)
                }
            })
                .then(res => {
                    setUser({login: res.data.login, data: res.data.data?.user});
                    setFriends(res.data.data?.friends || []);
                    setChats(res.data.data?.chats || []);
                })
                .catch(() => {
                    setUser({login: false});
                })
                .finally(() => setTimeout(() => {setIsLoading(false)}, 200) );
        }

        fetchUser();
    }, [setUser, setFriends, setChats]);

    return (
        isLoading ?
            <LoadingProgress progress={progress} /> :
            <Outlet context={{ chats, setChats, friends, setFriends, isLoading }} />
    )
}

export default FetchData