const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminDashboardController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", protect, isAdmin, getDashboardStats);

module.exports = router;
