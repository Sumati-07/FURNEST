const express = require("express");
const router = express.Router();
const { getAllReviews, moderateReview } = require("../controllers/adminReviewController");
const { protect } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.use(protect, isAdmin);
router.get("/", getAllReviews);
router.patch("/:id/moderate", moderateReview);

module.exports = router;
