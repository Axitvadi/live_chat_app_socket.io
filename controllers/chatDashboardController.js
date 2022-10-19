const User = require('../models/user');

exports.chatPage = async (req, res) => {
  const users = await User.find();
  console.log(users);
    res.render("chat",{data:users});
  };