const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
const ProdCategoryController = require("../app/Controllers/prodCategoryCtrl");

router.post("/", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.createProdCategory));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.getAProdCategory));
router.get("/", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.getAllProdCategory));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.updateProdCategory));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.deleteProdCategory));

module.exports = router;
