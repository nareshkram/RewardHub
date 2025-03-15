import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWithdrawalSchema, updateUserPaymentSchema } from "@shared/schema";
import { getAiResponse } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User session middleware
  app.get("/api/users/me", async (req, res) => {
    // For development, return the first user
    const users = await storage.getAllUsers();
    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(user);
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);

      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  // Payment Info routes
  app.patch("/api/users/:userId/payment-info", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const paymentInfo = updateUserPaymentSchema.parse(req.body);

      const user = await storage.updateUserPaymentInfo(userId, paymentInfo);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update payment info" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks/:taskId/complete", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);

      const taskId = parseInt(req.params.taskId);
      await storage.completeTask(userId, taskId);

      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to complete task" });
    }
  });

  // Withdrawal routes
  app.post("/api/withdrawals", async (req, res) => {
    try {
      const withdrawalData = insertWithdrawalSchema.parse(req.body);
      const user = await storage.getUser(withdrawalData.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.points < withdrawalData.amount) {
        return res.status(400).json({ message: "Insufficient points" });
      }

      // Add status "pending" by default for manual review
      const withdrawal = await storage.createWithdrawal({
        ...withdrawalData,
        status: "pending"
      });
      await storage.updateUserPoints(user.id, -withdrawalData.amount);

      res.json(withdrawal);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create withdrawal" });
    }
  });

  app.get("/api/withdrawals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const withdrawals = await storage.getWithdrawals(userId);
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch withdrawals" });
    }
  });

  // AI Help routes
  app.post("/api/help/chat", async (req, res) => {
    try {
      const { question } = z.object({
        question: z.string()
      }).parse(req.body);

      const response = await getAiResponse(question);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to get AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}