const Application = require("../models/Application");
const User = require("../models/User");
const Post = require("../models/Post");

/**
 * Read-only view onto the AI you've already built — NOT new AI/ML work.
 * This surfaces what the matching and price-prediction services have
 * produced so far, for the admin dashboard's "AI Insights" panel. The
 * genuinely new AI/Big Data phase (training, Hadoop/Spark, etc.) is still
 * deliberately untouched, as planned.
 */

// GET /api/admin/ai-insights
async function getAIInsights(req, res) {
    const [matchScoreAgg, topCaretakers, postsWithPrice, postsTotal] = await Promise.all([
        Application.aggregate([
            { $match: { matchScore: { $ne: null } } },
            { $group: { _id: null, avgMatchScore: { $avg: "$matchScore" }, count: { $sum: 1 } } }
        ]),
        User.find({ "caretakerStats.completedBookings": { $gt: 0 } })
            .sort({ "caretakerStats.averageRating": -1 })
            .limit(5)
            .select("name username caretakerStats"),
        Post.countDocuments({ type: "temporary", pricePerDay: { $exists: true, $ne: null } }),
        Post.countDocuments({ type: "temporary" })
    ]);

    res.json({
        matching: {
            averageMatchScore: matchScoreAgg[0]?.avgMatchScore ?? null,
            scoredApplications: matchScoreAgg[0]?.count ?? 0
        },
        topCaretakers,
        pricePrediction: {
            postsWithPrice,
            postsTotal,
            coverage: postsTotal > 0 ? postsWithPrice / postsTotal : null
        }
    });
}

module.exports = { getAIInsights };
