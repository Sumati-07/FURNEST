const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
        terms: { type: String },
        amount: { type: Number },
        paymentStatus: {
            type: String,
            enum: ["simulated_pending", "simulated_paid"],
            default: "simulated_pending"
        },
        startDate: { type: Date },
        endDate: { type: Date },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
