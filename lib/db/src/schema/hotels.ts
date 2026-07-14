import { pgTable, serial, text, numeric, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hotelsTable = pgTable("hotels", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  neighborhood: text("neighborhood").notNull().default(""),
  category: text("category").notNull().default("Upscale"),
  starLevel: integer("star_level").notNull().default(4),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  galleryImages: jsonb("gallery_images").notNull().default([]),
  shortDescEn: text("short_desc_en").notNull().default(""),
  shortDescEs: text("short_desc_es").notNull().default(""),
  shortDescPt: text("short_desc_pt").notNull().default(""),
  bestForEn: text("best_for_en").notNull().default(""),
  bestForEs: text("best_for_es").notNull().default(""),
  bestForPt: text("best_for_pt").notNull().default(""),
  amenities: jsonb("amenities").notNull().default([]),
  roomType: text("room_type").notNull().default("Queen Double"),
  maxOccupancy: integer("max_occupancy").notNull().default(2),
  regularRate: numeric("regular_rate", { precision: 10, scale: 2 }).notNull().default("0"),
  specialRate: numeric("special_rate", { precision: 10, scale: 2 }).notNull().default("0"),
  specialRateConditionsEn: text("special_rate_conditions_en").notNull().default("Holidays, New Year's Eve and Carnival. Final price must be confirmed before booking."),
  specialRateConditionsEs: text("special_rate_conditions_es").notNull().default("Feriados, Nochevieja y Carnaval. El precio final debe confirmarse antes de la reserva."),
  specialRateConditionsPt: text("special_rate_conditions_pt").notNull().default("Feriados, Réveillon e Carnaval. O preço final deve ser confirmado antes da reserva."),
  currency: text("currency").notNull().default("BRL"),
  availabilityStatus: text("availability_status").notNull().default("available"),
  isActive: boolean("is_active").notNull().default(true),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHotelSchema = createInsertSchema(hotelsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotelsTable.$inferSelect;
