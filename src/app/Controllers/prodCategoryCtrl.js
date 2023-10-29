const prodCategoryModel = require("../models/prodCategoryModel");
const validateMongodbId = require("../../utils/validateMongodbId");
class ProdCategoryController {
    /* [POST] api/prodcategory/ */
    async createProdCategory(req, res) {
        try {
            const newProdCategory = await prodCategoryModel.create(req.body);
            res.json(newProdCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/prodcategory/:id */
    async getAProdCategory(req, res) {
        const {id} = req.params
        validateMongodbId(id)
        try {
            const prodCategory = await prodCategoryModel.findById({_id: id});
            res.json(prodCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/prodcategory/ */
    async getAllProdCategory(req, res) {
        try {
            const prodCategories = await prodCategoryModel.find();
            res.json(prodCategories);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT] api/prodcategory/:id */
    async updateProdCategory(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const updateProdCategory = await prodCategoryModel.findByIdAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            res.json(updateProdCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [DELETE] api/prodcategory/:id */
    async deleteProdCategory(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteProdCategory = await prodCategoryModel.findByIdAndDelete({ _id: id });
            res.json(deleteProdCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new ProdCategoryController();
