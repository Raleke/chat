import { sendEmail } from "./emailService.js";
import { emitToUser } from "./socketService.js";
import { logger } from "../utils/logger.js";

/**
 * Send an in-app notification via socket.io
 */
const sendInAppNotification = async (userId, payload) => {
  try {
    emitToUser(userId, "notification", payload);
    logger.info(`🔔 In-app notification sent to user ${userId}`, payload);
  } catch (err) {
    logger.error("❌ Failed to send in-app notification", { message: err.message });
  }
};

/**
 * Send a notification via email
 */
const sendEmailNotification = async (userEmail, subject, html) => {
  try {
    await sendEmail({ to: userEmail, subject, html });
    logger.info(`📧 Email notification sent to ${userEmail}`);
  } catch (err) {
    logger.error("❌ Failed to send email notification", { message: err.message });
  }
};

/**
 * Wrapper: send both in-app + email
 */
const notifyUser = async ({ userId, userEmail, subject, html, payload }) => {
  if (userEmail && subject && html) {
    await sendEmailNotification(userEmail, subject, html);
  }
  if (userId && payload) {
    await sendInAppNotification(userId, payload);
  }
};

export { sendInAppNotification, sendEmailNotification, notifyUser };