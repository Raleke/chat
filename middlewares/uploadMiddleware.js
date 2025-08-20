const { upload } = require("../utils/multerConfig.js");

const uploadMiddleware = (fieldName = "file") => {
  return upload.single(fieldName); 
};

const multiUploadMiddleware = (fieldName = "files", maxCount = 5) => {
  return upload.array(fieldName, maxCount); 
};

module.exports = { uploadMiddleware, multiUploadMiddleware };