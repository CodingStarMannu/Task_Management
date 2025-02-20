"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${process.cwd()}/.env` });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const sendNotification = async (email, mailSubject, content) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
            logger_1.logger.info('Email notifications are disabled');
            return true;
        }
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: content,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email);
        logger_1.logger.info(`Notification sent successfully to ${email}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error('Error sending notification:', error);
        console.error("Error sending email:", error);
        return false;
    }
};
exports.sendNotification = sendNotification;
