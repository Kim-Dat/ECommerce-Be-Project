const userModel = require("../models/userModel");
const jwToken = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    /* kiểm tra phần ủy quyền là Bearer thì mình thực hiện lấy token */
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        /* lấy token */
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                /* xác minh token */
                const decoded = jwToken.verify(token, process.env.JWT_SECRET);
                /* khi có token thì tìm ra user có id theo id của token trả về */
                const user = await userModel.findById(decoded.id);
                /* gán user vào req để có thể truy cập thông tin user trong tất cả middleware và xử lý các trường hợp tiếp theo khi token gửi tới */
                req.user = user;
                /*khi gán xong gọi next để tiếp tục xử lý yêu cầu của middleware tiếp theo khi truy cập user*/
                next();
            }
        } catch (error) {
            throw new Error("Not authorization token expired, please login again");
        }
    } else {
        throw new Error("there is no token attached to header");
    }
});
const isAdmin = asyncHandler(async (req, res, next) => {
    const adminUser = await userModel.findOne({ email: req.user.email });
    if (adminUser.role.trim() !== "admin") {
        throw new Error("you are not an admin !!!");
    } else {
        next();
    }
});
module.exports = { authMiddleware, isAdmin };
