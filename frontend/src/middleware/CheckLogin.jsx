import { Navigate, Outlet } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { useEffect, useState } from "react";
import LoadingProgress from "../components/LoadingProgress";
import axios from "axios";

const CheckLogin = ({ type }) => {
    const { user, setChats, setFriends } = ChatState();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      // Get user's chats and friends
        const fetchData = async () => {
            setIsLoading(true);

            await axios.get('/api/auth/data', {
                onDownloadProgress: (progressEvent) => {
                    setProgress(Math.floor(progressEvent.progress * 100));
                }
            })
            .then(res => {
                setChats(res.data.data?.chats || []);
                setFriends(res.data.data?.friends || []);
            })
            .catch(err => console.error(err))
            .finally(() => setTimeout(() => {setIsLoading(false)}, 200) );
        }

        if(type==='auth') {
            fetchData();
        }
    }, [type, setChats, setFriends]);
    

    return (
        type==='auth' ?
            (user.login ? ( isLoading ?
                <LoadingProgress progress={progress} /> :
                <Outlet />
            ) : <Navigate to="/login" />) :
            (!user.login ? <Outlet /> : <Navigate to='/' />)
    )
}

export default CheckLogin;