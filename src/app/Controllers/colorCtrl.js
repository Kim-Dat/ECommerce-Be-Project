const colorModel = require("../models/colorModel")
const validateMongodbId = require("../../utils/validateMongodbId")
class ColorController{
     async createColor(req, res) {
          try {
              const newColor = await colorModel.create(req.body);
              res.json(newColor);
          } catch (error) {
              throw new Error(error);
          }
      }
      async getAColor(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const color = await colorModel.findById({ _id: id });
              res.json(color);
          } catch (error) {
              throw new Error(error);
          }
      }
      async getAllColor(req, res) {
          try {
              const colors = await colorModel.find();
              res.json(colors);
          } catch (error) {
              throw new Error(error);
          }
      }
      async updateColor(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const updateColor = await colorModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
              res.json(updateColor);
          } catch (error) {
              throw new Error(error);
          }
      }
      async deleteColor(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const deleteColor = await colorModel.findByIdAndDelete({ _id: id });
              res.json(deleteColor);
          } catch (error) {
              throw new Error(error);
          }
      }
}

module.exports = new ColorController