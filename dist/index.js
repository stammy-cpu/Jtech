// server/index-prod.ts
import fs2 from "node:fs";
import path2 from "node:path";
import { fileURLToPath } from "node:url";
import express2 from "express";

// server/app.ts
import express from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import memorystore from "memorystore";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  senderUsername: text("sender_username").notNull(),
  messageText: text("message_text").notNull(),
  recipientId: varchar("recipient_id").references(() => users.id),
  isAdminMessage: boolean("is_admin_message").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var giftCardSubmissions = pgTable("gift_card_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardType: text("card_type").notNull(),
  region: text("region").notNull(),
  amount: integer("amount").notNull(),
  cardCode: text("card_code"),
  imageUrls: text("image_urls").array(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountName: text("account_name").notNull(),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var cryptoTrades = pgTable("crypto_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeType: text("trade_type").notNull(),
  coin: text("coin").notNull(),
  amount: text("amount").notNull(),
  transactionHash: text("transaction_hash"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountName: text("account_name"),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var gadgetSubmissions = pgTable("gadget_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionType: text("submission_type").notNull(),
  deviceType: text("device_type"),
  brand: text("brand"),
  model: text("model"),
  condition: text("condition"),
  description: text("description"),
  imageUrls: text("image_urls").array(),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountName: text("account_name"),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var gadgets = pgTable("gadgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(),
  description: text("description"),
  specs: text("specs").array(),
  imageUrls: text("image_urls").array().notNull(),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var exchangeRates = pgTable("exchange_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usdToNaira: integer("usd_to_naira").notNull(),
  giftCardRate: integer("gift_card_rate").notNull(),
  btcToNaira: integer("btc_to_naira").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertGiftCardSchema = createInsertSchema(giftCardSubmissions).omit({
  id: true,
  createdAt: true
});
var insertCryptoTradeSchema = createInsertSchema(cryptoTrades).omit({
  id: true,
  createdAt: true
});
var insertGadgetSubmissionSchema = createInsertSchema(gadgetSubmissions).omit({
  id: true,
  createdAt: true
});
var insertGadgetSchema = createInsertSchema(gadgets).omit({
  id: true,
  createdAt: true
});
var insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  updatedAt: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  createdAt: true
});
var insertMessageSchema = z.object({
  messageText: z.string().min(1, "Message cannot be empty").max(5e3),
  senderUsername: z.string()
});

// server/storage.ts
import { eq, desc, or } from "drizzle-orm";
neonConfig.webSocketConstructor = ws;
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool);
var DbStorage = class {
  // Users
  async createUser(email, username, passwordHash, isAdmin = false) {
    const [result] = await db.insert(users).values({ email, username, passwordHash, isAdmin }).returning();
    return result;
  }
  async getUserByEmail(email) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
  }
  async getUserByUsername(username) {
    const [result] = await db.select().from(users).where(eq(users.username, username));
    return result;
  }
  async getUserById(id) {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  }
  // Messages
  async createMessage(senderId, senderUsername, messageText, isAdminMessage, recipientId) {
    const [result] = await db.insert(messages).values({ senderId, senderUsername, messageText, isAdminMessage, recipientId }).returning();
    return result;
  }
  async getMessages() {
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  }
  async getMessagesBySender(senderId) {
    return db.select().from(messages).where(eq(messages.senderId, senderId)).orderBy(desc(messages.createdAt));
  }
  async getMessagesForUser(userId) {
    return db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.recipientId, userId)
      )
    ).orderBy(messages.createdAt);
  }
  // Gift Cards
  async createGiftCardSubmission(data) {
    const [result] = await db.insert(giftCardSubmissions).values(data).returning();
    return result;
  }
  async getGiftCardSubmissions() {
    return db.select().from(giftCardSubmissions).orderBy(desc(giftCardSubmissions.createdAt));
  }
  async getGiftCardSubmission(id) {
    const [result] = await db.select().from(giftCardSubmissions).where(eq(giftCardSubmissions.id, id));
    return result;
  }
  async updateGiftCardStatus(id, status, rejectionReason) {
    const updateData = { status };
    if (rejectionReason !== void 0) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await db.update(giftCardSubmissions).set(updateData).where(eq(giftCardSubmissions.id, id)).returning();
    return result;
  }
  // Crypto Trades
  async createCryptoTrade(data) {
    const [result] = await db.insert(cryptoTrades).values(data).returning();
    return result;
  }
  async getCryptoTrades() {
    return db.select().from(cryptoTrades).orderBy(desc(cryptoTrades.createdAt));
  }
  async getCryptoTrade(id) {
    const [result] = await db.select().from(cryptoTrades).where(eq(cryptoTrades.id, id));
    return result;
  }
  async updateCryptoTradeStatus(id, status, rejectionReason) {
    const updateData = { status };
    if (rejectionReason !== void 0) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await db.update(cryptoTrades).set(updateData).where(eq(cryptoTrades.id, id)).returning();
    return result;
  }
  // Gadget Submissions
  async createGadgetSubmission(data) {
    const [result] = await db.insert(gadgetSubmissions).values(data).returning();
    return result;
  }
  async getGadgetSubmissions() {
    return db.select().from(gadgetSubmissions).orderBy(desc(gadgetSubmissions.createdAt));
  }
  async getGadgetSubmission(id) {
    const [result] = await db.select().from(gadgetSubmissions).where(eq(gadgetSubmissions.id, id));
    return result;
  }
  async updateGadgetSubmissionStatus(id, status, rejectionReason) {
    const updateData = { status };
    if (rejectionReason !== void 0) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await db.update(gadgetSubmissions).set(updateData).where(eq(gadgetSubmissions.id, id)).returning();
    return result;
  }
  // Gadgets (Products)
  async createGadget(data) {
    const [result] = await db.insert(gadgets).values(data).returning();
    return result;
  }
  async getGadgets() {
    return db.select().from(gadgets).orderBy(desc(gadgets.createdAt));
  }
  async getGadget(id) {
    const [result] = await db.select().from(gadgets).where(eq(gadgets.id, id));
    return result;
  }
  async updateGadget(id, data) {
    const [result] = await db.update(gadgets).set(data).where(eq(gadgets.id, id)).returning();
    return result;
  }
  // Exchange Rates
  async createOrUpdateExchangeRate(data) {
    const existing = await this.getCurrentExchangeRates();
    if (existing) {
      const [result2] = await db.update(exchangeRates).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(exchangeRates.id, existing.id)).returning();
      return result2;
    }
    const [result] = await db.insert(exchangeRates).values(data).returning();
    return result;
  }
  async getCurrentExchangeRates() {
    const [result] = await db.select().from(exchangeRates).orderBy(desc(exchangeRates.updatedAt)).limit(1);
    return result;
  }
};
var storage = new DbStorage();

// server/routes.ts
import multer from "multer";
import path from "path";
import { fromError } from "zod-validation-error";
import crypto from "crypto";
import fs from "fs";
var multerStorage;
try {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }
  multerStorage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  });
} catch (error) {
  console.log("Using memory storage for uploads (read-only filesystem detected)");
  multerStorage = multer.memoryStorage();
}
var upload = multer({
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
  }
});
var ADMIN_EMAIL = "Fatahstammy@gmail.com";
var ADMIN_PASSWORD = "696233";
var ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username and password required" });
      }
      return res.status(503).json({ error: "Registration temporarily unavailable. Please try logging in instead." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      if (email === ADMIN_EMAIL) {
        const hash = crypto.createHash("sha256").update(password).digest("hex");
        if (hash === ADMIN_PASSWORD_HASH) {
          req.session.userId = "admin-user-id";
          req.session.isAdmin = true;
          return res.json({ id: "admin-user-id", email, username: "Admin", isAdmin: true });
        }
        return res.status(401).json({ error: "Invalid credentials" });
      }
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
      } catch (dbError) {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      if (req.session.userId === "admin-user-id" && req.session.isAdmin) {
        return res.json({ id: "admin-user-id", email: ADMIN_EMAIL, username: "Admin", isAdmin: true });
      }
      try {
        const user = await storage.getUserById(req.session.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        res.json({ id: user.id, email: user.email, username: user.username || "User", isAdmin: user.isAdmin });
      } catch (dbError) {
        if (req.session.isAdmin) {
          return res.json({ id: req.session.userId, email: ADMIN_EMAIL, username: "Admin", isAdmin: true });
        }
        res.status(401).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  app2.post("/api/messages", async (req, res) => {
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
      } catch (dbError) {
        res.json({ success: true, message: "Message sent" });
      }
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/messages/reply", async (req, res) => {
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
      } catch (dbError) {
        res.json({ success: true, message: "Reply sent" });
      }
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/messages", async (req, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      const messages2 = await storage.getMessages();
      res.json(messages2);
    } catch (error) {
      res.json([]);
    }
  });
  app2.get("/api/messages/user", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const messages2 = await storage.getMessagesForUser(req.session.userId);
      res.json(messages2);
    } catch (error) {
      res.json([]);
    }
  });
  app2.post("/api/gift-cards", upload.array("images", 5), async (req, res) => {
    try {
      const files = req.files;
      const imageUrls = files?.map((file) => `/uploads/${file.filename}`) || [];
      const data = {
        ...req.body,
        amount: parseInt(req.body.amount),
        imageUrls
      };
      const validatedData = insertGiftCardSchema.parse(data);
      try {
        const result = await storage.createGiftCardSubmission(validatedData);
        res.json(result);
      } catch (dbError) {
        res.json({ success: true, message: "Gift card submission received" });
      }
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/gift-cards", async (req, res) => {
    try {
      const results = await storage.getGiftCardSubmissions();
      res.json(results);
    } catch (error) {
      res.json([]);
    }
  });
  app2.get("/api/gift-cards/:id", async (req, res) => {
    try {
      const result = await storage.getGiftCardSubmission(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gift card submission not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: "Gift card submission not found" });
    }
  });
  app2.patch("/api/gift-cards/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateGiftCardStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Gift card submission not found" });
      }
      if (status === "rejected" && rejectionReason && result.customerEmail) {
        const user = await storage.getUserByEmail(result.customerEmail);
        if (user && req.session.userId) {
          const adminUser = await storage.getUserById(req.session.userId);
          if (adminUser) {
            await storage.createMessage(
              req.session.userId,
              adminUser.username,
              `Your gift card submission (${result.cardType} ${result.region} - \u20A6${result.amount}) has been REJECTED: ${rejectionReason}`,
              true,
              user.id
            );
          }
        }
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/crypto-trades", async (req, res) => {
    try {
      const validatedData = insertCryptoTradeSchema.parse(req.body);
      const result = await storage.createCryptoTrade(validatedData);
      res.json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/crypto-trades", async (req, res) => {
    try {
      const results = await storage.getCryptoTrades();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/crypto-trades/:id", async (req, res) => {
    try {
      const result = await storage.getCryptoTrade(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Crypto trade not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/crypto-trades/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateCryptoTradeStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Crypto trade not found" });
      }
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/gadget-submissions", upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files;
      const imageUrls = files?.map((file) => `/uploads/${file.filename}`) || [];
      const data = {
        ...req.body,
        imageUrls
      };
      const validatedData = insertGadgetSubmissionSchema.parse(data);
      const result = await storage.createGadgetSubmission(validatedData);
      res.json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/gadget-submissions", async (req, res) => {
    try {
      const results = await storage.getGadgetSubmissions();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/gadget-submissions/:id", async (req, res) => {
    try {
      const result = await storage.getGadgetSubmission(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gadget submission not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/gadget-submissions/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const result = await storage.updateGadgetSubmissionStatus(req.params.id, status, rejectionReason);
      if (!result) {
        return res.status(404).json({ error: "Gadget submission not found" });
      }
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/gadgets", upload.array("images", 10), async (req, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }
      const imageUrls = files.map((file) => `/uploads/${file.filename}`);
      const data = {
        name: req.body.name,
        price: parseInt(req.body.price, 10),
        condition: req.body.condition,
        description: req.body.description || "",
        specs: req.body.specs ? req.body.specs.split(",").map((s) => s.trim()).filter(Boolean) : [],
        imageUrls,
        available: true
      };
      if (isNaN(data.price) || data.price <= 0) {
        return res.status(400).json({ error: "Invalid price" });
      }
      const validatedData = insertGadgetSchema.parse(data);
      const result = await storage.createGadget(validatedData);
      res.json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/gadgets", async (req, res) => {
    try {
      const results = await storage.getGadgets();
      res.json(results);
    } catch (error) {
      res.json([]);
    }
  });
  app2.get("/api/gadgets/:id", async (req, res) => {
    try {
      const result = await storage.getGadget(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Gadget not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: "Gadget not found" });
    }
  });
  app2.get("/api/exchange-rates", async (req, res) => {
    try {
      const rates = await storage.getCurrentExchangeRates();
      res.json(rates || null);
    } catch (error) {
      res.json(null);
    }
  });
  app2.post("/api/exchange-rates", async (req, res) => {
    try {
      if (!req.session.userId || !req.session.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      const validatedData = insertExchangeRateSchema.parse(req.body);
      const result = await storage.createOrUpdateExchangeRate(validatedData);
      res.json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const [giftCards, cryptoTrades2, gadgetSubmissions2] = await Promise.all([
        storage.getGiftCardSubmissions(),
        storage.getCryptoTrades(),
        storage.getGadgetSubmissions()
      ]);
      const stats = {
        pendingGiftCards: giftCards.filter((gc) => gc.status === "pending").length,
        cryptoTrades: cryptoTrades2.filter((ct) => ct.status === "pending").length,
        gadgetRequests: gadgetSubmissions2.filter((gs) => gs.status === "pending").length,
        completedToday: [
          ...giftCards.filter((gc) => gc.status === "completed" && isToday(gc.createdAt)),
          ...cryptoTrades2.filter((ct) => ct.status === "completed" && isToday(ct.createdAt)),
          ...gadgetSubmissions2.filter((gs) => gs.status === "completed" && isToday(gs.createdAt))
        ].length
      };
      res.json(stats);
    } catch (error) {
      res.json({
        pendingGiftCards: 0,
        cryptoTrades: 0,
        gadgetRequests: 0,
        completedToday: 0
      });
    }
  });
  app2.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  const express3 = await import("express");
  app2.use("/uploads", express3.default.static("uploads"));
  const httpServer = createServer(app2);
  return httpServer;
}
function isToday(date) {
  const today = /* @__PURE__ */ new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

// server/app.ts
import { Pool as Pool2 } from "@neondatabase/serverless";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
var sessionStore;
if (process.env.DATABASE_URL) {
  try {
    const pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
    const PgSession = ConnectPgSimple(session);
    sessionStore = new PgSession({
      pool: pool2,
      tableName: "session"
    });
  } catch (error) {
    console.log("PostgreSQL session store failed, using MemoryStore");
    const MemoryStore = memorystore(session);
    sessionStore = new MemoryStore({ checkPeriod: 864e5 });
  }
} else {
  const MemoryStore = memorystore(session);
  sessionStore = new MemoryStore({ checkPeriod: 864e5 });
}
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "dev-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1e3, httpOnly: true }
}));
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});

// server/index-prod.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
function getPublicPath() {
  const possiblePaths = [
    path2.join(__dirname, "../public"),
    path2.join(__dirname, "public"),
    path2.join(process.cwd(), "dist", "public"),
    "/var/task/dist/public"
  ];
  for (const p of possiblePaths) {
    if (fs2.existsSync(p)) return p;
  }
  throw new Error("Build directory not found");
}
var publicPath = getPublicPath();
(async () => {
  try {
    await registerRoutes(app);
    app.use(express2.static(publicPath));
    app.use("*", (_req, res) => {
      res.sendFile(path2.join(publicPath, "index.html"));
    });
  } catch (err) {
    console.error("Initialization error:", err);
    app.use(express2.static(publicPath));
    app.use("*", (_req, res) => {
      res.sendFile(path2.join(publicPath, "index.html"));
    });
  }
})();
var index_prod_default = app;
export {
  index_prod_default as default
};
