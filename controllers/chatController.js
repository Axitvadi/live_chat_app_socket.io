const Message = require("../models/message");

module.exports = (socket, io) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });
    socket.on("sendMessage", async (messageNew) => {
        const {userId, message, receiverId, name} = messageNew
        const newMsg = {
            senderId: userId,
            receiverId,
            message: message,
        };
        const newMessage = await Message.create(newMsg);
        const result = {
            senderId: newMsg.senderId,
            receiverId: newMsg.receiverId,
            message: newMsg.message,
            name: name,
        }
        socket.to(receiverId).emit("receiveMessage", result);
    });

    socket.on("getMessages", async (message) => {
        const receiverId = message.receiverId;
        const senderId = message.senderId;
        const messageAll = await Message.find({
            $or: [
                {receiverId: receiverId, senderId: senderId},
                {senderId: receiverId, receiverId: senderId}
            ]
        }).populate(["senderId", "receiverId"]);
        socket.emit("allMessages", messageAll)
    })
};
