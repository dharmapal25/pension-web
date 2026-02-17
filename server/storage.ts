import { 
  users, 
  type User, 
  type InsertUser, 
  pensionPots, 
  type PensionPot, 
  type InsertPensionPot, 
  retirementGoals, 
  type RetirementGoal, 
  type InsertRetirementGoal 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Auth methods (re-export or implement)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pension Pots
  getPensionPots(userId: string): Promise<PensionPot[]>;
  getPensionPot(id: number): Promise<PensionPot | undefined>;
  createPensionPot(userId: string, pot: InsertPensionPot): Promise<PensionPot>;
  updatePensionPot(id: number, userId: string, pot: Partial<InsertPensionPot>): Promise<PensionPot | undefined>;
  deletePensionPot(id: number, userId: string): Promise<void>;

  // Retirement Goals
  getRetirementGoal(userId: string): Promise<RetirementGoal | undefined>;
  upsertRetirementGoal(userId: string, goal: InsertRetirementGoal): Promise<RetirementGoal>;
}

export class DatabaseStorage implements IStorage {
  // Auth (minimal implementation if needed, mostly handled by replitAuth/storage)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Pension Pots
  async getPensionPots(userId: string): Promise<PensionPot[]> {
    return await db.select().from(pensionPots).where(eq(pensionPots.userId, userId));
  }

  async getPensionPot(id: number): Promise<PensionPot | undefined> {
    const [pot] = await db.select().from(pensionPots).where(eq(pensionPots.id, id));
    return pot;
  }

  async createPensionPot(userId: string, pot: InsertPensionPot): Promise<PensionPot> {
    const [newPot] = await db.insert(pensionPots).values({ ...pot, userId }).returning();
    return newPot;
  }

  async updatePensionPot(id: number, userId: string, updates: Partial<InsertPensionPot>): Promise<PensionPot | undefined> {
    const [updatedPot] = await db
      .update(pensionPots)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(pensionPots.id, id), eq(pensionPots.userId, userId)))
      .returning();
    return updatedPot;
  }

  async deletePensionPot(id: number, userId: string): Promise<void> {
    await db.delete(pensionPots).where(and(eq(pensionPots.id, id), eq(pensionPots.userId, userId)));
  }

  // Retirement Goals
  async getRetirementGoal(userId: string): Promise<RetirementGoal | undefined> {
    const [goal] = await db.select().from(retirementGoals).where(eq(retirementGoals.userId, userId));
    return goal;
  }

  async upsertRetirementGoal(userId: string, goalData: InsertRetirementGoal): Promise<RetirementGoal> {
    // Check if goal exists
    const existing = await this.getRetirementGoal(userId);
    
    if (existing) {
      const [updated] = await db
        .update(retirementGoals)
        .set({ ...goalData, updatedAt: new Date() })
        .where(eq(retirementGoals.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(retirementGoals)
        .values({ ...goalData, userId })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
