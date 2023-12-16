const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
const orderController = require("../app/Controllers/orderCtrl");

router.get("/", authMiddleware, asyncHandler(orderController.getOrder));
router.post("/create", authMiddleware, asyncHandler(orderController.createOrder));
router.get("/orders", authMiddleware, isAdmin, asyncHandler(orderController.getOrders));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(orderController.getOrderUserById));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(orderController.getOrderUserById));
router.patch("/:id", authMiddleware, isAdmin, asyncHandler(orderController.updateOrderStatus));

module.exports = router;
