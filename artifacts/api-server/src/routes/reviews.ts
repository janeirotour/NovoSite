import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  ListReviewsQueryParams,
  CreateReviewBody,
  UpdateReviewParams,
  UpdateReviewBody,
  UpdateReviewResponse,
  DeleteReviewParams,
  ListReviewsResponse,
} from "@workspace/api-zod";

const router = Router();

const mapReview = (r: typeof reviewsTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

router.get("/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success) {
    if (params.data.tourId !== undefined) conditions.push(eq(reviewsTable.tourId, params.data.tourId));
    if (params.data.featured !== undefined) conditions.push(eq(reviewsTable.featured, params.data.featured));
  }
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(reviewsTable.createdAt);
  res.json(ListReviewsResponse.parse(reviews.map(mapReview)));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [review] = await db.insert(reviewsTable).values(parsed.data as typeof reviewsTable.$inferInsert).returning();
  res.status(201).json(mapReview(review));
});

router.patch("/reviews/:id", async (req, res): Promise<void> => {
  const params = UpdateReviewParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [review] = await db.update(reviewsTable).set(parsed.data as Partial<typeof reviewsTable.$inferInsert>).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  res.json(UpdateReviewResponse.parse(mapReview(review)));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [review] = await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  res.sendStatus(204);
});

export default router;
