const { Room } = require("../models/Room.js");

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Global role check (admin)
      if (req.user.role === "admin") {
        return next();
      }

      // Per-room role check (if roomId is provided in params/body)
      if (req.params.roomId || req.body.roomId) {
        const roomId = req.params.roomId || req.body.roomId;
        const room = await Room.findById(roomId);

        if (!room) {
          return res.status(404).json({ error: "Room not found" });
        }

        // Check if user is creator (room owner)
        if (room.createdBy.toString() === req.user.id.toString()) {
          return next();
        }
      }

      // Check if user has the required global role
      if (req.user.role === requiredRole) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden: insufficient rights" });
    } catch (err) {
      return res.status(500).json({ error: "Authorization error", details: err.message });
    }
  };
};

module.exports = { roleMiddleware };