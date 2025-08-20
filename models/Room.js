const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const MemberSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
  joinedAt: { type: Date, default: Date.now }
});

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    members: [MemberSchema],
    isPrivate: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Room = model("Room", RoomSchema);

module.exports = Room;