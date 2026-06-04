import { Router, type IRouter } from "express";
import { db, toursTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { storage } from "../storage";
import { getUncachableStripeClient } from "../stripeClient";

const router: IRouter = Router();

interface CartItem {
  tourSlug: string;
  pax: number;
  title: string;
}

router.post("/stripe/checkout", async (req, res) => {
  try {
    const { items, customerEmail } = req.body as {
      items: CartItem[];
      customerEmail?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const stripe = await getUncachableStripeClient();

    const lineItems: { price: string; quantity: number }[] = [];
    const missingProducts: string[] = [];

    for (const item of items) {
      const [tour] = await db
        .select({ id: toursTable.id, title: toursTable.title })
        .from(toursTable)
        .where(eq(toursTable.slug, item.tourSlug))
        .limit(1);

      if (!tour) {
        return res.status(404).json({ error: `Tour not found: ${item.tourSlug}` });
      }

      const priceId = await storage.getStripePriceForTour(item.tourSlug);

      if (!priceId) {
        missingProducts.push(item.tourSlug);
        continue;
      }

      lineItems.push({ price: priceId, quantity: Math.max(1, item.pax) });
    }

    if (missingProducts.length > 0) {
      return res.status(400).json({
        error: `Products not yet configured in Stripe for: ${missingProducts.join(", ")}. Please run the seed script first.`,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid items in cart" });
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: {
        tour_slugs: items.map((i) => i.tourSlug).join(","),
        pax_counts: items.map((i) => i.pax).join(","),
      },
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    req.log?.error(err, "Stripe checkout error");
    return res.status(500).json({ error: err.message || "Checkout failed" });
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
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch session" });
  }
});

export default router;
