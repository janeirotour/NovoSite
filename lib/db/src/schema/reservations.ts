import { pgTable, serial, text, numeric, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reservationsTable = pgTable("reservations", {
  id: serial("id").primaryKey(),
  reservationRef: text("reservation_ref").notNull().unique(),
  tourSlug: text("tour_slug").notNull(),
  tourTitle: text("tour_title").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerCountry: text("customer_country"),
  hotelAddress: text("hotel_address"),
  pickupLocation: text("pickup_location"),
  dropoffLocation: text("dropoff_location"),
  flightNumber: text("flight_number"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  pax: integer("pax").notNull().default(1),
  language: text("language"),
  notes: text("notes"),
  selectedExtras: jsonb("selected_extras").notNull().default([]),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  extrasTotal: numeric("extras_total", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  bookingStatus: text("booking_status").notNull().default("pending_confirmation"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
