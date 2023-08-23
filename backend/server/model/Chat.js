import {Schema, model} from "mongoose";

const chatSchema = new Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    picture: {
        type: String
    },
    chatName: {
        type: String,
        trim: true
    },
    chatDesc: {
        type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps:true, versionKey: false});

const Chat = model('Chat', chatSchema);

export default Chat;