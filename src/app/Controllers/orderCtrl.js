const orderModel = require("../models/orderModel");
const validateMongodbId = require("../../utils/validateMongodbId");

class OrderController {
    async createOrder(req, res) {
        const { paymentMethod, shippingAddress, orderItems, totalPrice, totalPriceAfterDiscount, shippingPrice } = req.body;
        const { _id } = req.user;
        try {
            const createOrder = await orderModel.create({
                paymentMethod,
                shippingAddress,
                orderItems,
                totalPrice,
                totalPriceAfterDiscount,
                shippingPrice,
                user: _id,
            });
            res.json(createOrder);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getOrder(req, res) {
        const { _id } = req.user;
        try {
            const orders = await orderModel.find({ user: _id }).populate("user").populate("orderItems.productId").populate("orderItems.color");
            res.json({ orders });
        } catch (error) {
            throw new Error(error);
        }
    }
    async getOrders(req, res) {
        try {
            const getAllOrders = await orderModel.find().populate("user");
            res.json(getAllOrders);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getOrderUserById(req, res) {
        const { id } = req.params;
        try {
            const getOrderUserById = await orderModel.findById(id).populate("orderItems.productId").populate("orderItems.color");
            res.json(getOrderUserById);
        } catch (error) {
            throw new Error(error);
        }
    }
    async updateOrderStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const updateOrderStatus = await orderModel.findByIdAndUpdate(
                id,
                {
                    $set: { orderStatus: status },
                },
                {
                    new: true,
                }
            );
            res.json(updateOrderStatus);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new OrderController();
