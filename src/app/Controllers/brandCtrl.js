const validateMongodbId = require("../../utils/validateMongodbId");
const brandModel = require("../models/brandModel");

class BrandController {
    async createBrand(req, res) {
        try {
            const newBrand = await brandModel.create(req.body);
            res.json(newBrand);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getABrand(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const brand = await brandModel.findById({ _id: id });
            res.json(brand);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getAllBrand(req, res) {
        try {
            const brands = await brandModel.find();
            res.json(brands);
        } catch (error) {
            throw new Error(error);
        }
    }
    async updateBrand(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const updateBrand = await brandModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
            res.json(updateBrand);
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteBrand(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteBrand = await brandModel.findByIdAndDelete({ _id: id });
            res.json(deleteBrand);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new BrandController();
