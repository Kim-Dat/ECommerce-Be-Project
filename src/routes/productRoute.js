const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const productController = require("../app/Controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../app/middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../app/middlewares/uploadImages");
router.post("/", authMiddleware, isAdmin, asyncHandler(productController.createProductCtrl));
router.put("/wishlist", authMiddleware, asyncHandler(productController.addToWishList));
router.put("/rating", authMiddleware, asyncHandler(productController.rating));
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    asyncHandler(productController.uploadImages)
);
router.get("/:id", asyncHandler(productController.getAProduct));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(productController.updateProduct));
router.get("/", asyncHandler(productController.getAllProduct));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(productController.deleteProduct));
module.exports = router;
