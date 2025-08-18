const { Schema, model, Types } = require("mongoose");

const FileSchema = new Schema(
  {
    uploader: { type: Types.ObjectId, ref: "User", required: true },
    room: { type: Types.ObjectId, ref: "Room", required: true },

    // Cloudinary / storage info
    url: { type: String, required: true },         // direct access URL
    publicId: { type: String, required: true },    // Cloudinary public_id (needed for delete/transformations)
    filename: { type: String, required: true },    // original filename
    bytes: { type: Number },                       // file size in bytes
    mimeType: { type: String },                    // MIME type (image/png, video/mp4, etc.)

    // Categorization
    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      default: "file",
    },

    // Optional relation to a message (file may belong to one)
    message: { type: Types.ObjectId, ref: "Message", default: null },

    // Soft delete (if a file is removed but history should remain)
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * Helper: mark file as deleted (soft delete).
 */
FileSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

module.exports = model("File", FileSchema);