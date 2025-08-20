const express = require("express");
const { roomController } = require("../controllers/roomController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, roomController.createRoom);
router.post("/:roomId/join", authMiddleware, roomController.joinRoom);
router.post("/:roomId/leave", authMiddleware, roomController.leaveRoom);
router.get("/:roomId", authMiddleware, roomController.getRoomDetails);

router.delete(
  "/:roomId",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Only admins can delete rooms" });
  }
);

module.exports = router;