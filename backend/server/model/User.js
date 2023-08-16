import {Schema, model} from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: {
        type: String,
        required: 'Email address is required',
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'invalid email'],
    },
    username: {
        type: String,
        required: 'Username is required',
        unique: true,
        trim: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        default: '/default-avatar.png'
    },
    password: {
        type: String,
        required: 'Password is required',
        minLength: 8,
        trim: true
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }]
}, {timestamps:true, versionKey: false});

userSchema.pre('save', async function(){
    const user = this;

    const salt = await bcrypt.genSalt(10);

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, salt);
    }
});

const User = model('User', userSchema);

export default User;