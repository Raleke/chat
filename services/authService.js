import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { sendEmail } from "./emailService.js";
import { logger } from "../utils/logger.js";

// ✅ Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Register
const register = async ({ username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash });
  await user.save();

  logger.info(`👤 User registered: ${user.email}`);
  return { user, token: generateToken(user) };
};

// ✅ Login
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  logger.info(`🔑 User logged in: ${user.email}`);
  return { user, token: generateToken(user) };
};

// ✅ Request password reset
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Token valid for 15 minutes.</p>`
  });

  logger.info(`🔒 Password reset email sent: ${email}`);
  return true;
};

// ✅ Reset password
const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() }
  });
  if (!user) throw new Error("Invalid or expired reset token");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordChangedAt = new Date();
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();

  logger.info(`✅ Password reset for: ${user.email}`);
  return { user, token: generateToken(user) };
};

export { register, login, requestPasswordReset, resetPassword };