const authRouter = require("./authRoute");
const productRouter = require("./productRoute");
const blogRouter = require("./blogRoute");
const prodCategoryRouter = require("./prodCategoryRoute");
const blogCategoryRouter = require("./blogCategoryRoute");
const brandRouter = require("./brandRoute");
const couponRouter = require("./couponRoute");
const colorRouter = require("./colorRoute");
const enquiryRouter = require("./enquiryRoute");
const uploadRouter = require("./uploadRoute");
const paymentRouter = require("./paymentRoute");
const orderRouter = require("./orderRoute");
function routes(app) {
    app.use("/api/user", authRouter);
    app.use("/api/product", productRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/prodcategory", prodCategoryRouter);
    app.use("/api/blogcategory", blogCategoryRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/color", colorRouter);
    app.use("/api/enquiry", enquiryRouter);
    app.use("/api/upload", uploadRouter);
    app.use("/api/payment", paymentRouter);
    app.use("/api/order", orderRouter);
}

module.exports = routes;
