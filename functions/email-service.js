const nodemailer = require("nodemailer");

const mailerConfig = {
    host: "smtp.office365.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: "admin@speako.io",
        pass: "#1234mandMR"
    }
};

exports.transporter = nodemailer.createTransport(mailerConfig);
