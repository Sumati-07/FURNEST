const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
async function register(req, res) {
    try {
        const { username, name, email, phone, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(409).json({ message: "That email or username is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            name: name || username,
            email,
            phone,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
                is_verified: user.is_verified
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
}

// POST /api/auth/login
// Accepts username, user ID, or email as the identifier — matching the login screen.
async function login(req, res) {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Identifier and password are required" });
        }

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }]
        });

        if (!user) {
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
                phone: user.phone,
                roles: user.roles,
                is_verified: user.is_verified
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}

// GET /api/auth/me
async function getCurrentUser(req, res) {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
}

// POST /api/auth/forgot-password
// Placeholder: verifies the account exists, doesn't send a real email yet.
// Wire up a mail provider (e.g. Nodemailer + SMTP, or a transactional email API)
// before relying on this in production.
async function forgotPassword(req, res) {
    const { userId, email } = req.body;
    const user = await User.findOne({
        $or: [{ username: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }]
    });

    if (!user || user.email !== email) {
        // Same response whether or not it matched, so we don't leak which accounts exist.
        return res.json({ sent: true });
    }

    console.log(`[stub] Password reset requested for ${user.email}`);
    res.json({ sent: true });
}

module.exports = { register, login, getCurrentUser, forgotPassword };
