const { Server } = require("socket.io");
const { logger } = require("./logger");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    logger.info(`⚡ User connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      logger.info(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      logger.info(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };