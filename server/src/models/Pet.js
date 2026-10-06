const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        species: {
            type: String,
            required: true,
            trim: true
        }, // "Dog", "Cat", ...

        breed: {
            type: String,
            trim: true
        },

        age: {
            type: Number
        },

        healthNotes: {
            type: String,
            trim: true
        },

        photo: {
            type: String
        },

        // A simple size/temperament tag set is what the matching service
        // scores caretaker experience against later.
        tags: {
            type: [String],
            default: []
        },

        // Admin moderation fields.
        // If an admin removes a pet, the pet remains in the database
        // but can be hidden from the normal user-facing application.
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

module.exports = mongoose.model("Pet", petSchema);