const authService = require("../services/authService.js");
const { logger } = require("../utils/logger.js");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    res.status(201).json(result);
  } catch (err) {
    logger.error("❌ Registration failed", { message: err.message });
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    logger.error("❌ Login failed", { message: err.message });
    res.status(401).json({ error: err.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, requestPasswordReset, resetPassword };