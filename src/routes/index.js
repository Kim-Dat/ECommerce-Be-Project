const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
function routes(app) {
    app.use("/api/user", authRoute);
    app.use("/api/product", productRoute);
}

module.exports = routes;
