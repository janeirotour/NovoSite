/**
 * PackageCard — canonical card component for ALL package content.
 *
 * Use ONLY when contentType === "package".
 * Do NOT use for Tours, Experiences, Transfers, Hotels, Blog, Destinations.
 *
 * Variants:
 *   "horizontal" — listing page (5-col grid, alternating image side, full detail)
 *   "vertical"   — homepage featured grid (image-top, compact content)
 */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Check, Clock, MessageCircle, Plane, Star, Users,
} from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Package } from "@workspace/api-client-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "es" | "pt" | "fr" | "de" | "no";

type TourIncluded = {
  slug?: string;
  title?: string;
  duration?: string;
  description?: string;
  [key: string]: unknown;
};

interface PackageCardProps {
  pkg: Package;
  variant?: "horizontal" | "vertical";
  /** alternating image side (horizontal only) */
  idx?: number;
  lang?: string;
}

// ─── Badge colour map ─────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  green:  "bg-green-600 text-white",
  amber:  "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
};

// ─── Badge translations ───────────────────────────────────────────────────────

const BADGE_TX: Record<string, Record<Lang, string>> = {
  "Best Seller":          { en: "Best Seller",         es: "Más Vendido",      pt: "Mais Vendido",      fr: "Best Seller",         de: "Bestseller",          no: "Bestselger" },
  "Premium":              { en: "Premium",              es: "Premium",          pt: "Premium",           fr: "Premium",             de: "Premium",             no: "Premium" },
  "Most Popular":         { en: "Most Popular",         es: "Más Popular",      pt: "Mais Popular",      fr: "Le Plus Populaire",   de: "Am Beliebtesten",     no: "Mest Populær" },
  "New":                  { en: "New",                  es: "Nuevo",            pt: "Novo",              fr: "Nouveau",             de: "Neu",                 no: "Ny" },
  "Luxury":               { en: "Luxury",               es: "Lujo",             pt: "Luxo",              fr: "Luxe",                de: "Luxus",               no: "Luksus" },
  "Cultural":             { en: "Cultural",             es: "Cultural",         pt: "Cultural",          fr: "Culturel",            de: "Kulturell",           no: "Kulturell" },
  "Family":               { en: "Family",               es: "Familiar",         pt: "Família",           fr: "Famille",             de: "Familie",             no: "Familie" },
  "Adventure":            { en: "Adventure",            es: "Aventura",         pt: "Aventura",          fr: "Aventure",            de: "Abenteuer",           no: "Eventyr" },
  "Private":              { en: "Private",              es: "Privado",          pt: "Privado",           fr: "Privé",               de: "Privat",              no: "Privat" },
  "Limited Availability": { en: "Limited Availability", es: "Disponibilidad Limitada", pt: "Disponibilidade Limitada", fr: "Disponibilité Limitée", de: "Begrenzte Verfügbarkeit", no: "Begrenset Tilgjengelighet" },
};

function translateBadge(badge: string, lang: Lang): string {
  return BADGE_TX[badge]?.[lang] ?? badge;
}

// ─── Shared label translations ────────────────────────────────────────────────

const TX = {
  perPerson:    { en: "per person",           es: "por persona",          pt: "por pessoa",           fr: "par personne",          de: "pro Person",           no: "per person" },
  included:     { en: "Included experiences", es: "Experiencias incluidas", pt: "Experiências incluídas", fr: "Expériences incluses", de: "Enthaltene Erlebnisse", no: "Inkluderte opplevelser" },
  moreExp:      { en: "more experiences",     es: "experiencias más",     pt: "experiências incluídas", fr: "expériences de plus",  de: "weitere Erlebnisse",  no: "flere opplevelser" },
  highlights:   { en: "Package highlights",   es: "Aspectos destacados",  pt: "Destaques do pacote",   fr: "Points forts",          de: "Paketvorteile",        no: "Pakkefordeler" },
  seePrices:    { en: "See Prices & Book",    es: "Ver Precios y Reservar", pt: "Ver Preços e Reservar", fr: "Voir les Prix et Réserver", de: "Preise & Buchen",  no: "Se priser og bestill" },
  whatsapp:     { en: "WhatsApp",             es: "WhatsApp",             pt: "WhatsApp",              fr: "WhatsApp",              de: "WhatsApp",             no: "WhatsApp" },
  save:         { en: "Save",                 es: "Ahorra",               pt: "Economize",             fr: "Économisez",            de: "Spare",                no: "Spar" },
  bookNow:      { en: "See Prices & Book",    es: "Ver Precios y Reservar", pt: "Ver Preços e Reservar", fr: "Voir les Prix et Réserver", de: "Preise & Buchen",  no: "Se priser og bestill" },
} as const;

type TXKey = keyof typeof TX;

function tx(key: TXKey, lang: Lang): string {
  return (TX[key] as Record<string, string>)[lang] ?? (TX[key] as Record<string, string>).en;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PackageCard({ pkg, variant = "horizontal", idx = 0, lang = "en" }: PackageCardProps) {
  const { data: settings } = useGetSettings();
  const { formatPrice } = useCurrency();

  const l = (lang as Lang) || "en";
  const whatsappUrl = settings?.contactWhatsapp ?? "https://wa.me/5521972633333";
  const isReversed  = variant === "horizontal" && idx % 2 === 1;

  const tours      = (pkg.toursIncluded ?? []) as TourIncluded[];
  const highlights = (pkg.highlights    ?? []) as string[];
  const infoBar    = (pkg.includedItems ?? [])[0] ?? null;

  const badgeStyle  = BADGE_STYLES[pkg.badgeColor ?? "green"] ?? BADGE_STYLES.green;
  const badgeLabel  = pkg.badge ? translateBadge(pkg.badge, l) : null;
  const isStarBadge = pkg.badge === "Best Seller" || pkg.badge === BADGE_TX["Best Seller"]?.[l];

  if (variant === "vertical") {
    return <VerticalCard
      pkg={pkg} l={l} whatsappUrl={whatsappUrl} formatPrice={formatPrice}
      tours={tours} highlights={highlights} infoBar={infoBar}
      badgeStyle={badgeStyle} badgeLabel={badgeLabel} isStarBadge={isStarBadge}
    />;
  }

  // ── Horizontal layout ──────────────────────────────────────────────────────
  const visibleTours  = tours.slice(0, 3);
  const extraTours    = tours.length > 3 ? tours.length - 3 : 0;
  const visibleHighlights = highlights.slice(0, 6);

  return (
    <div className="relative bg-card border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 grid lg:grid-cols-5">
      {/* ── Image column ── */}
      <div className={`relative lg:col-span-2 min-h-56 lg:min-h-0 ${isReversed ? "lg:order-last" : ""}`}>
        <img
          src={pkg.imageUrl}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badge */}
        {badgeLabel && (
          <div className={`absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow ${badgeStyle}`}>
            {isStarBadge
              ? <span className="flex items-center gap-1"><Star size={10} fill="currentColor" />{badgeLabel}</span>
              : badgeLabel
            }
          </div>
        )}
        {/* Savings pill */}
        {pkg.savingsPercent && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
            {tx("save", l)} {pkg.savingsPercent}%
          </div>
        )}
      </div>

      {/* ── Content column ── */}
      <div className="lg:col-span-3 p-5 flex flex-col gap-3">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-tight">{pkg.title}</h3>
            {pkg.subtitle && <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{pkg.subtitle}</p>}
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
              {pkg.durationLabel    && <span className="flex items-center gap-1"><Clock size={10} />{pkg.durationLabel}</span>}
              {tours.length > 0    && <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500" />{tours.length} {tx("included", l)}</span>}
              {pkg.groupSizeLabel  && <span className="flex items-center gap-1"><Users size={10} />{pkg.groupSizeLabel}</span>}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-green-600">{formatPrice(Number(pkg.priceFrom))}</p>
            <p className="text-[11px] text-muted-foreground">{tx("perPerson", l)}</p>
            {pkg.originalPrice && (
              <p className="text-[11px] line-through text-muted-foreground">{formatPrice(Number(pkg.originalPrice))}</p>
            )}
          </div>
        </div>

        {/* Info bar */}
        {infoBar && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300 font-medium">
            <Plane size={11} className="flex-shrink-0" />
            <span className="leading-snug">{infoBar}</span>
          </div>
        )}

        {/* Included experiences */}
        {visibleTours.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground tracking-[0.05em] mb-1.5 uppercase">{tx("included", l)}</p>
            <div className="flex flex-col gap-1.5">
              {visibleTours.map((t, ti) => (
                <div key={t.slug ?? ti} className="flex gap-2.5 items-start bg-muted/40 rounded-lg px-3 py-2 border">
                  <div className="w-5 h-5 rounded-md bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                    {ti + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs leading-tight">{t.title ?? ""}</p>
                    {t.description && (
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1 mt-0.5">{t.description}</p>
                    )}
                  </div>
                  {t.duration && (
                    <span className="flex-shrink-0 text-[10px] text-green-600 font-medium flex items-center gap-0.5 mt-0.5">
                      <Clock size={9} />{t.duration}
                    </span>
                  )}
                </div>
              ))}
              {extraTours > 0 && (
                <p className="text-[11px] text-muted-foreground pl-1">+{extraTours} {tx("moreExp", l)}</p>
              )}
            </div>
          </div>
        )}

        {/* Highlights */}
        {visibleHighlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5">
            {visibleHighlights.map((h) => (
              <div key={h} className="flex items-start gap-1.5 text-xs">
                <Check size={11} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-snug">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t mt-auto">
          <Link href={`/packages/${pkg.slug}`} className="flex-1">
            <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm gap-1.5">
              {tx("seePrices", l)} <ArrowRight size={14} />
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="sm:w-auto">
            <Button variant="outline" className="w-full h-10 border-green-300 text-green-700 hover:bg-green-50 text-sm gap-1.5 px-4">
              <MessageCircle size={14} /> {tx("whatsapp", l)}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Vertical card (homepage featured section) ────────────────────────────────

interface VerticalCardProps {
  pkg: Package;
  l: Lang;
  whatsappUrl: string;
  formatPrice: (n: number) => string;
  tours: TourIncluded[];
  highlights: string[];
  infoBar: string | null;
  badgeStyle: string;
  badgeLabel: string | null;
  isStarBadge: boolean;
}

function VerticalCard({ pkg, l, whatsappUrl, formatPrice, tours, infoBar, badgeStyle, badgeLabel, isStarBadge }: VerticalCardProps) {
  const visibleTours = tours.slice(0, 3);
  const extraTours   = tours.length > 3 ? tours.length - 3 : 0;

  return (
    <div className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
        <img
          src={pkg.imageUrl}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {badgeLabel && (
          <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow ${badgeStyle}`}>
            {isStarBadge
              ? <span className="flex items-center gap-1"><Star size={10} fill="currentColor" />{badgeLabel}</span>
              : badgeLabel
            }
          </div>
        )}
        {pkg.savingsPercent && (
          <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
            {tx("save", l)} {pkg.savingsPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight">{pkg.title}</h3>
            {pkg.subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{pkg.subtitle}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-green-600">{formatPrice(Number(pkg.priceFrom))}</p>
            <p className="text-xs text-muted-foreground">{tx("perPerson", l)}</p>
            {pkg.originalPrice && (
              <p className="text-[11px] line-through text-muted-foreground">{formatPrice(Number(pkg.originalPrice))}</p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {pkg.durationLabel   && <span className="flex items-center gap-1"><Clock size={10} />{pkg.durationLabel}</span>}
          {pkg.groupSizeLabel  && <span className="flex items-center gap-1"><Users size={10} />{pkg.groupSizeLabel}</span>}
        </div>

        {/* Experiences list */}
        {visibleTours.length > 0 && (
          <div className="space-y-1.5">
            {visibleTours.map((t, i) => (
              <div key={t.slug ?? i} className="flex gap-2 items-start text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 font-bold text-[9px] mt-0.5">
                  {i + 1}
                </div>
                <span className="leading-snug line-clamp-1">{t.title ?? ""}</span>
              </div>
            ))}
            {extraTours > 0 && (
              <p className="text-[11px] text-muted-foreground pl-6">+{extraTours} {tx("moreExp", l)}</p>
            )}
          </div>
        )}

        {/* Info bar */}
        {infoBar && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300 font-medium">
            <Plane size={11} className="flex-shrink-0" />
            <span className="leading-snug line-clamp-1">{infoBar}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-1">
          <Link href={`/packages/${pkg.slug}`} className="flex-1">
            <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold gap-2">
              {tx("bookNow", l)} <ArrowRight size={14} />
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="sm:w-auto">
            <Button variant="outline" className="w-full h-10 border-green-300 text-green-700 hover:bg-green-50 text-sm gap-1.5 px-3">
              <MessageCircle size={14} /> {tx("whatsapp", l)}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
