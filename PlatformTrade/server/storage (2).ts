import {
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

export interface IStorage {
  createUser(email: string, username: string, passwordHash: string, isAdmin?: boolean): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createMessage(senderId: string, senderUsername: string, messageText: string, isAdminMessage: boolean, recipientId?: string): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessagesBySender(senderId: string): Promise<Message[]>;
  getMessagesForUser(userId: string): Promise<Message[]>;
  createGiftCardSubmission(data: InsertGiftCard): Promise<GiftCard>;
  getGiftCardSubmissions(): Promise<GiftCard[]>;
  getGiftCardSubmission(id: string): Promise<GiftCard | undefined>;
  updateGiftCardStatus(id: string, status: string, rejectionReason?: string): Promise<GiftCard | undefined>;
  createCryptoTrade(data: InsertCryptoTrade): Promise<CryptoTrade>;
  getCryptoTrades(): Promise<CryptoTrade[]>;
  getCryptoTrade(id: string): Promise<CryptoTrade | undefined>;
  updateCryptoTradeStatus(id: string, status: string, rejectionReason?: string): Promise<CryptoTrade | undefined>;
  createGadgetSubmission(data: InsertGadgetSubmission): Promise<GadgetSubmission>;
  getGadgetSubmissions(): Promise<GadgetSubmission[]>;
  getGadgetSubmission(id: string): Promise<GadgetSubmission | undefined>;
  updateGadgetSubmissionStatus(id: string, status: string, rejectionReason?: string): Promise<GadgetSubmission | undefined>;
  createGadget(data: InsertGadget): Promise<Gadget>;
  getGadgets(): Promise<Gadget[]>;
  getGadget(id: string): Promise<Gadget | undefined>;
  updateGadget(id: string, data: Partial<InsertGadget>): Promise<Gadget | undefined>;
  createOrUpdateExchangeRate(data: InsertExchangeRate): Promise<ExchangeRate>;
  getCurrentExchangeRates(): Promise<ExchangeRate | undefined>;
}

class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private messages: Message[] = [];
  private giftCards: Map<string, GiftCard> = new Map();
  private cryptoTrades: Map<string, CryptoTrade> = new Map();
  private gadgetSubmissions: Map<string, GadgetSubmission> = new Map();
  private gadgets: Map<string, Gadget> = new Map();
  private exchangeRates: ExchangeRate | undefined = undefined;

  async createUser(email: string, username: string, passwordHash: string, isAdmin = false): Promise<User> {
    const user: User = { id: Math.random().toString(), email, username, passwordHash, isAdmin, createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createMessage(senderId: string, senderUsername: string, messageText: string, isAdminMessage: boolean, recipientId?: string): Promise<Message> {
    const message: Message = { id: Math.random().toString(), senderId, senderUsername, messageText, isAdminMessage, recipientId, createdAt: new Date() };
    this.messages.push(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages].reverse();
  }

  async getMessagesBySender(senderId: string): Promise<Message[]> {
    return this.messages.filter(m => m.senderId === senderId).reverse();
  }

  async getMessagesForUser(userId: string): Promise<Message[]> {
    return this.messages.filter(m => m.senderId === userId || m.recipientId === userId);
  }

  async createGiftCardSubmission(data: InsertGiftCard): Promise<GiftCard> {
    const giftCard: GiftCard = { id: Math.random().toString(), ...data as any, createdAt: new Date(), status: "pending", rejectionReason: null };
    this.giftCards.set(giftCard.id, giftCard);
    return giftCard;
  }

  async getGiftCardSubmissions(): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values()).reverse();
  }

  async getGiftCardSubmission(id: string): Promise<GiftCard | undefined> {
    return this.giftCards.get(id);
  }

  async updateGiftCardStatus(id: string, status: string, rejectionReason?: string): Promise<GiftCard | undefined> {
    const giftCard = this.giftCards.get(id);
    if (!giftCard) return undefined;
    giftCard.status = status;
    if (rejectionReason) giftCard.rejectionReason = rejectionReason;
    return giftCard;
  }

  async createCryptoTrade(data: InsertCryptoTrade): Promise<CryptoTrade> {
    const trade: CryptoTrade = { id: Math.random().toString(), ...data as any, createdAt: new Date(), status: "pending", rejectionReason: null };
    this.cryptoTrades.set(trade.id, trade);
    return trade;
  }

  async getCryptoTrades(): Promise<CryptoTrade[]> {
    return Array.from(this.cryptoTrades.values()).reverse();
  }

  async getCryptoTrade(id: string): Promise<CryptoTrade | undefined> {
    return this.cryptoTrades.get(id);
  }

  async updateCryptoTradeStatus(id: string, status: string, rejectionReason?: string): Promise<CryptoTrade | undefined> {
    const trade = this.cryptoTrades.get(id);
    if (!trade) return undefined;
    trade.status = status;
    if (rejectionReason) trade.rejectionReason = rejectionReason;
    return trade;
  }

  async createGadgetSubmission(data: InsertGadgetSubmission): Promise<GadgetSubmission> {
    const submission: GadgetSubmission = { id: Math.random().toString(), ...data as any, createdAt: new Date(), status: "pending", rejectionReason: null };
    this.gadgetSubmissions.set(submission.id, submission);
    return submission;
  }

  async getGadgetSubmissions(): Promise<GadgetSubmission[]> {
    return Array.from(this.gadgetSubmissions.values()).reverse();
  }

  async getGadgetSubmission(id: string): Promise<GadgetSubmission | undefined> {
    return this.gadgetSubmissions.get(id);
  }

  async updateGadgetSubmissionStatus(id: string, status: string, rejectionReason?: string): Promise<GadgetSubmission | undefined> {
    const submission = this.gadgetSubmissions.get(id);
    if (!submission) return undefined;
    submission.status = status;
    if (rejectionReason) submission.rejectionReason = rejectionReason;
    return submission;
  }

  async createGadget(data: InsertGadget): Promise<Gadget> {
    const gadget: Gadget = { id: Math.random().toString(), ...data as any, createdAt: new Date(), available: true };
    this.gadgets.set(gadget.id, gadget);
    return gadget;
  }

  async getGadgets(): Promise<Gadget[]> {
    return Array.from(this.gadgets.values()).reverse();
  }

  async getGadget(id: string): Promise<Gadget | undefined> {
    return this.gadgets.get(id);
  }

  async updateGadget(id: string, data: Partial<InsertGadget>): Promise<Gadget | undefined> {
    const gadget = this.gadgets.get(id);
    if (!gadget) return undefined;
    Object.assign(gadget, data);
    return gadget;
  }

  async createOrUpdateExchangeRate(data: InsertExchangeRate): Promise<ExchangeRate> {
    const rate: ExchangeRate = { id: "1", ...data, updatedAt: new Date() };
    this.exchangeRates = rate;
    return rate;
  }

  async getCurrentExchangeRates(): Promise<ExchangeRate | undefined> {
    return this.exchangeRates;
  }
}

export const storage = new MemoryStorage();
