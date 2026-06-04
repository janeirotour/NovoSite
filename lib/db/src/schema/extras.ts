import { pgTable, serial, text, numeric, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { toursTable } from "./tours";

export const tourExtrasTable = pgTable("tour_extras", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").references(() => toursTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTourExtraSchema = createInsertSchema(tourExtrasTable).omit({ id: true, createdAt: true });
export type InsertTourExtra = z.infer<typeof insertTourExtraSchema>;
export type TourExtra = typeof tourExtrasTable.$inferSelect;
