import { Room } from "../models/Room.js";
import { logger } from "../utils/logger.js";

const createRoom = async ({ name, createdBy, isPrivate }) => {
  const room = new Room({ name, createdBy, members: [createdBy], isPrivate });
  await room.save();
  logger.info(`💬 Room created: ${room.name}`);
  return room;
};

const joinRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  if (!room.members.includes(userId)) {
    room.members.push(userId);
    await room.save();
    logger.info(`👥 User ${userId} joined room ${roomId}`);
  }

  return room;
};

const assignRole = async (roomId, userId, role) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const member = room.members.find((m) => m.user.toString() === userId.toString());
  if (member) {
    member.role = role;
    await room.save();
    logger.info(`⚡ User ${userId} role updated to ${role} in room ${roomId}`);
  }

  return room;
};

export { createRoom, joinRoom, assignRole };