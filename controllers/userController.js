const { updateProfile, uploadAvatar } = require("../services/userService.js");

const userController = {
  getProfile: async (req, res, next) => {
    try {
      res.json(req.user); 
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updated = await updateProfile(req.user.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  uploadAvatar: async (req, res, next) => {
    try {
      const filePath = req.file?.path;
      if (!filePath) throw new Error("No file uploaded");

      const result = await uploadAvatar(req.user.id, filePath);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { userController };