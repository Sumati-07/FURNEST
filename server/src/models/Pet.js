const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: { type: String, required: true, trim: true },
        species: { type: String, required: true, trim: true }, // "Dog", "Cat", ...
        breed: { type: String, trim: true },
        age: { type: Number },
        healthNotes: { type: String, trim: true },
        photo: { type: String },

        // A simple size/temperament tag set is what the matching service
        // scores caretaker experience against later.
        tags: { type: [String], default: [] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
