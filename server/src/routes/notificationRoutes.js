const express = require("express");
const router = express.Router();
const { getMyNotifications, markRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markRead);

module.exports = router;
