import User from "../model/User.js";

export const allUsers = async (req, res)=>{
    const { search } = req.query;

    const users = await User.find({
        username: {
            $regex: search ? search : '',
            $options: 'i'
        }
    })
        .select({_id: 1, username: 1, avatar: 1})
        .sort([['username', 'asc']]);

    res.json(users);
}

export const getFriends = async (req, res)=>{
    const { search } = req.query;
    const friends = req.user.friends;

    const friendsDetail = await User.find({
        _id: {
            $in: friends
        },
        username: {
            $regex: search ? search : '',
            $options: 'i'
        }
    })
        .select({_id: 1, username: 1, avatar: 1})
        .sort([['username', 'asc']]);

    res.json({friends: friendsDetail});
}

export const editFriends = async (req, res)=>{
    const myUser = req.user;
    const { user } = req.body;

    if(user!==myUser._id.toString()){
        // Add friend
        if(!myUser.friends.includes(user)){
            try {
                await myUser.updateOne({$push: {friends: user}});
            } catch (err) {
                return res.status(400).json({message: err.message});
            }
            return res.json({message: 'User added to friendlist'});
        }
    
        // Remove friend
        else{
            try {
                await myUser.updateOne({$pull: {friends: user}});
            } catch (error) {
                return res.status(400).json({message: err.message});
            }
            return res.json({message: 'User removed from friendlist'});
        }
    } 

    res.status(400).json({message: 'You cannot add yourself to your friendlist'});
}