import { ChatState } from '../context/ChatProvider';
import { isSameSenderLast, isLastMessage, isSameSenderFirst, isFirstMessage, isSameSender } from '../config/ChatLogics';

const GroupChat = ({ messages }) => {
    const { user } = ChatState();
    
    return (
        messages.map((m, i) => (
            <div key={i} className={`d-flex ${isSameSender(messages, m, i) ? 'mb-3' : 'mb-1'}`}>
                {(isSameSenderLast(messages, m, i, user.data?._id) || isLastMessage(messages, i, user.data?._id)) ? (
                <div className='mt-auto'>
                    <img src={m.sender.avatar} alt="" style={{aspectRatio: '1 / 1', width: '30px'}} />
                </div>) : (
                <div style={{width: '30px'}}></div>)}

                <div key={m._id} className={
                    `message ms-2 ${m.sender._id === user.data?._id ? 'me' : ''}`}>
                    {(isSameSenderFirst(messages, m, i, user.data?._id) || isFirstMessage(messages, i, user.data?._id)) && 
                    <div className='fw-bold' style={{fontSize: '12px'}}>{m.sender.username}</div>
                    }
                    {m.text}
                </div>
            </div>
        ))
    )
}

export default GroupChat;