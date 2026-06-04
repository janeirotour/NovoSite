import { Router } from "express";
import { db } from "@workspace/db";
import { tourAvailabilityTable, toursTable } from "@workspace/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";

const router = Router();

type AvailabilityInput = {
  date: string;
  availableSpots?: number | null;
  isBlocked?: boolean;
  notes?: string | null;
};

function parseAvailabilityInput(body: unknown): { ok: true; data: AvailabilityInput } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const b = body as Record<string, unknown>;
  if (b.date !== undefined && (typeof b.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(b.date))) return { ok: false };
  if (b.availableSpots !== undefined && b.availableSpots !== null && typeof b.availableSpots !== "number") return { ok: false };
  if (b.isBlocked !== undefined && typeof b.isBlocked !== "boolean") return { ok: false };
  return {
    ok: true,
    data: {
      date: b.date as string,
      availableSpots: b.availableSpots as number | null | undefined,
      isBlocked: b.isBlocked as boolean | undefined,
      notes: b.notes as string | null | undefined,
    },
  };
}

const mapEntry = (e: typeof tourAvailabilityTable.$inferSelect) => ({
  id: e.id,
  tourId: e.tourId,
  date: e.date,
  availableSpots: e.availableSpots,
  isBlocked: e.isBlocked,
  notes: e.notes,
  createdAt: e.createdAt,
});

// Public: get availability for a tour slug
router.get("/tours/:slug/availability", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const { from, to } = req.query as { from?: string; to?: string };

  const tour = await db.select({ id: toursTable.id }).from(toursTable).where(eq(toursTable.slug, slug)).limit(1);
  if (!tour.length) { res.json([]); return; }

  const conditions = [eq(tourAvailabilityTable.tourId, tour[0].id)];
  if (from) conditions.push(gte(tourAvailabilityTable.date, from));
  if (to) conditions.push(lte(tourAvailabilityTable.date, to));

  const entries = await db.select().from(tourAvailabilityTable).where(and(...conditions)).orderBy(asc(tourAvailabilityTable.date));
  res.json(entries.map(mapEntry));
});

// Admin: get all availability for a tourId
router.get("/admin/tours/:tourId/availability", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const tourId = parseInt(req.params.tourId, 10);
  const { from, to } = req.query as { from?: string; to?: string };

  const conditions = [eq(tourAvailabilityTable.tourId, tourId)];
  if (from) conditions.push(gte(tourAvailabilityTable.date, from));
  if (to) conditions.push(lte(tourAvailabilityTable.date, to));

  const entries = await db.select().from(tourAvailabilityTable).where(and(...conditions)).orderBy(asc(tourAvailabilityTable.date));
  res.json(entries.map(mapEntry));
});

// Admin: create availability entry
router.post("/admin/tours/:tourId/availability", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const tourId = parseInt(req.params.tourId, 10);
  const parsed = parseAvailabilityInput(req.body);
  if (!parsed.ok || !parsed.data.date) { res.status(400).json({ error: "Invalid input" }); return; }

  const [entry] = await db.insert(tourAvailabilityTable).values({
    tourId,
    date: parsed.data.date,
    availableSpots: parsed.data.availableSpots ?? null,
    isBlocked: parsed.data.isBlocked ?? false,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(mapEntry(entry));
});

// Admin: update availability entry
router.put("/admin/availability/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = parseInt(req.params.id, 10);
  const parsed = parseAvailabilityInput(req.body);
  if (!parsed.ok) { res.status(400).json({ error: "Invalid input" }); return; }

  const [entry] = await db.update(tourAvailabilityTable)
    .set({ ...parsed.data })
    .where(eq(tourAvailabilityTable.id, id))
    .returning();

  if (!entry) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapEntry(entry));
});

// Admin: delete availability entry
router.delete("/admin/availability/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = parseInt(req.params.id, 10);
  await db.delete(tourAvailabilityTable).where(eq(tourAvailabilityTable.id, id));
  res.status(204).send();
});

export default router;
