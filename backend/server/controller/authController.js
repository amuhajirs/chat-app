import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import bcrypt from 'bcrypt';
import ResetPasswordEmail from '../config/resetPasswordEmail.js';
import ResetToken from '../model/ResetToken.js';
import { v2 as cloudinary } from 'cloudinary'

// POST /api/auth/register
export const register = async (req, res)=>{
    const { email, username, password } = req.body;
    let error = {};

    if(!email || !username || !password) {
        if(req.file) {
            cloudinary.api.delete_resources([req.file.filename]);
        }
        return res.status(400).json({message: 'email, username, password field must be filled'});
    }

    const checkEmail = await User.findOne({email});
    const checkUsername = await User.findOne({username});

    if(checkEmail){
        error.email = 'Email already exists';
    }
    if(checkUsername){
        error.username = 'Username already exists';
    };

    try {
        await User.create({email, username, password, avatar: req.file ? req.file.path : undefined});
    } catch (err) {
        if(req.file) {
            cloudinary.api.delete_resources([req.file.filename]);
        }
        return res.status(400).json({message: error});
    }

    res.json({message: 'Register success'});
}

// POST /api/auth/login
export const login = async (req, res)=>{
    const { emailUsername, password } = req.body;

    let user = await User.findOne({
        $or: [
            {email: emailUsername},
            {username: emailUsername}
        ]
    }).select(['-chats', '-friends']);

    if(!user){
        return res.status(401).json({message: 'Bad Credentials'});
    }

    // Check Password
    const checkPassword = await bcrypt.compare(password, user.password);
    
    if(!checkPassword){
        return res.status(401).json({message: 'Bad Credentials'});
    }

    // Generate JWT Token
    const token = jwt.sign(
        {_id: user._id, username: user.username},
        process.env.JWT_KEY,
        {expiresIn: '30d'}
    );

    // Set Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
    });

    user.password = undefined;

    res.json({login: true, data: user});
}

// PATCH /api/auth/update
export const updateUser = async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select(['-chats', '-friends']);

    if(req.file) {
        // Delete previous avatar from cloudinary
        if(user.avatar!=='/default-avatar') {
            const index = user.avatar.indexOf('chatapp/profile');
            console.log(user.avatar.slice(index));
            cloudinary.api.delete_resources([user.avatar.slice(index)]);
        }

        user.avatar = process.env.CLOUD_URL + req.file.filename;
    }

    if(username) {
        user.username = username;
    }

    if(email) {
        user.email = email;
    }

    if(newPassword) {
        // Check Password
        const checkPassword = await bcrypt.compare(currentPassword, user.password);
        
        if(!checkPassword){
            return res.status(401).json({message: 'Wrong Password'});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    try {
        await user.save();
    } catch (err) {
        if(req.file) {
            cloudinary.api.delete_resources([req.file.filename]);
        }
        return res.status(400).json({message: err.message});
    }

    user.password = undefined;

    res.json({data: user});
}

// DELETE /api/auth/delete-avatar
export const deleteAvatar = async (req, res) => {
    const user = await User.findById(req.user._id).select(['-chats', '-friends']);

    // Delete previous avatar from cloudinary
    if(user.avatar!=='/default-avatar') {
        const index = user.avatar.indexOf('chatapp/profile');
        console.log(user.avatar.slice(index));
        cloudinary.api.delete_resources([user.avatar.slice(index)]);
    }

    user.avatar = '/default-avatar.png';
    await user.save();

    res.json({data: user});
}

// POST /api/auth/forgot
export const forgot = async (req, res)=>{
    const {email} = req.body
    const user = await User.findOne({email: email});

    if(!user){
        return res.json({message: 'Account not found'});
    }

    // Generate JWT Token
    const token = jwt.sign(
        {email: user.email,},
        process.env.RESET_PASSWORD_KEY,
        {expiresIn: '1h'}
    );

    try {
        await ResetPasswordEmail(user.username, user.email, req.get('host'), token);
        await ResetToken.create({token});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.json({message: `link has been sent to ${email}`});
}

// POST /api/auth/verify
export const verify = async (req, res)=>{
    const token = req.body.token;
    const verify = await ResetToken.findOne({token});

    if(token && verify){
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
            res.json({email: decoded.email});
        } catch (err) {
            res.status(400).json({message: false});
        }
    } else {
        res.status(400).json({message: false});
    }
}

// POST /api/auth/reset
export const reset = async (req, res)=>{
    const {token, password} = req.body;
    const verify = await ResetToken.findOne({token});

    if(verify){
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.findOneAndUpdate({email: decoded.email}, {password: hashedPassword});

            await verify.deleteOne();
        } catch (error) {
            return res.status(400).json({message: 'Invalid Token'});
        }
    } else{
        return res.status(400).json({message: 'Invalid Token'});
    }

    res.json({message: 'Reset password success'});
}

// GET /api/auth/logout
export const logout = (req, res)=>{
    // Clear Cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
    });
    res.json({message: 'Logged Out'});
}

// GET /api/auth/loggedin
export const loggedIn = async (req, res)=>{
    const token = req.cookies.token;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findById(decoded._id)
                .select(['-password', '-chats', '-friends']);

            res.json({login: true, data: user});
        } catch (err) {
            res.status(401).json({login: false, message: err.message});
        }
    } else {
        res.status(401).json({login: false});
    }
};

// GET /api/auth/data
export const getData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friends', ['-password', '-friends', '-chats'])
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
                },
                options: {
                    sort: {updatedAt: -1}
                }
            })
            .select('-password');

        const data = {
            user,
            friends: user.friends,
            chats: user.chats
        }

        data.user.password = undefined;
        data.user.friends = undefined
        data.user.chats = undefined

        res.json({login: true, data: data});
    } catch (err) {
        res.status(401).json({login: false, message: err.message});
    }
}