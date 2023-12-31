const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")
const {authMiddleware, isAdmin} = require("../app/middlewares/authMiddleware")
const BlogCategoryController = require("../app/Controllers/blogCategoryCtrl")

router.post("/", authMiddleware, isAdmin, asyncHandler(BlogCategoryController.createBlogCategory));
router.get("/",  asyncHandler(BlogCategoryController.getAllBlogCategory));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(BlogCategoryController.getABlogCategory));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(BlogCategoryController.updateBlogCategory));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(BlogCategoryController.deleteBlogCategory));

module.exports = router