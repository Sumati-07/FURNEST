const Report = require("../models/Report");

// GET /api/admin/reports?status=open|resolved|dismissed&type=user|post|booking
async function getAllReports(req, res) {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.targetType = type;

    const reports = await Report.find(filter)
        .populate("reporter", "name username")
        .populate("targetUser", "name username")
        .populate({ path: "targetPost", populate: { path: "pet", select: "name" } })
        .sort({ createdAt: -1 });

    res.json(reports);
}

// PATCH /api/admin/reports/:id/resolve   { status: "resolved"|"dismissed", adminNote }
async function resolveReport(req, res) {
    const { status, adminNote } = req.body;
    if (!["resolved", "dismissed"].includes(status)) {
        return res.status(400).json({ message: "status must be resolved or dismissed" });
    }

    const report = await Report.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
}

module.exports = { getAllReports, resolveReport };
