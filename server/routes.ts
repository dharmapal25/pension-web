import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Pension Routes - Protected
  app.get(api.pensions.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user!.claims!.sub!;
    const pots = await storage.getPensionPots(userId);
    res.json(pots);
  });

  app.post(api.pensions.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user!.claims!.sub!;
      const input = api.pensions.create.input.parse(req.body);
      const pot = await storage.createPensionPot(userId, input);
      res.status(201).json(pot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.pensions.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user!.claims!.sub!;
    const id = parseInt(req.params.id);
    const pot = await storage.getPensionPot(id);
    
    if (!pot) {
      return res.status(404).json({ message: "Pension pot not found" });
    }
    
    // Ensure ownership
    if (pot.userId !== userId) {
      return res.status(404).json({ message: "Pension pot not found" });
    }
    
    res.json(pot);
  });

  app.put(api.pensions.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user!.claims!.sub!;
      const id = parseInt(req.params.id);
      const input = api.pensions.update.input.parse(req.body);
      
      const updatedPot = await storage.updatePensionPot(id, userId, input);
      
      if (!updatedPot) {
        return res.status(404).json({ message: "Pension pot not found" });
      }
      
      res.json(updatedPot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete(api.pensions.delete.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user!.claims!.sub!;
    const id = parseInt(req.params.id);
    
    // Check existence and ownership first
    const pot = await storage.getPensionPot(id);
    if (!pot || pot.userId !== userId) {
      return res.status(404).json({ message: "Pension pot not found" });
    }
    
    await storage.deletePensionPot(id, userId);
    res.status(204).send();
  });

  // Goal Routes - Protected
  app.get(api.goals.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user!.claims!.sub!;
    const goal = await storage.getRetirementGoal(userId);
    // Return null if not set, or default object? API contract says nullable.
    res.json(goal || null);
  });

  app.post(api.goals.upsert.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user!.claims!.sub!;
      const input = api.goals.upsert.input.parse(req.body);
      const goal = await storage.upsertRetirementGoal(userId, input);
      res.json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
