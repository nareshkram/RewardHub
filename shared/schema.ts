import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  profilePhoto: text("profile_photo"),
  dateOfBirth: text("date_of_birth"),
  phone: text("phone"),
  location: text("location"),
  address: text("address"),
  deviceInfo: text("device_info"),
  ipAddress: text("ip_address"),
  referralCode: text("referral_code").unique(),
  points: integer("points").notNull().default(0),
  upiId: text("upi_id"),
  bankAccount: text("bank_account"),
  ifscCode: text("ifsc_code"),
  preferredLanguage: text("preferred_language").default("en"),
  darkMode: boolean("dark_mode").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull(),
  type: text("type").notNull(), // 'ad', 'survey', 'game'
});

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow()
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'failed'
  method: text("method").notNull(), // 'upi', 'bank'
  paymentId: text("payment_id"), // Razorpay payment ID
  paymentDetails: text("payment_details"), // UPI ID or Bank Account details
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  points: true,
  upiId: true,
  bankAccount: true,
  ifscCode: true
});

export const updateUserPaymentSchema = z.object({
  upiId: z.string().optional(),
  bankAccount: z.string().optional(),
  ifscCode: z.string().optional()
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ 
  id: true 
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({ 
  id: true,
  createdAt: true,
  paymentId: true,
  status: true
}).extend({
  paymentDetails: z.string()
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserPayment = z.infer<typeof updateUserPaymentSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;