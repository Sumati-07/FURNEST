const mongoose = require("mongoose");

// A report can target a user, a post, or a booking (for a care complaint).
// Only one of targetUser/targetPost/targetBooking will be set, matching
// `targetType`.
const reportSchema = new mongoose.Schema(
    {
        reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        targetType: { type: String, enum: ["user", "post", "booking"], required: true },
        targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        targetPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        targetBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        reason: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["open", "resolved", "dismissed"],
            default: "open"
        },
        adminNote: { type: String, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
