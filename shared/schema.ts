import { pgTable, text, serial, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import auth tables to export them
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const pensionPots = pgTable("pension_pots", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Foreign key to auth.users (handled via app logic)
  providerName: text("provider_name").notNull(),
  currentValue: numeric("current_value").notNull(),
  monthlyContribution: numeric("monthly_contribution").notNull().default("0"),
  annualGrowthRate: numeric("annual_growth_rate").notNull().default("5.0"), // Percentage, e.g. 5.0
  managementFee: numeric("management_fee").notNull().default("0.75"), // Percentage, e.g. 0.75
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const retirementGoals = pgTable("retirement_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  retirementAge: integer("retirement_age").notNull().default(65),
  targetAnnualIncome: numeric("target_annual_income").notNull().default("25000"),
  currentAge: integer("current_age").notNull().default(30),
  lifeExpectancy: integer("life_expectancy").notNull().default(85),
  includeStatePension: boolean("include_state_pension").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === SCHEMAS ===

// Pension Pots
export const insertPensionPotSchema = createInsertSchema(pensionPots).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const insertPensionPotSchemaClient = insertPensionPotSchema.extend({
  currentValue: z.coerce.number().min(0),
  monthlyContribution: z.coerce.number().min(0),
  annualGrowthRate: z.coerce.number().min(0).max(100),
  managementFee: z.coerce.number().min(0).max(100),
});

// Retirement Goals
export const insertRetirementGoalSchema = createInsertSchema(retirementGoals).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const insertRetirementGoalSchemaClient = insertRetirementGoalSchema.extend({
  retirementAge: z.coerce.number().min(55).max(100),
  targetAnnualIncome: z.coerce.number().min(0),
  currentAge: z.coerce.number().min(18).max(99),
  lifeExpectancy: z.coerce.number().min(60).max(120),
});


// === TYPES ===
export type PensionPot = typeof pensionPots.$inferSelect;
export type InsertPensionPot = z.infer<typeof insertPensionPotSchema>;
export type InsertPensionPotClient = z.infer<typeof insertPensionPotSchemaClient>;

export type RetirementGoal = typeof retirementGoals.$inferSelect;
export type InsertRetirementGoal = z.infer<typeof insertRetirementGoalSchema>;
export type InsertRetirementGoalClient = z.infer<typeof insertRetirementGoalSchemaClient>;

// Projection Result Type (for frontend calculation/display)
export interface YearlyProjection {
  age: number;
  year: number;
  totalPotValue: number;
  totalContributions: number;
  projectedIncome: number;
}
