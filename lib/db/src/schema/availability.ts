import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { toursTable } from "./tours";

export const tourAvailabilityTable = pgTable("tour_availability", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").references(() => toursTable.id, { onDelete: "cascade" }).notNull(),
  date: text("date").notNull(),
  availableSpots: integer("available_spots"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTourAvailabilitySchema = createInsertSchema(tourAvailabilityTable).omit({ id: true, createdAt: true });
export type InsertTourAvailability = z.infer<typeof insertTourAvailabilitySchema>;
export type TourAvailability = typeof tourAvailabilityTable.$inferSelect;
