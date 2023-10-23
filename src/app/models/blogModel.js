const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        numViews: {
            type: Number,
            default: 0,
        },
        isLiked: {
            type: Boolean,
            default: false,
        },
        isDisLiked: {
            type: Boolean,
            default: false,
        },
        likes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        disLikes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        image: {
            type: String,
            default: "https://www.lucasweb.it/upload/blog/CAT-1551275824.jpg",
        },
        author: {
            type: String,
            default: "admin",
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);
module.exports = mongoose.model("Blog", blogSchema);
