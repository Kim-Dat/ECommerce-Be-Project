const validateMongodbId = require("../../utils/validateMongodbId");
const productModel = require("../models/productModel");
const slugify = require("slugify");
class ProductController {
    async createProductCtrl(req, res) {
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title, {
                    lower: true,
                    locale: "vi",
                    trim: true,
                });
            }
            const newProduct = await productModel.create(req.body);
            res.json({
                createProduct: newProduct,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    async updateProduct(req, res) {
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const updateProduct = await productModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
            });
            res.json(updateProduct);
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteProduct(req, res) {
        try {
            const deleteProduct = await productModel.findByIdAndDelete({ _id: req.params.id });
            res.json(deleteProduct);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getAProduct(req, res) {
        validateMongodbId(req.params.id);
        try {
            const findProduct = await productModel.findOne({ _id: req.params.id });
            res.json(findProduct);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getAllProduct(req, res) {
        try {
            /* filtering */
            const queryObj = { ...req.query };
            const excludeFields = ["page", "fields", "limit", "sort"];
            excludeFields.forEach((el) => delete queryObj[el]);
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(equals|ne|gt|lt|gte|lte)\b/g, (match) => `$${match}`);
            let query = productModel.find(JSON.parse(queryStr));

            /* sorting */
            if (req.query.sort) {
                const sortBy = req.query.sort.split(",").join(" ");
                query = query.sort(sortBy);
            }

            /*limiting and fields*/
            if (req.query.fields) {
                const fields = req.query.fields.split(",").join(" ");
                query = query.select(fields);
            } else {
                query = query.select("-__v");
            }

            /*pagination*/
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.limit(limit).skip(skip);
            if (req.query.page) {
                const productCount = await productModel.countDocuments();
                if (skip >= productCount) {
                    throw new Error("this Page does not exists");
                }
            }
            const product = await query;
            res.json(product);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new ProductController();
