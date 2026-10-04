const express = require("express");
const router = express.Router();
const { getAllUsers, getUserDetails, setUserSuspension, deleteUser } = require("../controllers/adminUserController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.use(protect, isAdmin);
router.get("/", getAllUsers);
router.get("/:id", getUserDetails);
router.patch("/:id/suspend", setUserSuspension);
router.delete("/:id", deleteUser);

module.exports = router;
