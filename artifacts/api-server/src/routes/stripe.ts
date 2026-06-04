import { Router, type IRouter } from "express";
import { db, toursTable, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { storage } from "../storage";
import { getUncachableStripeClient } from "../stripeClient";
import { createReservation } from "./reservations";

const router: IRouter = Router();

interface SelectedExtra {
  id: number;
  name: string;
  price: number;
  currency: string;
}

interface BookingItem {
  tourSlug: string;
  pax: number;
  title: string;
  selectedExtras?: SelectedExtra[];
  preferredDate?: string;
  preferredTime?: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  hotelAddress?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  flightNumber?: string;
  language?: string;
  notes?: string;
}

type StripeLineItem =
  | { price: string; quantity: number }
  | { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number };

router.post("/stripe/checkout", async (req, res) => {
  try {
    const { items, customer } = req.body as {
      items: BookingItem[];
      customer?: CustomerData;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const stripe = await getUncachableStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

    const lineItems: StripeLineItem[] = [];
    const reservationIds: number[] = [];

    for (const item of items) {
      const [tour] = await db
        .select({
          id: toursTable.id,
          title: toursTable.title,
          priceFrom: toursTable.priceFrom,
          currency: toursTable.currency,
        })
        .from(toursTable)
        .where(eq(toursTable.slug, item.tourSlug))
        .limit(1);

      if (!tour) {
        return res.status(404).json({ error: `Tour not found: ${item.tourSlug}` });
      }

      const priceId = await storage.getStripePriceForTour(item.tourSlug);
      if (!priceId) {
        return res.status(400).json({
          error: `No Stripe price configured for: ${item.tourSlug}. Run the seed script.`,
        });
      }

      lineItems.push({ price: priceId, quantity: Math.max(1, item.pax) });

      const extras = item.selectedExtras ?? [];
      const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);

      if (extrasTotal > 0) {
        lineItems.push({
          price_data: {
            currency: (tour.currency ?? "USD").toLowerCase(),
            product_data: { name: `Extras — ${tour.title}` },
            unit_amount: Math.round(extrasTotal * 100),
          },
          quantity: 1,
        });
      }

      if (customer?.name && customer?.email) {
        const basePrice = Number(tour.priceFrom);
        const totalAmount = basePrice * item.pax + extrasTotal;

        const reservation = await createReservation({
          tourSlug: item.tourSlug,
          tourTitle: tour.title,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerCountry: customer.country,
          hotelAddress: customer.hotelAddress,
          pickupLocation: customer.pickupLocation,
          dropoffLocation: customer.dropoffLocation,
          flightNumber: customer.flightNumber,
          preferredDate: item.preferredDate,
          preferredTime: item.preferredTime,
          pax: item.pax,
          language: customer.language,
          notes: customer.notes,
          selectedExtras: extras,
          basePrice,
          extrasTotal,
          totalAmount,
          currency: tour.currency ?? "USD",
        });

        reservationIds.push(reservation.id);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      ...(customer?.email ? { customer_email: customer.email } : {}),
      metadata: {
        reservation_ids: reservationIds.join(","),
        customer_name: (customer?.name ?? "").slice(0, 200),
      },
    });

    if (reservationIds.length > 0 && session.id) {
      await Promise.all(
        reservationIds.map((resId) =>
          db
            .update(reservationsTable)
            .set({ stripeSessionId: session.id })
            .where(eq(reservationsTable.id, resId))
        )
      );
    }

    return res.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    req.log?.error(err, "Stripe checkout error");
    return res.status(500).json({ error: message });
  }
});

router.get("/stripe/checkout/session", async (req, res) => {
  try {
    const { session_id } = req.query as { session_id?: string };
    if (!session_id) return res.status(400).json({ error: "Missing session_id" });

    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    return res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      lineItems: session.line_items?.data ?? [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch session";
    return res.status(500).json({ error: message });
  }
});

export default router;
