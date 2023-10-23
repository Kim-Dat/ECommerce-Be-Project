const mongoose = require("mongoose");
const validateMongodbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("this ID is not found or not valid");
    }
};

module.exports = validateMongodbId;
