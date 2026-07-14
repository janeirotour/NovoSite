import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, groupProgramsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/group-programs", async (req, res): Promise<void> => {
  const includeUnpublished = req.query.includeUnpublished === "true";
  const query = db.select().from(groupProgramsTable);
  if (!includeUnpublished) {
    query.where(eq(groupProgramsTable.published, true));
  }
  const programs = await query.orderBy(groupProgramsTable.sortOrder);
  res.json(programs.map(serialize));
});

router.get("/group-programs/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [program] = await db
    .select()
    .from(groupProgramsTable)
    .where(eq(groupProgramsTable.slug, slug));
  if (!program) { res.status(404).json({ error: "Program not found" }); return; }
  res.json(serialize(program));
});

router.post("/group-programs", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const [created] = await db.insert(groupProgramsTable).values(sanitize(req.body)).returning();
    logger.info({ id: created.id }, "Group program created");
    res.status(201).json(serialize(created));
  } catch (err) {
    logger.error({ err }, "Failed to create group program");
    res.status(400).json({ error: "Failed to create program" });
  }
});

router.patch("/group-programs/id/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [updated] = await db
      .update(groupProgramsTable)
      .set({ ...sanitize(req.body), updatedAt: new Date() })
      .where(eq(groupProgramsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(updated));
  } catch (err) {
    logger.error({ err }, "Failed to update group program");
    res.status(400).json({ error: "Failed to update program" });
  }
});

router.delete("/group-programs/id/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  await db.delete(groupProgramsTable).where(eq(groupProgramsTable.id, id));
  res.json({ success: true });
});

function sanitize(body: Record<string, unknown>) {
  return {
    slug: body.slug as string,
    title: body.title as string,
    subtitle: (body.subtitle as string | null) ?? null,
    duration: body.duration as string,
    heroImageUrl: (body.heroImageUrl as string) ?? "",
    overview: (body.overview as string) ?? "",
    targetAudience: (body.targetAudience as string) ?? "",
    highlights: (body.highlights as string[]) ?? [],
    suggestedItinerary: (body.suggestedItinerary as unknown[]) ?? [],
    whatsIncluded: (body.whatsIncluded as string[]) ?? [],
    whatsNotIncluded: (body.whatsNotIncluded as string[]) ?? [],
    accommodationOptions: (body.accommodationOptions as unknown[]) ?? [],
    transportation: (body.transportation as string) ?? "",
    optionalExperiences: (body.optionalExperiences as unknown[]) ?? [],
    pricingLandOnly: (body.pricingLandOnly as unknown[]) ?? [],
    pricingComplete: (body.pricingComplete as unknown[]) ?? [],
    landOnlyFromPrice: String(body.landOnlyFromPrice ?? "0"),
    completeFromPrice: String(body.completeFromPrice ?? "0"),
    currency: (body.currency as string) ?? "USD",
    pdfUrl: (body.pdfUrl as string | null) ?? null,
    whatsappNumber: (body.whatsappNumber as string | null) ?? null,
    published: body.published !== undefined ? Boolean(body.published) : true,
    sortOrder: Number(body.sortOrder ?? 10),
  };
}

function serialize(p: typeof groupProgramsTable.$inferSelect) {
  return {
    ...p,
    landOnlyFromPrice: Number(p.landOnlyFromPrice),
    completeFromPrice: Number(p.completeFromPrice),
  };
}

export default router;
