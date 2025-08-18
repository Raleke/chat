const { Schema, model, Types } = require("mongoose");

const FileSchema = new Schema(
  {
    uploader: { type: Types.ObjectId, ref: "User", required: true },
    room: { type: Types.ObjectId, ref: "Room", required: true },

  
    url: { type: String, required: true },         
    publicId: { type: String, required: true },    
    filename: { type: String, required: true },    
    bytes: { type: Number },                       
    mimeType: { type: String },                   


    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      default: "file",
    },
    message: { type: Types.ObjectId, ref: "Message", default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FileSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

module.exports = model("File", FileSchema);