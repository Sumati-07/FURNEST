const express = require("express");

const router = express.Router();

const {
    getPosts,
    createPost,
    getSuggestedPrice,
    toggleLike,
    addComment
} = require("../controllers/postController");

const {
    applyToPost,
    getApplicationsForPost,
    acceptApplication
} = require("../controllers/applicationController");

const { protect } = require("../middleware/auth");

// Optional auth: attaches req.userId if a valid token is present,
// but doesn't block the request.
// The public landing page uses this route.
const { optionalAuth } = require("../middleware/optionalAuth");


// ============================================================
// POSTS
// ============================================================

// Get all posts
router.get("/", optionalAuth, getPosts);

// Get suggested price for a temporary-care post
router.get("/suggested-price", getSuggestedPrice);

// Create a new post
router.post("/", protect, createPost);


// ============================================================
// LIKES & COMMENTS
// ============================================================

// Like / unlike a post
router.post("/:postId/like", protect, toggleLike);

// Add a comment to a post
router.post("/:postId/comments", protect, addComment);


// ============================================================
// TEMPORARY CARE APPLICATIONS
// ============================================================

// Caretaker applies for a temporary-care post
router.post(
    "/:postId/apply",
    protect,
    applyToPost
);

// Pet owner views all applicants for their post
router.get(
    "/:postId/applications",
    protect,
    getApplicationsForPost
);

// Pet owner selects a caretaker
// This will also create the Booking
router.post(
    "/:postId/applications/:applicationId/accept",
    protect,
    acceptApplication
);


module.exports = router;