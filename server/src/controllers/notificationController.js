const Notification = require("../models/Notification");

// GET /api/notifications
async function getMyNotifications(req, res) {
    const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notifications);
}

// PATCH /api/notifications/:id/read
async function markRead(req, res) {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { isRead: true },
        { new: true }
    );
    res.json(notification);
}

module.exports = { getMyNotifications, markRead };
