const express = require("express");
const { fileController } = require("../controllers/fileController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { uploadMiddleware } = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

// 📂 File routes (protected)
router.post(
  "/upload",
  authMiddleware,
  uploadMiddleware.single("file"),
  fileController.uploadFile
);

router.get("/:fileId", authMiddleware, fileController.getFileDetails);

module.exports = router;