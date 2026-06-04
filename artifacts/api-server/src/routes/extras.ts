import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, tourExtrasTable, toursTable } from "@workspace/db";

const router = Router();

const mapExtra = (e: typeof tourExtrasTable.$inferSelect) => ({
  ...e,
  price: Number(e.price),
});

router.get("/tours/:slug/extras", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [tour] = await db.select({ id: toursTable.id }).from(toursTable).where(eq(toursTable.slug, slug)).limit(1);
  if (!tour) { res.status(404).json({ error: "Tour not found" }); return; }

  const extras = await db
    .select()
    .from(tourExtrasTable)
    .where(and(eq(tourExtrasTable.tourId, tour.id), eq(tourExtrasTable.active, true)))
    .orderBy(tourExtrasTable.sortOrder, tourExtrasTable.id);

  res.json(extras.map(mapExtra));
});

router.get("/admin/extras", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const tourId = req.query.tourId ? Number(req.query.tourId) : undefined;

  const extras = tourId
    ? await db.select().from(tourExtrasTable).where(eq(tourExtrasTable.tourId, tourId)).orderBy(tourExtrasTable.sortOrder, tourExtrasTable.id)
    : await db.select().from(tourExtrasTable).orderBy(tourExtrasTable.tourId, tourExtrasTable.sortOrder, tourExtrasTable.id);

  res.json(extras.map(mapExtra));
});

router.post("/admin/tours/:tourId/extras", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const tourId = Number(req.params.tourId);
  if (isNaN(tourId)) { res.status(400).json({ error: "Invalid tourId" }); return; }

  const { name, description, price, currency, active, sortOrder } = req.body as Record<string, unknown>;
  if (!name || price === undefined) { res.status(400).json({ error: "name and price are required" }); return; }

  const [created] = await db.insert(tourExtrasTable).values({
    tourId,
    name: String(name),
    description: description != null ? String(description) : null,
    price: String(Number(price)),
    currency: currency ? String(currency) : "USD",
    active: active !== false,
    sortOrder: sortOrder != null ? Number(sortOrder) : 0,
  }).returning();

  res.status(201).json(mapExtra(created));
});

router.put("/admin/extras/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { name, description, price, currency, active, sortOrder } = req.body as Record<string, unknown>;
  const updates: Partial<typeof tourExtrasTable.$inferInsert> = {};
  if (name !== undefined) updates.name = String(name);
  if (description !== undefined) updates.description = description != null ? String(description) : null;
  if (price !== undefined) updates.price = String(Number(price));
  if (currency !== undefined) updates.currency = String(currency);
  if (active !== undefined) updates.active = Boolean(active);
  if (sortOrder !== undefined) updates.sortOrder = Number(sortOrder);

  const [updated] = await db.update(tourExtrasTable).set(updates).where(eq(tourExtrasTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Extra not found" }); return; }

  res.json(mapExtra(updated));
});

router.delete("/admin/extras/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(tourExtrasTable).where(eq(tourExtrasTable.id, id));
  res.status(204).send();
});

export default router;
