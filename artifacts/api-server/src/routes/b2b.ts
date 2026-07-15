import { Router } from "express";
import { db, b2bQuotesTable, b2bPricingSettingsTable, b2bGroupTiersTable } from "@workspace/db";
import { eq, desc, ilike, and } from "drizzle-orm";
import { z } from "zod";
import { logger } from "../lib/logger";
import { sendB2bAdminNotification, sendB2bCustomerConfirmation } from "../lib/email";

const router = Router();

function generateQuoteRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "BQ-";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// ── Public: Get pricing settings (for estimate engine) ──────────────────────
router.get("/b2b/pricing", async (_req, res) => {
  const settings = await db.select().from(b2bPricingSettingsTable).orderBy(b2bPricingSettingsTable.settingGroup, b2bPricingSettingsTable.settingKey);
  res.json(settings);
});

// ── Public: Get group tiers (for estimate engine) ─────────────────────────
router.get("/b2b/tiers", async (_req, res) => {
  const tiers = await db.select().from(b2bGroupTiersTable).orderBy(b2bGroupTiersTable.minPax);
  res.json(tiers);
});

// ── Public: Submit quote ──────────────────────────────────────────────────
const quoteInputSchema = z.object({
  language: z.string().default("en"),
  contactName: z.string().min(2),
  company: z.string().default(""),
  email: z.string().email(),
  phone: z.string().default(""),
  country: z.string().default(""),
  website: z.string().default(""),
  iata: z.string().default(""),
  preferredContact: z.string().default("email"),
  groupData: z.record(z.string(), z.unknown()).default({}),
  estimateLow: z.number().default(0),
  estimateHigh: z.number().default(0),
  estimateCurrency: z.string().default("USD"),
  estimateBreakdown: z.record(z.string(), z.unknown()).default({}),
});

router.post("/b2b/quotes", async (req, res) => {
  try {
    const parsed = quoteInputSchema.parse(req.body);
    let quoteRef = generateQuoteRef();
    // Ensure uniqueness
    const existing = await db.select({ id: b2bQuotesTable.id }).from(b2bQuotesTable).where(eq(b2bQuotesTable.quoteRef, quoteRef));
    if (existing.length) quoteRef = generateQuoteRef() + Math.floor(Math.random() * 9);

    const [quote] = await db.insert(b2bQuotesTable).values({
      ...parsed,
      quoteRef,
      estimateLow: String(parsed.estimateLow),
      estimateHigh: String(parsed.estimateHigh),
      status: "New Lead",
    }).returning();

    // Send emails (non-blocking)
    sendB2bAdminNotification(quote).catch(err => logger.error({ err }, "Admin B2B email failed"));
    sendB2bCustomerConfirmation(quote).catch(err => logger.error({ err }, "Customer B2B email failed"));

    res.status(201).json(quote);
  } catch (err) {
    logger.error({ err }, "Failed to create B2B quote");
    res.status(400).json({ error: "Invalid quote data", detail: String(err) });
  }
});

// ── Admin: List quotes ────────────────────────────────────────────────────
router.get("/b2b/quotes", async (req, res) => {
  const { status, country, limit = "50", offset = "0" } = req.query as Record<string, string>;
  const conditions = [];
  if (status) conditions.push(eq(b2bQuotesTable.status, status));
  if (country) conditions.push(ilike(b2bQuotesTable.country, `%${country}%`));
  const quotes = await db
    .select()
    .from(b2bQuotesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(b2bQuotesTable.createdAt))
    .limit(Number(limit))
    .offset(Number(offset));
  res.json(quotes);
});

// ── Admin: Get single quote ───────────────────────────────────────────────
router.get("/b2b/quotes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [quote] = await db.select().from(b2bQuotesTable).where(eq(b2bQuotesTable.id, id));
  if (!quote) return res.status(404).json({ error: "Not found" });
  res.json(quote);
});

// ── Admin: Update quote ───────────────────────────────────────────────────
const quoteUpdateSchema = z.object({
  status: z.string().optional(),
  internalNotes: z.string().optional(),
  assignedTo: z.string().optional(),
  estimateLow: z.number().optional(),
  estimateHigh: z.number().optional(),
}).passthrough();

router.patch("/b2b/quotes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = quoteUpdateSchema.parse(req.body);
  const updates: Record<string, unknown> = { ...parsed, updatedAt: new Date() };
  if (parsed.estimateLow !== undefined) updates.estimateLow = String(parsed.estimateLow);
  if (parsed.estimateHigh !== undefined) updates.estimateHigh = String(parsed.estimateHigh);
  const [updated] = await db.update(b2bQuotesTable).set(updates).where(eq(b2bQuotesTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

// ── Admin: Bulk-update pricing ────────────────────────────────────────────
router.put("/b2b/pricing", async (req, res) => {
  const updates = req.body as Array<{ settingKey: string; settingValue: number }>;
  const results = [];
  for (const u of updates) {
    const [row] = await db
      .update(b2bPricingSettingsTable)
      .set({ settingValue: String(u.settingValue), updatedAt: new Date() })
      .where(eq(b2bPricingSettingsTable.settingKey, u.settingKey))
      .returning();
    if (row) results.push(row);
  }
  res.json(results);
});

// ── Admin: Bulk-update group tiers ────────────────────────────────────────
router.put("/b2b/tiers", async (req, res) => {
  const tiers = req.body as Array<{ id: number; discountPct: number; markupPct: number; complimentaryPolicy: string }>;
  const results = [];
  for (const t of tiers) {
    const [row] = await db
      .update(b2bGroupTiersTable)
      .set({ discountPct: String(t.discountPct), markupPct: String(t.markupPct), complimentaryPolicy: t.complimentaryPolicy ?? "", updatedAt: new Date() })
      .where(eq(b2bGroupTiersTable.id, t.id))
      .returning();
    if (row) results.push(row);
  }
  res.json(results);
});

export default router;
