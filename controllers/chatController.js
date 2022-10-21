const Message = require("../models/message");

module.exports = (socket, io) => {
  //msg to join user
  // socket.on("joinUser", async (data) => {
  //   socket.broadcast.emit('joinUserInfo', data)
  // });

  // // to all users accept join user
  // // socket.broadcast.emit("message", "User has Joined chat !");

  // // when user disconnect
  // socket.on("left", (name) => {
  //   //message to all users
  //   // io.emit("message", `${name} has left the chat`);
  //   socket.broadcast.emit("message", `${name} has left the chat`);
  // });

  socket.on("message", async (msjobj) => {

    const {userId, usermsj} = msjobj

    const newMsg = {
      senderId : userId,
      receiverId : "",
      message: usermsj
    };
    
    const message = await Message.create(newMsg);

    socket.broadcast.emit("serverMsj", msjobj);
  });
};
