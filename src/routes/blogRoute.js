const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
const blogController = require("../app/Controllers/blogCtrl");
const { uploadPhoto, blogImgResize } = require("../app/middlewares/uploadImages");
router.post("/", authMiddleware, isAdmin, asyncHandler(blogController.createBlog));
router.put("/likes",authMiddleware, asyncHandler(blogController.likeTheBlog));
router.put("/dislikes",authMiddleware, asyncHandler(blogController.disLikeTheBlog));
router.put(
     "/upload/:id",
     authMiddleware,
     isAdmin,
     uploadPhoto.array("images", 2),
     blogImgResize,
     asyncHandler(blogController.uploadImages)
 );
router.get("/:id", asyncHandler(blogController.getABlog));
router.get("/", asyncHandler(blogController.getAllBlog));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(blogController.updateBlog));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(blogController.deleteBlog));
module.exports = router;
