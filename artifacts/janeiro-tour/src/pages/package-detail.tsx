import { useGetPackage } from "@workspace/api-client-react";
import { AccommodationAddon } from "@/components/accommodation/AccommodationAddon";
import { useParams, Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Check, X, Minus, Plus, Clock, Users, ArrowRight, ChevronLeft,
  Plane, MapPin, Car, CalendarDays, CreditCard, MessageCircle, Utensils, Star,
} from "lucide-react";
import { useState, useMemo } from "react";
import { PackageBookingModal } from "@/components/ui/PackageBookingModal";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/hooks/use-language";

// ─── Group discount tiers (applied to ALL package types) ─────────────────────
const GROUP_DISCOUNT_TIERS: { minPax: number; maxPax: number | null; discountPct: number }[] = [
  { minPax: 1,  maxPax: 1,    discountPct: 0  },
  { minPax: 2,  maxPax: 5,    discountPct: 5  },
  { minPax: 6,  maxPax: 10,   discountPct: 7  },
  { minPax: 11, maxPax: 20,   discountPct: 10 },
  { minPax: 21, maxPax: null, discountPct: 12 },
];

function getGroupDiscount(pax: number): number {
  return (
    GROUP_DISCOUNT_TIERS.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax))
      ?.discountPct ?? 0
  );
}

// ─── Standard package types & helpers ─────────────────────────────────────────
const VEHICLE_TIERS = [
  { minPax: 1,  maxPax: 2,  vehicle: "Private Car",  price: 120 },
  { minPax: 3,  maxPax: 11, vehicle: "Minivan",       price: 300 },
  { minPax: 12, maxPax: 16, vehicle: "Minibus",       price: 500 },
  { minPax: 17, maxPax: null, vehicle: "Coach Bus",   price: 700 },
];

function getVehicleTier(pax: number) {
  return (
    VEHICLE_TIERS.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)) ??
    VEHICLE_TIERS[VEHICLE_TIERS.length - 1]
  );
}

type PricingRule = { minPax: number; maxPax: number | null; pricePerPerson: number };
type TourEntry = {
  slug: string; title: string; duration: string;
  description: string; priceFrom: number; pricingRules: PricingRule[];
};

function getTourTotal(tour: TourEntry, pax: number): number {
  if (tour.pricingRules?.length > 0) {
    const tier =
      tour.pricingRules.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)) ??
      tour.pricingRules[tour.pricingRules.length - 1];
    return tier.pricePerPerson * pax;
  }
  return tour.priceFrom * pax;
}

function getTourUnitPrice(tour: TourEntry, pax: number): number {
  if (tour.pricingRules?.length > 0) {
    const tier =
      tour.pricingRules.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)) ??
      tour.pricingRules[tour.pricingRules.length - 1];
    return tier.pricePerPerson;
  }
  return tour.priceFrom;
}

const TRANSFER_PRICE_PER_PERSON = 60;

function calcPackageTotal(tours: TourEntry[], pax: number) {
  const vt = getVehicleTier(pax);
  const toursTotal   = tours.reduce((s, t) => s + getTourTotal(t, pax), 0);
  const transport2x  = vt.price * 2;
  const transferIn   = TRANSFER_PRICE_PER_PERSON * pax;
  const transferOut  = TRANSFER_PRICE_PER_PERSON * pax;
  const airportTotal = transferIn + transferOut;
  const subtotal     = toursTotal + transport2x + airportTotal;
  const discountPct  = getGroupDiscount(pax);
  const discount     = subtotal * (discountPct / 100);
  return { subtotal, discount, grandTotal: subtotal - discount, toursTotal, transport2x, transferIn, transferOut, airportTotal, vt, discountPct };
}

// ─── Premium pricing types & helpers ─────────────────────────────────────────
type PremiumCostItem = { label: string; price: number };

/** Legacy cost-based multi-day config (kept for backward compat) */
type MultiDayConfig = {
  type: "premium_multi_day";
  perPersonCosts: PremiumCostItem[];
  fixedGroupCosts: PremiumCostItem[];
  discountPercent: number;
  maxPax: number;
  tableDescription: string;
};

/** Simple fixed retail price per traveler */
type FixedPerPersonConfig = {
  type: "fixed_per_person";
  basePricePerPerson: number;
  discountPercent: number;
  minTravelers: number;
  maxTravelers: number;
  tableDescription?: string;
};

type PremiumPricingConfig = MultiDayConfig | FixedPerPersonConfig;

type ItineraryDay = {
  day: number;
  icon: "plane" | "map-pin" | "utensils" | "star" | "departure";
  title: string;
  description: string;
  tags?: string[];
  schedule?: string[];
};

// Type extension for fields added to DB but not yet in generated OpenAPI types
type PackageExtended = {
  pricingConfig?: PremiumPricingConfig | null;
  itineraryDays?: ItineraryDay[] | null;
  notIncludedItems?: string[] | null;
  titleEs?: string | null;
  titlePt?: string | null;
  descriptionEs?: string | null;
  descriptionPt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  category?: string | null;
  destination?: string | null;
};

function calcMultiDayTotal(config: MultiDayConfig, pax: number) {
  const perPersonSubtotal = config.perPersonCosts.reduce((s, c) => s + c.price, 0) * pax;
  const fixedGroupSubtotal = config.fixedGroupCosts.reduce((s, c) => s + c.price, 0);
  const subtotal = perPersonSubtotal + fixedGroupSubtotal;
  const discount = subtotal * (config.discountPercent / 100);
  const grandTotal = subtotal - discount;
  return { subtotal, discount, grandTotal, perPersonSubtotal, fixedGroupSubtotal };
}

function calcFixedPerPersonTotal(config: FixedPerPersonConfig, pax: number) {
  const subtotal = config.basePricePerPerson * pax;
  const discountPct = getGroupDiscount(pax);
  const discount = subtotal * (discountPct / 100);
  const grandTotal = subtotal - discount;
  return { subtotal, discount, grandTotal, discountPct };
}

function calcAnyPremiumTotal(config: PremiumPricingConfig, pax: number) {
  if (config.type === "fixed_per_person") return calcFixedPerPersonTotal(config, pax);
  return calcMultiDayTotal(config, pax);
}

function getPremiumMaxPax(config: PremiumPricingConfig): number {
  return config.type === "fixed_per_person" ? config.maxTravelers : config.maxPax;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  green:  "bg-green-600 text-white",
  amber:  "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
  blue:   "bg-blue-600 text-white",
  orange: "bg-orange-500 text-white",
  red:    "bg-red-600 text-white",
};

function DayIcon({ icon }: { icon: string }) {
  const cls = "text-white";
  const sz = 8;
  if (icon === "plane" || icon === "departure") return <Plane size={sz} className={cls} />;
  if (icon === "utensils") return <Utensils size={sz} className={cls} />;
  if (icon === "star") return <Star size={sz} className={cls} />;
  return <MapPin size={sz} className={cls} />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkgRaw, isLoading } = useGetPackage(slug!);
  const { formatPrice, currency } = useCurrency();
  const { lang } = useLanguage();

  // Cast to include DB-extended fields
  const pkg = pkgRaw as (typeof pkgRaw & PackageExtended) | undefined;
  const pricingConfig = pkg?.pricingConfig as PremiumPricingConfig | null | undefined;
  const isPremium = pricingConfig?.type === "premium_multi_day" || pricingConfig?.type === "fixed_per_person";
  const isFixedPerPerson = pricingConfig?.type === "fixed_per_person";
  const isMultiDay = pricingConfig?.type === "premium_multi_day";
  const itineraryDays = (pkg?.itineraryDays ?? []) as ItineraryDay[];
  const notIncludedItems = (pkg?.notIncludedItems ?? []) as string[];

  const [pax, setPax] = useState(2);
  const [arrivalDate, setArrivalDate] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const tours     = useMemo(() => (pkg?.toursIncluded ?? []) as TourEntry[], [pkg]);
  const highlights = useMemo(() => (pkg?.highlights ?? []) as string[], [pkg]);
  const includedItems = useMemo(() => (pkg?.includedItems ?? []) as string[], [pkg]);

  // Standard itinerary helpers (for non-premium packages)
  const day2Tour  = tours[0];
  const day3Tours = tours.slice(1);

  // Pricing — branch based on package type
  const premiumCalc = useMemo(
    () => (isPremium && pricingConfig ? calcAnyPremiumTotal(pricingConfig, pax) : null),
    [isPremium, pricingConfig, pax]
  );
  const standardCalc = useMemo(
    () => (!isPremium ? calcPackageTotal(tours, pax) : null),
    [isPremium, tours, pax]
  );

  const { grandTotal, discount, subtotal } = isPremium
    ? { grandTotal: premiumCalc!.grandTotal, discount: premiumCalc!.discount, subtotal: premiumCalc!.subtotal }
    : { grandTotal: standardCalc!.grandTotal, discount: standardCalc!.discount, subtotal: standardCalc!.subtotal };

  const perPerson = pax > 0 ? grandTotal / pax : grandTotal;

  const maxPax = isPremium ? getPremiumMaxPax(pricingConfig!) : 45;
  const TABLE_ROWS = Array.from({ length: maxPax }, (_, i) => i + 1);

  const today = new Date().toISOString().split("T")[0];

  // Localised description
  const localDescription = useMemo(() => {
    if (lang === "pt" && pkg?.descriptionPt) return pkg.descriptionPt;
    if (lang === "es" && pkg?.descriptionEs) return pkg.descriptionEs;
    return pkg?.description ?? "";
  }, [lang, pkg]);

  const localTitle = useMemo(() => {
    if (lang === "pt" && pkg?.titlePt) return pkg.titlePt;
    if (lang === "es" && pkg?.titleEs) return pkg.titleEs;
    return pkg?.title ?? "";
  }, [lang, pkg]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">Loading package…</div>
        </div>
      </MainLayout>
    );
  }

  if (!pkg) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Package not found</h1>
          <Link href="/packages"><Button>Back to Packages</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const badgeStyle = BADGE_STYLES[pkg.badgeColor ?? "green"] ?? BADGE_STYLES.green;

  return (
    <MainLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={pkg.imageUrl} alt={localTitle} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 pb-10">
          <Link href="/packages">
            <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ChevronLeft size={15} /> Back to Packages
            </button>
          </Link>
          {pkg.badge && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 ${badgeStyle}`}>
              {pkg.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white">{localTitle}</h1>
          {pkg.subtitle && <p className="text-white/80 text-lg mt-2">{pkg.subtitle}</p>}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
            {pkg.durationLabel  && <span className="flex items-center gap-1.5"><Clock size={13} />{pkg.durationLabel}</span>}
            {pkg.groupSizeLabel && <span className="flex items-center gap-1.5"><Users size={13} />{pkg.groupSizeLabel}</span>}
            {pkg.destination    && <span className="flex items-center gap-1.5"><MapPin size={13} />{pkg.destination}</span>}
          </div>
        </div>
      </section>

      {/* ── Main content + sidebar ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">

            <p className="text-muted-foreground text-lg leading-relaxed">{localDescription}</p>

            {/* ─ ITINERARY ──────────────────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-bold mb-5">Itinerary</h2>
              <div className="relative pl-8">
                <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />

                {isPremium && itineraryDays.length > 0 ? (
                  /* Premium: custom day-by-day from itineraryDays */
                  itineraryDays.map((d, idx) => (
                    <div key={d.day} className={`relative ${idx < itineraryDays.length - 1 ? "mb-8" : ""}`}>
                      <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                        <DayIcon icon={d.icon} />
                      </div>
                      <p className="text-xs font-bold text-green-600 tracking-[0.05em] mb-1">Day {d.day}</p>
                      <h3 className="font-semibold text-base mb-1">{d.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                      {d.tags && d.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {d.tags.map((tag, ti) => (
                            <span key={ti} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                              {tag.toLowerCase().includes("transfer") || tag.toLowerCase().includes("transport") ? (
                                <Car size={10} className="text-green-600" />
                              ) : tag.toLowerCase().includes("ticket") || tag.toLowerCase().includes("show") ? (
                                <Star size={10} className="text-amber-500" />
                              ) : (
                                <Check size={10} className="text-green-600" />
                              )}
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {d.schedule && d.schedule.length > 0 && (
                        <div className="mt-3 bg-muted/40 rounded-xl border p-3 space-y-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-2">Evening Schedule</p>
                          {d.schedule.map((s, si) => (
                            <p key={si} className="text-xs text-muted-foreground">{s}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  /* Standard: existing tour-based itinerary */
                  <>
                    {/* Day 1 — Arrival */}
                    <div className="relative mb-8">
                      <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                        <Plane size={8} className="text-white" />
                      </div>
                      <p className="text-xs font-bold text-green-600 tracking-[0.05em] mb-1">Day 1</p>
                      <h3 className="font-semibold text-base mb-1">Arrival in Rio de Janeiro</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You land at Galeão International Airport (GIG). Our team picks you up and transfers you directly
                        to your hotel. Rest, explore the surroundings and feel Rio for the first time — no activities
                        scheduled today.
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border w-fit">
                        <Car size={11} className="text-green-600" /> Airport arrival transfer included
                      </div>
                    </div>

                    {/* Day 2 — Tour 1 */}
                    {day2Tour && (
                      <div className="relative mb-8">
                        <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                          <MapPin size={8} className="text-white" />
                        </div>
                        <p className="text-xs font-bold text-green-600 tracking-[0.05em] mb-1">Day 2</p>
                        <h3 className="font-semibold text-base mb-1">{day2Tour.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{day2Tour.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                            <Clock size={10} /> {day2Tour.duration}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                            <Car size={10} className="text-green-600" /> Round-trip transport included
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Day 3+ */}
                    {day3Tours.length > 0 && (
                      <div className="relative">
                        <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                          <MapPin size={8} className="text-white" />
                        </div>
                        <p className="text-xs font-bold text-green-600 tracking-[0.05em] mb-1">Day 3</p>
                        <div className="space-y-4">
                          {day3Tours.map((t) => (
                            <div key={t.slug}>
                              <h3 className="font-semibold text-base mb-1">{t.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                              <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                                <Clock size={10} /> {t.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                          After your last activity, our team collects you from the hotel and takes you directly to
                          Galeão International Airport (GIG) in time for your flight home.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                            <Car size={10} className="text-green-600" /> Round-trip transport included
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 border">
                            <Plane size={10} className="text-green-600" /> Departure transfer (GIG) included
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ─ Highlights ─────────────────────────────────────────────── */}
            {highlights.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Package Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Included / Not Included ────────────────────────────────── */}
            {(includedItems.length > 0 || notIncludedItems.length > 0) && (
              <div className={`grid gap-8 ${notIncludedItems.length > 0 ? "sm:grid-cols-2" : ""}`}>
                {includedItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold mb-4 text-green-700">What's Included</h2>
                    <div className="space-y-2">
                      {includedItems.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm">
                          <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {notIncludedItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold mb-4 text-red-600">What's Not Included</h2>
                    <div className="space-y-2">
                      {notIncludedItems.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm">
                          <X size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ Important notices ──────────────────────────────────────── */}
            {isPremium && (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-semibold mb-1">Special-Season Pricing</p>
                  <p>Special-season pricing applies during Carnival, New Year's Eve, holidays and major events. Final rates and availability require confirmation.</p>
                </div>
                <div className="rounded-xl border bg-muted/50 p-4 text-sm text-muted-foreground">
                  <p>Prices are preliminary and subject to availability, travel dates, supplier confirmation, attraction availability and final group size.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border rounded-2xl shadow-xl overflow-hidden">

              {/* Total header */}
              <div className="bg-primary p-5">
                <p className="text-primary-foreground/80 text-sm font-medium">Package total</p>
                <p className="text-3xl font-bold text-primary-foreground">
                  {formatPrice(grandTotal)}
                </p>
                <p className="text-primary-foreground/80 text-xs mt-1">
                  {formatPrice(perPerson)}/person · {pax} traveler{pax !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Pax counter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Users size={14} className="text-muted-foreground" />
                    Travelers in your group
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPax(p => Math.max(1, p - 1))}
                      disabled={pax <= 1}
                      className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{pax}</span>
                    <button
                      onClick={() => setPax(p => Math.min(maxPax, p + 1))}
                      disabled={pax >= maxPax}
                      className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-xs text-muted-foreground ml-1">max {maxPax}</span>
                  </div>
                </div>

                <Separator />

                {/* Breakdown — FIXED PER PERSON (e.g. Essential Premium Rio) */}
                {isFixedPerPerson && pricingConfig && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground tracking-[0.05em] mb-2">
                      Retail Price
                    </p>
                    <div className="flex justify-between text-xs gap-2">
                      <span className="text-muted-foreground leading-snug">
                        {formatPrice((pricingConfig as FixedPerPersonConfig).basePricePerPerson)}/person × {pax} traveler{pax !== 1 ? "s" : ""}
                      </span>
                      <span className="font-medium flex-shrink-0">
                        {formatPrice((pricingConfig as FixedPerPersonConfig).basePricePerPerson * pax)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Breakdown — MULTI-DAY (legacy cost-based) */}
                {isMultiDay && pricingConfig && (
                  <>
                    {(pricingConfig as MultiDayConfig).perPersonCosts.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground tracking-[0.05em] mb-2">
                          Per Person × {pax}
                        </p>
                        {(pricingConfig as MultiDayConfig).perPersonCosts.map((c) => (
                          <div key={c.label} className="flex justify-between text-xs gap-2">
                            <span className="text-muted-foreground leading-snug">
                              {c.label}
                              <span className="text-muted-foreground/60 ml-1">
                                ({formatPrice(c.price)}/pax × {pax})
                              </span>
                            </span>
                            <span className="font-medium flex-shrink-0">{formatPrice(c.price * pax)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {(pricingConfig as MultiDayConfig).fixedGroupCosts.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground tracking-[0.05em] mb-2">
                          Fixed Group Costs
                        </p>
                        {(pricingConfig as MultiDayConfig).fixedGroupCosts.map((c) => (
                          <div key={c.label} className="flex justify-between text-xs gap-2">
                            <span className="text-muted-foreground leading-snug">{c.label}</span>
                            <span className="font-medium flex-shrink-0">{formatPrice(c.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Breakdown — STANDARD */}
                {!isPremium && standardCalc && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground tracking-[0.05em] mb-2">Activities</p>
                      {tours.map((t) => (
                        <div key={t.slug} className="flex justify-between text-xs gap-2">
                          <span className="text-muted-foreground leading-snug">
                            {t.title.split("—")[0].trim().split(" ").slice(0, 5).join(" ")}
                            {t.title.split(" ").length > 5 ? "…" : ""}
                            <span className="text-muted-foreground/60 ml-1">
                              ({formatPrice(getTourUnitPrice(t, pax))}/pax × {pax})
                            </span>
                          </span>
                          <span className="font-medium flex-shrink-0">{formatPrice(getTourTotal(t, pax))}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground tracking-[0.05em] mb-2">Transfers</p>
                      <div className="flex justify-between text-xs gap-2">
                        <span className="text-muted-foreground">
                          Arrival transfer (GIG)
                          <span className="text-muted-foreground/60 ml-1">({formatPrice(TRANSFER_PRICE_PER_PERSON)}/pax × {pax})</span>
                        </span>
                        <span className="font-medium flex-shrink-0">{formatPrice(standardCalc.transferIn)}</span>
                      </div>
                      <div className="flex justify-between text-xs gap-2">
                        <span className="text-muted-foreground">
                          Departure transfer (GIG)
                          <span className="text-muted-foreground/60 ml-1">({formatPrice(TRANSFER_PRICE_PER_PERSON)}/pax × {pax})</span>
                        </span>
                        <span className="font-medium flex-shrink-0">{formatPrice(standardCalc.transferOut)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground/60">
                        <span>Round-trip transport × 2 days ({standardCalc.vt.vehicle})</span>
                        <span>{formatPrice(standardCalc.vt.price * 2)}</span>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Subtotal + discount + total */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Package subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-medium">
                      <span>Group discount ({getGroupDiscount(pax)}%)</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Per person</span>
                    <span>{formatPrice(perPerson)}</span>
                  </div>
                  {currency !== "USD" && (
                    <p className="text-[10px] text-muted-foreground pt-1">
                      Prices shown in {currency} for convenience. Final payment processed in USD.
                    </p>
                  )}
                </div>

                <Separator />

                {/* Arrival date picker */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CalendarDays size={14} className="text-muted-foreground" />
                    Arrival date (Day 1)
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    min={today}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  />
                  {!arrivalDate && (
                    <p className="text-xs text-muted-foreground mt-1">Select your arrival date to book</p>
                  )}
                </div>

                <Separator />

                {/* CTAs */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowBookingModal(true)}
                    disabled={!arrivalDate}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 disabled:opacity-50"
                  >
                    <CreditCard size={15} /> Book &amp; Pay Online
                  </Button>
                  <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-10 border-green-300 text-green-700 hover:bg-green-50 text-sm gap-2">
                      <MessageCircle size={14} /> Book via WhatsApp
                    </Button>
                  </a>
                </div>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Secured by Stripe · Free cancellation up to 48h before
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing table (full width) ────────────────────────────────────── */}
      <section className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-2">Price by group size</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isPremium && pricingConfig && pricingConfig.tableDescription
              ? pricingConfig.tableDescription
              : "All prices include activities, round-trip transport for 2 activity days and both airport transfers. Group discounts applied automatically."}
          </p>
          <div className="overflow-x-auto rounded-2xl border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b">
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Travelers</th>
                  <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Package Total</th>
                  <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Per Person</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((n) => {
                  const gt = isPremium && pricingConfig
                    ? calcAnyPremiumTotal(pricingConfig, n).grandTotal
                    : calcPackageTotal(tours, n).grandTotal;
                  const isActive = n === pax;
                  return (
                    <tr
                      key={n}
                      onClick={() => setPax(n)}
                      className={`border-b last:border-0 transition-colors cursor-pointer ${
                        isActive ? "bg-green-50 dark:bg-green-950/20 font-semibold" : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="px-5 py-2.5 font-medium">
                        {n} {n === 1 ? "person" : "people"}
                        {isActive && (
                          <span className="ml-2 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold align-middle">
                            selected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-right font-bold text-green-600">{formatPrice(Math.round(gt))}</td>
                      <td className="px-5 py-2.5 text-right">{formatPrice(Math.round(gt / n))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Group discounts: 1 person — no discount · 2–5 people — 5% · 6–10 people — 7% · 11–20 people — 10% · 21–40 people — 12%.
            {!isPremium && " Transport allocated by group size: 1–2 pax Private Car · 3–11 Minivan · 12–16 Minibus · 17+ Coach Bus."}
          </p>
        </div>
      </section>

      {/* ── Accommodation Add-On ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <AccommodationAddon />
      </section>

      <PackageBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        packageSlug={pkg.slug}
        packageTitle={localTitle}
        pax={pax}
        arrivalDate={arrivalDate}
        grandTotal={grandTotal}
      />
    </MainLayout>
  );
}
