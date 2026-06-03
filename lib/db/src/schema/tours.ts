import { pgTable, serial, text, integer, numeric, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toursTable = pgTable("tours", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleEs: text("title_es"),
  titlePt: text("title_pt"),
  destination: text("destination").notNull(),
  category: text("category").notNull(),
  durationHours: numeric("duration_hours", { precision: 5, scale: 1 }).notNull(),
  priceFrom: numeric("price_from", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  tourType: text("tour_type").notNull().default("group"),
  languages: jsonb("languages").notNull().default([]),
  groupSizeMax: integer("group_size_max").notNull().default(15),
  imageUrl: text("image_url").notNull(),
  galleryImages: jsonb("gallery_images").notNull().default([]),
  highlights: jsonb("highlights").notNull().default([]),
  overview: text("overview").notNull(),
  overviewEs: text("overview_es"),
  overviewPt: text("overview_pt"),
  includedItems: jsonb("included_items").notNull().default([]),
  notIncludedItems: jsonb("not_included_items").notNull().default([]),
  itinerary: jsonb("itinerary").notNull().default([]),
  meetingPoint: text("meeting_point").notNull(),
  cancellationPolicy: text("cancellation_policy").notNull(),
  regiondoWidget: text("regiondo_widget"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTourSchema = createInsertSchema(toursTable).omit({ id: true, createdAt: true });
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof toursTable.$inferSelect;
