import Chat from "../model/Chat.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

// GET /api/chats
export const myChats = async (req, res) => {
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

// POST /api/chats
export const accessPersonalChat = async (req, res) => {
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

// POST /api/chats/group
export const createGroup = async (req, res) => {
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

    users.forEach(async (u) => {
        try {
            await User.findByIdAndUpdate(u, {$push: {chats: chat._id}});
        } catch (err) {
            return res.status(400).json({message: err.message})
        }
    });

    chat = await chat
        .populate('users groupAdmin', ['-password', '-friends', '-chats']);

    res.json({message: 'Group Chat has been created', data: chat});
}

// PUT /api/chats/group/update
export const updateGroup = async (req, res) => {
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

// PUT /api/chats/group/invite
export const inviteToGroup = async (req, res) => {
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

// PUT /api/chats/group/kick
export const kickFromGroup = async (req, res) => {
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

// GET /api/chats/:id
export const history = async (req, res) => {
    const { id } = req.params;
    let messages;

    try {
        messages = await Message.find({chat: id})
            .populate('sender', ['-password', '-friends', '-chats'])
            .sort({createdAt: 'asc'});
    } catch (err) {
        return res.status(400).json({message: err.message})
    }

    res.json({data: messages});
}

// POST /api/chats/send
export const sendMessage = async (req, res) => {
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

// PUT /api/chats/add
export const addChat = async (req, res) => {
    const { chatId } = req.body;

    let chat
    try {
        chat = await Chat.findById(chatId)
            .populate('users groupAdmin', ['-password', '-friends', '-chats'])
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    select: ['-password', '-friends', '-chats']
                }
            });
    } catch (err) {
        return res.status(400).json({message: err.message});
    }

    if(chat) {
        await User.findByIdAndUpdate(req.user._id, {$addToSet: {chats: chat._id}});
    } else {
        return res.status(400).json({message: 'chat not found'})
    }

    res.json({message: 'chat added', data: chat});
}

// PUT /api/chats/remove
export const removeChat = async (req, res) => {
    const { chatId } = req.body;

    await User.findByIdAndUpdate(req.user._id, {$pull: {chats: chatId}});
    res.json({message: 'chat removed'});
}

// DELETE /api/chats/:id/delete
export const deletePersonalChat = async (req, res) => {

}

// DELETE /api/chats/group/:id/delete
export const deleteGroup = async (req, res) => {

}