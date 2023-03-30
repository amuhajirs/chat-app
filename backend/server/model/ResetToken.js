import {Schema, model} from "mongoose";

const resetTokenSchema = new Schema({
    token: {
        type: String,
    },
}, {timestamps:true, versionKey: false});

const ResetToken = model('ResetToken', resetTokenSchema);

export default ResetToken;