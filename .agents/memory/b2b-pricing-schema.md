---
name: B2B pricing schema field names and decimal conventions
description: Actual API field names for b2b_pricing_settings and b2b_group_tiers; pct values are stored as decimals not integers.
---

## b2b_pricing_settings API response fields
- `settingKey` — the lookup key (e.g. `accommodation_3star_usd_ppn`)
- `settingValue` — string decimal (e.g. `"45.0000"`)
- `settingLabel` — human-readable label (NOT `label` or `description`)
- `settingGroup` — grouping key (`accommodation`, `transport`, `meals`, etc.)

## b2b_group_tiers API response fields
- `id`, `minPax`, `maxPax`, `label` (NOT `tierName`), `discountPct`, `markupPct`, `complimentaryPolicy`, `updatedAt`

## Pct values are stored as DECIMALS
- `discountPct: "0.0000"` means 0%, `markupPct: "0.1500"` means 15%
- `special_season_surcharge_pct = 0.3000` means 30%
- `estimate_range_pct = 0.1000` means 10%
- Do NOT divide by 100 when using these values — multiply directly (e.g. `subtotal * markupPct`)

## Actual pricing setting keys (seeded)
- accommodation: `accommodation_3star_usd_ppn`, `accommodation_4star_usd_ppn`, `accommodation_5star_usd_ppn`, `accommodation_luxury_usd_ppn`
- experience: `experience_avg_pp`
- airport services: `airport_assistance_pp`
- staff: `coordinator_per_day_usd`, `guide_per_day_usd`
- meals: `meal_breakfast_pp`, `meal_fullboard_pp`, `meal_halfboard_pp`, `meal_special_dinner_pp`
- markup/range: `agency_markup_pct`, `estimate_range_pct`, `special_season_surcharge_pct`
- transport: `transport_airport_arrival_pp`, `transport_airport_departure_pp`, `transport_coach_per_day`, `transport_minivan_per_day`

**Why:** The seeded keys use concrete names (e.g. `accommodation_3star_usd_ppn`) not generic patterns (e.g. `accommodation_standard_rate_pppn`). The estimate engine must map form values (budget/standard/superior/deluxe) to these actual keys.
