const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const productController = require("../app/Controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../app/middlewares/authMiddleware");
/* router */
router.post("/", authMiddleware, isAdmin, asyncHandler(productController.createProductCtrl));
router.get("/", asyncHandler(productController.getAllProduct));
router.patch("/wishlist", authMiddleware, asyncHandler(productController.addToWishList));
router.put("/rating", authMiddleware, asyncHandler(productController.rating));
router.get("/:id", asyncHandler(productController.getAProduct));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(productController.updateProduct));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(productController.deleteProduct));

module.exports = router;
