const express = require("express");
const router = express.Router();

const {chatPage} = require("../controllers/chatDashboardController");

const {isAuthentication} = require("../middlware/authencation")

router.get("/chatpage", isAuthentication, chatPage);

module.exports = router;
