import { ChatState } from '../context/ChatProvider';
import { isSameSenderLast, isLastMessage, isSameSenderFirst, isFirstMessage, isSameSender, isLastMessageIncludeMe, isDifferentDay } from '../config/ChatLogics';
import moment from 'moment';

const GroupChat = ({ messages, setSelectedUser }) => {
    const { user } = ChatState();

    return (
        messages.map((m, i) => (
            <div key={i}>
                {isDifferentDay(messages, m, i) && (
                <div className="d-flex justify-content-center">
                    <span className="bg-theme-primary p-2 px-3 my-3 rounded-pill" style={{fontSize: '14px'}}>{moment(m.createdAt).format('D MMMM YYYY')}</span>
                </div>)}

                <div  className={`d-flex ${isSameSender(messages, m, i) ? 'mb-3' : 'mb-1'}`}>
                    {(isSameSenderLast(messages, m, i, user.data?._id) || isLastMessage(messages, i, user.data?._id)) ? (
                    <div role='button' className='mt-auto' data-bs-toggle="modal" data-bs-target="#userProfileModal" onClick={() => setSelectedUser(m.sender)}>
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
            </div>
        ))
    )
}

export default GroupChat;