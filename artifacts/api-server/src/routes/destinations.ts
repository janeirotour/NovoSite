import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, destinationsTable } from "@workspace/db";
import {
  ListDestinationsQueryParams,
  CreateDestinationBody,
  GetDestinationParams,
  GetDestinationResponse,
  UpdateDestinationParams,
  UpdateDestinationBody,
  UpdateDestinationResponse,
  DeleteDestinationParams,
  ListDestinationsResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/destinations", async (req, res): Promise<void> => {
  const params = ListDestinationsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success && params.data.featured !== undefined) {
    conditions.push(eq(destinationsTable.featured, params.data.featured));
  }
  const destinations = await db
    .select()
    .from(destinationsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(destinationsTable.sortOrder);
  res.json(ListDestinationsResponse.parse(destinations));
});

router.get("/destinations/:id", async (req, res): Promise<void> => {
  const params = GetDestinationParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [dest] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, params.data.id));
  if (!dest) { res.status(404).json({ error: "Destination not found" }); return; }
  res.json(GetDestinationResponse.parse(dest));
});

router.post("/destinations", async (req, res): Promise<void> => {
  const parsed = CreateDestinationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [dest] = await db.insert(destinationsTable).values(parsed.data as typeof destinationsTable.$inferInsert).returning();
  res.status(201).json(GetDestinationResponse.parse(dest));
});

router.patch("/destinations/:id", async (req, res): Promise<void> => {
  const params = UpdateDestinationParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateDestinationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [dest] = await db.update(destinationsTable).set(parsed.data as Partial<typeof destinationsTable.$inferInsert>).where(eq(destinationsTable.id, params.data.id)).returning();
  if (!dest) { res.status(404).json({ error: "Destination not found" }); return; }
  res.json(UpdateDestinationResponse.parse(dest));
});

router.delete("/destinations/:id", async (req, res): Promise<void> => {
  const params = DeleteDestinationParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [dest] = await db.delete(destinationsTable).where(eq(destinationsTable.id, params.data.id)).returning();
  if (!dest) { res.status(404).json({ error: "Destination not found" }); return; }
  res.sendStatus(204);
});

export default router;
