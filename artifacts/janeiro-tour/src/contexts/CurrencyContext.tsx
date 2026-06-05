import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "BRL" | "CAD" | "AUD" | "ARS" | "CLP" | "MXN";

export const CURRENCY_META: Record<CurrencyCode, { label: string; flag: string; locale: string; fractionDigits: number }> = {
  USD: { label: "US Dollar",          flag: "🇺🇸", locale: "en-US", fractionDigits: 0 },
  EUR: { label: "Euro",               flag: "🇪🇺", locale: "de-DE", fractionDigits: 0 },
  GBP: { label: "British Pound",      flag: "🇬🇧", locale: "en-GB", fractionDigits: 0 },
  BRL: { label: "Real Brasileiro",    flag: "🇧🇷", locale: "pt-BR", fractionDigits: 0 },
  CAD: { label: "Canadian Dollar",    flag: "🇨🇦", locale: "en-CA", fractionDigits: 0 },
  AUD: { label: "Australian Dollar",  flag: "🇦🇺", locale: "en-AU", fractionDigits: 0 },
  ARS: { label: "Peso Argentino",     flag: "🇦🇷", locale: "es-AR", fractionDigits: 0 },
  CLP: { label: "Peso Chileno",       flag: "🇨🇱", locale: "es-CL", fractionDigits: 0 },
  MXN: { label: "Peso Mexicano",      flag: "🇲🇽", locale: "es-MX", fractionDigits: 0 },
};

export const CURRENCIES = Object.keys(CURRENCY_META) as CurrencyCode[];

const LOCALE_TO_CURRENCY: Record<string, CurrencyCode> = {
  "en-US": "USD", "en-CA": "CAD", "en-GB": "GBP", "en-AU": "AUD",
  "en-NZ": "AUD", "pt-BR": "BRL", "es-AR": "ARS", "es-CL": "CLP",
  "es-MX": "MXN", "de":    "EUR", "de-DE": "EUR", "de-AT": "EUR",
  "fr":    "EUR", "fr-FR": "EUR", "fr-BE": "EUR", "it":    "EUR",
  "it-IT": "EUR", "nl":    "EUR", "nl-NL": "EUR", "pt-PT": "EUR",
  "es-ES": "EUR", "es-FR": "EUR",
};

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, BRL: 4.97,
  CAD: 1.36, AUD: 1.53, ARS: 900, CLP: 920, MXN: 17.2,
};

function detectCurrency(): CurrencyCode {
  try {
    const langs = [...(navigator.languages ?? [navigator.language])];
    for (const lang of langs) {
      if (LOCALE_TO_CURRENCY[lang]) return LOCALE_TO_CURRENCY[lang];
      const prefix = lang.split("-")[0];
      if (LOCALE_TO_CURRENCY[prefix]) return LOCALE_TO_CURRENCY[prefix];
    }
  } catch {}
  return "USD";
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  formatPrice: (usdAmount: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "janeiro_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (stored && CURRENCY_META[stored]) return stored;
    } catch {}
    return detectCurrency();
  });

  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/currency/rates");
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { rates: Record<string, number> };
        if (!cancelled) {
          setRates({ ...FALLBACK_RATES, ...(data.rates as Record<CurrencyCode, number>) });
        }
      } catch {
        // keep fallback rates
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
  }, []);

  const formatPrice = useCallback((usdAmount: number): string => {
    const meta = CURRENCY_META[currency];
    const rate = rates[currency] ?? 1;
    const converted = Math.round(usdAmount * rate);
    try {
      return new Intl.NumberFormat(meta.locale, {
        style: "currency",
        currency,
        minimumFractionDigits: meta.fractionDigits,
        maximumFractionDigits: meta.fractionDigits,
      }).format(converted);
    } catch {
      return `${currency} ${converted.toLocaleString()}`;
    }
  }, [currency, rates]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
