const express = require("express");
const router = express.Router();
const {
    speciesDemand,
    cityDemand,
    seasonalDemand,
    priceByCity,
    applicationOutcomes
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

// In a real deployment, add an isAdmin check here alongside protect.
router.get("/species-demand", protect, speciesDemand);
router.get("/city-demand", protect, cityDemand);
router.get("/seasonal-demand", protect, seasonalDemand);
router.get("/price-by-city", protect, priceByCity);
router.get("/application-outcomes", protect, applicationOutcomes);

module.exports = router;
