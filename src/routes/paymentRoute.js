const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authMiddleware } = require("../app/middlewares/authMiddleware");
const ProdCategoryController = require("../app/Controllers/prodCategoryCtrl");

router.get(
    "/config",
    authMiddleware,
    asyncHandler((req, res) => {
        return res.status(200).json({
            status: "Ok",
            data: process.env.CLIENT_ID,
        });
    })
); 

module.exports = router;
