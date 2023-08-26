// Same sender but not me check next message
export const isSameSenderLast = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
}

// Last message but not me
export const isLastMessage = (messages, i, userId) => {
    return (
        (i === messages.length - 1) &&
        (messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id)
    );
}

// Same sender but not me check previous message
export const isSameSenderFirst = (messages, m, i, userId) => {
    return (
        i > 0 &&
        (messages[i - 1].sender._id !== m.sender._id ||
            messages[i - 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
}

// First message but not me
export const isFirstMessage = (messages, i, userId) => {
    return (
        (i === 0) &&
        (messages[0].sender._id !== userId &&
        messages[0].sender._id)
    );
}

// Same sender includes me check next messages
export const isSameSender = (messages, m, i) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined)
    );
}

// Last message includes me
export const isLastMessageIncludeMe = (messages, i) => {
    return (
        (i === messages.length - 1) &&
        messages[messages.length - 1].sender._id
    );
}

// Show latest message
export const showLatestMessage = (chat, myId) => {
    return (chat.latestMessage && (
        chat.isGroupChat ? (
            // Group Chat
            `${chat.latestMessage?.sender._id === myId ?
                'You' : chat.latestMessage?.sender.displayName}: ${chat.latestMessage?.text}`) : (
            
            // Personal Chat
            (chat.latestMessage?.sender._id === myId ? 'You: ' : '') + chat.latestMessage?.text
        )
    ))
}

// Show personal chat
export const showChat = (chat, myId) => {
    return (chat.users[0]._id===myId) ?
            (chat.users[1]) :
            (chat.users[0])
}