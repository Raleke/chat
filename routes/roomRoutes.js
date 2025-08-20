const express = require("express");
const roomController = require("../controllers/roomController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.use(authMiddleware);
router.post("/", roomController.createRoom);
router.post("/:roomId/join", roomController.joinRoom);
router.post("/:roomId/leave", roomController.leaveRoom);
router.get("/:roomId", roomController.getRoomDetails);
router.post("/:roomId/assign-role", roomController.assignRole);
router.post("/:roomId/remove-member", roomController.removeMember);

module.exports = router;