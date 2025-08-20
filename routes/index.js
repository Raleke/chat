const express = require("express");

const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const roomRoutes = require("./roomRoutes.js");
const messageRoutes = require("./messageRoutes.js");
const fileRoutes = require("./fileRoutes.js");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/messages", messageRoutes);
router.use("/files", fileRoutes);

module.exports = router;