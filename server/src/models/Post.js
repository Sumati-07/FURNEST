const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },
        type: {
            type: String,
            enum: ["temporary", "adoption"],
            required: true
        },
        startDate: { type: Date }, // temporary only
        endDate: { type: Date }, // temporary only
        pricePerDay: { type: Number }, // temporary only

        // Where the pet/post is based — every analytics example in the
        // AI/Big Data plan (city demand, price by location) reads this.
        city: { type: String, trim: true },

        status: {
            type: String,
            enum: ["open", "booked", "closed"],
            default: "open"
        },
        
        isRemoved: {
    type: Boolean,
    default: false
},

removedReason: {
    type: String,
    trim: true
}
    },
    { timestamps: true }
);

// Indexes that make the aggregation-pipeline analytics fast once data grows.
postSchema.index({ city: 1, type: 1 });
postSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Post", postSchema);
