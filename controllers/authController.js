const { register, login, requestPasswordReset, resetPassword } = require("../services/authService.js");

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await register({ username, email, password });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await login({ email, password });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  requestPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;
      await requestPasswordReset(email);
      res.json({ message: "Password reset email sent" });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const result = await resetPassword(token, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { authController };