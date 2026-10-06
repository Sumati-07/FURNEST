const User = require("../models/User");

async function isAdmin(req, res, next) {
    try {
        const user = await User.findById(req.userId)
            .select("isAdmin");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        console.error("isAdmin middleware error:", error);

        res.status(500).json({
            message: "Failed to verify admin access"
        });
    }
}

module.exports = isAdmin;