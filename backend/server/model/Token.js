import {Schema, model} from "mongoose";

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    expireAt: {
        type: Date,
        index: {
            expires: '0'
        }
    }
}, {timestamps:true, versionKey: false});

const Token = model('Token', tokenSchema);

export default Token;