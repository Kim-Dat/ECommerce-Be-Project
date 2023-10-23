const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const validateMongodbId = require("../../utils/validateMongodbId");
class BlogController {
    /* [POST] api/blog/ */
    async createBlog(req, res) {
        try {
            const newBlog = await blogModel.create(req.body);
            res.json({
                message: "successfully !",
                newBlog,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/blog/:id */
    async getABlog(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const getBlog = await blogModel.findById({ _id: id });
            const updateView = await blogModel.findByIdAndUpdate(
                { _id: id },
                {
                    $inc: { numViews: 1 },
                },
                {
                    new: true,
                }
            );
            res.json({
                getBlog,
                updateView,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [GET] api/blog/ */
    async getAllBlog(req, res) {
        try {
            const getBlogs = await blogModel.find();
            res.json(getBlogs);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT] api/blog/:id */
    async updateBlog(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const updateBlog = await blogModel.findByIdAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            res.json(updateBlog);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [DELETE] api/blog/:id */
    async deleteBlog(req, res) {
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const deleteBlog = await blogModel.findByIdAndDelete({ _id: id });
            res.json(deleteBlog);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PATCH] */
    async likeBlog(req, res) {
        const { blogId } = req.body;
        validateMongodbId(blogId);
        try {
            const blog = await blogModel.findById({ _id: blogId });
            const userBlogId = req?.user?._id;
            const isLiked = blog?.isLiked;
            const alreadyDisliked = blog?.disLikes?.find();
            if (alreadyDisliked) {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $pull: { disLikes: userBlogId },
                        isDisLiked: true,
                    }
                );
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new BlogController();
