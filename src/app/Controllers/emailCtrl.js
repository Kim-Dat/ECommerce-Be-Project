const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
const sendEmail = asyncHandler(async (data, req, res) => {
    const info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);
});

module.exports = sendEmail;
