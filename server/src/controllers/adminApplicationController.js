const Application = require("../models/Application");

// GET /api/admin/applications?status=pending|accepted|rejected
async function getAllApplications(req, res) {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter)
        .populate("caretaker", "name username email")
        .populate({ path: "post", populate: { path: "pet", select: "name species" } })
        .sort({ createdAt: -1 });
    res.json(applications);
}

module.exports = { getAllApplications };
