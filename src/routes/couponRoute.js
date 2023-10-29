const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const couponController = require("../app/Controllers/couponCtrl");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
router.post("/", authMiddleware, isAdmin, asyncHandler(couponController.createCoupon));
router.get("/", authMiddleware, asyncHandler(couponController.getAllCoupon));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(couponController.updateCoupon));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(couponController.deleteCoupon));

module.exports = router;
