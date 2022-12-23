const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        message: {
            type: String,
        }
    },
    {
        timestamp: true,
    }
);

const message = mongoose.model("message", messageSchema);

module.exports = message;
