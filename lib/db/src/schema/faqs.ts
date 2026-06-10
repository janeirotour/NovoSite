import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id"),
  question: text("question").notNull(),
  questionEs: text("question_es"),
  questionPt: text("question_pt"),
  answer: text("answer").notNull(),
  answerEs: text("answer_es"),
  answerPt: text("answer_pt"),
  sortOrder: integer("sort_order").notNull().default(0),
  isEnabled: boolean("is_enabled").notNull().default(true),
});

export const insertFaqSchema = createInsertSchema(faqsTable).omit({ id: true });
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;
