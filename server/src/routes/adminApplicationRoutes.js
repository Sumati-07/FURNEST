const express = require("express");
const router = express.Router();
const { getAllApplications } = require("../controllers/adminApplicationController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", protect, isAdmin, getAllApplications);

module.exports = router;
