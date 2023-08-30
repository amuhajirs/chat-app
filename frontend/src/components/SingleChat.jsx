import { isLastMessageIncludeMe, isDifferentDay, isSameSender } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import moment from 'moment';

const SingleChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        messages.map((m, i) => (
            <div key={i}>
                {isDifferentDay(messages, m, i) && (
                <div className="d-flex justify-content-center">
                    <span className="bg-theme-primary p-2 px-3 my-3 rounded-pill" style={{fontSize: '14px'}}>{moment(m.createdAt).format('D MMMM YYYY')}</span>
                </div>)}
                <div className={`${isSameSender(messages, m, i) ? 'mb-3' : 'mb-1'}`}>
                    <div className={
                        `message ${m.sender._id === user.data?._id && 'me'}
                        ${(isSameSender(messages, m, i, user.data?._id) || isLastMessageIncludeMe(messages, i)) ? 'last' : ''}`
                    }>
                        <span className="me-2">{m.text}</span>
                        <sub className="text-secondary">{moment(m.createdAt).format('HH:mm')}</sub>
                    </div>
                </div>
            </div>
        ))
    )
}

export default SingleChat