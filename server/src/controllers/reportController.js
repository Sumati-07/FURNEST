const Report = require("../models/Report");

// POST /api/reports   { targetType, targetId, reason }
// Any logged-in user can file a report against a user, post, or booking.
async function createReport(req, res) {
    try {
        const { targetType, targetId, reason } = req.body;

        if (!["user", "post", "booking"].includes(targetType)) {
            return res.status(400).json({ message: "targetType must be user, post, or booking" });
        }
        if (!reason) return res.status(400).json({ message: "reason is required" });

        const report = await Report.create({
            reporter: req.userId,
            targetType,
            targetUser: targetType === "user" ? targetId : undefined,
            targetPost: targetType === "post" ? targetId : undefined,
            targetBooking: targetType === "booking" ? targetId : undefined,
            reason
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: "Could not file report", error: error.message });
    }
}

module.exports = { createReport };
