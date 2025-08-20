const { Room } = require("../models/Room.js");
const { logger } = require("../utils/logger.js");
const createRoom = async ({ name, createdBy, isPrivate }) => {
  const room = new Room({
    name,
    createdBy,
    members: [{ user: createdBy, role: "owner" }],
    isPrivate
  });

  await room.save();
  logger.info(` Room created: ${room.name} by ${createdBy}`);
  return room;
};


const joinRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const alreadyIn = room.members.some(m => m.user.toString() === userId.toString());
  if (!alreadyIn) {
    room.members.push({ user: userId, role: "member" });
    await room.save();
    logger.info(` User ${userId} joined room ${roomId}`);
  }

  return room;
};
const leaveRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  room.members = room.members.filter(m => m.user.toString() !== userId.toString());
  await room.save();

  logger.info(` User ${userId} left room ${roomId}`);
  return room;
};

/**
 * Assign or change role for a user inside a room.
 * - Owner can promote/demote anyone (except themselves).
 * - Admin can promote/demote members, but NOT touch owner or other admins.
 */
const assignRole = async (roomId, actingUserId, targetUserId, newRole) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const actingMember = room.members.find(m => m.user.toString() === actingUserId.toString());
  if (!actingMember) throw new Error("You are not a member of this room");

  const targetMember = room.members.find(m => m.user.toString() === targetUserId.toString());
  if (!targetMember) throw new Error("Target user not in room");

  if (actingMember.role === "member") {
    throw new Error("You are not authorized to assign roles");
  }

  if (actingMember.role === "admin" && targetMember.role !== "member") {
    throw new Error("Admins can only assign roles to members");
  }

  if (actingMember.role === "owner" && targetMember.role === "owner") {
    throw new Error("Owner cannot change their own role");
  }

  targetMember.role = newRole;
  await room.save();

  logger.info(` User ${targetUserId} role changed to ${newRole} in room ${roomId}`);
  return room;
};

/**
 * Remove a user from a room.
 * - Owner can remove anyone (except themselves).
 * - Admins can remove members only.
 */
const removeMember = async (roomId, actingUserId, targetUserId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const actingMember = room.members.find(m => m.user.toString() === actingUserId.toString());
  if (!actingMember) throw new Error("You are not a member of this room");

  const targetMember = room.members.find(m => m.user.toString() === targetUserId.toString());
  if (!targetMember) throw new Error("Target user not in room");

  if (actingMember.role === "member") {
    throw new Error("You are not authorized to remove members");
  }

  if (actingMember.role === "admin" && targetMember.role !== "member") {
    throw new Error("Admins can only remove members, not admins or owner");
  }

  if (actingMember.role === "owner" && targetMember.role === "owner") {
    throw new Error("Owner cannot remove themselves");
  }

  room.members = room.members.filter(m => m.user.toString() !== targetUserId.toString());
  await room.save();

  logger.info(` User ${targetUserId} removed from room ${roomId} by ${actingUserId}`);
  return room;
};

const getRoomDetails = async (roomId) => {
  return Room.findById(roomId).populate("members.user", "username email avatarUrl");
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  assignRole,
  removeMember,
  getRoomDetails
};