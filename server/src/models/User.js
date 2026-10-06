const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        // Same account, two hats — no separate caretaker login needed.
        roles: {
            type: [String],
            default: ["owner", "caretaker"]
        },

        is_verified: {
            type: Boolean,
            default: false
        },

        // Admin account flag.
        // Normal users remain false.
        isAdmin: {
            type: Boolean,
            default: false
        },

        // Account status.
        // Admin can suspend/activate users.
        isActive: {
            type: Boolean,
            default: true
        },

        // Filled in as bookings complete — this is what the matching
        // and price-prediction services read from later.
        caretakerStats: {
            completedBookings: {
                type: Number,
                default: 0
            },

            averageRating: {
                type: Number,
                default: 0
            },

            experienceTags: {
                type: [String],
                default: []
            } // e.g. "Dog", "Large breed"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);