const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const blogRoute = require("./blogRoute")
function routes(app) {
    app.use("/api/user", authRoute);
    app.use("/api/product", productRoute);
    app.use("/api/blog", blogRoute);
}

module.exports = routes;
