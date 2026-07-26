// ─── Group discount tiers — single source of truth for ALL packages ───────────
export const GROUP_DISCOUNT_TIERS: {
  minPax: number;
  maxPax: number | null;
  discountPct: number;
  label: string;
}[] = [
  { minPax: 1,  maxPax: 1,    discountPct: 0,  label: "1 person"    },
  { minPax: 2,  maxPax: 5,    discountPct: 5,  label: "2–5 people"  },
  { minPax: 6,  maxPax: 10,   discountPct: 7,  label: "6–10 people" },
  { minPax: 11, maxPax: 20,   discountPct: 10, label: "11–20 people" },
  { minPax: 21, maxPax: null, discountPct: 12, label: "21–40 people" },
];

export function getGroupDiscount(pax: number): number {
  return (
    GROUP_DISCOUNT_TIERS.find(
      t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)
    )?.discountPct ?? 0
  );
}

export function getGroupDiscountLabel(pax: number): string {
  const tier = GROUP_DISCOUNT_TIERS.find(
    t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)
  );
  return tier?.discountPct ? `${tier.discountPct}% group discount` : "";
}
