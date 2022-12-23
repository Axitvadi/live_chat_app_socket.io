const User = require('../models/user');

exports.chatPage = async (req, res) => {

  const userId = req.session.user._id
  const user1 = User.findById(userId);
  const users1 = User.find({ _id: { $ne : userId} });

  const [users, user] = await Promise.all([users1, user1])
  res.render("chat",{ users, logInUser: user});

  };
