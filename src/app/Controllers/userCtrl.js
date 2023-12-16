const { generateToken } = require("../../config/jwToken");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const uniqid = require("uniqid");
const validateMongodbId = require("../../utils/validateMongodbId");
const { generateRefreshToken } = require("../../config/refreshToken");
const jwToken = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./emailCtrl");
class UserController {
    /* [POST] api/user/register */
    async createUserCtrl(req, res, next) {
        const email = req.body.email;
        const findUser = await userModel.findOne({ email });
        if (!!findUser) {
            throw new Error("User already exists");
        } else {
            const newUser = await userModel.create(req.body);
            res.json({
                message: "User created successfully",
                success: true,
                user: newUser,
            });
        }
    }
    /* [GET] api/user/login */
    async loginUserCtrl(req, res, next) {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email });
        if (findUser && (await findUser.isPasswordMatched(password)) && !findUser.isBlocked) {
            const refreshToken = await generateRefreshToken(findUser._id);
            const updateUser = await userModel.findByIdAndUpdate(
                { _id: findUser._id },
                {
                    refreshToken,
                },
                {
                    new: true,
                }
            );
            res.cookie("refreshToken", refreshToken, {
                maxAge: 72 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.json({
                _id: updateUser?._id,
                firstName: updateUser?.firstName,
                lastName: updateUser?.lastName,
                email: updateUser?.email,
                mobile: updateUser?.mobile,
                token: generateToken(updateUser?._id),
            });
        } else {
            throw new Error("Invalid Information !!!");
        }
    }
    /* [GET] api/user/admin-login */
    async loginAdmin(req, res, next) {
        const { email, password } = req.body;
        const findAdmin = await userModel.findOne({ email });
        if (findAdmin.role !== "admin") throw new Error("Not an Admin");
        if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
            const refreshToken = await generateRefreshToken(findAdmin._id);
            const updateUser = await userModel.findByIdAndUpdate(
                { _id: findAdmin._id },
                {
                    refreshToken,
                },
                {
                    new: true,
                }
            );
            res.cookie("refreshToken", refreshToken, {
                maxAge: 72 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.json({
                _id: updateUser?._id,
                firstName: updateUser?.firstName,
                lastName: updateUser?.lastName,
                email: updateUser?.email,
                mobile: updateUser?.mobile,
                token: generateToken(updateUser?._id),
            });
        } else {
            throw new Error("Invalid Information !!!");
        }
    }
    /*[GET] api/user/refresh*/
    async handleRefreshToken(req, res) {
        const cookie = req.cookies;
        if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
        const refreshToken = cookie.refreshToken;
        const user = await userModel.findOne({ refreshToken });
        if (!user) throw new Error("No Refresh Token present in database or not matched");
        jwToken.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) {
                throw new Error("there is something wrong with refresh token");
            }
        });
        const access = generateToken(user?._id);
        res.json(access);
    }
    /* [GET] api/user/logout*/
    async logout(req, res) {
        const cookie = req.cookies;
        console.log(cookie);
        if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
        const refreshToken = cookie.refreshToken;
        const user = await userModel.findOne({ refreshToken });
        if (!user) {
            res.clearCookie("refreshToken", { httpOnly: true, secure: true });
            return res.sendStatus(204); /*No content*/
        }
        await userModel.findOneAndUpdate(
            { refreshToken },
            {
                refreshToken: "",
            }
        );
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.sendStatus(204);
    }
    /* [PUT] api/user/edit-user */
    async updateAUser(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        try {
            const updateUser = await userModel.findByIdAndUpdate(
                { _id },
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    mobile: req.body.mobile,
                },
                {
                    new: true,
                }
            );
            res.json(updateUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT]  api/user/save-address*/
    async saveAddress(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        try {
            const updateUser = await userModel.findByIdAndUpdate(
                { _id },
                {
                    address: req.body.address,
                },
                {
                    new: true,
                }
            );

            res.json(updateUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/user/all-users */
    async getAllUser(req, res) {
        try {
            const getUsers = await userModel.find();
            res.json(getUsers);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/user/:id */
    async getAUser(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const getUser = await userModel.findById({ _id: id });
            res.json(getUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [DELETE] api/user/:id */
    async deleteAUser(req, res) {
        // const { userId } = req.body;
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteAUser = await userModel.findByIdAndDelete(id);
            res.json(deleteAUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] api/user/block-user */
    async blockUser(req, res) {
        const { userId } = req.body;
        validateMongodbId(userId);
        try {
            const user = await userModel.findById(userId);

            const alreadyBlocked = user.isBlocked;
            if (alreadyBlocked) {
                const updateUser = await userModel.findByIdAndUpdate(
                    userId,
                    {
                        isBlocked: false,
                    },
                    {
                        new: true,
                    }
                );
                res.json(updateUser);
            } else {
                const updateUser = await userModel.findByIdAndUpdate(
                    userId,
                    {
                        isBlocked: true,
                    },
                    {
                        new: true,
                    }
                );
                res.json(updateUser);
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    async getBlocks(req, res) {
        try {
            const getBlogs = await userModel.find({ isBlocked: true });
            res.json(getBlogs);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] api/user/unblock-user/:id */
    async unBlockUser(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const unBlock = await userModel.findByIdAndUpdate(
                { _id: id },
                {
                    isBlocked: false,
                },
                {
                    new: true,
                }
            );
            res.json(unBlock);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] api/user/password */
    async updatePassword(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        const { password } = req.body;
        const user = await userModel.findById({ _id });
        if (password) {
            user.password = password;
            const updatePassword = await user.save();
            res.json(updatePassword);
        } else {
            res.json(user);
        }
    }
    /* [POST] api/user/forgot-password-token */
    async forgotPasswordToken(req, res) {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found with this email !!!");
        }
        try {
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now
            <a href="http://localhost:3000/reset-password/${token}">Click Here</a>
             `;
            const data = {
                to: email,
                subject: "Forgot Password Link",
                text: "Hey User",
                htm: resetURL,
            };
            sendEmail(data);
            res.json(token);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] api/user/reset-password/:token */
    async resetPassword(req, res) {
        try {
            const { password } = req.body;
            const { token } = req.params;
            const hashedToken = crypto.createHash("sha256").update(token.toString()).digest("hex");
            const user = await userModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            if (!user) {
                throw new Error("Token expires, please try again later");
            }
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            res.json(user);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/user/wishlist */
    async getWishList(req, res) {
        const { _id } = req.user;
        try {
            const findUser = await userModel.findById(_id).populate("wishlists");
            res.json(findUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [POST] api/user/cart*/
    async userCart(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        const { productId, color, quantity, price } = req.body;

        try {
            const newCart = await new cartModel({
                userId: _id,
                productId: productId,
                color: color,
                quantity: quantity,
                price: price,
            }).save();
            res.json(newCart);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/user/cart*/
    async getUserCart(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        try {
            const cart = await cartModel.find({ userId: _id }).populate("productId").populate("color");
            res.json(cart);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [Delete] api/user/cart/:id*/
    async removeProductFromCart(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteProductFromCart = await cartModel.findByIdAndDelete(id);
            res.json(deleteProductFromCart);
        } catch (error) {
            throw new Error(error);
        }
    }

    async emptyCart(req, res) {
        const { _id } = req.user;
        validateMongodbId(_id);
        try {
            const emptyCart = await cartModel.deleteMany({ userId: _id });
            res.json(emptyCart);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getMonthWiseOrderInCome(req, res) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const currentYear = new Date().getFullYear();
        const endDateList = [];

        for (let index = 0; index < monthNames.length; index++) {
            // Create a new date object for the first day of each month in the current year
            const currentDate = new Date(currentYear, index, 1);

            // Set the date to the end of the current month
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(0);

            // Format the date to match your requirement
            const endDate = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();
            endDateList.push(endDate);
        }

        // Now you can use endDateList in your MongoDB query
        const data = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $lte: new Date(),
                        $gte: new Date(endDateList[0]), // Use the first month's end date
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: "$month",
                    },
                    amount: { $sum: "$totalPriceAfterDiscount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(data);
    }

    async getYearlyTotalOrders(req, res) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let d = new Date();
        let endDate = "";
        d.setDate(1);
        for (let index = 0; index < monthNames.length + 1; index++) {
            d.setMonth(d.getMonth() - 1);
            endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
        }
        const data = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $lte: new Date(),
                        $gte: new Date(endDate),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    amount: { $sum: "$totalPriceAfterDiscount" },
                },
            },
        ]);
        res.json(data);
    }
}

module.exports = new UserController();
