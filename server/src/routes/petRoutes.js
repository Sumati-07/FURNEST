const express = require("express");
const router = express.Router();
const { getMyPets, createPet } = require("../controllers/petController");
const { protect } = require("../middleware/auth");

router.get("/mine", protect, getMyPets);
router.post("/", protect, createPet);

module.exports = router;
