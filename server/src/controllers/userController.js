const User = require("../models/User");

// GET /api/users/popular-caretakers
async function getPopularCaretakers(req, res) {
    const caretakers = await User.find({ "caretakerStats.completedBookings": { $gt: 0 } })
        .sort({ "caretakerStats.averageRating": -1 })
        .limit(6)
        .select("name username caretakerStats");
    res.json(caretakers);
}

module.exports = { getPopularCaretakers };
