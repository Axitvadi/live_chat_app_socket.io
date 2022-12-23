const express = require("express");
const router = express.Router();
const upload = require('../multer/multer')
const {isAuthentication, isNotAuthentication } = require("../middlware/authentication")
const {
  loginPage,
  login,
  signupPage,
  signup,
  forgotPasswordPage,
  resetPasswordPage,
  forgotPassword,
  resetPassword,
  logOut,
  editProfilePage,
  editProfile
} = require("../controllers/authController");


router.get("/login",isNotAuthentication, loginPage);
router.post("/login",isNotAuthentication, login);

router.get("/signup",isNotAuthentication, signupPage);
router.post("/signup",isNotAuthentication, signup);

router.get("/forgot-password",isNotAuthentication, forgotPasswordPage);
router.post("/forgot-password",isNotAuthentication, forgotPassword);

router.get("/reset-password",isNotAuthentication, resetPasswordPage);
router.post("/reset-password",isNotAuthentication, resetPassword);

router.get("/log-out",isAuthentication, logOut)

router.get("/edit-profile" , editProfilePage)
router.post("/edit-profile", upload.fields([{name: "image"}]) ,editProfile)

module.exports = router;
