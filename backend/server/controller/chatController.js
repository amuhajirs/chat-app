import Chat from "../model/Chat.js";
import Message from "../model/Message.js";

// GET /api/chat
export const allChats = async (req, res)=>{
    const chats = await Chat.find({
        users: { $in: req.user._id }
    })
        .populate('latestMessage')
        .populate('users', ['-password', '-friends'])
        .populate('groupAdmin', ['-password', '-friends'])
        .sort([['updatedAt', 'desc']]);
    res.json({data: chats});
}

// POST /api/chat/
export const accessPersonalChat = async (req, res)=>{
    const { userId } = req.body;

    if(!userId) {
        return res.status(400).json({message: 'userId field must be filled'})
    }

    // Check if the chat exist
    let chat;
    try {
        chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                {users: {$in: req.user._id}},
                {users: {$in: userId}}
            ]
        });
    } catch (err) {
        return res.status(400).json({message: err.message})
    }

    if(chat) {
        return res.json({message: 'Chat already exist', data: chat})
    }

    // If not exist, then create the chat
    try {
        await Chat.create({
            chatName: 'test',
            isGroupChat: false,
            users: [
                req.user._id,
                userId
            ]
        })
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'New chat has been created'});
}

// POST /api/chat/group
export const createGroup = async (req, res)=>{
    const { users, chatName, chatDesc } = req.body;

    console.log(users.length)
    if(!users || !chatName) {
        return res.status(400).json({message: 'users and chatName field must be filled'});
    }

    if(users.length < 2) {
        return res.status(400).json({message: 'you need at least 3 users to create a group'});
    }

    users.push(req.user._id);

    try {
        await Chat.create({
            chatName: chatName,
            chatDesc: chatDesc || '',
            isGroupChat: true,
            groupAdmin: req.user._id,
            users: users
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: 'Group Chat has been created'});
}

// PUT /api/group/:id/update
export const updateGroup = async (req, res)=>{
    const { id } = req.params;
    const { chatName, chatDesc } = req.body;

    if(!chatName) {
        return res.status(400).json({message: 'chatName field must be filled'});
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
    const { id } = req.params;
    const { userId } = req.body;

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
    const { id } = req.params;
    const { userId } = req.body;

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
            .sort({createdAt: 'asc'});
    } catch (err) {
        return res.json({message: err.message})
    }

    res.json({data: messages});
}