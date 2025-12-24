import { storage } from "./storage";
import crypto from "crypto";

async function initAdmin() {
  try {
    const existingAdmin = await storage.getUserByEmail("fatahstammy@gmail.com");
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const passwordHash = crypto.createHash("sha256").update("@21Savage").digest("hex");
    const admin = await storage.createUser("fatahstammy@gmail.com", "Admin", passwordHash, true);
    console.log("Admin user created:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize admin:", error);
    process.exit(1);
  }
}

initAdmin();
