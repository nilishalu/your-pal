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
    console.log(req.user)
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("admin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (data) => {
           data = await User.populate(data, {
            path: "latestMessage.sender",
            select: "name picture email"
           })

           res.status(200).send(data);
        })
    } catch (error) {
        res.status(400).send({message: "An error occurred"});
    }
};

const createGroup = async (req, res) => {
    let { name, users } = req.body;
    if (!name || !users) {
        return res.status(400).send({ message: "Please fill all details" });
    }

    users = JSON.parse(users);

    users.push(req.user);

    try {
        const group = await Chat.create({
            chatName: name,
            users: users,
            isGroupChat: true,
            admin: req.user
        });

        const fullChat = await Chat.findOne({ _id: group._id }).populate("users", "-password").populate("admin", "-password");
        
        res.status(200).json(fullChat);
    } catch (error) {
        res.status(400).json({message: "An error occurred"})
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const newName = await Chat.findByIdAndUpdate(chatId, {
        chatName
    },
    { new: true}).populate("users", "-password")
    .populate("admin", "-password");

    if (!newName) {
        res.status(404);
    } else {
        res.json(newName);
    }
};

const addMember = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: {users: userId},
    }, {new: true}).populate("users", "-password")
    .populate("admin", "-password");

    if (!added) {
        res.status(404);
    } else {
        res.json(added);
    }
};

const removeMember = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users: userId},
    }, {new: true}).populate("users", "-password")
    .populate("admin", "-password");

    if (!removed) {
        res.status(404);
    } else {
        res.json(removed);
    }
};

module.exports = { chat, fetchChats, createGroup, renameGroup, addMember, removeMember };