const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const senderEmail = process.env.EMAIL
const baseUrl = process.env.BASE_URL

// <<<<<<<<<<<<<<<<<<<<< SIGNUP PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.signupPage = async (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");
    res.render("signup", {success, error});
};

exports.signup = async (req, res) => {
    try {
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : password
        });

         await user.save();

        req.flash(
            "success",
            "You Are Successfully SignUp Please Verify With Email"
        );

        return res.status(200).redirect("/login");
    } catch (error) {
        return res.status(401).redirect("/signup");
    }
};

// <<<<<<<<<<<<<<<<<<<<< LOGIN PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.loginPage = async (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");
    res.render("login", {success, error});
};
exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const {password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            req.flash("error", "Plz SignUp");
            return res.redirect("/signup");
        }

        const matchPw = await bcrypt.compare(password, user.password);
        if (!matchPw) {
            req.flash('error', 'Password Is Incorrect')
            return res.redirect("/login");
        }
        req.session.user = user;
        user.active = true
        await user.save();
        return res.redirect("/chatpage");
    } catch (error) {
        return res.status(500).redirect("/signup");
    }
};

// <<<<<<<<<<<<<<<<<<<<< LOGOUT CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.logout = async (req, res, next) => {
    try {
        req.logout(function (err) {
            if (err) {
                throw err
            }
            return res.redirect("/login");
        });

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
    return res.render("forgotpassword", {success, error});
};

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.redirect("/signup"); // signup
        }

        const token = jwt.sign(
            {
                email: user.email, // unique
            },
            process.env.SECRET_KEY,
            {expiresIn: "10m"}
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

         await transporter.sendMail({
            from: `Chat App <${senderEmail}>`, // sender address
            to: user.email , // list of receivers
            subject: "Reset Password", // Subject line
            //   text: "Hello world?", // plain text body
            html: `<a href="${baseUrl}/reset-password?token=${token}">Click Here For Reset Password</a>`, // html body
        });

        req.flash("success", "Mail Successfull Sent");
        return res.redirect("/login");
    } catch (error) {
        return res.redirect("/forgot-password");
    }
};

// <<<<<<<<<<<<<<<<<<<<< RESER-PASSWORD PAGE RENDER AND CONTROLLER >>>>>>>>>>>>>>>>>>>>
exports.resetPasswordPage = async (req, res) => {
    const token = req.query.token;
    res.render("resetpassword", {token});
};

exports.resetPassword = async (req, res) => {
    try {
        const newPw = req.body.new_password;
        const confirmPw = req.body.confirm_password;
        const token = req.body.token;

        if (newPw !== confirmPw) {
            return res.redirect("/reset-password");
        }

        const decodeToken =  jwt.verify(token, process.env.SECRET_KEY);

        const userEmail = decodeToken.email;
        const user = await User.findOne({email: userEmail});

        user.password = confirmPw;
         await user.save();
        res.flash("success", "Password is updated...")
        return res.redirect("/login")
    } catch (error) {
        console.log(error);
    }
};

exports.logOut = async (req, res, next) => {
    try {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/login');
        });
    } catch (error) {
        console.log(error.message);
    }
}

exports.editProfilePage = async (req, res, next) => {
    try {
        res.render('editProfile')
    } catch (error) {
        console.log(error.message);
    }
}

exports.editProfile = async (req, res, next) => {
    try {
        const id = req.session.user._id
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            image: (req.files.image !== 'undefined' && req.files.image) ? `/upload/images/${req.files.image[0].filename}`: null
        }
        const updateUser = await User.findByIdAndUpdate(id, newUser, {new: true})

        if (!updateUser){
            throw new Error('User Not found')
        }

        return res.redirect("/chatpage")
    } catch (error) {
        console.log(error.message)
    }
}
