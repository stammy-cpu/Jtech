import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import memorystore from 'memorystore';

const app = express();

const MemoryStore = memorystore(session);

app.set('trust proxy', 1);

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'platform-trade-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ADMIN_EMAIL = "Fatahstammy@gmail.com";
const ADMIN_PASSWORD = "696233";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");

declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAdmin: boolean;
  }
}

app.post("/api/auth/register", async (_req, res) => {
  return res.status(503).json({ error: "Registration temporarily unavailable. Please try logging in instead." });
});

app.post("/api/auth/login", async (req, res) => {
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
        return res.json({ id: "admin-user-id", email: email, username: "Admin", isAdmin: true });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (req.session.userId === "admin-user-id" && req.session.isAdmin) {
      return res.json({ id: "admin-user-id", email: ADMIN_EMAIL, username: "Admin", isAdmin: true });
    }

    res.status(401).json({ error: "User not found" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true });
  });
});

app.get("/api/gift-cards", async (_req, res) => {
  res.json([]);
});

app.post("/api/gift-cards", async (_req, res) => {
  res.json({ success: true, message: "Gift card submission received" });
});

app.get("/api/gift-cards/:id", async (_req, res) => {
  res.status(404).json({ error: "Gift card not found" });
});

app.patch("/api/gift-cards/:id/status", async (_req, res) => {
  res.json({ success: true });
});

app.get("/api/crypto-trades", async (_req, res) => {
  res.json([]);
});

app.post("/api/crypto-trades", async (_req, res) => {
  res.json({ success: true, message: "Crypto trade submitted" });
});

app.get("/api/crypto-trades/:id", async (_req, res) => {
  res.status(404).json({ error: "Crypto trade not found" });
});

app.patch("/api/crypto-trades/:id/status", async (_req, res) => {
  res.json({ success: true });
});

app.get("/api/gadgets", async (_req, res) => {
  res.json([]);
});

app.get("/api/gadgets/:id", async (_req, res) => {
  res.status(404).json({ error: "Gadget not found" });
});

app.post("/api/gadgets", async (_req, res) => {
  res.json({ success: true, message: "Gadget created" });
});

app.get("/api/gadget-submissions", async (_req, res) => {
  res.json([]);
});

app.post("/api/gadget-submissions", async (_req, res) => {
  res.json({ success: true, message: "Gadget submission received" });
});

app.get("/api/gadget-submissions/:id", async (_req, res) => {
  res.status(404).json({ error: "Gadget submission not found" });
});

app.patch("/api/gadget-submissions/:id/status", async (_req, res) => {
  res.json({ success: true });
});

app.get("/api/exchange-rates", async (_req, res) => {
  res.json(null);
});

app.post("/api/exchange-rates", async (_req, res) => {
  res.json({ success: true });
});

app.get("/api/messages", async (_req, res) => {
  res.json([]);
});

app.get("/api/messages/user", async (_req, res) => {
  res.json([]);
});

app.post("/api/messages", async (_req, res) => {
  res.json({ success: true, message: "Message sent" });
});

app.post("/api/messages/reply", async (_req, res) => {
  res.json({ success: true, message: "Reply sent" });
});

app.get("/api/admin/stats", async (_req, res) => {
  res.json({
    pendingGiftCards: 0,
    cryptoTrades: 0,
    gadgetRequests: 0,
    completedToday: 0,
  });
});

app.all("/api/*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
