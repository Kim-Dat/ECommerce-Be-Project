const validateMongodbId = require("../../utils/validateMongodbId");
const couponModel = require("../models/couponModel");
class CouponController {
    async createCoupon(req, res) {
        try {
            const newCoupon = await couponModel.create(req.body);
            res.json(newCoupon);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllCoupon(req, res) {
        try {
            const coupons = await couponModel.find();
            res.json(coupons);
        } catch (error) {
            throw new Error(error);
        }
    }
    async updateCoupon(req, res) {
        const { id } = req.params;
        console.log(id)
        validateMongodbId(id)
        try {
            const updateCoupon = await couponModel.findByIdAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            res.json(updateCoupon)
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteCoupon(req, res){
        const { id } = req.params;
        validateMongodbId(id)
        try {
            const deleteCoupon = await couponModel.findByIdAndDelete({ _id: id });
            res.json(deleteCoupon)
        } catch (error) {
            throw new Error(error);
        }
    }
    async getCoupon(req, res){
        const { id } = req.params;
        validateMongodbId(id)
        try {
            const coupon = await couponModel.findById({ _id: id });
            res.json(coupon)
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new CouponController();
