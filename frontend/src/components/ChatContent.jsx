import axios from 'axios';
import { useEffect, useState } from 'react';
import GroupChat from './GroupChat';
import SingleChat from './SingleChat';

const ChatContent = ({ socket, selectedChat, setMessageIsLoading }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    // Receive message from socket.io
    useEffect(() => {
        socket?.on('receive message', newMessage => {
            if(newMessage.chat===selectedChat._id) {
                setMessages([...messages, newMessage]);
            }
        });
        scrollToBottom();
    }, [messages])

    // Get history messages
    const fetchMessages = async () => {
        setMessageIsLoading(true);

        await axios.get(`/api/chat/${selectedChat._id}`)
            .then(res => {
                setMessages(res.data.data);
                scrollToBottom();
            })
            .catch(err => console.error(err.response))
            .finally(() => setMessageIsLoading(false));
    }

    // Automatic scroll to bottom
    const scrollToBottom = () => {
        const messagesContent = document.querySelector('.messages-content');
        const inputEl = document.querySelector('#inputEl');
        messagesContent.scrollTo(0, messagesContent.scrollHeight);
        inputEl.focus();
    }

    return (
        selectedChat.isGroupChat ? (
        <GroupChat messages={messages} />) : (
        <SingleChat messages={messages} />
        )
    )
}

export default ChatContent;