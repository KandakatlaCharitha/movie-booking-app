const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Define routes
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);
router.get("/coupons ", userController.getCouponCode);
router.post("/bookings ", userController.bookShow);

module.exports = router;
