import axios from "axios";
import { useRef, useState } from "react";

import { ChatState } from "../context/ChatProvider";
import { useOutletContext } from "react-router-dom";

const DropdownChat = ({chat}) => {
    const [chatId, setChatId] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { chats, setChats } = ChatState();
    const { selectedChat, setSelectedChat } = useOutletContext();

    const deleteConfirmModal = useRef();

    const deleteChat = async () => {
        setIsLoading(true);
        await axios.put('/api/chats/remove', {chatId})
            .then(() => {
                window.bootstrap.Modal.getInstance(deleteConfirmModal.current).hide();
                if(selectedChat._id===chatId) {
                    setSelectedChat(undefined);
                }
                const removedChats = chats.filter(c => c._id !== chatId);
                setChats(removedChats);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }

    return (
        <>
        {chat.isGroupChat ? (
            // Group Chat
            <></>) : (
            // Private Chat
            <div className="dropdown">
                <span className="btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-solid fa-angle-down"></i>
                </span>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-theme-primary">
                    <li onClick={() => setChatId(chat._id)}>
                        <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#deleteChatConfirmation">Delete Chat</button>
                    </li>
                </ul>
            </div>
        )}

            {/* Delete Chat confirmation */}
            <div className="modal fade" id="deleteChatConfirmation" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={deleteConfirmModal}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-theme-primary">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Delete Chat</h1>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure want to delete the chat?</p>

                            <div className="d-flex justify-content-end gap-2 mt-5">
                                <button type="button" className="btn btn-outline-primary px-3" data-bs-dismiss="modal">Cancel</button>
                                {!isLoading ?
                                <button type="button" onClick={() => deleteChat()} className="btn btn-primary px-3">Delete</button> :
                                <button type="button" className="btn btn-primary px-3" disabled>Deleting...</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DropdownChat;