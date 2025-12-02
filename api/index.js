import express from 'express';
import session from 'express-session';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { eq, desc, or } from 'drizzle-orm';
import crypto from 'crypto';
import memorystore from 'memorystore';

neonConfig.fetchConnectionCache = true;

const app = express();

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
const db = pool ? drizzle(pool) : null;

const MemoryStore = memorystore(session);

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'platform-trade-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ADMIN_EMAIL = "Fatahstammy@gmail.com";
const ADMIN_PASSWORD = "696233";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");

app.post("/api/auth/register", async (req, res) => {
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
  } catch (error) {
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
  } catch (error) {
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

app.get("/api/gift-cards", async (req, res) => {
  res.json([]);
});

app.post("/api/gift-cards", async (req, res) => {
  res.json({ success: true, message: "Gift card submission received" });
});

app.get("/api/crypto-trades", async (req, res) => {
  res.json([]);
});

app.post("/api/crypto-trades", async (req, res) => {
  res.json({ success: true, message: "Crypto trade submitted" });
});

app.get("/api/gadgets", async (req, res) => {
  res.json([]);
});

app.get("/api/gadgets/:id", async (req, res) => {
  res.status(404).json({ error: "Gadget not found" });
});

app.get("/api/gadget-submissions", async (req, res) => {
  res.json([]);
});

app.post("/api/gadget-submissions", async (req, res) => {
  res.json({ success: true, message: "Gadget submission received" });
});

app.get("/api/exchange-rates", async (req, res) => {
  res.json(null);
});

app.get("/api/messages", async (req, res) => {
  res.json([]);
});

app.get("/api/messages/user", async (req, res) => {
  res.json([]);
});

app.post("/api/messages", async (req, res) => {
  res.json({ success: true, message: "Message sent" });
});

app.get("/api/admin/stats", async (req, res) => {
  res.json({
    pendingGiftCards: 0,
    cryptoTrades: 0,
    gadgetRequests: 0,
    completedToday: 0,
  });
});

app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

export default app;
