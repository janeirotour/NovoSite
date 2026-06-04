import { Router } from "express";
import { eq, and, SQL } from "drizzle-orm";
import { db, toursTable } from "@workspace/db";
import {
  ListToursQueryParams,
  CreateTourBody,
  GetTourParams,
  GetTourResponse,
  UpdateTourParams,
  UpdateTourBody,
  UpdateTourResponse,
  DeleteTourParams,
  GetTourBySlugParams,
  GetTourBySlugResponse,
  ListFeaturedToursResponse,
  ListToursResponse,
} from "@workspace/api-zod";

const router = Router();

const mapTour = (tour: typeof toursTable.$inferSelect) => ({
  ...tour,
  durationHours: Number(tour.durationHours),
  priceFrom: Number(tour.priceFrom),
  languages: (tour.languages as string[]) || [],
  galleryImages: (tour.galleryImages as string[]) || [],
  highlights: (tour.highlights as string[]) || [],
  includedItems: (tour.includedItems as string[]) || [],
  notIncludedItems: (tour.notIncludedItems as string[]) || [],
  itinerary: (tour.itinerary as object[]) || [],
  premiumBadge: tour.premiumBadge ?? null,
  createdAt: tour.createdAt.toISOString(),
});

router.get("/tours", async (req, res): Promise<void> => {
  const params = ListToursQueryParams.safeParse(req.query);
  const conditions: SQL[] = [];
  if (params.success) {
    if (params.data.destination) conditions.push(eq(toursTable.destination, params.data.destination));
    if (params.data.category) conditions.push(eq(toursTable.category, params.data.category));
    if (params.data.language) conditions.push(eq(toursTable.languages, params.data.language as unknown as string[]));
    if (params.data.type && params.data.type !== "all") conditions.push(eq(toursTable.tourType, params.data.type));
    if (params.data.featured !== undefined) conditions.push(eq(toursTable.featured, params.data.featured));
  }
  const tours = await db
    .select()
    .from(toursTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(toursTable.sortOrder, toursTable.createdAt);
  res.json(ListToursResponse.parse(tours.map(mapTour)));
});

router.get("/tours/featured", async (_req, res): Promise<void> => {
  const tours = await db
    .select()
    .from(toursTable)
    .where(and(eq(toursTable.featured, true), eq(toursTable.published, true)))
    .orderBy(toursTable.sortOrder)
    .limit(8);
  res.json(ListFeaturedToursResponse.parse(tours.map(mapTour)));
});

router.get("/tours/slug/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [tour] = await db.select().from(toursTable).where(eq(toursTable.slug, slug));
  if (!tour) { res.status(404).json({ error: "Tour not found" }); return; }
  res.json(GetTourBySlugResponse.parse(mapTour(tour)));
});

router.get("/tours/:id", async (req, res): Promise<void> => {
  const params = GetTourParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, params.data.id));
  if (!tour) { res.status(404).json({ error: "Tour not found" }); return; }
  res.json(GetTourResponse.parse(mapTour(tour)));
});

router.post("/tours", async (req, res): Promise<void> => {
  const parsed = CreateTourBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [tour] = await db.insert(toursTable).values(parsed.data as unknown as typeof toursTable.$inferInsert).returning();
  res.status(201).json(GetTourResponse.parse(mapTour(tour)));
});

router.patch("/tours/:id", async (req, res): Promise<void> => {
  const params = UpdateTourParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateTourBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [tour] = await db.update(toursTable).set(parsed.data as Partial<typeof toursTable.$inferInsert>).where(eq(toursTable.id, params.data.id)).returning();
  if (!tour) { res.status(404).json({ error: "Tour not found" }); return; }
  res.json(UpdateTourResponse.parse(mapTour(tour)));
});

router.delete("/tours/:id", async (req, res): Promise<void> => {
  const params = DeleteTourParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [tour] = await db.delete(toursTable).where(eq(toursTable.id, params.data.id)).returning();
  if (!tour) { res.status(404).json({ error: "Tour not found" }); return; }
  res.sendStatus(204);
});

export default router;
