import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res)=>{
    const { email, username, password } = req.body;

    try {
        await User.create({email, username, password});
    } catch (err) {
        return res.status(400).json({message: err});
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
        {id: user._id, username: user.username},
        process.env.JWT_KEY,
        {expiresIn: '1d'}
    );

    // Set Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production' ? true : false,
    });
    res.json({message: 'Login Success'});
}

export const logout = (req, res)=>{
    // Clear Cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production' ? true : false,
    });
    res.json({message: 'Logged Out'});
}

export const loggedIn = async (req, res)=>{
    const token = req.cookies.token;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findById(decoded.id).select('-password');
            res.json({login: user});
        } catch (err) {
            res.json({login: false});
        }
    } else {
        res.json({login: false});
    }
};