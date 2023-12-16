const fs = require("fs");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../../utils/cloudinary");
class UploadController {
    /* [PUT]  api/product/upload/:id*/
    async uploadImages(req, res) {
        try {
            const uploader = (path) => cloudinaryUploadImg(path, " images");
            const urls = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }
            const images = urls.map((file) => file);
            res.json(images);
        } catch (error) {
            throw new Error(error);
        }
    }
    /* [DELETE]  api/product/upload/:id*/
    async deleteImages(req, res) {
        const { id } = req.params;
        try {
            const deleted = await cloudinaryDeleteImg(id, " images");
            res.json({
                message: "Deleted images",
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new UploadController();
