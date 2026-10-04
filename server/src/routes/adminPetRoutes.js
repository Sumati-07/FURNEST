const express = require("express");
const router = express.Router();
const { getAllPets, getPetDetails, moderatePet } = require("../controllers/adminPetController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.use(protect, isAdmin);
router.get("/", getAllPets);
router.get("/:id", getPetDetails);
router.patch("/:id/moderate", moderatePet);

module.exports = router;
