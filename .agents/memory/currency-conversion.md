---
name: Currency conversion
description: How the currency conversion system works — architecture, files changed, extension guide.
---

# Currency Conversion System

## Architecture
Display-only conversion. Backend prices stay in USD. Stripe always charges USD.

## Backend
- `artifacts/api-server/src/routes/currency.ts` — GET /api/currency/rates
  - Fetches from `https://open.er-api.com/v6/latest/USD` (free, no API key)
  - In-memory cache, 1-hour TTL
  - Static fallback rates if API fails
  - Registered in `routes/index.ts` before toursRouter

## Frontend
- `CurrencyContext.tsx` — React context with `formatPrice(usdAmount)`, auto-detect from `navigator.language`, localStorage persistence at key `janeiro_currency`
- `currency-selector.tsx` — dropdown component added to Header.tsx (desktop) between nav and language selector
- `useCurrency()` hook used in: tour-card.tsx, CartSidebar.tsx, packages.tsx, package-detail.tsx, tour-detail.tsx

## Supported currencies
USD, EUR, GBP, BRL, CAD, AUD, ARS, CLP, MXN

## Country detection (locale → currency)
`navigator.language` prefix mapped in LOCALE_TO_CURRENCY object inside CurrencyContext.tsx.

## To add a new currency
1. Add to `SUPPORTED` array in `currency.ts` (backend)
2. Add to `CURRENCY_META` in `CurrencyContext.tsx`
3. Add to `LOCALE_TO_CURRENCY` if there's a locale to auto-detect
4. Add to `FALLBACK_RATES` in both files

**Why display-only:** Stripe requires server-side price authority. Frontend conversion is for UX only; payment amount is always calculated from USD prices in DB.
