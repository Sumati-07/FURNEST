const Application = require("../models/Application");
const Post = require("../models/Post");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const { scoreCaretakerForPost } = require("../services/matchingService");

// POST /api/posts/:postId/apply
async function applyToPost(req, res) {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("pet");

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.type !== "temporary") {
        return res.status(400).json({
            message: "Applications are only available for temporary-care posts"
        });
    }

    if (post.status !== "open") {
        return res.status(400).json({
            message: "This care request is no longer available"
        });
    }

    // Owner cannot apply to their own post
    if (String(post.pet.owner) === String(req.userId)) {
        return res.status(400).json({
            message: "You cannot apply to your own care request"
        });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
        post: postId,
        caretaker: req.userId
    });

    if (existingApplication) {
        return res.status(409).json({
            message: "You have already applied to this request"
        });
    }

    const matchScore = await scoreCaretakerForPost(
        req.userId,
        postId
    );

    const application = await Application.create({
        post: postId,
        caretaker: req.userId,
        matchScore
    });

    if (post.pet?.owner) {
        await Notification.create({
            user: post.pet.owner,
            type: "application_received",
            content: `Someone applied to look after ${post.pet.name}.`
        });
    }

    res.status(201).json(application);
}


// GET /api/posts/:postId/applications
// Owner sees applicants and their match scores.
async function getApplicationsForPost(req, res) {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("pet");

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    // Only the pet owner can see applications
    if (String(post.pet.owner) !== String(req.userId)) {
        return res.status(403).json({
            message: "Only the pet owner can view applications"
        });
    }

    const applications = await Application.find({
        post: postId
    })
        .populate(
            "caretaker",
            "name username email phone avatar caretakerStats"
        )
        .sort({ matchScore: -1, createdAt: 1 });

    res.json(applications);
}


// POST /api/posts/:postId/applications/:applicationId/accept
// Owner selects one caretaker.
async function acceptApplication(req, res) {
    const { postId, applicationId } = req.params;

    const post = await Post.findById(postId).populate("pet");

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (String(post.pet.owner) !== String(req.userId)) {
        return res.status(403).json({
            message: "Only the pet owner can choose a caretaker"
        });
    }

    if (post.type !== "temporary") {
        return res.status(400).json({
            message: "Only temporary-care posts can create bookings"
        });
    }

    if (post.status !== "open") {
        return res.status(400).json({
            message: "This care request has already been booked or closed"
        });
    }

    const application = await Application.findOne({
        _id: applicationId,
        post: postId
    }).populate("caretaker", "name username");

    if (!application) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    if (application.status !== "pending") {
        return res.status(400).json({
            message: "This application has already been processed"
        });
    }

    // Prevent duplicate booking
    const existingBooking = await Booking.findOne({
        application: application._id
    });

    if (existingBooking) {
        return res.status(409).json({
            message: "A booking already exists for this application"
        });
    }

    // Calculate number of care days
    let days = 1;

    if (post.startDate && post.endDate) {
        const start = new Date(post.startDate);
        const end = new Date(post.endDate);

        days = Math.max(
            1,
            Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        );
    }

    const amount = Number(post.pricePerDay || 0) * days;

    // Accept selected application
    application.status = "accepted";
    await application.save();

    // Reject all other applicants
    await Application.updateMany(
        {
            post: postId,
            _id: { $ne: application._id },
            status: "pending"
        },
        {
            $set: { status: "rejected" }
        }
    );

    // Create confirmed booking
    const booking = await Booking.create({
        application: application._id,
        terms: `${post.pet.name} temporary care for ${days} day(s) at ₹${post.pricePerDay || 0}/day.`,
        amount,
        startDate: post.startDate,
        endDate: post.endDate,
        paymentStatus: "simulated_pending",
        status: "active"
    });

    // Mark post as booked
    post.status = "booked";
    await post.save();

    // Notify selected caretaker
    await Notification.create({
        user: application.caretaker._id,
        type: "application_accepted",
        content: `Your application to care for ${post.pet.name} was accepted. A booking has been created.`
    });

    res.status(201).json({
        message: "Caretaker selected and booking created",
        booking
    });
}


module.exports = {
    applyToPost,
    getApplicationsForPost,
    acceptApplication
};