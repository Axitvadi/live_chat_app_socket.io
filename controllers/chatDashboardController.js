const User = require('../models/user');

exports.chatPage = async (req, res) => {
  const users = await User.find();
  res.render("chat",{users:users, userName: 'dhaval'});
  };