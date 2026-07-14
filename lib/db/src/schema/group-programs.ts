import { pgTable, serial, text, numeric, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const groupProgramsTable = pgTable("group_programs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  duration: text("duration").notNull(),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  overview: text("overview").notNull().default(""),
  targetAudience: text("target_audience").notNull().default(""),
  highlights: jsonb("highlights").notNull().default([]),
  suggestedItinerary: jsonb("suggested_itinerary").notNull().default([]),
  whatsIncluded: jsonb("whats_included").notNull().default([]),
  whatsNotIncluded: jsonb("whats_not_included").notNull().default([]),
  accommodationOptions: jsonb("accommodation_options").notNull().default([]),
  transportation: text("transportation").notNull().default(""),
  optionalExperiences: jsonb("optional_experiences").notNull().default([]),
  pricingLandOnly: jsonb("pricing_land_only").notNull().default([]),
  pricingComplete: jsonb("pricing_complete").notNull().default([]),
  landOnlyFromPrice: numeric("land_only_from_price", { precision: 10, scale: 2 }).notNull().default("0"),
  completeFromPrice: numeric("complete_from_price", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  pdfUrl: text("pdf_url"),
  whatsappNumber: text("whatsapp_number"),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type GroupProgram = typeof groupProgramsTable.$inferSelect;
export type InsertGroupProgram = typeof groupProgramsTable.$inferInsert;
