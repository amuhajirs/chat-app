import { ChatState } from "../context/ChatProvider";

const Notification = () => {
    const { notif } = ChatState();

    return (
        notif.map(n => (
            <div>
                
            </div>
        ))
    )
}

export default Notification;