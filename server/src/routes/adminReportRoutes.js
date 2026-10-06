const express = require("express");
const router = express.Router();
const { getAllReports, resolveReport } = require("../controllers/adminReportController");
const { protect } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.use(protect, isAdmin);
router.get("/", getAllReports);
router.patch("/:id/resolve", resolveReport);

module.exports = router;
