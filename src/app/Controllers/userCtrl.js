const { generateToken } = require("../../config/jwToken");
const userModel = require("../models/userModel");
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
            res.json({ message: "User created successfully", success: true, user: newUser });
        }
    }
    /* [GET] api/user/login */
    async loginUserCtrl(req, res, next) {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email });
        if (findUser && (await findUser.isPasswordMatched(password))) {
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
            res.cookie("refreshToken", refreshToken, { maxAge: 72 * 60 * 60 * 1000, httpOnly: true });
            res.json({
                _id: updateUser?._id,
                firstname: updateUser?.firstname,
                lastname: updateUser?.lastname,
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
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
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
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteAUser = await userModel.findByIdAndDelete({ _id: id });
            res.json({ deleteAUser });
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] api/user/block-user/:id */
    async blockUser(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const block = await userModel.findByIdAndUpdate(
                { _id: id },
                {
                    isBlocked: true,
                },
                {
                    new: true,
                }
            );
            res.json(block);
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
    async forgotPasswordToken(req, res) {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found with this email !!!");
        }
        try {
            const token = await user.createPasswordResetToken();
            console.log("forgot Token :", token);
            await user.save();
            const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now
            <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>
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
}

module.exports = new UserController();
