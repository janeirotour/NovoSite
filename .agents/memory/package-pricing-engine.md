---
name: Package pricing engine
description: Two pricing models in package-detail.tsx; detection via pricingConfig.type in DB
---

## Standard packages (Afro Rio Soul, Rio Highlights, Rio VIP)
- Uses `toursIncluded` pricingRules + vehicle tiers + $60/pax airport transfers
- `calcPackageTotal()` in package-detail.tsx
- 5% discount hardcoded
- Max 45 pax

## Premium multi-day packages (Essential Premium Rio)
- Uses `pricingConfig` jsonb field with `type: "premium_multi_day"`
- Fields: `perPersonCosts[]`, `fixedGroupCosts[]`, `discountPercent`, `maxPax`, `tableDescription`
- Formula: (sum(perPersonCosts) × pax) + sum(fixedGroupCosts), then × (1 - discountPercent/100)
- `calcPremiumTotal()` in package-detail.tsx
- Itinerary from `itineraryDays` jsonb field (ItineraryDay[])

## DB columns added to packages table
- `pricing_config` jsonb
- `not_included_items` jsonb DEFAULT '[]'
- `itinerary_days` jsonb DEFAULT '[]'
- `title_es`, `title_pt`, `description_es`, `description_pt` text
- `seo_title`, `seo_description` text
- `category`, `destination` text

**Why:** Essential Premium Rio has fixed group costs (Day 2 $500, Day 3 $450) + per-person costs ($340/pax) — incompatible with the vehicle-tier model used by standard packages.

**How to apply:** Set `pricingConfig.type = "premium_multi_day"` in the DB row to activate the premium engine. Leave `pricingConfig = null` for standard packages.
