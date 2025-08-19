const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = (filePath, folder = "chat-files") =>
  cloudinary.uploader.upload(filePath, { folder });

const deleteFile = (publicId) =>
  cloudinary.uploader.destroy(publicId);

module.exports = { uploadFile, deleteFile };