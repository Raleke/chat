import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Chat App" <${process.env.GMAIL_USER}>`, 
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(` Email sent to ${to}`, { messageId: info.messageId });
    return info;
  } catch (err) {
    logger.error(" Email sending failed", { message: err.message });
    throw err;
  }
};

export { sendEmail };