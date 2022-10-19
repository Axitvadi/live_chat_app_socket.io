const express = require("express");
const router = express.Router();

const { chatPage } = require("../controllers/chatDashboardController");

router.get("/chatpage", chatPage);

module.exports = router;
