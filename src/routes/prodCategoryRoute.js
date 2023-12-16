const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
const ProdCategoryController = require("../app/Controllers/prodCategoryCtrl");

router.post("/", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.createProdCategory));
router.get("/", asyncHandler(ProdCategoryController.getAllProdCategory));
router.get("/:id", asyncHandler(ProdCategoryController.getAProdCategory));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.updateProdCategory));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(ProdCategoryController.deleteProdCategory));

module.exports = router;
