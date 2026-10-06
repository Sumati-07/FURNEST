const express = require("express");

const router = express.Router();

const {
    adminLogin,
    getAdminProfile,
    updateAdminProfile
} = require("../controllers/adminAuthController");

const { protect } = require("../middleware/auth");

const isAdmin = require("../middleware/isAdmin");

router.post(
    "/login",
    adminLogin
);

router.get(
    "/me",
    protect,
    isAdmin,
    getAdminProfile
);

router.patch(
    "/me",
    protect,
    isAdmin,
    updateAdminProfile
);

module.exports = router;