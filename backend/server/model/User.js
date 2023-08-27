import {Schema, model} from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    displayName: {
        type: String,
        required: 'Display Name is required'
    },
    username: {
        type: String,
        required: 'Username is required',
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: 'Email address is required',
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'invalid email'],
    },
    avatar: {
        type: String,
        default: '/default-avatar.jpg'
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
    }],
    isOnline: {
        type: Boolean,
        default: false
    }
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