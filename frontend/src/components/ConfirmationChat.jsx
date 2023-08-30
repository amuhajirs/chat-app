import axios from "axios";
import { useRef, useState } from "react";

import { ChatState } from "../context/ChatProvider";

const ConfirmationChat = ({chatId}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { chats, setChats, selectedChat, setSelectedChat } = ChatState();

    const deleteConfirmModal = useRef();
    const exitConfirmModal = useRef();

    // remove chat
    const deleteChat = async () => {
        setIsLoading(true);
        await axios.put('/api/chats/remove', {chatId})
            .then(() => {
                window.bootstrap.Modal.getInstance(deleteConfirmModal.current).hide();
                if(selectedChat?._id===chatId) {
                    setSelectedChat(undefined);
                }
                setChats(chats.filter(c => c._id !== chatId));
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }

    return (
        <>
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

        {/* Exit Group confirmation */}
        <div className="modal fade" id="exitGroupConfirmation" tabIndex="-1" aria-hidden="true" data-bs-theme="dark" ref={exitConfirmModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Exit Group</h1>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to Exit from the group?</p>

                        <div className="d-flex justify-content-end gap-2 mt-5">
                            <button type="button" className="btn btn-outline-primary px-3" data-bs-dismiss="modal">Cancel</button>
                            {!isLoading ?
                            <button type="button" onClick={() => {}} className="btn btn-primary px-3">Exit</button> :
                            <button type="button" className="btn btn-primary px-3" disabled>Exiting...</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ConfirmationChat;