const { upload } = require("../utils/multerConfig.js");

const uploadMiddleware = (fieldName = "file") => {
  return upload.single(fieldName); // handle single file uploads
};

const multiUploadMiddleware = (fieldName = "files", maxCount = 5) => {
  return upload.array(fieldName, maxCount); // handle multiple file uploads
};

module.exports = { uploadMiddleware, multiUploadMiddleware };