const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/admin/auth/login
// Same credentials table as regular login, but rejects any account that
// isn't flagged isAdmin — a regular user typing their own password here
// gets the same "invalid credentials" response as a wrong password would,
// so this endpoint doesn't even reveal which accounts are admins.
async function adminLogin(req, res) {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Identifier and password are required" });
        }

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}

// GET /api/admin/auth/me
async function getAdminProfile(req, res) {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Admin not found" });
    res.json(user);
}

// PATCH /api/admin/auth/me — admin's own profile settings
async function updateAdminProfile(req, res) {
    try {
        const { name, newPassword, currentPassword } = req.body;
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) return res.status(404).json({ message: "Admin not found" });

        if (name !== undefined) user.name = name;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to change password" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.json({ id: user._id, username: user.username, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Could not update admin profile", error: error.message });
    }
}

module.exports = { adminLogin, getAdminProfile, updateAdminProfile };
