import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, hotelsTable, specialSeasonsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

// ── Hotels ──────────────────────────────────────────────────────────────────

function serializeHotel(h: typeof hotelsTable.$inferSelect) {
  return {
    ...h,
    regularRate: Number(h.regularRate),
    specialRate: Number(h.specialRate),
    galleryImages: h.galleryImages ?? [],
    amenities: h.amenities ?? [],
  };
}

router.get("/hotels", async (req, res): Promise<void> => {
  const activeOnly = req.query.activeOnly !== "false";
  const query = db.select().from(hotelsTable);
  const rows = await query.orderBy(asc(hotelsTable.sortOrder));
  const filtered = activeOnly
    ? rows.filter(h => h.isActive && h.isPublished)
    : rows;
  res.json(filtered.map(serializeHotel));
});

router.post("/hotels", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const [created] = await db.insert(hotelsTable).values(sanitizeHotel(req.body)).returning();
    logger.info({ id: created.id }, "Hotel created");
    res.status(201).json(serializeHotel(created));
  } catch (err) {
    logger.error({ err }, "Failed to create hotel");
    res.status(400).json({ error: "Failed to create hotel" });
  }
});

router.put("/hotels/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  try {
    const [updated] = await db
      .update(hotelsTable)
      .set({ ...sanitizeHotel(req.body), updatedAt: new Date() })
      .where(eq(hotelsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Hotel not found" }); return; }
    res.json(serializeHotel(updated));
  } catch (err) {
    logger.error({ err }, "Failed to update hotel");
    res.status(400).json({ error: "Failed to update hotel" });
  }
});

router.delete("/hotels/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  await db.delete(hotelsTable).where(eq(hotelsTable.id, id));
  res.json({ ok: true });
});

function sanitizeHotel(body: Record<string, unknown>) {
  return {
    slug: body.slug as string,
    name: body.name as string,
    neighborhood: (body.neighborhood as string) ?? "",
    category: (body.category as string) ?? "Upscale",
    starLevel: Number(body.starLevel ?? 4),
    heroImageUrl: (body.heroImageUrl as string) ?? "",
    galleryImages: (body.galleryImages as string[]) ?? [],
    shortDescEn: (body.shortDescEn as string) ?? "",
    shortDescEs: (body.shortDescEs as string) ?? "",
    shortDescPt: (body.shortDescPt as string) ?? "",
    bestForEn: (body.bestForEn as string) ?? "",
    bestForEs: (body.bestForEs as string) ?? "",
    bestForPt: (body.bestForPt as string) ?? "",
    amenities: (body.amenities as string[]) ?? [],
    roomType: (body.roomType as string) ?? "Queen Double",
    maxOccupancy: Number(body.maxOccupancy ?? 2),
    regularRate: String(body.regularRate ?? "0"),
    specialRate: String(body.specialRate ?? "0"),
    specialRateConditionsEn: (body.specialRateConditionsEn as string) ?? "Holidays, New Year's Eve and Carnival. Final price must be confirmed before booking.",
    specialRateConditionsEs: (body.specialRateConditionsEs as string) ?? "",
    specialRateConditionsPt: (body.specialRateConditionsPt as string) ?? "",
    currency: (body.currency as string) ?? "BRL",
    availabilityStatus: (body.availabilityStatus as string) ?? "available",
    isActive: body.isActive !== false,
    isPublished: body.isPublished !== false,
    sortOrder: Number(body.sortOrder ?? 10),
  };
}

// ── Special Seasons ──────────────────────────────────────────────────────────

router.get("/special-seasons", async (_req, res): Promise<void> => {
  const rows = await db.select().from(specialSeasonsTable).orderBy(asc(specialSeasonsTable.startDate));
  res.json(rows);
});

router.post("/special-seasons", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const [created] = await db.insert(specialSeasonsTable).values(sanitizeSeason(req.body)).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create special season");
    res.status(400).json({ error: "Failed to create special season" });
  }
});

router.put("/special-seasons/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  const [updated] = await db
    .update(specialSeasonsTable)
    .set(sanitizeSeason(req.body))
    .where(eq(specialSeasonsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.delete("/special-seasons/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  await db.delete(specialSeasonsTable).where(eq(specialSeasonsTable.id, id));
  res.json({ ok: true });
});

function sanitizeSeason(body: Record<string, unknown>) {
  return {
    name: body.name as string,
    startDate: body.startDate as string,
    endDate: body.endDate as string,
    descriptionEn: (body.descriptionEn as string) ?? "",
    descriptionEs: (body.descriptionEs as string) ?? "",
    descriptionPt: (body.descriptionPt as string) ?? "",
    isActive: body.isActive !== false,
  };
}

export default router;
