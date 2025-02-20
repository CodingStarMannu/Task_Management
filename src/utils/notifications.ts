import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });
import nodemailer from 'nodemailer';
import { logger } from './logger';


export const sendNotification = async (
    email: string,
    mailSubject: string,
    content: string
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_MAIL!,
          pass: process.env.SMTP_PASSWORD!,
        },
      });
    
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
      logger.info('Email notifications are disabled');
      return true;
    }

    const mailOptions = {
        from: process.env.SMTP_MAIL!,
        to: email,
        subject: mailSubject,
        html: content,
      };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
    logger.info(`Notification sent successfully to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending notification:', error);
    console.error("Error sending email:", error);
    return false;
  }
};

