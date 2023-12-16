const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const uploadController = require("../app/Controllers/uploadCtrl");
const { isAdmin, authMiddleware } = require("../app/middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../app/middlewares/uploadImages");
/* router */
router.post(
    "/",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    asyncHandler(uploadController.uploadImages)
);
router.delete("/delete-img/:id", authMiddleware, isAdmin, asyncHandler(uploadController.deleteImages));

module.exports = router;
