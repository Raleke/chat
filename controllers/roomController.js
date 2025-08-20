const roomService = require("../services/roomService.js");
const roomController = {
  createRoom: async (req, res, next) => {
    try {
      const room = await roomService.createRoom({
        ...req.body,
        createdBy: req.user.id
      });
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  },

  joinRoom: async (req, res, next) => {
    try {
      const room = await roomService.joinRoom(req.params.roomId, req.user.id);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  leaveRoom: async (req, res, next) => {
    try {
      const room = await roomService.leaveRoom(req.params.roomId, req.user.id);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },
  getRoomDetails: async (req, res, next) => {
    try {
      const room = await roomService.getRoomDetails(req.params.roomId);
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  assignRole: async (req, res, next) => {
    try {
      const { targetUserId, role } = req.body;
      const room = await roomService.assignRole(
        req.params.roomId,
        req.user.id,
        targetUserId,
        role
      );
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  removeMember: async (req, res, next) => {
    try {
      const { targetUserId } = req.body;
      const room = await roomService.removeMember(
        req.params.roomId,
        req.user.id,
        targetUserId
      );
      res.json(room);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = roomController;