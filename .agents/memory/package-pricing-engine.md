---
name: Package pricing engine
description: Two pricing models in package-detail.tsx; detection via pricingConfig.type in DB
---

## Standard packages (Afro Rio Soul, Rio Highlights, Rio VIP)
- Uses `toursIncluded` pricingRules + vehicle tiers + $60/pax airport transfers
- `calcPackageTotal()` in package-detail.tsx
- 5% discount hardcoded
- Max 45 pax

## Global group discount tiers (ALL package types)
- Defined as `GROUP_DISCOUNT_TIERS` constant in package-detail.tsx
- 1 person = 0% · 2–5 = 5% · 6–10 = 7% · 11–20 = 10% · 21–40 = 12%
- `getGroupDiscount(pax)` returns the applicable %; used in both `calcPackageTotal` and `calcFixedPerPersonTotal`
- Admin PackageForm shows these tiers as a read-only reference table (not editable per-package)

## Fixed per-person packages (Essential Premium Rio)
- Uses `pricingConfig` jsonb field with `type: "fixed_per_person"`
- Fields: `basePricePerPerson`, `minTravelers`, `maxTravelers`, `tableDescription?` (discountPercent kept in DB but unused — tiers govern)
- Formula: basePricePerPerson × pax × (1 − getGroupDiscount(pax)/100)
- Examples: 1 pax = $1,300; 2 pax = $2,470; 6 pax = $7,254; 11 pax = $12,870

## Legacy multi-day config (backward compat only)
- `type: "premium_multi_day"` — cost-based formula using its own `discountPercent`; kept for backward compat but not used by any active package

## DB columns added to packages table
- `pricing_config` jsonb
- `not_included_items` jsonb DEFAULT '[]'
- `itinerary_days` jsonb DEFAULT '[]'
- `title_es`, `title_pt`, `description_es`, `description_pt` text
- `seo_title`, `seo_description` text
- `category`, `destination` text

**Why:** Essential Premium Rio has fixed group costs (Day 2 $500, Day 3 $450) + per-person costs ($340/pax) — incompatible with the vehicle-tier model used by standard packages.

**How to apply:** Set `pricingConfig.type = "premium_multi_day"` in the DB row to activate the premium engine. Leave `pricingConfig = null` for standard packages.
