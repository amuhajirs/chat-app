import { ChatState } from '../context/ChatProvider';
import { isSameSenderLast, isLastMessage, isSameSenderFirst, isFirstMessage, isSameSender, isLastMessageIncludeMe } from '../config/ChatLogics';
import moment from 'moment';

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
                    `message ms-2
                    ${m.sender._id === user.data?._id ? 'me' : ''}
                    ${(isSameSender(messages, m, i, user.data?._id) || isLastMessageIncludeMe(messages, i, user.data?._id)) ? 'last' : ''}`
                }>
                    {(isSameSenderFirst(messages, m, i, user.data?._id) || isFirstMessage(messages, i, user.data?._id)) && 
                    <div className='fw-bold' style={{fontSize: '12px'}}>{m.sender.username}</div>
                    }
                    <span className="me-2">{m.text}</span>
                    <sub className="text-secondary">{moment(m.createdAt).format('HH:mm')}</sub>
                </div>
            </div>
        ))
    )
}

export default GroupChat;