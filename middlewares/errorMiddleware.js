const { logger } = require("../utils/logger.js");

const errorMiddleware = (err, req, res, next) => {
  logger.error("❌ API Error", { message: err.message, stack: err.stack });

  const status = err.status || 500;
  const response = {
    error: err.message || "Internal Server Error"
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = { errorMiddleware };