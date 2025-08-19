import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { sendEmail } from "./emailService.js";
import { logger } from "../utils/logger.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Helper: build frontend link in prod, fallback to raw token in dev
 */
const buildUrlOrToken = (path, token) => {
  if (process.env.FRONTEND_URL) {
    return `${process.env.FRONTEND_URL}/${path}/${token}`;
  }
  return `DEV-MODE-TOKEN:${token}`;
};

const register = async ({ username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash });
  await user.save();

  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyUrl = buildUrlOrToken("verify-email", verifyToken);

  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  await user.save();

  if (process.env.FRONTEND_URL) {
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`
    });
  } else {
    logger.debug(` Dev email verification token for ${email}: ${verifyToken}`);
  }

  logger.info(` User registered: ${user.email}`);
  return { user, token: generateToken(user), verifyUrl, verifyToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  logger.info(` User logged in: ${user.email}`);
  return { user, token: generateToken(user) };
};


const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = buildUrlOrToken("reset-password", token);

  if (process.env.FRONTEND_URL) {
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Token valid for 15 minutes.</p>`
    });
  } else {
    logger.debug(` Dev reset token for ${email}: ${token}`);
  }

  logger.info(` Password reset initiated for: ${email}`);
  return { resetUrl, token };
};

/**
 * Reset password with token
 */
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

  logger.info(` Password reset for: ${user.email}`);
  return { user, token: generateToken(user) };
};

const verifyEmail = async (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailVerificationToken: tokenHash
  });

  if (!user) throw new Error("Invalid or expired verification token");

  user.emailVerificationToken = null;
  user.isEmailVerified = true;
  await user.save();

  logger.info(` Email verified: ${user.email}`);
  return { user, token: generateToken(user) };
};

export { register, login, requestPasswordReset, resetPassword, verifyEmail };