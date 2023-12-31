const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware, isAdmin } = require("../app/middlewares/authMiddleware");
const enquiryController = require("../app/Controllers/enquiryCtrl");
router.post("/",authMiddleware, asyncHandler(enquiryController.createEnquiry));
router.get("/", asyncHandler(enquiryController.getAllEnquiry));
router.get("/:id", authMiddleware, isAdmin, asyncHandler(enquiryController.getAEnquiry));
router.put("/:id", authMiddleware, isAdmin, asyncHandler(enquiryController.updateEnquiry));
router.delete("/:id", authMiddleware, isAdmin, asyncHandler(enquiryController.deleteEnquiry));
module.exports = router;
