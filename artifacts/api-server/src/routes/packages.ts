import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, packagesTable } from "@workspace/db";

const router = Router();

function requireAdmin(req: any, res: any): boolean {
  if (!req.session?.adminId) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}

router.get("/packages", async (req, res): Promise<void> => {
  const packages = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.published, true))
    .orderBy(packagesTable.sortOrder);
  res.json(packages);
});

router.get("/packages/:slug", async (req, res): Promise<void> => {
  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.slug, req.params.slug));
  if (!pkg) { res.status(404).json({ error: "Package not found" }); return; }
  res.json(pkg);
});

// ─── Admin CRUD ────────────────────────────────────────────────────────────

router.get("/admin/packages", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const packages = await db.select().from(packagesTable).orderBy(packagesTable.sortOrder);
  res.json(packages);
});

router.post("/admin/packages", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { slug, title, subtitle, description, badge, badgeColor, priceFrom, originalPrice,
    savingsPercent, imageUrl, durationLabel, groupSizeLabel, highlights,
    includedItems, toursIncluded, published, sortOrder } = req.body;
  if (!slug || !title || !description || !priceFrom || !imageUrl) {
    res.status(400).json({ error: "slug, title, description, priceFrom, imageUrl are required" }); return;
  }
  const [pkg] = await db.insert(packagesTable).values({
    slug, title, subtitle, description, badge, badgeColor: badgeColor ?? "green",
    priceFrom, originalPrice, savingsPercent,
    imageUrl, durationLabel, groupSizeLabel,
    highlights: highlights ?? [],
    includedItems: includedItems ?? [],
    toursIncluded: toursIncluded ?? [],
    published: published ?? true,
    sortOrder: sortOrder ?? 10,
  }).returning();
  res.status(201).json(pkg);
});

router.put("/admin/packages/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { slug, title, subtitle, description, badge, badgeColor, priceFrom, originalPrice,
    savingsPercent, imageUrl, durationLabel, groupSizeLabel, highlights,
    includedItems, toursIncluded, published, sortOrder } = req.body;
  const [pkg] = await db.update(packagesTable).set({
    slug, title, subtitle, description, badge, badgeColor,
    priceFrom, originalPrice, savingsPercent,
    imageUrl, durationLabel, groupSizeLabel,
    highlights, includedItems, toursIncluded,
    published, sortOrder,
    updatedAt: new Date(),
  }).where(eq(packagesTable.id, id)).returning();
  if (!pkg) { res.status(404).json({ error: "Package not found" }); return; }
  res.json(pkg);
});

router.delete("/admin/packages/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [pkg] = await db.delete(packagesTable).where(eq(packagesTable.id, id)).returning();
  if (!pkg) { res.status(404).json({ error: "Package not found" }); return; }
  res.sendStatus(204);
});

export default router;
