const express = require("express");
const router = express.Router();
const { getOrCreateChat, getMyChats, getMessages, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", getOrCreateChat);
router.get("/", getMyChats);
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/messages", sendMessage);

module.exports = router;
