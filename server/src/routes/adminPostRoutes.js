const express = require("express");
const router = express.Router();
const { getAllPosts, moderatePost } = require("../controllers/adminPostController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.use(protect, isAdmin);
router.get("/", getAllPosts);
router.patch("/:id/moderate", moderatePost);

module.exports = router;
