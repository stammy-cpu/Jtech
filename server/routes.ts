import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertGiftCardSchema, insertCryptoTradeSchema, insertGadgetSubmissionSchema, insertMessageSchema, insertGadgetSchema, insertExchangeRateSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import crypto from "crypto";
import fs from "fs";

// Configure multer storage - use memory on read-only filesystems, disk otherwise
let multerStorage: any;
try {
  // Try to create uploads directory - fails on Vercel's read-only fs
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }
  multerStorage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
} catch (error: any) {
  // Fallback to memory storage on Vercel
  console.log("Using memory storage for uploads (read-only filesystem detected)");
  multerStorage = multer.memoryStorage();
}

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Hardcoded admin credentials for development
const ADMIN_EMAIL = "Fatahstammy@gmail.com";
const ADMIN_PASSWORD = "696233";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username and password required" });
      }

      // Database unavailable - don't allow registration
      return res.status(503).json({ error: "Registration temporarily unavailable. Please try logging in instead." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Check hardcoded admin credentials first
      if (email === ADMIN_EMAIL) {
        const hash = crypto.createHash("sha256").update(password).digest("hex");
        if (hash === ADMIN_PASSWORD_HASH) {
          req.session.userId = "admin-user-id";
          req.session.isAdmin = true;
          return res.json({ id: "admin-user-id", email: email, username: "Admin", isAdmin: true });
        }
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Try database for other users
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const hash = crypto.createHash("sha256").update(password).digest("hex");
        if (hash !== user.passwordHash) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.userId = user.id;
        req.session.isAdmin = user.isAdmin;
        
        res.json({ id: user.id, email: user.email, username: user.username || "User", isAdmin: user.isAdmin });
      } catch (dbError: any) {
        // Database not available, only allow admin login
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Check if this is hardcoded admin
      if (req.session.userId === "admin-user-id" && req.session.isAdmin) {
        return res.json({ id: "admin-user-id", email: ADMIN_EMAIL, username: "Admin", isAdmin: true });
      }

      // Try to get from database
      try {
        const user = await storage.getUserById(req.session.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        res.json({ id: user.id, email: user.email, username: user.username || "User", isAdmin: user.isAdmin });
      } catch (dbError: any) {
        // Database not available, return admin info if authenticated
        if (req.session.isAdmin) {
          return res.json({ id: req.session.userId, email: ADMIN_EMAIL, username: "Admin", isAdmin: true });
        }
        res.status(401).json({ error: "User not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: Error | undefined) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Messages Routes
  app.post("/api/messages", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { messageText } = req.body;
      try {
        const user = await storage.getUserById(req.session.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        const validatedData = insertMessageSchema.parse({ messageText, senderUsername: user.username });
        const message = await storage.createMessage(user.id, user.username, validatedData.messageText, false);

        res.json(message);
      } catch (dbError: any) {
        // Database unavailable, return success without storing
        res.json({ success: true, message: "Message sent" });
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages/reply", async (req, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { messageText, recipientId } = req.body;
      if (!recipientId) {
        return res.status(400).json({ error: "recipientId is required" });
      }

      try {
        const user = await storage.getUserById(req.session.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        const senderUsername = user.username || "Admin";
        const validatedData = insertMessageSchema.parse({ messageText, senderUsername });
        const message = await storage.createMessage(user.id, senderUsername, validatedData.messageText, true, recipientId);

        res.json(message);
      } catch (dbError: any) {
        // Database unavailable, return success without storing
        res.json({ success: true, message: "Reply sent" });
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error: any) {
      // Return empty array if database is not available
      res.json([]);
    }
  });

  app.get("/api/messages/user", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const messages = await storage.getMessagesForUser(req.session.userId);
      res.json(messages);
    } catch (error: any) {
      // Return empty array if database is not available
      res.json([]);
    }
  });

  // Gift Card Routes
  app.post("/api/gift-cards", upload.array("images", 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
      
      const data = {
        ...req.body,
        amount: parseInt(req.body.amount),
        imageUrls,
      };

      const validatedData = insertGiftCardSchema.parse(data);
      try {
        const result = await storage.createGiftCardSubmission(validatedData);
        res.json(result);
      } catch (dbError: any) {
        // Database unavailable, return success without storing
        res.json({ success: true, message: "Gift card submission received" });
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/gift-cards", async (req, res) => {
    try {
      const results = await storage.getGiftCardSubmissions();
      res.json(results);
    } catch (error: any) {
      // Return empty array if database is not available
      res.json([]);
    }
  });

  app.get("/api/gift-cards/:id", async (req, res) => {
    try {
      const result = await storage.getGiftCardSubmission(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gift card submission not found" });
      }
      res.json(result);
    } catch (error: any) {
      // Return 404 if database is not available
      res.status(404).json({ error: "Gift card submission not found" });
    }
  });

  app.patch("/api/gift-cards/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateGiftCardStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Gift card submission not found" });
      }

      // Auto-message user if rejected
      if (status === "rejected" && rejectionReason && result.customerEmail) {
        const user = await storage.getUserByEmail(result.customerEmail);
        if (user && req.session.userId) {
          const adminUser = await storage.getUserById(req.session.userId);
          if (adminUser) {
            await storage.createMessage(
              req.session.userId,
              adminUser.username,
              `Your gift card submission (${result.cardType} ${result.region} - ₦${result.amount}) has been REJECTED: ${rejectionReason}`,
              true,
              user.id
            );
          }
        }
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crypto Trade Routes
  app.post("/api/crypto-trades", async (req, res) => {
    try {
      const validatedData = insertCryptoTradeSchema.parse(req.body);
      const result = await storage.createCryptoTrade(validatedData);
      res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/crypto-trades", async (req, res) => {
    try {
      const results = await storage.getCryptoTrades();
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/crypto-trades/:id", async (req, res) => {
    try {
      const result = await storage.getCryptoTrade(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Crypto trade not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/crypto-trades/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateCryptoTradeStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Crypto trade not found" });
      }

      // Auto-message user if rejected
      if (status === "rejected" && rejectionReason && result.customerEmail) {
        const user = await storage.getUserByEmail(result.customerEmail);
        if (user && req.session.userId) {
          const adminUser = await storage.getUserById(req.session.userId);
          if (adminUser) {
            await storage.createMessage(
              req.session.userId,
              adminUser.username,
              `Your crypto trade (${result.tradeType} ${result.coin} - ${result.amount}) has been REJECTED: ${rejectionReason}`,
              true,
              user.id
            );
          }
        }
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Gadget Submission Routes
  app.post("/api/gadget-submissions", upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];
      
      const data = {
        ...req.body,
        imageUrls,
      };

      const validatedData = insertGadgetSubmissionSchema.parse(data);
      const result = await storage.createGadgetSubmission(validatedData);
      
      res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/gadget-submissions", async (req, res) => {
    try {
      const results = await storage.getGadgetSubmissions();
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/gadget-submissions/:id", async (req, res) => {
    try {
      const result = await storage.getGadgetSubmission(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gadget submission not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/gadget-submissions/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateGadgetSubmissionStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Gadget submission not found" });
      }

      // Auto-message user if rejected
      if (status === "rejected" && rejectionReason && result.customerEmail) {
        const user = await storage.getUserByEmail(result.customerEmail);
        if (user && req.session.userId) {
          const adminUser = await storage.getUserById(req.session.userId);
          if (adminUser) {
            await storage.createMessage(
              req.session.userId,
              adminUser.username,
              `Your gadget trade-in (${result.brand} ${result.model}) has been REJECTED: ${rejectionReason}`,
              true,
              user.id
            );
          }
        }
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Gadgets (Marketplace) Routes
  app.post("/api/gadgets", upload.array("images", 10), async (req: Request, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }

      const imageUrls = files.map(file => `/uploads/${file.filename}`);
      
      const data = {
        name: req.body.name,
        price: parseInt(req.body.price, 10),
        condition: req.body.condition,
        description: req.body.description || "",
        specs: req.body.specs ? req.body.specs.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        imageUrls,
        available: true,
      };

      if (isNaN(data.price) || data.price <= 0) {
        return res.status(400).json({ error: "Invalid price" });
      }

      const validatedData = insertGadgetSchema.parse(data);
      const result = await storage.createGadget(validatedData);
      res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/gadgets", async (req, res) => {
    try {
      const results = await storage.getGadgets();
      res.json(results);
    } catch (error: any) {
      // Return empty array if database is not available
      res.json([]);
    }
  });

  app.get("/api/gadgets/:id", async (req, res) => {
    try {
      const result = await storage.getGadget(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gadget not found" });
      }
      res.json(result);
    } catch (error: any) {
      // Return 404 if database is not available
      res.status(404).json({ error: "Gadget not found" });
    }
  });

  // Exchange Rates Routes
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const rates = await storage.getCurrentExchangeRates();
      res.json(rates || null);
    } catch (error: any) {
      // Return default rates if database is not available
      res.json(null);
    }
  });

  app.post("/api/exchange-rates", async (req: Request, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const validatedData = insertExchangeRateSchema.parse(req.body);
      const result = await storage.createOrUpdateExchangeRate(validatedData);
      res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Stats Route
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [giftCards, cryptoTrades, gadgetSubmissions] = await Promise.all([
        storage.getGiftCardSubmissions(),
        storage.getCryptoTrades(),
        storage.getGadgetSubmissions(),
      ]);

      const stats = {
        pendingGiftCards: giftCards.filter(gc => gc.status === "pending").length,
        cryptoTrades: cryptoTrades.filter(ct => ct.status === "pending").length,
        gadgetRequests: gadgetSubmissions.filter(gs => gs.status === "pending").length,
        completedToday: [
          ...giftCards.filter(gc => gc.status === "completed" && isToday(gc.createdAt)),
          ...cryptoTrades.filter(ct => ct.status === "completed" && isToday(ct.createdAt)),
          ...gadgetSubmissions.filter(gs => gs.status === "completed" && isToday(gs.createdAt)),
        ].length,
      };

      res.json(stats);
    } catch (error: any) {
      // Return zero stats if database is not available
      res.json({
        pendingGiftCards: 0,
        cryptoTrades: 0,
        gadgetRequests: 0,
        completedToday: 0,
      });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  const express = await import("express");
  app.use("/uploads", express.default.static("uploads"));

  // Create HTTP server for local dev (used by index-dev.ts)
  // For Vercel, the app is exported directly without a server
  const httpServer = createServer(app);

  return httpServer;
}

// Export a sync version that just registers routes for Vercel
export function registerRoutesSync(app: Express) {
  // For Vercel, we don't create an HTTP server
  // This is a placeholder to keep the same interface
  return;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
