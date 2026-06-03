import { Router } from "express";
import { eq, and, isNull } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";
import {
  ListFaqsQueryParams,
  CreateFaqBody,
  UpdateFaqParams,
  UpdateFaqBody,
  UpdateFaqResponse,
  DeleteFaqParams,
  ListFaqsResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/faqs", async (req, res): Promise<void> => {
  const params = ListFaqsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success && params.data.tourId !== undefined) {
    conditions.push(eq(faqsTable.tourId, params.data.tourId));
  } else {
    conditions.push(isNull(faqsTable.tourId));
  }
  const faqs = await db
    .select()
    .from(faqsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(faqsTable.sortOrder);
  res.json(ListFaqsResponse.parse(faqs));
});

router.post("/faqs", async (req, res): Promise<void> => {
  const parsed = CreateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [faq] = await db.insert(faqsTable).values(parsed.data as typeof faqsTable.$inferInsert).returning();
  res.status(201).json(faq);
});

router.patch("/faqs/:id", async (req, res): Promise<void> => {
  const params = UpdateFaqParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [faq] = await db.update(faqsTable).set(parsed.data as Partial<typeof faqsTable.$inferInsert>).where(eq(faqsTable.id, params.data.id)).returning();
  if (!faq) { res.status(404).json({ error: "FAQ not found" }); return; }
  res.json(UpdateFaqResponse.parse(faq));
});

router.delete("/faqs/:id", async (req, res): Promise<void> => {
  const params = DeleteFaqParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [faq] = await db.delete(faqsTable).where(eq(faqsTable.id, params.data.id)).returning();
  if (!faq) { res.status(404).json({ error: "FAQ not found" }); return; }
  res.sendStatus(204);
});

export default router;
