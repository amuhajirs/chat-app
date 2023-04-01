import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { config } from "dotenv";
config({path: '.env'});

const authMiddleware = async (req, res, next)=>{
    const token = req.cookies.token;
    
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = await User.findById(decoded._id).select('-password');
            next();
        } catch (err) {
            res.status(401).json({message: 'Unauthorized'});
        }
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
};

export default authMiddleware;