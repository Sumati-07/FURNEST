const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const {
    suggestPricePerDay
} = require("../services/matchingService");

// GET /api/posts
// Public — the landing page and the logged-in feed both call this.
//
// ADMIN MERGE:
// Posts marked as removed by an admin are excluded from
// the normal user-facing feed.
async function getPosts(req, res) {
    const posts = await Post.find({
        isRemoved: { $ne: true }
    })
        .sort({ createdAt: -1 })
        .populate("pet")
        .populate({
            path: "pet",
            populate: {
                path: "owner",
                select: "name avatar username"
            }
        });

    const currentUserId = req.userId;
    // set by protect middleware if the request was authenticated

    const hydrated = await Promise.all(
        posts.map(async (post) => {
            const [
                likeCount,
                likedByMe,
                comments
            ] = await Promise.all([
                Like.countDocuments({
                    post: post._id
                }),

                currentUserId
                    ? Like.exists({
                          post: post._id,
                          user: currentUserId
                      })
                    : false,

                Comment.find({
                    post: post._id
                })
                    .populate(
                        "user",
                        "name avatar username"
                    )
                    .sort({ createdAt: 1 })
            ]);

            return {
                ...post.toObject(),
                likeCount,
                likedByMe: !!likedByMe,
                comments
            };
        })
    );

    res.json(hydrated);
}

// POST /api/posts
async function createPost(req, res) {
    try {
        const {
            petId,
            type,
            startDate,
            endDate,
            pricePerDay,
            city
        } = req.body;

        const post = await Post.create({
            pet: petId,
            type,
            startDate,
            endDate,
            pricePerDay,
            city
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({
            message: "Could not create post",
            error: error.message
        });
    }
}

// GET /api/posts/suggested-price?city=Lucknow&species=Dog
// A visible, explainable use of the "AI" layer in the UI
// (e.g. shown while filling the New Post form).
async function getSuggestedPrice(req, res) {
    const {
        city,
        species
    } = req.query;

    const suggestion =
        await suggestPricePerDay({
            city,
            species
        });

    res.json({
        suggestedPricePerDay: suggestion
    });
}

// POST /api/posts/:postId/like
async function toggleLike(req, res) {
    const { postId } = req.params;

    const existing =
        await Like.findOne({
            post: postId,
            user: req.userId
        });

    if (existing) {
        await existing.deleteOne();

        return res.json({
            liked: false
        });
    }

    await Like.create({
        post: postId,
        user: req.userId
    });

    res.json({
        liked: true
    });
}

// POST /api/posts/:postId/comments
async function addComment(req, res) {
    const {
        postId
    } = req.params;

    const {
        content
    } = req.body;

    const comment =
        await Comment.create({
            post: postId,
            user: req.userId,
            content
        });

    const populated =
        await comment.populate(
            "user",
            "name avatar username"
        );

    res.status(201).json(populated);
}

module.exports = {
    getPosts,
    createPost,
    getSuggestedPrice,
    toggleLike,
    addComment
};