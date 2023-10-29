const validateMongodbId = require("../../utils/validateMongodbId");
const productModel = require("../models/productModel");
const slugify = require("slugify");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const userModel = require("../models/userModel");
class ProductController {
    /* [POST] api/product/*/
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
    /* [PUT] api/product/:id*/
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
    /* [DELETE] api/product/:id*/
    async deleteProduct(req, res) {
        try {
            const deleteProduct = await productModel.findByIdAndDelete({ _id: req.params.id });
            res.json(deleteProduct);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/product/:id*/
    async getAProduct(req, res) {
        validateMongodbId(req.params.id);
        try {
            const findProduct = await productModel.findOne({ _id: req.params.id });
            res.json(findProduct);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT] api/product/*/
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

    /* [] */
    async addToWishList(req, res) {
        const { prodId } = req.body;
        const { _id } = req.user;
        try {
            const user = await userModel.findById({ _id });
            const alreadyAdded = user?.wishlist?.find((userId) => userId.toString() === prodId.toString());
            if (alreadyAdded) {
                const user = await userModel.findByIdAndUpdate(
                    { _id },
                    {
                        $pull: { wishlist: prodId },
                    },
                    {
                        new: true,
                    }
                );
                res.json(user);
            } else {
                const user = await userModel.findByIdAndUpdate(
                    { _id },
                    {
                        $push: { wishlist: prodId },
                    },
                    {
                        new: true,
                    }
                );
                res.json(user);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async rating(req, res) {
        const { _id } = req.user;
        const { star, prodId } = req.body;
        try {
            const product = await productModel.findById({ _id: prodId });
            if (!product) {
                return res.status(404).json({ message: "product not found !!!" });
            }
            const alreadyRated = product?.ratings?.find((userId) => userId.postedby.toString() === _id.toString());
            if (alreadyRated) {
                const updateRating = await productModel.updateOne(
                    {
                        ratings: { $elemMatch: alreadyRated },
                    },
                    {
                        $set: { "ratings.$.star": star },
                    },
                    {
                        new: true,
                    }
                );
                res.json(updateRating);
            } else {
                const ratedProduct = await productModel.findByIdAndUpdate(
                    { _id: prodId },
                    {
                        $push: {
                            ratings: {
                                star,
                                postedby: _id,
                            },
                        },
                    }
                );
                res.json(ratedProduct);
            }
            let totalRating = product.ratings.length;
            let ratingSum = product.ratings.map((rating) => rating.star).reduce((acc, arr) => acc + arr, 0);
            let actualRating = Math.round(ratingSum / totalRating);
            const finalProduct = await productModel.findByIdAndUpdate(
                { _id: prodId },
                {
                    totalrating: actualRating,
                },
                {
                    new: true,
                }
            );
            console.log(finalProduct);
        } catch (error) {
            throw new Error(error);
        }
    }

    async uploadImages(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const uploader = (path) => cloudinaryUploadImg(path, " images");
            const urls = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath)
            }
            console.log("URLS :", urls)
            const findProduct = await productModel.findByIdAndUpdate(
                { _id: id },
                {
                    images: urls.map((file) => file),
                },
                {
                    new: true,
                }
            );
            await findProduct.save()
            res.json(findProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new ProductController();
