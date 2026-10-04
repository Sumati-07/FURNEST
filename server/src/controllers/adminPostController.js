const Post = require("../models/Post");

// GET /api/admin/posts?type=adoption|temporary
async function getAllPosts(req, res) {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const posts = await Post.find(filter)
        .populate({ path: "pet", populate: { path: "owner", select: "name username email" } })
        .sort({ createdAt: -1 });
    res.json(posts);
}

// PATCH /api/admin/posts/:id/moderate   { remove: true|false, reason }
async function moderatePost(req, res) {
    const { remove, reason } = req.body;
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        { isRemoved: !!remove, removedReason: remove ? reason : undefined },
        { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
}

module.exports = { getAllPosts, moderatePost };
