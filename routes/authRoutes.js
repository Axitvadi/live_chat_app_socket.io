const express = require("express");
const router = express.Router();

const {
  loginPage,
  login,
  signupPage,
  signup,
  forgotPasswordPage,
  resetPasswordPage,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.get("/login", loginPage);
router.post("/login", login);

router.get("/signup", signupPage);
router.post("/signup", signup);

router.get("/forgot-password", forgotPasswordPage);
router.post("/forgot-password", forgotPassword);

router.get("/reset-password", resetPasswordPage);
router.post("/reset-password", resetPassword);

module.exports = router;
