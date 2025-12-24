import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import {
  giftCardSubmissions,
  cryptoTrades,
  gadgetSubmissions,
  gadgets,
  users,
  messages,
  exchangeRates,
  type InsertGiftCard,
  type GiftCard,
  type InsertCryptoTrade,
  type CryptoTrade,
  type InsertGadgetSubmission,
  type GadgetSubmission,
  type InsertGadget,
  type Gadget,
  type User,
  type Message,
  type InsertExchangeRate,
  type ExchangeRate,
} from "@shared/schema";
import { eq, desc, or } from "drizzle-orm";

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}
neonConfig.fetchConnectionCache = true;

const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;
const db = pool ? drizzle(pool) : null;

export interface IStorage {
  // Users
  createUser(email: string, username: string, passwordHash: string, isAdmin?: boolean): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;

  // Messages
  createMessage(senderId: string, senderUsername: string, messageText: string, isAdminMessage: boolean, recipientId?: string): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessagesBySender(senderId: string): Promise<Message[]>;
  getMessagesForUser(userId: string): Promise<Message[]>;

  // Gift Cards
  createGiftCardSubmission(data: InsertGiftCard): Promise<GiftCard>;
  getGiftCardSubmissions(): Promise<GiftCard[]>;
  getGiftCardSubmission(id: string): Promise<GiftCard | undefined>;
  updateGiftCardStatus(id: string, status: string, rejectionReason?: string): Promise<GiftCard | undefined>;

  // Crypto Trades
  createCryptoTrade(data: InsertCryptoTrade): Promise<CryptoTrade>;
  getCryptoTrades(): Promise<CryptoTrade[]>;
  getCryptoTrade(id: string): Promise<CryptoTrade | undefined>;
  updateCryptoTradeStatus(id: string, status: string, rejectionReason?: string): Promise<CryptoTrade | undefined>;

  // Gadget Submissions
  createGadgetSubmission(data: InsertGadgetSubmission): Promise<GadgetSubmission>;
  getGadgetSubmissions(): Promise<GadgetSubmission[]>;
  getGadgetSubmission(id: string): Promise<GadgetSubmission | undefined>;
  updateGadgetSubmissionStatus(id: string, status: string, rejectionReason?: string): Promise<GadgetSubmission | undefined>;

  // Gadgets (Products)
  createGadget(data: InsertGadget): Promise<Gadget>;
  getGadgets(): Promise<Gadget[]>;
  getGadget(id: string): Promise<Gadget | undefined>;
  updateGadget(id: string, data: Partial<InsertGadget>): Promise<Gadget | undefined>;

  // Exchange Rates
  createOrUpdateExchangeRate(data: InsertExchangeRate): Promise<ExchangeRate>;
  getCurrentExchangeRates(): Promise<ExchangeRate | undefined>;
}

export class DbStorage implements IStorage {
  private ensureDb() {
    if (!db) {
      throw new Error('Database not configured');
    }
    return db;
  }

  // Users
  async createUser(email: string, username: string, passwordHash: string, isAdmin = false): Promise<User> {
    const database = this.ensureDb();
    const [result] = await database.insert(users).values({ email, username, passwordHash, isAdmin }).returning();
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(users).where(eq(users.email, email));
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(users).where(eq(users.username, username));
    return result;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(users).where(eq(users.id, id));
    return result;
  }

  // Messages
  async createMessage(senderId: string, senderUsername: string, messageText: string, isAdminMessage: boolean, recipientId?: string): Promise<Message> {
    const database = this.ensureDb();
    const [result] = await database.insert(messages).values({ senderId, senderUsername, messageText, isAdminMessage, recipientId }).returning();
    return result;
  }

  async getMessages(): Promise<Message[]> {
    const database = this.ensureDb();
    return database.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessagesBySender(senderId: string): Promise<Message[]> {
    const database = this.ensureDb();
    return database.select().from(messages).where(eq(messages.senderId, senderId)).orderBy(desc(messages.createdAt));
  }

  async getMessagesForUser(userId: string): Promise<Message[]> {
    const database = this.ensureDb();
    return database.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.recipientId, userId)
      )
    ).orderBy(messages.createdAt);
  }

  // Gift Cards
  async createGiftCardSubmission(data: InsertGiftCard): Promise<GiftCard> {
    const database = this.ensureDb();
    const [result] = await database.insert(giftCardSubmissions).values(data).returning();
    return result;
  }

  async getGiftCardSubmissions(): Promise<GiftCard[]> {
    const database = this.ensureDb();
    return database.select().from(giftCardSubmissions).orderBy(desc(giftCardSubmissions.createdAt));
  }

  async getGiftCardSubmission(id: string): Promise<GiftCard | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(giftCardSubmissions).where(eq(giftCardSubmissions.id, id));
    return result;
  }

  async updateGiftCardStatus(id: string, status: string, rejectionReason?: string): Promise<GiftCard | undefined> {
    const database = this.ensureDb();
    const updateData: any = { status };
    if (rejectionReason !== undefined) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await database
      .update(giftCardSubmissions)
      .set(updateData)
      .where(eq(giftCardSubmissions.id, id))
      .returning();
    return result;
  }

  // Crypto Trades
  async createCryptoTrade(data: InsertCryptoTrade): Promise<CryptoTrade> {
    const database = this.ensureDb();
    const [result] = await database.insert(cryptoTrades).values(data).returning();
    return result;
  }

  async getCryptoTrades(): Promise<CryptoTrade[]> {
    const database = this.ensureDb();
    return database.select().from(cryptoTrades).orderBy(desc(cryptoTrades.createdAt));
  }

  async getCryptoTrade(id: string): Promise<CryptoTrade | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(cryptoTrades).where(eq(cryptoTrades.id, id));
    return result;
  }

  async updateCryptoTradeStatus(id: string, status: string, rejectionReason?: string): Promise<CryptoTrade | undefined> {
    const database = this.ensureDb();
    const updateData: any = { status };
    if (rejectionReason !== undefined) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await database
      .update(cryptoTrades)
      .set(updateData)
      .where(eq(cryptoTrades.id, id))
      .returning();
    return result;
  }

  // Gadget Submissions
  async createGadgetSubmission(data: InsertGadgetSubmission): Promise<GadgetSubmission> {
    const database = this.ensureDb();
    const [result] = await database.insert(gadgetSubmissions).values(data).returning();
    return result;
  }

  async getGadgetSubmissions(): Promise<GadgetSubmission[]> {
    const database = this.ensureDb();
    return database.select().from(gadgetSubmissions).orderBy(desc(gadgetSubmissions.createdAt));
  }

  async getGadgetSubmission(id: string): Promise<GadgetSubmission | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(gadgetSubmissions).where(eq(gadgetSubmissions.id, id));
    return result;
  }

  async updateGadgetSubmissionStatus(id: string, status: string, rejectionReason?: string): Promise<GadgetSubmission | undefined> {
    const database = this.ensureDb();
    const updateData: any = { status };
    if (rejectionReason !== undefined) {
      updateData.rejectionReason = rejectionReason;
    }
    const [result] = await database
      .update(gadgetSubmissions)
      .set(updateData)
      .where(eq(gadgetSubmissions.id, id))
      .returning();
    return result;
  }

  // Gadgets (Products)
  async createGadget(data: InsertGadget): Promise<Gadget> {
    const database = this.ensureDb();
    const [result] = await database.insert(gadgets).values(data).returning();
    return result;
  }

  async getGadgets(): Promise<Gadget[]> {
    const database = this.ensureDb();
    return database.select().from(gadgets).orderBy(desc(gadgets.createdAt));
  }

  async getGadget(id: string): Promise<Gadget | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(gadgets).where(eq(gadgets.id, id));
    return result;
  }

  async updateGadget(id: string, data: Partial<InsertGadget>): Promise<Gadget | undefined> {
    const database = this.ensureDb();
    const [result] = await database
      .update(gadgets)
      .set(data)
      .where(eq(gadgets.id, id))
      .returning();
    return result;
  }

  // Exchange Rates
  async createOrUpdateExchangeRate(data: InsertExchangeRate): Promise<ExchangeRate> {
    const database = this.ensureDb();
    const existing = await this.getCurrentExchangeRates();
    if (existing) {
      const [result] = await database
        .update(exchangeRates)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(exchangeRates.id, existing.id))
        .returning();
      return result;
    }
    const [result] = await database.insert(exchangeRates).values(data).returning();
    return result;
  }

  async getCurrentExchangeRates(): Promise<ExchangeRate | undefined> {
    const database = this.ensureDb();
    const [result] = await database.select().from(exchangeRates).orderBy(desc(exchangeRates.updatedAt)).limit(1);
    return result;
  }
}

export const storage = new DbStorage();
