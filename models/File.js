const { Schema, model, Types } = require("mongoose");

const FileSchema = new Schema(
  {
    uploaderId: { type: Types.ObjectId, ref: "User", required: true },
    roomId: { type: Types.ObjectId, ref: "Room", required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    bytes: { type: Number },
    mime: { type: String },
    publicId: { type: String }
  },
  { timestamps: true }
);

module.exports = model("File", FileSchema);