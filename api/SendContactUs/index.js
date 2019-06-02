exports.handler = async (event, context) => {
    try {

        if (event.httpMethod === 'OPTIONS') {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers": "content-type",
                },
                statusCode: 200,
            }
        }

        const request = JSON.parse(event.body.toString());

        const nodemailer = require('nodemailer');
        const environment = require('./environment');

        const transporter = nodemailer.createTransport({
            host: environment.smtpHost,
            port: 587,
            requireTLS: true, // true for 465, false for other ports
            auth: {
                user: environment.smtpUser,
                pass: environment.smtpPass
            }
        });

        const subject = `${request.yourName} <${request.yourEmail}>`;
        const html = request.message;

        const mailOptions = {
            from: environment.smtpEmail,
            to: environment.smtpEmail,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);

        const data = {
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info)
        };

        return {
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            statusCode: 200,
            body: JSON.stringify(data)
        }
    } catch (err) {
        console.log(err);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            statusCode: 400,
            body: 'unexpected error'
        }
    }
};
