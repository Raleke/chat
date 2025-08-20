const { uploadFile, getFileDetails } = require("../services/fileService.js");

const fileController = {
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const result = await uploadFile({
        uploaderId: req.user.id,
        roomId: req.body.roomId,
        file: req.file
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  getFileDetails: async (req, res, next) => {
    try {
      const file = await getFileDetails(req.params.fileId);
      res.json(file);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { fileController };