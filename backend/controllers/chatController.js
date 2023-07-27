const Chat = require("../models/Chat");
const User = require("../models/Chat");

const chat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    var isChatAvailable = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password")
       .populate("latestMessage")

    isChatAvailable = await User.populate(isChatAvailable, {
        path: 'latestMessage.sender',
        select: "name picture email"
    });

    if (isChatAvailable.length > 0) {
        res.send(isChatAvailable[0]);
    } else {
        var nChat = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const newChat = await Chat.create(nChat);

            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400).json({message: error});
        }
    }
};

const fetchChats = async (req, res) => {
    
};

module.exports = { chat, fetchChats };