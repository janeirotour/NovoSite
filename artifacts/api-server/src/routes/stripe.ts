import { Router, type IRouter } from "express";
import { db, toursTable, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { createReservation } from "./reservations";

const router: IRouter = Router();

interface SelectedExtra {
  id: number;
  name: string;
  price: number;
  currency: string;
}

interface TransportationOption {
  vehicle: string;
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
  transportation?: TransportationOption;
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

type StripeLineItem = {
  price_data: { currency: string; product_data: { name: string }; unit_amount: number };
  quantity: number;
};

interface PricingTier {
  label: string;
  minPax: number;
  maxPax: number | null;
  pricePerPerson: number;
  currency: string;
}

interface TransportationTier {
  minPax: number;
  maxPax: number | null;
  vehicle: string;
  price: number;
  currency: string;
}

interface TransportationPricing {
  enabled: boolean;
  name: string;
  description: string;
  tiers: TransportationTier[];
}

function calcTourPrice(pax: number, pricingRules: PricingTier[] | null | undefined, priceFrom: number): { total: number; label: string } {
  if (!pricingRules || pricingRules.length === 0) {
    return { total: priceFrom * pax, label: `$${priceFrom} × ${pax} traveler${pax !== 1 ? "s" : ""}` };
  }
  const tier = pricingRules.find((t) => pax >= t.minPax && (t.maxPax == null || pax <= t.maxPax));
  const activeTier = tier ?? pricingRules[pricingRules.length - 1];
  return {
    total: activeTier.pricePerPerson * pax,
    label: `${activeTier.label} — $${activeTier.pricePerPerson} × ${pax}`,
  };
}

function getTransportTier(pax: number, transPricing: TransportationPricing | null | undefined): TransportationTier | null {
  if (!transPricing?.enabled || !transPricing.tiers?.length) return null;
  const tier = transPricing.tiers.find((t) => pax >= t.minPax && (t.maxPax == null || pax <= t.maxPax));
  return tier ?? null;
}

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
          pricingRules: toursTable.pricingRules,
          transportationPricing: toursTable.transportationPricing,
        })
        .from(toursTable)
        .where(eq(toursTable.slug, item.tourSlug))
        .limit(1);

      if (!tour) {
        return res.status(404).json({ error: `Tour not found: ${item.tourSlug}` });
      }

      const currency = (tour.currency ?? "USD").toLowerCase();

      // Calculate tour price server-side from pricing rules
      const { total: tourTotal } = calcTourPrice(
        item.pax,
        tour.pricingRules as PricingTier[] | null,
        Number(tour.priceFrom)
      );

      lineItems.push({
        price_data: {
          currency,
          product_data: { name: item.title || tour.title },
          unit_amount: Math.round(tourTotal * 100),
        },
        quantity: 1,
      });

      // Transportation add-on — verify server-side pricing
      const extras = item.selectedExtras ?? [];
      let transportTotal = 0;

      if (item.transportation) {
        // Look up the correct tier from DB to prevent price manipulation
        const transPricing = tour.transportationPricing as TransportationPricing | null;
        const serverTier = getTransportTier(item.pax, transPricing);
        if (serverTier) {
          transportTotal = serverTier.price;
          lineItems.push({
            price_data: {
              currency,
              product_data: {
                name: `${transPricing!.name} (${serverTier.vehicle}) — ${tour.title}`,
              },
              unit_amount: Math.round(serverTier.price * 100),
            },
            quantity: 1,
          });
        }
      }

      // Extras
      const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
      if (extrasTotal > 0) {
        lineItems.push({
          price_data: {
            currency,
            product_data: { name: `Add-ons — ${tour.title}` },
            unit_amount: Math.round(extrasTotal * 100),
          },
          quantity: 1,
        });
      }

      if (customer?.name && customer?.email) {
        const basePrice = Number(tour.priceFrom);
        const totalAmount = tourTotal + transportTotal + extrasTotal;

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
    const message = err instanceof Error ? err.message : "Failed to retrieve session";
    return res.status(500).json({ error: message });
  }
});

export default router;
