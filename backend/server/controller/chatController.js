import Message from "../model/Message.js";

export const history = async (req, res)=>{
    const { id } = req.params;

    const messages = await Message.find({
        $or: [
            {sender: req.user._id, recipient: id},
            {sender: id, recipient: req.user._id}
        ]
    }).sort({createdAt: 'asc'});

    res.json({messages});
}