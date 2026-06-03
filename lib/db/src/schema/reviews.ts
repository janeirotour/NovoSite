import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id"),
  authorName: text("author_name").notNull(),
  authorCountry: text("author_country").notNull(),
  authorAvatarUrl: text("author_avatar_url"),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  tourName: text("tour_name"),
  source: text("source"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
