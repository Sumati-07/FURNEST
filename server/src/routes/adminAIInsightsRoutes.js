const express = require("express");
const router = express.Router();
const { getAIInsights } = require("../controllers/adminAIInsightsController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", protect, isAdmin, getAIInsights);

module.exports = router;
