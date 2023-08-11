import {Schema, model} from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    text: {
        type: String
    },
}, {timestamps:true, versionKey: false});

const Message = model('Message', messageSchema);

export default Message;