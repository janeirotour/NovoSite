import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const specialSeasonsTable = pgTable("special_seasons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionEs: text("description_es").notNull().default(""),
  descriptionPt: text("description_pt").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpecialSeasonSchema = createInsertSchema(specialSeasonsTable).omit({ id: true, createdAt: true });
export type InsertSpecialSeason = z.infer<typeof insertSpecialSeasonSchema>;
export type SpecialSeason = typeof specialSeasonsTable.$inferSelect;
