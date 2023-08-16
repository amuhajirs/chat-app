import Chat from "../model/Chat.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

// GET /api/chat
export const myChats = async (req, res)=>{
    const chats = await User.findById(req.user._id)
        .populate({
            path: 'chats',
            populate: {
                path: 'users groupAdmin',
                select: ['-password', '-friends', '-chats']
            }
        })
        .populate({
            path: 'chats',
            populate: {
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    select: ['-password', '-friends', '-chats']
                }
            }
        })
        .select('chats')
        .sort([['updatedAt', 'desc']]);
    res.json({data: chats.chats});
}

// POST /api/chat/
export const accessPersonalChat = async (req, res)=>{
    const { userId } = req.body;

    if(!userId) {
        return res.status(400).json({message: 'userId field must be filled'})
    }

    // Check if the chat exist
    let chat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            {users: {$in: req.user._id}},
            {users: {$in: userId}}
        ]
    })
        .populate('users', ['-password', '-friends', '-chats'])
        .populate({
            path: 'latestMessage',
            populate: {
                path: 'sender',
                select: ['-password', '-friends', '-chats']
            }
        });

        
    if(chat) {
        await User.findByIdAndUpdate(req.user._id, {$addToSet: {chats: chat._id}});
        return res.json({message: 'Chat already exist', data: chat})
    }

    // If doesn't exist, then create the chat
    try {
        chat = await Chat.create({
            isGroupChat: false,
            users: [
                req.user._id,
                userId
            ]
        });

        await User.findByIdAndUpdate(req.user._id, {$push: {chats: chat._id}});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    chat = await chat.populate('users', ['-password', '-friends', '-chats'])

    res.json({message: 'New chat has been created', data: chat});
}

// POST /api/chat/group
export const createGroup = async (req, res)=>{
    const { chatName, chatDesc, users } = req.body;

    if(!users || !chatName) {
        return res.status(400).json({message: 'users and chatName field must be filled'});
    }

    if(users.length < 2) {
        return res.status(400).json({message: 'you need at least 3 users to create a group'});
    }

    users.push(req.user._id);

    let chat;

    try {
        chat = await Chat.create({
            chatName: chatName,
            chatDesc: chatDesc || '',
            isGroupChat: true,
            groupAdmin: req.user._id,
            users: users
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    await User.findByIdAndUpdate(req.user._id, {$push: {chats: chat._id}});

    chat = await chat
        .populate('users groupAdmin', ['-password', '-friends']);

    res.json({message: 'Group Chat has been created', data: chat});
}

// PUT /api/group/:id/update
export const updateGroup = async (req, res)=>{
    const { id, chatName, chatDesc } = req.body;

    if(!chatName || !id) {
        return res.status(400).json({message: 'id and chatName field must be filled'});
    }

    try {
        await Chat.findByIdAndUpdate(id, {chatName, chatDesc});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'Group Chat updated successfully'});
}

// PUT /api/chat/:id/invite
export const inviteToGroup = async (req, res)=>{
    const { id, userId } = req.body;

    if(!userId || !id) {
        return res.status(400).json({message: 'id and userId field must be filled'});
    }

    try {
        await Chat.findByIdAndUpdate(id, {
            $push: {
                users: userId
            }
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'User has been invited'});
}

// PUT /api/chat/:id/kick
export const kickFromGroup = async (req, res)=>{
    const { id, userId } = req.body;

    if(!userId || !id) {
        return res.status(400).json({message: 'id and userId field must be filled'});
    }

    try {
        await Chat.findByIdAndUpdate(id, {
            $pull: {
                users: userId
            }
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'User has been kicked'});
}

// GET /api/chat/:id
export const history = async (req, res)=>{
    const { id } = req.params;
    let messages;

    try {
        messages = await Message.find({chat: id})
            .populate('sender', ['-password', '-friends'])
            .sort({createdAt: 'asc'});
    } catch (err) {
        return res.status(400).json({message: err.message})
    }

    res.json({data: messages});
}

// POST /api/chat/send
export const sendMessage = async (req, res)=>{
    const { chat, text } = req.body;

    if(!chat || !text) {
        return res.status(400).json({message: 'sender, chat, text field must be filled'});
    }

    let message
    try {
        message = await Message.create({sender: req.user._id, chat, text});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    try {
        await Chat.findByIdAndUpdate(chat, {latestMessage: message._id});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'message has been saved to database'});
}