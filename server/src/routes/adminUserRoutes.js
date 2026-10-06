const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getUserDetails,
    setUserSuspension,
    deleteUser
} = require("../controllers/adminUserController");

const { protect } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get(
    "/",
    protect,
    isAdmin,
    getAllUsers
);

router.get(
    "/:id",
    protect,
    isAdmin,
    getUserDetails
);

router.patch(
    "/:id/suspend",
    protect,
    isAdmin,
    setUserSuspension
);

router.delete(
    "/:id",
    protect,
    isAdmin,
    deleteUser
);

module.exports = router;
