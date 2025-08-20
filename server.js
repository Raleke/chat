require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./utils/socket");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info("Connected to MongoDB successfully");
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(` Server running at http://localhost:${PORT}`);
    });
    initSocket(server);
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
      process.exit(1);
    });

  } catch (err) {
    logger.error("Failed to start server:", err);
    console.error(" Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
