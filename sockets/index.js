const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger.js");

let io;
const onlineUsers = new Map(); // userId -> socketId(s)

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id, role: decoded.role };
      return next();
    } catch (err) {
      logger.error(" Socket authentication failed", { message: err.message });
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    logger.info(`🔌 User connected: ${userId} (${socket.id})`);

    // Track online users (allow multiple tabs)
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // Handle joining rooms
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      logger.info(`👥 User ${userId} joined room ${roomId}`);
    });

    // Handle leaving rooms
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      logger.info(` User ${userId} left room ${roomId}`);
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      logger.info(` User disconnected: ${userId} (${socket.id})`);
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });

  return io;
};

const emitToUser = (userId, event, payload) => {
  if (!io) return;
  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.forEach((sid) => io.to(sid).emit(event, payload));
    logger.debug(`📤 Emitted event "${event}" to user ${userId}`);
  }
};

const emitToRoom = (roomId, event, payload) => {
  if (!io) return;
  io.to(roomId).emit(event, payload);
  logger.debug(`📢 Emitted event "${event}" to room ${roomId}`);
};

module.exports = {
  initSockets,
  emitToUser,
  emitToRoom
};