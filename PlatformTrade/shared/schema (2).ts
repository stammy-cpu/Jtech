import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  senderUsername: text("sender_username").notNull(),
  messageText: text("message_text").notNull(),
  recipientId: varchar("recipient_id").references(() => users.id),
  isAdminMessage: boolean("is_admin_message").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const giftCardSubmissions = pgTable("gift_card_submissions", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cryptoTrades = pgTable("crypto_trades", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gadgetSubmissions = pgTable("gadget_submissions", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gadgets = pgTable("gadgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(),
  description: text("description"),
  specs: text("specs").array(),
  imageUrls: text("image_urls").array().notNull(),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usdToNaira: integer("usd_to_naira").notNull(),
  giftCardRate: integer("gift_card_rate").notNull(),
  btcToNaira: integer("btc_to_naira").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGiftCardSchema = createInsertSchema(giftCardSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertCryptoTradeSchema = createInsertSchema(cryptoTrades).omit({
  id: true,
  createdAt: true,
});

export const insertGadgetSubmissionSchema = createInsertSchema(gadgetSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertGadgetSchema = createInsertSchema(gadgets).omit({
  id: true,
  createdAt: true,
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  updatedAt: true,
});

export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type GiftCard = typeof giftCardSubmissions.$inferSelect;

export type InsertCryptoTrade = z.infer<typeof insertCryptoTradeSchema>;
export type CryptoTrade = typeof cryptoTrades.$inferSelect;

export type InsertGadgetSubmission = z.infer<typeof insertGadgetSubmissionSchema>;
export type GadgetSubmission = typeof gadgetSubmissions.$inferSelect;

export type InsertGadget = z.infer<typeof insertGadgetSchema>;
export type Gadget = typeof gadgets.$inferSelect;

export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
export type ExchangeRate = typeof exchangeRates.$inferSelect;

export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertMessageSchema = z.object({
  messageText: z.string().min(1, "Message cannot be empty").max(5000),
  senderUsername: z.string(),
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
