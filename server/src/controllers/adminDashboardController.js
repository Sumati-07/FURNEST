const User = require("../models/User");
const Pet = require("../models/Pet");
const Post = require("../models/Post");
const Application = require("../models/Application");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Report = require("../models/Report");

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
    const [
        userCount,
        activeUserCount,
        petCount,
        adoptionPostCount,
        temporaryPostCount,
        applicationCount,
        activeBookingCount,
        completedBookingCount,
        reviewCount,
        openReportCount
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: { $ne: false } }),
        Pet.countDocuments({ isRemoved: { $ne: true } }),
        Post.countDocuments({ type: "adoption", isRemoved: { $ne: true } }),
        Post.countDocuments({ type: "temporary", isRemoved: { $ne: true } }),
        Application.countDocuments(),
        Booking.countDocuments({ status: "active" }),
        Booking.countDocuments({ status: "completed" }),
        Review.countDocuments({ isRemoved: { $ne: true } }),
        Report.countDocuments({ status: "open" })
    ]);

    res.json({
        userCount,
        activeUserCount,
        suspendedUserCount: userCount - activeUserCount,
        petCount,
        adoptionPostCount,
        temporaryPostCount,
        applicationCount,
        activeBookingCount,
        completedBookingCount,
        reviewCount,
        openReportCount
    });
}

module.exports = { getDashboardStats };
