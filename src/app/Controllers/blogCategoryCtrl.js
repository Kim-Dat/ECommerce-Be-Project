const blogCategoryModel = require("../models/blogCategoryModel");
const validateMongodbId = require("../../utils/validateMongodbId");
class BlogCategoryController {
    /* [POST] api/blogcategory/ */
    async createBlogCategory(req, res) {
        try {
            const newBlogCategory = await blogCategoryModel.create(req.body);
            res.json(newBlogCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/blogcategory/:id */
    async getABlogCategory(req, res) {
        const {id} = req.params
        validateMongodbId(id)
        try {
            const blogCategory = await blogCategoryModel.findById({_id: id});
            res.json(blogCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/blogcategory/ */
    async getAllBlogCategory(req, res) {
        try {
            const blogCategories = await blogCategoryModel.find();
            res.json(blogCategories);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT] api/blogcategory/:id */
    async updateBlogCategory(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const updateBlogCategory = await blogCategoryModel.findByIdAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            res.json(updateBlogCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [DELETE] api/blogcategory/:id */
    async deleteBlogCategory(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const updateBlogCategory = await blogCategoryModel.findByIdAndDelete({ _id: id });
            res.json(updateBlogCategory);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new BlogCategoryController();
