import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import { app as expressApp } from "./app";
import { registerRoutes } from "./routes";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find public directory
function getPublicPath(): string {
  const possiblePaths = [
    path.join(__dirname, "../public"),
    path.join(__dirname, "public"),
    path.join(process.cwd(), "dist", "public"),
    "/var/task/dist/public",
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Build directory not found");
}

const publicPath = getPublicPath();

// Register routes first, then setup static files
(async () => {
  try {
    // Register all API routes
    await registerRoutes(expressApp);

    // After routes are registered, add static files + SPA fallback
    expressApp.use(express.static(publicPath));
    expressApp.use("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  } catch (err) {
    console.error("Initialization error:", err);
    // Setup minimal fallback even if routes fail
    expressApp.use(express.static(publicPath));
    expressApp.use("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  }
})();

export default expressApp;
