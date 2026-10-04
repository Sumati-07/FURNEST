const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        ], // always exactly two users
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // optional context, e.g. "start a chat" from a post
        lastMessageAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

chatSchema.index({ participants: 1 });

module.exports = mongoose.model("Chat", chatSchema);
