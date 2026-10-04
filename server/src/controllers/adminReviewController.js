const Review = require("../models/Review");

// GET /api/admin/reviews
async function getAllReviews(req, res) {
    const reviews = await Review.find()
        .populate("reviewer", "name username")
        .populate({ path: "booking", populate: { path: "application", populate: { path: "caretaker", select: "name username" } } })
        .sort({ createdAt: -1 });
    res.json(reviews);
}

// PATCH /api/admin/reviews/:id/moderate   { remove: true|false, reason }
async function moderateReview(req, res) {
    const { remove, reason } = req.body;
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        { isRemoved: !!remove, removedReason: remove ? reason : undefined },
        { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
}

module.exports = { getAllReviews, moderateReview };
