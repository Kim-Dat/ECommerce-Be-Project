const authRouter = require("./authRoute");
const productRouter = require("./productRoute");
const blogRouter = require("./blogRoute");
const prodCategoryRouter = require("./prodCategoryRoute");
const blogCategoryRouter = require("./blogCategoryRoute");
const brandRoute = require("./brandRoute")
const couponRouter = require("./couponRoute")
function routes(app) {
    app.use("/api/user", authRouter);
    app.use("/api/product", productRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/prodcategory", prodCategoryRouter);
    app.use("/api/blogcategory", blogCategoryRouter);
    app.use("/api/brand", brandRoute);
    app.use("/api/coupon", couponRouter);
}

module.exports = routes;
