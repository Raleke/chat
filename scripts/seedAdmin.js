import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chatapp";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB connected");

    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log(" Admin already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new User({
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });

    await admin.save();
    console.log(" Admin user created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(" Error seeding admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();