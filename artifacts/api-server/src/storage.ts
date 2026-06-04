import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export class Storage {
  async getStripePriceForTour(tourSlug: string): Promise<string | null> {
    const result = await db.execute(
      sql`
        SELECT pr.id as price_id
        FROM stripe.prices pr
        JOIN stripe.products p ON pr.product = p.id
        WHERE p.metadata->>'tour_slug' = ${tourSlug}
          AND pr.active = true
          AND p.active = true
        ORDER BY pr.unit_amount ASC
        LIMIT 1
      `
    );
    const row = result.rows[0] as { price_id?: string } | undefined;
    return row?.price_id ?? null;
  }

  async listProductsWithPrices() {
    const result = await db.execute(
      sql`
        WITH paginated_products AS (
          SELECT id, name, description, metadata, active
          FROM stripe.products
          WHERE active = true
          ORDER BY id
        )
        SELECT
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.active as price_active
        FROM paginated_products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        ORDER BY p.id, pr.unit_amount
      `
    );
    return result.rows;
  }
}

export const storage = new Storage();
