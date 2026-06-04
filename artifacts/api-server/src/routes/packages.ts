import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, packagesTable } from "@workspace/db";

const router = Router();

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

export default router;
