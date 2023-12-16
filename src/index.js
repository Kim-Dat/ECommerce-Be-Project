require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const morgan = require("morgan");
const { dbConnect } = require("./config/dbConnect");
const cors = require("cors")
const { notFound, errorHandler } = require("./app/middlewares/errorHandler");
const app = express();
app.use(express.json());
app.use(cors({credentials: true,}))
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 4000;
dbConnect();
app.use(cookieParser());
app.use(morgan('dev'));
routes(app);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on PORT:  http://localhost:${PORT}`);
});
