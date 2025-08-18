const { Schema, model, Types } = require("mongoose");

const MemberSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "member"],
      default: "member"
    },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    // Who created this room
    createdBy: { type: Types.ObjectId, ref: "User", required: true },

    // Array of members with their room-specific roles
    members: [MemberSchema],

 
    type: {
      type: String,
      enum: ["group", "dm", "channel"], 
      default: "group"
    },
    isPrivate: { type: Boolean, default: false },

    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = model("Room", RoomSchema);