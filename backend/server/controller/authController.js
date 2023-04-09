import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import bcrypt from 'bcrypt';
import ResetPasswordEmail from '../config/resetPasswordEmail.js';
import ResetToken from '../model/ResetToken.js';

export const register = async (req, res)=>{
    const { email, username, password } = req.body;
    let error = {};

    const checkEmail = await User.findOne({email});
    const checkUsername = await User.findOne({username});

    if(checkEmail){
        error.email = 'Email already exists'
    }
    if(checkUsername){
        error.username = 'Username already exists'
    };

    try {
        await User.create({email, username, password});
    } catch (err) {
        return res.status(400).json({error});
    }

    res.json({message: 'Register success'});
}

export const login = async (req, res)=>{
    const { emailUsername, password } = req.body;

    let user = await User.findOne({email: emailUsername});

    if(!user){
        user = await User.findOne({username: emailUsername});

        if(!user){
            return res.status(401).json({message: 'Bad Credentials'});
        }
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
    res.json({message: 'Login Success'});
}

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
        return res.status(500).json({message: 'yea'});
    }

    res.json({message: `link has been sent to ${email}`});
}

export const verify = async (req, res)=>{
    const token = req.body.token;
    const verify = await ResetToken.findOne({token});

    if(token && verify){
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
            res.json({email: decoded.email});
        } catch (err) {
            res.status(400).json(false);
        }
    } else {
        res.status(400).json(false);
    }
}

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

export const logout = (req, res)=>{
    // Clear Cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
    });
    res.json({message: 'Logged Out'});
}

export const loggedIn = async (req, res)=>{
    const token = req.cookies.token;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findById(decoded._id).select('-password');
            res.json({login: user});
        } catch (err) {
            res.json({login: false});
        }
    } else {
        res.json({login: false});
    }
};