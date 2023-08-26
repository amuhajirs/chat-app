import User from "../model/User.js";

// GET /api/users/:username
export const searchUser = async (req, res)=>{
    const { username } = req.params;

    const users = await User.findOne({
        _id: { $ne: req.user._id },
        username: username
    })
        .select(['-password', '-friends', '-chats']);

    res.json({data: users});
}

// GET /api/users/friends?search=
export const getFriends = async (req, res)=>{
    const { search } = req.query;

    const friends = await User.find({
        _id: { $in: req.user.friends },
        username: {
            $regex: search ? search : '',
            $options: 'i'
        }
    })
        .select(['-password', '-friends', '-chats'])
        .sort([['displayName', 'asc']]);

    res.json({data: friends});
}

// PUT /api/users/friends/edit
export const editFriends = async (req, res)=>{
    const myUser = req.user;
    const { userId } = req.body;

    const user = await User.findById(userId);

    if(!user) {
        return res.status(400).json({message: 'No user found'});
    }

    if(userId!==myUser._id.toString()){
        // Add friend
        if(!myUser.friends.includes(userId)){
            try {
                await myUser.updateOne({$push: {friends: userId}});
            } catch (err) {
                return res.status(400).json({message: err.message});
            }
            return res.json({message: 'User added to friendlist', data: user});
        }
    
        // Remove friend
        else{
            try {
                await myUser.updateOne({$pull: {friends: userId}});
            } catch (error) {
                return res.status(400).json({message: err.message});
            }
            return res.json({message: 'User removed from friendlist', data: user});
        }
    } 

    res.status(400).json({message: 'You cannot add yourself to your friendlist'});
}