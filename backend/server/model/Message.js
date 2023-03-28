import {Schema, model} from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String
    },
}, {timestamps:true, versionKey: false});

const Message = model('Message', messageSchema);

export default Message;