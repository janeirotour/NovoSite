import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency, CURRENCY_META, CURRENCIES, type CurrencyCode } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  isHero?: boolean;
  compact?: boolean;
}

export function CurrencySelector({ isHero = false, compact = false }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const meta = CURRENCY_META[currency];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-md text-sm transition-colors",
          compact ? "px-1.5 py-1" : "px-2 py-1.5",
          isHero
            ? "text-white/80 hover:text-white"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
        title="Select currency"
      >
        <span className="text-sm leading-none">{meta.flag}</span>
        <span className={cn("font-semibold", compact ? "text-[11px]" : "text-xs")}>{currency}</span>
        <ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[60] max-h-72 overflow-y-auto">
          {CURRENCIES.map((code: CurrencyCode) => {
            const m = CURRENCY_META[code];
            return (
              <button
                key={code}
                onClick={() => { setCurrency(code); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors",
                  currency === code ? "font-semibold text-gray-900 bg-gray-50" : "text-gray-600"
                )}
              >
                <span className="text-base leading-none w-5">{m.flag}</span>
                <span className="font-bold text-[11px] text-gray-400 w-7">{code}</span>
                <span className="text-xs text-gray-500 truncate">{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
