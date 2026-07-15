import { pgTable, serial, text, numeric, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const b2bQuotesTable = pgTable("b2b_quotes", {
  id: serial("id").primaryKey(),
  quoteRef: text("quote_ref").notNull().unique(),
  status: text("status").notNull().default("New Lead"),
  language: text("language").notNull().default("en"),
  // Contact
  contactName: text("contact_name").notNull(),
  company: text("company").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  country: text("country").notNull().default(""),
  website: text("website").notNull().default(""),
  iata: text("iata").notNull().default(""),
  preferredContact: text("preferred_contact").notNull().default("email"),
  // Group info stored as JSONB for flexibility
  groupData: jsonb("group_data").notNull().default({}),
  // Estimate
  estimateLow: numeric("estimate_low", { precision: 12, scale: 2 }).notNull().default("0"),
  estimateHigh: numeric("estimate_high", { precision: 12, scale: 2 }).notNull().default("0"),
  estimateCurrency: text("estimate_currency").notNull().default("USD"),
  estimateBreakdown: jsonb("estimate_breakdown").notNull().default({}),
  // Admin
  internalNotes: text("internal_notes").notNull().default(""),
  assignedTo: text("assigned_to").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const b2bPricingSettingsTable = pgTable("b2b_pricing_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: numeric("setting_value", { precision: 12, scale: 4 }).notNull().default("0"),
  settingLabel: text("setting_label").notNull().default(""),
  settingGroup: text("setting_group").notNull().default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const b2bGroupTiersTable = pgTable("b2b_group_tiers", {
  id: serial("id").primaryKey(),
  minPax: integer("min_pax").notNull(),
  maxPax: integer("max_pax").notNull(),
  label: text("label").notNull(),
  discountPct: numeric("discount_pct", { precision: 5, scale: 4 }).notNull().default("0"),
  markupPct: numeric("markup_pct", { precision: 5, scale: 4 }).notNull().default("0.15"),
  complimentaryPolicy: text("complimentary_policy").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertB2bQuoteSchema = createInsertSchema(b2bQuotesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertB2bPricingSettingSchema = createInsertSchema(b2bPricingSettingsTable).omit({ id: true, updatedAt: true });
export const insertB2bGroupTierSchema = createInsertSchema(b2bGroupTiersTable).omit({ id: true, updatedAt: true });

export type B2bQuote = typeof b2bQuotesTable.$inferSelect;
export type InsertB2bQuote = z.infer<typeof insertB2bQuoteSchema>;
export type B2bPricingSetting = typeof b2bPricingSettingsTable.$inferSelect;
export type B2bGroupTier = typeof b2bGroupTiersTable.$inferSelect;
