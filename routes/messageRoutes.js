const express = require("express");
const { messageController } = require("../controllers/messageController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, messageController.sendMessage);
router.post("/:messageId/read", authMiddleware, messageController.markAsRead);
router.post("/:messageId/react", authMiddleware, messageController.addReaction);
router.post("/:messageId/unreact", authMiddleware, messageController.removeReaction);

module.exports = router;