import { ChatState } from '../context/ChatProvider';
import { isSameSenderLast, isLastMessage, isSameSenderFirst, isFirstMessage, isSameSender, isLastMessageIncludeMe } from '../config/ChatLogics';
import moment from 'moment';

const GroupChat = ({ messages, setSelectedFriend }) => {
    const { user } = ChatState();

    return (
        <>
        {messages.map((m, i) => (
            <div key={i} className={`d-flex ${isSameSender(messages, m, i) ? 'mb-3' : 'mb-1'}`}>
                {(isSameSenderLast(messages, m, i, user.data?._id) || isLastMessage(messages, i, user.data?._id)) ? (
                <div role='button' className='mt-auto' data-bs-toggle="modal" data-bs-target="#friendProfileModal" onClick={() => setSelectedFriend(m.sender)}>
                    <img src={m.sender.avatar} alt="" style={{width: '30px'}} className='avatar' />
                </div>) : (
                <div style={{width: '30px'}}></div>)}

                <div key={m._id} className={
                    `message ms-2
                    ${m.sender._id === user.data?._id ? 'me' : ''}
                    ${(isSameSender(messages, m, i, user.data?._id) || isLastMessageIncludeMe(messages, i)) ? 'last' : ''}`
                }>
                    {(isSameSenderFirst(messages, m, i, user.data?._id) || isFirstMessage(messages, i, user.data?._id)) && 
                    <div className='fw-bold' style={{fontSize: '12px'}}>{m.sender.displayName}</div>
                    }
                    <span className="me-2">{m.text}</span>
                    <sub className="text-secondary">{moment(m.createdAt).format('HH:mm')}</sub>
                </div>
            </div>
        ))}
        </>
    )
}

export default GroupChat;