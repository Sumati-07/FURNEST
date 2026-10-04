const User = require("../models/User");
const Pet = require("../models/Pet");
const Post = require("../models/Post");
const Booking = require("../models/Booking");
const Application = require("../models/Application");

// GET /api/admin/users?search=&page=1&limit=20
async function getAllUsers(req, res) {
    const { search = "", page = 1, limit = 20 } = req.query;

    const filter = search
        ? { $or: [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }, { name: new RegExp(search, "i") }] }
        : {};

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit)),
        User.countDocuments(filter)
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

// GET /api/admin/users/:id — full profile plus their pets, posts, and bookings
async function getUserDetails(req, res) {
    const { id } = req.params;

    const [user, pets, posts] = await Promise.all([
        User.findById(id).select("-password"),
        Pet.find({ owner: id }),
        Post.find({ pet: { $in: await Pet.find({ owner: id }).distinct("_id") } })
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });

    const applications = await Application.find({ caretaker: id }).populate("post");
    const bookingsAsCaretaker = await Booking.find({
        application: { $in: await Application.find({ caretaker: id }).distinct("_id") }
    });

    res.json({ user, pets, posts, applications, bookingsAsCaretaker });
}

// PATCH /api/admin/users/:id/suspend   { suspend: true|false }
async function setUserSuspension(req, res) {
    const { suspend } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: !suspend },
        { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
}

// DELETE /api/admin/users/:id
// Hard delete the account itself. Their pets/posts/applications/bookings
// are left in place (so history and other users' records stay intact) but
// become orphaned references — this is a deliberate, simple choice for now;
// a production system would likely anonymize instead of deleting outright.
async function deleteUser(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
}

module.exports = { getAllUsers, getUserDetails, setUserSuspension, deleteUser };
