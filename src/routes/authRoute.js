const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const userController = require("../app/Controllers/userCtrl");

const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
router.post("/register", asyncHandler(userController.createUserCtrl));
router.post("/forgot-password-token", asyncHandler(userController.forgotPasswordToken));
router.patch("/reset-password/:token", asyncHandler(userController.resetPassword));
router.patch("/password", authMiddleware, asyncHandler(userController.updatePassword));
router.post("/login", asyncHandler(userController.loginUserCtrl));
router.post("/admin-login", asyncHandler(userController.loginAdmin));
router.post("/cart", authMiddleware, asyncHandler(userController.userCart));
router.delete("/empty-cart", authMiddleware, asyncHandler(userController.emptyCart));

router.get("/all-users", asyncHandler(userController.getAllUser));
router.get("/refresh", asyncHandler(userController.handleRefreshToken));
router.get("/logout", asyncHandler(userController.logout));
router.get("/wishlist", authMiddleware, asyncHandler(userController.getWishList));
router.get("/cart", authMiddleware, asyncHandler(userController.getUserCart));
router.get("/month-income", authMiddleware, asyncHandler(userController.getMonthWiseOrderInCome));
router.get("/year-orders", authMiddleware, asyncHandler(userController.getYearlyTotalOrders));

router.delete("/cart/:id", authMiddleware, asyncHandler(userController.removeProductFromCart));
router.delete("/empty-cart", authMiddleware, asyncHandler(userController.emptyCart));
router.put("/edit-user", authMiddleware, asyncHandler(userController.updateAUser));
router.put("/save-address", authMiddleware, asyncHandler(userController.saveAddress));

router.patch("/block-user", authMiddleware, isAdmin, asyncHandler(userController.blockUser));
router.get("/blocks", authMiddleware, isAdmin, asyncHandler(userController.getBlocks));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(userController.getAUser));
router.delete("/delete-user/:id", authMiddleware, asyncHandler(userController.deleteAUser));
module.exports = router;
