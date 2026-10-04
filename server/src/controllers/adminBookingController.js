const Booking = require("../models/Booking");

// GET /api/admin/bookings?status=active|completed|cancelled
async function getAllBookings(req, res) {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
        .populate({
            path: "application",
            populate: [
                { path: "caretaker", select: "name username email" },
                { path: "post", populate: { path: "pet", populate: { path: "owner", select: "name username email" } } }
            ]
        })
        .sort({ createdAt: -1 });
    res.json(bookings);
}

module.exports = { getAllBookings };
