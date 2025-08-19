import { Message } from "../models/Message.js";
import { logger } from "../utils/logger.js";

const sendMessage = async ({ roomId, senderId, content, fileId, parentMessage }) => {
  const message = new Message({
    roomId,
    senderId,
    content,
    fileId,
    parentMessage
  });
  await message.save();

  logger.info(`✉️ Message sent by ${senderId} in room ${roomId}`);
  return message;
};

const markDelivered = async (messageId) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  message.deliveryStatus = "delivered";
  await message.save();

  logger.info(`📬 Message ${messageId} marked delivered`);
  return message;
};

const markRead = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  const alreadyRead = message.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    message.readBy.push({ user: userId, readAt: new Date() });
    await message.save();
    logger.info(`👁️ Message ${messageId} read by ${userId}`);
  }

  return message;
};

const addReaction = async (messageId, userId, emoji) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  const existing = message.reactions.find(
    (r) => r.user.toString() === userId.toString() && r.emoji === emoji
  );

  if (!existing) {
    message.reactions.push({ user: userId, emoji });
    await message.save();
    logger.info(`😀 Reaction ${emoji} added by ${userId} on ${messageId}`);
  }

  return message;
};

const removeReaction = async (messageId, userId, emoji) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  message.reactions = message.reactions.filter(
    (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  await message.save();

  logger.info(`❌ Reaction ${emoji} removed by ${userId} on ${messageId}`);
  return message;
};

export { sendMessage, markDelivered, markRead, addReaction, removeReaction };