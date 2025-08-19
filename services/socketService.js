import { io } from "../utils/socket.js";
import { logger } from "../utils/logger.js";

/**
 * Emit an event to a specific user.
 */
const emitToUser = (userId, event, data) => {
  const socketId = io.userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
    logger.debug(`📡 Event [${event}] sent to user ${userId}`);
  } else {
    logger.warn(`⚠️ No active socket for user ${userId}`);
  }
};

/**
 * Emit to everyone in a room.
 */
const emitToRoom = (roomId, event, data) => {
  io.to(roomId.toString()).emit(event, data);
  logger.debug(`💬 Event [${event}] broadcast to room ${roomId}`);
};

/**
 * Emit a system-wide broadcast.
 */
const emitBroadcast = (event, data) => {
  io.emit(event, data);
  logger.debug(`🌍 Event [${event}] broadcasted to ALL`);
};

export { emitToUser, emitToRoom, emitBroadcast };