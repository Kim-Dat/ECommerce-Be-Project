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
            const getBlog = await blogModel.findById({ _id: id }).populate("likes").populate("disLikes");
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
    /* [PUT] api/blog/likes*/
    async likeTheBlog(req, res) {
        const { blogId } = req.body;
        validateMongodbId(blogId);
        try {
            /*Tìm Blog muốn thích*/
            const blog = await blogModel.findById({ _id: blogId });
            /*lấy id của người dùng đã đăng nhập*/
            const loginUserId = req?.user?._id;
            /*Kiểm tra người dùng đã thích chưa*/
            const isLiked = blog?.isLiked;
            /*Kiểm tra người dùng đã từng không thích trước đó chưa*/
            const alreadyDisliked = blog?.disLikes?.find((userId) => userId.toString() === loginUserId?.toString());
            if (alreadyDisliked) {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $pull: { disLikes: loginUserId },
                        isDisLiked: false,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            }
            if (isLiked) {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $pull: { likes: loginUserId },
                        isLiked: false,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            } else {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $push: { likes: loginUserId },
                        isLiked: true,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [PUT] api/blog/dislikes*/
    async disLikeTheBlog(req, res) {
        const { blogId } = req.body;
        validateMongodbId(blogId);
        try {
            /*Tìm Blog muốn thích*/
            const blog = await blogModel.findById({ _id: blogId });
            /*lấy id của người dùng đã đăng nhập*/
            const loginUserId = req?.user?._id;
            /*Kiểm tra người dùng đã không thích chưa*/
            const isDisLiked = blog?.isDisLiked;
            /*Kiểm tra người dùng đã từng thích trước đó chưa*/
            const alreadyLiked = blog?.likes?.find((userId) => userId.toString() === loginUserId?.toString());
            if (alreadyLiked) {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $pull: { likes: loginUserId },
                        isLiked: false,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            }
            if (isDisLiked) {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $pull: { disLikes: loginUserId },
                        isDisLiked: false,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            } else {
                const blog = await blogModel.findByIdAndUpdate(
                    { _id: blogId },
                    {
                        $push: { disLikes: loginUserId },
                        isDisLiked: true,
                    },
                    {
                        new: true,
                    }
                );
                res.json(blog);
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new BlogController();
