const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// <<<<<<<<<<<<<<<<<<<<< SIGNUP PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.signupPage = async (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("signup", { success, error });
};

exports.signup = async (req, res) => {
  try {
    // const password = req.body.password;
    // const hasPw = await bcrypt.hash(password,12);
    const user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    const newUser = await user.save();
    res.status(200).redirect("/signup");
    return req.flash(
      "success",
      "You Are Successfull SignUp Please Verify With Email"
    );
  } catch (error) {
    return res.status(401).redirect("/signup");
  }
};

// <<<<<<<<<<<<<<<<<<<<< LOGIN PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.loginPage = async (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("login", { success, error });
};
exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      return req.flash("error", "Plz SignUp");
      //   return res.redirect("/signup");
    }
    console.log(user);

    const matchPw = await bcrypt.compare(password, user.password);
    if (!matchPw) {
      // return req.flash('error','Password Is Inccorect')

      return res.redirect("/login");
    }

    req.session.user = user.email;

    user.verified = true;
    user.active = true
    await user.save();

    return res.redirect("/chatpage");
  } catch (error) {
    // return req.flash('error','Plz SignUp')
    return res.status(500).redirect("/signup");
  }
};

// <<<<<<<<<<<<<<<<<<<<< LOGOUT CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// <<<<<<<<<<<<<<<<<<<<< FORGOT-PASSWORD PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.forgotPasswordPage = async (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("forgotEmail", { success, error });
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect("/signup"); // signup
    }

    const token = jwt.sign(
      {
        email: user.email, // unique
      },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.APP_PW, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Dhaval "<dhavalkakadiya01@gmail.com>', // sender address
      to: "dhavalkakadiya01@gmail.com", // list of receivers
      subject: "Reset Password", // Subject line
      //   text: "Hello world?", // plain text body
      html: `<a href="http://localhost:3000/reset-password?token=${token}">Click Here For Reset Password</a>`, // html body
    });

    req.flash("success", "Mail Successfull Sent");

    return res.redirect("/forgot-password");
  } catch (error) {
    return res.redirect("/forgot-password");
  }
};

// <<<<<<<<<<<<<<<<<<<<< RESER-PASSWORD PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.resetPasswordPage = async (req, res) => {
  const token = req.query.token;
  console.log(token);
  res.render("resetpassword", { token });
};

exports.resetPassword = async (req, res) => {
  try {
    const newPw = req.body.new_password;
    const confirmPw = req.body.confirm_password;
    const token = req.body.token;
    // console.log("info:", token);

    if (newPw !== confirmPw) {
      return res.redirect("/reset-password");
    }

    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decodeToken);
    const userEmail = decodeToken.email;
    const user = await User.findOne({ email: userEmail });

    user.password = confirmPw;

    const updateUser = await user.save();
  } catch (error) {
    console.log(error);
  }
};
