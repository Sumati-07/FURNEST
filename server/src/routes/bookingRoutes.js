const express = require("express");

const router = express.Router();

const {
    getMyBookings,
    completeBooking,
    cancelBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/auth");

router.get("/", protect, getMyBookings);

router.patch(
    "/:bookingId/complete",
    protect,
    completeBooking
);

router.patch(
    "/:bookingId/cancel",
    protect,
    cancelBooking
);

module.exports = router;