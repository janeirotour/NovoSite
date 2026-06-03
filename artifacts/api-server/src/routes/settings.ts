import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";

const router = Router();

async function ensureSettings() {
  const [existing] = await db.select().from(siteSettingsTable).limit(1);
  if (!existing) {
    const [created] = await db.insert(siteSettingsTable).values({}).returning();
    return created;
  }
  return existing;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await ensureSettings();
  res.json(GetSettingsResponse.parse(settings));
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const existing = await ensureSettings();
  const [updated] = await db
    .update(siteSettingsTable)
    .set(parsed.data)
    .where(eq(siteSettingsTable.id, existing.id))
    .returning();
  res.json(UpdateSettingsResponse.parse(updated));
});

export default router;
