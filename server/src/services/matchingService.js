const User = require("../models/User");
const Post = require("../models/Post");

/**
 * Smart caretaker matching (AI feature 1 from the plan).
 * Scores a caretaker's fit for a post using a weighted rule set instead of
 * a trained model — deliberate, given the project timeline. It's still a
 * genuine scoring algorithm (not a placeholder), and the weights are the
 * obvious place to plug in a trained model later without touching callers.
 */
async function scoreCaretakerForPost(caretakerId, postId) {
    const [caretaker, post] = await Promise.all([
        User.findById(caretakerId),
        Post.findById(postId).populate("pet")
    ]);

    if (!caretaker || !post) return 0;

    let score = 0.5; // baseline

    const experienceTags = caretaker.caretakerStats?.experienceTags || [];
    if (post.pet?.species && experienceTags.includes(post.pet.species)) {
        score += 0.2;
    }
    if (post.pet?.tags?.some((tag) => experienceTags.includes(tag))) {
        score += 0.1;
    }

    const rating = caretaker.caretakerStats?.averageRating || 0;
    score += (rating / 5) * 0.15;

    const completed = caretaker.caretakerStats?.completedBookings || 0;
    score += Math.min(completed / 20, 1) * 0.05;

    return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}

/**
 * Temporary-care price suggestion (AI feature 3 from the plan).
 * Averages recent prices for similar posts (same city + species) instead
 * of a regression model — same reasoning as above: honest, explainable,
 * and built on real historical data once the app has some.
 */
async function suggestPricePerDay({ city, species }) {
    const recentPosts = await Post.find({
        type: "temporary",
        city,
        pricePerDay: { $exists: true, $ne: null }
    })
        .populate({ path: "pet", match: species ? { species } : {} })
        .sort({ createdAt: -1 })
        .limit(50);

    const relevant = recentPosts.filter((p) => p.pet);
    if (relevant.length === 0) return null;

    const avg = relevant.reduce((sum, p) => sum + p.pricePerDay, 0) / relevant.length;
    return Math.round(avg);
}

module.exports = { scoreCaretakerForPost, suggestPricePerDay };
