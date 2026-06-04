import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reservationsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const mapReservation = (r: typeof reservationsTable.$inferSelect) => ({
  ...r,
  basePrice: Number(r.basePrice),
  extrasTotal: Number(r.extrasTotal),
  totalAmount: Number(r.totalAmount),
  selectedExtras: (r.selectedExtras as object[]) ?? [],
});

router.get("/admin/reservations", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const { bookingStatus, paymentStatus } = req.query as Record<string, string | undefined>;

  let query = db.select().from(reservationsTable).$dynamic();
  if (bookingStatus) query = query.where(eq(reservationsTable.bookingStatus, bookingStatus));
  if (paymentStatus) query = query.where(eq(reservationsTable.paymentStatus, paymentStatus));

  const rows = await query.orderBy(desc(reservationsTable.createdAt));
  res.json(rows.map(mapReservation));
});

router.get("/admin/reservations/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [row] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id)).limit(1);
  if (!row) { res.status(404).json({ error: "Reservation not found" }); return; }

  res.json(mapReservation(row));
});

router.patch("/admin/reservations/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { bookingStatus, paymentStatus, notes } = req.body as Record<string, string | undefined>;
  const updates: Partial<typeof reservationsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (bookingStatus) updates.bookingStatus = bookingStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (notes !== undefined) updates.notes = notes;

  const [updated] = await db
    .update(reservationsTable)
    .set(updates)
    .where(eq(reservationsTable.id, id))
    .returning();

  if (!updated) { res.status(404).json({ error: "Reservation not found" }); return; }
  res.json(mapReservation(updated));
});

export async function createReservation(data: {
  tourSlug: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  hotelAddress?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  flightNumber?: string;
  preferredDate?: string;
  preferredTime?: string;
  pax: number;
  language?: string;
  notes?: string;
  selectedExtras: Array<{ id: number; name: string; price: number; currency: string }>;
  basePrice: number;
  extrasTotal: number;
  totalAmount: number;
  currency: string;
  stripeSessionId?: string;
}) {
  const [{ maxRef }] = await db
    .select({ maxRef: sql<string>`COALESCE(MAX(CAST(SUBSTRING(reservation_ref, 5) AS INTEGER)), 0)` })
    .from(reservationsTable);

  const nextNum = (Number(maxRef) + 1).toString().padStart(5, "0");
  const reservationRef = `JAN-${nextNum}`;

  const [created] = await db.insert(reservationsTable).values({
    reservationRef,
    tourSlug: data.tourSlug,
    tourTitle: data.tourTitle,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone ?? null,
    customerCountry: data.customerCountry ?? null,
    hotelAddress: data.hotelAddress ?? null,
    pickupLocation: data.pickupLocation ?? null,
    dropoffLocation: data.dropoffLocation ?? null,
    flightNumber: data.flightNumber ?? null,
    preferredDate: data.preferredDate ?? null,
    preferredTime: data.preferredTime ?? null,
    pax: data.pax,
    language: data.language ?? null,
    notes: data.notes ?? null,
    selectedExtras: data.selectedExtras,
    basePrice: String(data.basePrice),
    extrasTotal: String(data.extrasTotal),
    totalAmount: String(data.totalAmount),
    currency: data.currency,
    stripeSessionId: data.stripeSessionId ?? null,
    paymentStatus: "pending",
    bookingStatus: "pending_confirmation",
  }).returning();

  return created;
}

export async function updateReservationBySessionId(
  stripeSessionId: string,
  updates: { paymentStatus?: string; stripePaymentId?: string; bookingStatus?: string }
) {
  const [updated] = await db
    .update(reservationsTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(reservationsTable.stripeSessionId, stripeSessionId))
    .returning();
  return updated ?? null;
}

export default router;
