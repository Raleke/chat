import { User } from "../models/User.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";
import { logger } from "../utils/logger.js";

const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  logger.info(`👤 User profile updated: ${user.email}`);
  return user;
};

const updateAvatar = async (userId, filePath) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Remove old avatar if exists
  if (user.avatarPublicId) {
    await deleteFile(user.avatarPublicId);
  }

  const uploadRes = await uploadFile(filePath, "avatars");
  user.avatarUrl = uploadRes.secure_url;
  user.avatarPublicId = uploadRes.public_id;
  await user.save();

  logger.info(`🖼️ Avatar updated for: ${user.email}`);
  return user;
};

export { updateProfile, updateAvatar };
