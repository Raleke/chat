const { Schema, model, Types } = require("mongoose");

const ReadReceiptSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReactionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    emoji: { type: String, required: true }, // e.g. "👍", "😂", "🔥"
    reactedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    room: {
      type: Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String, trim: true },

    attachments: [
      {
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["image", "video", "file", "audio"],
          default: "file",
        },
      },
    ],


    parentMessage: { type: Types.ObjectId, ref: "Message", default: null },
    reactions: [ReactionSchema],
    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "delivered", "failed"],
      default: "pending",
    },
    readBy: [ReadReceiptSchema],
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
MessageSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.isNew) {
    this.editedAt = new Date();
  }
  next();
});
MessageSchema.methods.markDelivered = function () {
  this.deliveryStatus = "delivered";
  return this.save();
};

MessageSchema.methods.markRead = function (userId) {
  const alreadyRead = this.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
  }
  return this.save();
};

MessageSchema.methods.addReaction = function (userId, emoji) {
  const existing = this.reactions.find(
    (r) => r.user.toString() === userId.toString() && r.emoji === emoji
  );
  if (!existing) {
    this.reactions.push({ user: userId, emoji });
  }
  return this.save();
};

MessageSchema.methods.removeReaction = function (userId, emoji) {
  this.reactions = this.reactions.filter(
    (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  return this.save();
};

module.exports = model("Message", MessageSchema);