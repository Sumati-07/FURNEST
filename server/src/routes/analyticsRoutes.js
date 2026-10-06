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
const isAdmin = require("../middleware/isAdmin");

// All analytics routes are now Admin-only.
// protect verifies the JWT.
// isAdmin verifies that the logged-in user has isAdmin: true.

router.get(
    "/species-demand",
    protect,
    isAdmin,
    speciesDemand
);

router.get(
    "/city-demand",
    protect,
    isAdmin,
    cityDemand
);

router.get(
    "/seasonal-demand",
    protect,
    isAdmin,
    seasonalDemand
);

router.get(
    "/price-by-city",
    protect,
    isAdmin,
    priceByCity
);

router.get(
    "/application-outcomes",
    protect,
    isAdmin,
    applicationOutcomes
);

module.exports = router;