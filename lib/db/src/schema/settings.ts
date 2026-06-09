import { json, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Janeiro Tour & Travel"),
  heroHeadline: text("hero_headline").notNull().default("Discover the Best of Brazil"),
  heroHeadlineEs: text("hero_headline_es"),
  heroHeadlinePt: text("hero_headline_pt"),
  heroSubheadline: text("hero_subheadline").notNull().default("Premium tours, private experiences, airport transfers and travel services across Brazil."),
  heroSubheadlineEs: text("hero_subheadline_es"),
  heroSubheadlinePt: text("hero_subheadline_pt"),
  heroPrimaryCtaText: text("hero_primary_cta_text").notNull().default("Explore Tours"),
  heroSecondaryCtaText: text("hero_secondary_cta_text").notNull().default("Plan Your Trip"),
  heroImageUrl: text("hero_image_url"),
  contactEmail: text("contact_email").notNull().default("info@janeirotour.com"),
  contactPhone: text("contact_phone").notNull().default("+55 21 99999-9999"),
  contactWhatsapp: text("contact_whatsapp").notNull().default("https://wa.me/+5521999999999"),
  address: text("address").notNull().default("Rio de Janeiro, Brazil"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  tripadvisorUrl: text("tripadvisor_url"),
  googleReviewsUrl: text("google_reviews_url"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImageUrl: text("og_image_url"),
  blogConversionData: json("blog_conversion_data"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
