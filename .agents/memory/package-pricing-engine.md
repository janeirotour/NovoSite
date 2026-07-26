---
name: Package pricing engine
description: Two pricing models in package-detail.tsx; detection via pricingConfig.type in DB
---

## Standard packages (Afro Rio Soul, Rio Highlights, Rio VIP)
- Uses `toursIncluded` pricingRules + vehicle tiers + $60/pax airport transfers
- `calcPackageTotal()` in package-detail.tsx
- 5% discount hardcoded
- Max 45 pax

## Fixed per-person packages (Essential Premium Rio)
- Uses `pricingConfig` jsonb field with `type: "fixed_per_person"`
- Fields: `basePricePerPerson`, `discountPercent`, `minTravelers`, `maxTravelers`, `tableDescription?`
- Formula: basePricePerPerson × pax; discount (5%) applies only for pax ≥ 2; 1 traveler = no discount
- Examples: 1 pax = $1,300; 2 pax = $2,470; 5 pax = $6,175; 10 pax = $12,350
- `calcFixedPerPersonTotal()` and `calcAnyPremiumTotal()` in package-detail.tsx
- Itinerary from `itineraryDays` jsonb field (ItineraryDay[])
- Admin dashboard PackageForm shows editable fields for this type (base price, discount%, min/max travelers)

## Legacy multi-day config (backward compat only)
- `type: "premium_multi_day"` — cost-based formula with `perPersonCosts[]` + `fixedGroupCosts[]`; kept for backward compat but not used by any active package

## DB columns added to packages table
- `pricing_config` jsonb
- `not_included_items` jsonb DEFAULT '[]'
- `itinerary_days` jsonb DEFAULT '[]'
- `title_es`, `title_pt`, `description_es`, `description_pt` text
- `seo_title`, `seo_description` text
- `category`, `destination` text

**Why:** Essential Premium Rio has fixed group costs (Day 2 $500, Day 3 $450) + per-person costs ($340/pax) — incompatible with the vehicle-tier model used by standard packages.

**How to apply:** Set `pricingConfig.type = "premium_multi_day"` in the DB row to activate the premium engine. Leave `pricingConfig = null` for standard packages.
