const { createRoom, joinRoom, leaveRoom, getRoomDetails } = require("../services/roomService.js");

const roomController = {
  createRoom: async (req, res, next) => {
    try {
      const room = await createRoom({ ...req.body, createdBy: req.user.id });
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  },

  joinRoom: async (req, res, next) => {
    try {
      const room = await joinRoom(req.params.roomId, req.user.id);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  leaveRoom: async (req, res, next) => {
    try {
      const room = await leaveRoom(req.params.roomId, req.user.id);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  getRoomDetails: async (req, res, next) => {
    try {
      const room = await getRoomDetails(req.params.roomId);
      res.json(room);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { roomController };