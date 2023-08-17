import { isLastMessageIncludeMe, isSameSender } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import moment from 'moment';

const SingleChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        messages.map((m, i) => (
            <div key={i} className={`d-flex ${isSameSender(messages, m, i) ? 'mb-3' : 'mb-1'}`}>
                <div className={
                    `message ${m.sender._id === user.data?._id && 'me'}
                    ${(isSameSender(messages, m, i, user.data?._id) || isLastMessageIncludeMe(messages, i, user.data?._id)) ? 'last' : ''}`
                }>
                    <span className="me-2">{m.text}</span>
                    <sub className="text-secondary">{moment(m.createdAt).format('HH:mm')}</sub>
                </div>
            </div>
        ))
    )
}

export default SingleChat