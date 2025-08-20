const express = require("express");
const { userController } = require("../controllers/userController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { uploadMiddleware } = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

router.get("/me", authMiddleware, userController.getProfile);
router.put("/me", authMiddleware, userController.updateProfile);

router.post(
  "/me/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  userController.uploadAvatar
);

module.exports = router;