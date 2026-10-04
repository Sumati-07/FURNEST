const User = require("../models/User");

// Runs AFTER `protect` (which sets req.userId from the JWT).
// Looks the user up fresh on every request rather than trusting a flag
// baked into the token — so revoking admin access takes effect immediately,
// not just after the token expires.
async function isAdmin(req, res, next) {
    try {
        const user = await User.findById(req.userId).select("isAdmin");

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Could not verify admin access", error: error.message });
    }
}

module.exports = { isAdmin };
