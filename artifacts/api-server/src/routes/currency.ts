import { Router } from "express";

const router = Router();

const SUPPORTED: string[] = ["USD", "EUR", "GBP", "BRL", "CAD", "AUD", "ARS", "CLP", "MXN", "NOK"];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BRL: 4.97,
  CAD: 1.36,
  AUD: 1.53,
  ARS: 900,
  CLP: 920,
  MXN: 17.2,
  NOK: 10.7,
};

interface RatesCache {
  rates: Record<string, number>;
  expiresAt: number;
}

let cache: RatesCache | null = null;
const TTL_MS = 60 * 60 * 1000;

async function fetchRates(): Promise<Record<string, number>> {
  if (cache && Date.now() < cache.expiresAt) return cache.rates;

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error("No rates in response");
    const filtered: Record<string, number> = {};
    for (const code of SUPPORTED) {
      filtered[code] = data.rates[code] ?? FALLBACK_RATES[code] ?? 1;
    }
    cache = { rates: filtered, expiresAt: Date.now() + TTL_MS };
    return filtered;
  } catch {
    return FALLBACK_RATES;
  }
}

router.get("/currency/rates", async (req, res) => {
  try {
    const rates = await fetchRates();
    res.json({ base: "USD", rates });
  } catch {
    res.json({ base: "USD", rates: FALLBACK_RATES });
  }
});

export default router;
