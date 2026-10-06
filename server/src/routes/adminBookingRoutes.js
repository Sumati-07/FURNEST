const express = require("express");
const router = express.Router();
const { getAllBookings } = require("../controllers/adminBookingController");
const { protect } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", protect, isAdmin, getAllBookings);

module.exports = router;
