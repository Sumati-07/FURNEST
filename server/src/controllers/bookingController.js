const Booking = require("../models/Booking");
const Application = require("../models/Application");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");


// GET /api/bookings
// Returns bookings where the current user is either owner or caretaker.
async function getMyBookings(req, res) {
    const bookings = await Booking.find()
        .populate({
            path: "application",
            populate: [
                {
                    path: "caretaker",
                    select: "name username email avatar caretakerStats"
                },
                {
                    path: "post",
                    populate: {
                        path: "pet",
                        populate: {
                            path: "owner",
                            select: "name username email avatar"
                        }
                    }
                }
            ]
        })
        .sort({ createdAt: -1 });

    const myBookings = bookings.filter((booking) => {
        const application = booking.application;

        if (!application || !application.post || !application.post.pet) {
            return false;
        }

        const ownerId = application.post.pet.owner?._id;
        const caretakerId = application.caretaker?._id;

        return (
            String(ownerId) === String(req.userId) ||
            String(caretakerId) === String(req.userId)
        );
    });

    res.json(myBookings);
}


// PATCH /api/bookings/:bookingId/complete
async function completeBooking(req, res) {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "application",
            populate: {
                path: "post",
                populate: {
                    path: "pet"
                }
            }
        });

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    const ownerId = booking.application?.post?.pet?.owner;
    const caretakerId = booking.application?.caretaker;

    if (
        String(ownerId) !== String(req.userId) &&
        String(caretakerId) !== String(req.userId)
    ) {
        return res.status(403).json({
            message: "You are not part of this booking"
        });
    }

    if (booking.status !== "active") {
        return res.status(400).json({
            message: "Only active bookings can be completed"
        });
    }

    booking.status = "completed";
    await booking.save();

    // Update caretaker statistics
    await User.findByIdAndUpdate(caretakerId, {
        $inc: {
            "caretakerStats.completedBookings": 1
        }
    });

    // Close the original post
    if (booking.application?.post?._id) {
        await Post.findByIdAndUpdate(
            booking.application.post._id,
            { status: "closed" }
        );
    }

    // Notify the other party
    const otherUserId =
        String(ownerId) === String(req.userId)
            ? caretakerId
            : ownerId;

    if (otherUserId) {
        await Notification.create({
            user: otherUserId,
            type: "booking_completed",
            content: "A FURNEST booking has been marked as completed. You can now leave a review."
        });
    }

    res.json({
        message: "Booking completed successfully",
        booking
    });
}


// PATCH /api/bookings/:bookingId/cancel
async function cancelBooking(req, res) {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "application",
            populate: {
                path: "post",
                populate: {
                    path: "pet"
                }
            }
        });

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    const ownerId = booking.application?.post?.pet?.owner;
    const caretakerId = booking.application?.caretaker;

    if (
        String(ownerId) !== String(req.userId) &&
        String(caretakerId) !== String(req.userId)
    ) {
        return res.status(403).json({
            message: "You are not part of this booking"
        });
    }

    if (booking.status !== "active") {
        return res.status(400).json({
            message: "Only active bookings can be cancelled"
        });
    }

    booking.status = "cancelled";
    await booking.save();

    if (booking.application?.post?._id) {
        await Post.findByIdAndUpdate(
            booking.application.post._id,
            { status: "open" }
        );
    }

    res.json({
        message: "Booking cancelled",
        booking
    });
}


module.exports = {
    getMyBookings,
    completeBooking,
    cancelBooking
};