const Chat = require("../models/Chat");

const chat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    // var isChatAvailable = await Chat.find({
    //     isGroupChat: false,
    //     $and: [
    //         {users:}
    //     ]
    // });
};