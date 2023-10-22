const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const productController = require("../app/Controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../app/middlewares/authMiddleware");
router.post("/", authMiddleware, isAdmin, asyncHandler(productController.createProductCtrl));
router.get("/:id", asyncHandler(productController.getAProduct));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(productController.updateProduct));
router.get("/", asyncHandler(productController.getAllProduct));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(productController.deleteProduct));
module.exports = router;
