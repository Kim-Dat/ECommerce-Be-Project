const mongoose = require("mongoose");
const dbConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(process.env.MONGODB_URL)
            .then(() => {
                console.log("Connect Successfully");
                resolve();
            })
            .catch((error) => {
                console.log("Error Connect DB", error);
                reject();
            });
    });
};
module.exports = { dbConnect };
