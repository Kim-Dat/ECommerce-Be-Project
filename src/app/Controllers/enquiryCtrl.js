const enquiryModel = require("../models/enquiryModel")
const validateMongodbId = require("../../utils/validateMongodbId")
class EnquiryController{
     async createEnquiry(req, res) {
          try {
              const newEnquiry = await enquiryModel.create(req.body);
              res.json(newEnquiry);
          } catch (error) {
              throw new Error(error);
          }
      }
      async getAEnquiry(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const enquiry = await enquiryModel.findById({ _id: id });
              res.json(enquiry);
          } catch (error) {
              throw new Error(error);
          }
      }
      async getAllEnquiry(req, res) {
          try {
              const enquirys = await enquiryModel.find();
              res.json(enquirys);
          } catch (error) {
              throw new Error(error);
          }
      }
      async updateEnquiry(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const updateEnquiry = await enquiryModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
              res.json(updateEnquiry);
          } catch (error) {
              throw new Error(error);
          }
      }
      async deleteEnquiry(req, res) {
          const { id } = req.params;
          validateMongodbId(id);
          try {
              const deleteEnquiry = await enquiryModel.findByIdAndDelete({ _id: id });
              res.json(deleteEnquiry);
          } catch (error) {
              throw new Error(error);
          }
      }
}

module.exports = new EnquiryController