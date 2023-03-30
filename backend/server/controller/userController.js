import User from "../model/User.js";

export const people = async (req, res)=>{
    const users = await User.find().select({_id: 1, username: 1})
    res.json(users);
}