const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {authMiddleware, isAdmin} = require("../app/middlewares/authMiddleware")
const brandController = require("../app/Controllers/brandCtrl");
router.post("/", authMiddleware, isAdmin, brandController.createBrand);
router.get("/:id", authMiddleware, isAdmin, brandController.getABrand);
router.get("/", authMiddleware, isAdmin, brandController.getAllBrand);
router.put("/:id", authMiddleware, isAdmin, brandController.updateBrand);
router.delete("/:id", authMiddleware, isAdmin, brandController.deleteBrand);
module.exports = router;
