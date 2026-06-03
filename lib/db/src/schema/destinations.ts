import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameEs: text("name_es"),
  namePt: text("name_pt"),
  country: text("country").notNull().default("Brazil"),
  imageUrl: text("image_url").notNull(),
  heroImageUrl: text("hero_image_url"),
  description: text("description").notNull(),
  descriptionEs: text("description_es"),
  descriptionPt: text("description_pt"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  featured: boolean("featured").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({ id: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;
