const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        caretaker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // Filled in by the matching service at creation time — a real,
        // if simple, AI-derived score, not a placeholder.
        matchScore: { type: Number },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
