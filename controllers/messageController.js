const { sendMessage, markAsRead, addReaction, removeReaction } = require("../services/messageService.js");

const messageController = {
  sendMessage: async (req, res, next) => {
    try {
      const { roomId, content, parentMessage } = req.body;
      const msg = await sendMessage({
        sender: req.user.id,
        roomId,
        content,
        parentMessage
      });
      res.status(201).json(msg);
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const msg = await markAsRead(req.params.messageId, req.user.id);
      res.json(msg);
    } catch (err) {
      next(err);
    }
  },

  addReaction: async (req, res, next) => {
    try {
      const { emoji } = req.body;
      const msg = await addReaction(req.params.messageId, req.user.id, emoji);
      res.json(msg);
    } catch (err) {
      next(err);
    }
  },

  removeReaction: async (req, res, next) => {
    try {
      const { emoji } = req.body;
      const msg = await removeReaction(req.params.messageId, req.user.id, emoji);
      res.json(msg);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { messageController };