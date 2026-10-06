const User = require("../models/User");
const Pet = require("../models/Pet");
const Post = require("../models/Post");
const Booking = require("../models/Booking");
const Application = require("../models/Application");

// GET /api/admin/users?search=&page=1&limit=20
async function getAllUsers(req, res) {
    try {
        const { search = "", page = 1, limit = 20 } = req.query;

        const filter = search
            ? {
                $or: [
                    { username: new RegExp(search, "i") },
                    { email: new RegExp(search, "i") },
                    { name: new RegExp(search, "i") }
                ]
            }
            : {};

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit)),
            User.countDocuments(filter)
        ]);

        res.json({
            users,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({
            message: "Could not fetch users",
            error: error.message
        });
    }
}

// GET /api/admin/users/:id — full profile plus their pets, posts, applications and bookings
async function getUserDetails(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const pets = await Pet.find({ owner: id });
        const petIds = pets.map((pet) => pet._id);
        const posts = await Post.find({ pet: { $in: petIds } });

        const applications = await Application.find({ caretaker: id })
            .populate("post");

        const applicationIds = applications.map((application) => application._id);
        const bookingsAsCaretaker = await Booking.find({
            application: { $in: applicationIds }
        });

        res.json({
            user,
            pets,
            posts,
            applications,
            bookingsAsCaretaker
        });
    } catch (error) {
        console.error("getUserDetails error:", error);
        res.status(500).json({
            message: "Could not fetch user details",
            error: error.message
        });
    }
}

// PATCH /api/admin/users/:id/suspend   { suspend: true|false }
async function setUserSuspension(req, res) {
    try {
        const { suspend } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: !suspend },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("setUserSuspension error:", error);
        res.status(500).json({
            message: "Could not update user status",
            error: error.message
        });
    }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("deleteUser error:", error);
        res.status(500).json({
            message: "Could not delete user",
            error: error.message
        });
    }
}

module.exports = {
    getAllUsers,
    getUserDetails,
    setUserSuspension,
    deleteUser
};
