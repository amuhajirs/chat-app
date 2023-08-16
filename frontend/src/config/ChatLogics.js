export const isSameSenderLast = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
}

export const isLastMessage = (messages, i, userId) => {
    return (
        (i === messages.length - 1) &&
        (messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id)
    );
}

export const isSameSenderFirst = (messages, m, i, userId) => {
    return (
        i > 0 &&
        (messages[i - 1].sender._id !== m.sender._id ||
            messages[i - 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
}

export const isFirstMessage = (messages, i, userId) => {
    return (
        (i === 0) &&
        (messages[0].sender._id !== userId &&
        messages[0].sender._id)
    );
}

export const isSameSender = (messages, m, i) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined)
    );
}

export const showLatestMessage = (chat, myUsername) => {
    return (chat.latestMessage && (
        chat.isGroupChat ? (
            // Group Chat
            `${chat.latestMessage?.sender.username === myUsername ?
                'You' : chat.latestMessage?.sender.username}: ${chat.latestMessage?.text}`) : (
            
            // Personal Chat
            (chat.latestMessage?.sender.username === myUsername ? 'You: ' : '') + chat.latestMessage?.text
        )
    ))
}