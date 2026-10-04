const express = require("express");
const router = express.Router();
const { getPopularCaretakers } = require("../controllers/userController");

router.get("/popular-caretakers", getPopularCaretakers);

module.exports = router;
