import { ChatState } from "../context/ChatProvider";

const SingleChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        messages.map((m, i) => (
            <div key={i} className='d-flex'>
                <div key={m._id} className={`message ${m.sender._id === user.data?._id && 'me'} mb-1`}>{m.text}</div>
            </div>
        ))
    )
}

export default SingleChat