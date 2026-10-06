const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Generate JWT token
function generateToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}


// ======================================================
// ADMIN LOGIN
// POST /api/admin/auth/login
// ======================================================
async function adminLogin(req, res) {
    try {
        console.log("ADMIN LOGIN ROUTE HIT");
        console.log("Request body:", req.body);

        const { identifier, password } = req.body;

        // Validate input
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Identifier and password are required"
            });
        }

        // Find user by username OR email
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier.toLowerCase() }
            ]
        });

        // User does not exist or is not an admin
        if (!user || !user.isAdmin) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Check if admin account is suspended
        if (user.isActive === false) {
            return res.status(403).json({
                message:
                    "Your admin account has been suspended. Please contact the administrator."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        console.log(
            `Admin "${user.username}" logged in successfully`
        );

        // Successful response
        return res.status(200).json({
            message: "Admin login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error(
            "Admin login error:",
            error
        );

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}


// ======================================================
// GET ADMIN PROFILE
// GET /api/admin/auth/me
// ======================================================
async function getAdminProfile(req, res) {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(
            "Get admin profile error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get admin profile",
            error: error.message
        });
    }
}


// ======================================================
// UPDATE ADMIN PROFILE
// PATCH /api/admin/auth/me
// ======================================================
async function updateAdminProfile(req, res) {
    try {
        const {
            name,
            newPassword,
            currentPassword
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        // Update name if provided
        if (name !== undefined) {
            user.name = name;
        }

        // Change password if requested
        if (newPassword) {

            // Current password is required
            if (!currentPassword) {
                return res.status(400).json({
                    message:
                        "Current password is required to change password"
                });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message:
                        "Current password is incorrect"
                });
            }

            // Hash new password
            user.password = await bcrypt.hash(
                newPassword,
                10
            );
        }

        await user.save();

        return res.status(200).json({
            message: "Admin profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error(
            "Update admin profile error:",
            error
        );

        return res.status(500).json({
            message: "Could not update admin profile",
            error: error.message
        });
    }
}


// ======================================================
// EXPORT FUNCTIONS
// ======================================================
module.exports = {
    adminLogin,
    getAdminProfile,
    updateAdminProfile
};