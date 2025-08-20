// controllers/roomController.js
const roomService = require("../services/roomService.js");

const roomController = {
  // ✅ Create a new room (creator = owner)
  createRoom: async (req, res, next) => {
    try {
      const room = await roomService.createRoom({
        ...req.body,
        createdBy: req.user.id
      });
      return res.status(201).json(room);
    } catch (err) {
      return next(err);
    }
  },

  // ✅ Join a room
  joinRoom: async (req, res, next) => {
    try {
      const room = await roomService.joinRoom(req.params.roomId, req.user.id);
      return res.json(room);
    } catch (err) {
      return next(err);
    }
  },

  // ✅ Leave a room
  leaveRoom: async (req, res, next) => {
    try {
      const room = await roomService.leaveRoom(req.params.roomId, req.user.id);
      return res.json(room);
    } catch (err) {
      return next(err);
    }
  },

  // ✅ Get room details
  getRoomDetails: async (req, res, next) => {
    try {
      const room = await roomService.getRoomDetails(req.params.roomId);
      if (!room) return res.status(404).json({ error: "Room not found" });
      return res.json(room);
    } catch (err) {
      return next(err);
    }
  },

  // ✅ Assign a role (promote/demote a member)
  assignRole: async (req, res, next) => {
    try {
      const { userId, role } = req.body;
      const room = await roomService.assignRole(req.params.roomId, userId, role);
      return res.json(room);
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = roomController;