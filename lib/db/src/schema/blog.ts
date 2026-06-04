import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleEs: text("title_es"),
  titlePt: text("title_pt"),
  excerpt: text("excerpt").notNull(),
  excerptEs: text("excerpt_es"),
  excerptPt: text("excerpt_pt"),
  content: text("content").notNull(),
  contentEs: text("content_es"),
  contentPt: text("content_pt"),
  imageUrl: text("image_url").notNull(),
  galleryImages: jsonb("gallery_images").notNull().default([]),
  author: text("author").notNull(),
  category: text("category").notNull(),
  readTimeMinutes: integer("read_time_minutes").notNull().default(5),
  seoTitle: text("seo_title"),
  seoTitleEs: text("seo_title_es"),
  seoTitlePt: text("seo_title_pt"),
  seoDescription: text("seo_description"),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionPt: text("seo_description_pt"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({ id: true, createdAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
