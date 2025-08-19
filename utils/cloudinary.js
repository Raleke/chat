import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger.js";

// ✅ Configure once (using env vars, not hardcoded secrets)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary.
 * @param {string} filePath - local path or remote URL
 * @param {object} options - extra upload options (folder, public_id, etc.)
 */
const uploadFile = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    logger.info("✅ File uploaded to Cloudinary", { publicId: result.public_id, url: result.secure_url });
    return result;
  } catch (err) {
    logger.error("❌ Cloudinary upload failed", { message: err.message, stack: err.stack });
    throw err;
  }
};

/**
 * Delete a file from Cloudinary by its publicId.
 */
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`🗑️ File deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (err) {
    logger.error("❌ Cloudinary delete failed", { message: err.message, stack: err.stack });
    throw err;
  }
};

/**
 * Generate a Cloudinary optimized URL.
 */
const generateOptimizedUrl = (publicId) => {
  const url = cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto"
  });
  logger.debug(`🔗 Generated optimized URL: ${url}`);
  return url;
};

/**
 * Generate a Cloudinary cropped URL.
 */
const generateCroppedUrl = (publicId, width = 500, height = 500) => {
  const url = cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width,
    height
  });
  logger.debug(`✂️ Generated cropped URL: ${url}`);
  return url;
};

export {
  uploadFile,
  deleteFile,
  generateOptimizedUrl,
  generateCroppedUrl
};