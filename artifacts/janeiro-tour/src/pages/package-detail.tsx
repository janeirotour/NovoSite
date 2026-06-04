import { useGetPackage } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Minus, Plus, Clock, Users, ArrowRight, ChevronLeft, Plane, MapPin, Car, CalendarDays, CreditCard, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { PackageBookingModal } from "@/components/ui/PackageBookingModal";

// ─── Vehicle tiers — same across all packages ─────────────────────────────────
const VEHICLE_TIERS = [
  { minPax: 1,  maxPax: 2,  vehicle: "Private Car",  price: 120 },
  { minPax: 3,  maxPax: 11, vehicle: "Minivan",       price: 300 },
  { minPax: 12, maxPax: 16, vehicle: "Minibus",       price: 500 },
  { minPax: 17, maxPax: null, vehicle: "Coach Bus",   price: 700 },
];

const TABLE_ROWS = Array.from({ length: 45 }, (_, i) => i + 1);

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

const TRANSFER_PRICE_PER_PERSON = 60; // airport-transfer-rio — $60/person/trip

function calcPackageTotal(tours: TourEntry[], pax: number) {
  const vt = getVehicleTier(pax);
  const toursTotal    = tours.reduce((s, t) => s + getTourTotal(t, pax), 0);
  const transport2x   = vt.price * 2;                    // 2 activity days round-trip (vehicle)
  const transferIn    = TRANSFER_PRICE_PER_PERSON * pax; // arrival airport transfer
  const transferOut   = TRANSFER_PRICE_PER_PERSON * pax; // departure airport transfer
  const airportTotal  = transferIn + transferOut;
  const subtotal = toursTotal + transport2x + airportTotal;
  const discount = subtotal * 0.05;
  return { subtotal, discount, grandTotal: subtotal - discount, toursTotal, transport2x, transferIn, transferOut, airportTotal, vt };
}

const BADGE_STYLES: Record<string, string> = {
  green:  "bg-green-600 text-white",
  amber:  "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
};

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading } = useGetPackage(slug!);
  const [pax, setPax] = useState(2);

  const tours     = useMemo(() => (pkg?.toursIncluded ?? []) as TourEntry[], [pkg]);
  const highlights = useMemo(() => (pkg?.highlights ?? []) as string[], [pkg]);

  const { grandTotal, discount, toursTotal, transferIn, transferOut, vt } = useMemo(() => calcPackageTotal(tours, pax), [tours, pax]);
  const perPerson = pax > 0 ? grandTotal / pax : grandTotal;
  const [arrivalDate, setArrivalDate] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Itinerary: Day 2 = tours[0], Day 3 = tours[1] + tours[2]
  const day2Tour  = tours[0];
  const day3Tours = tours.slice(1);

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
        <img src={pkg.imageUrl} alt={pkg.title} className="absolute inset-0 w-full h-full object-cover" />
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">{pkg.title}</h1>
          {pkg.subtitle && <p className="text-white/80 text-lg mt-2">{pkg.subtitle}</p>}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
            {pkg.durationLabel  && <span className="flex items-center gap-1.5"><Clock size={13} />{pkg.durationLabel}</span>}
            {pkg.groupSizeLabel && <span className="flex items-center gap-1.5"><Users size={13} />{pkg.groupSizeLabel}</span>}
          </div>
        </div>
      </section>

      {/* ── Main content + sidebar ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">

            <p className="text-muted-foreground text-lg leading-relaxed">{pkg.description}</p>

            {/* ─ Itinerary ──────────────────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-bold mb-5">Itinerary</h2>
              <div className="relative pl-8">
                {/* vertical line */}
                <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />

                {/* Day 1 — Arrival */}
                <div className="relative mb-8">
                  <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                    <Plane size={8} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Day 1</p>
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
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Day 2</p>
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

                {/* Day 3 — Tour 2 + Tour 3 + Departure */}
                {day3Tours.length > 0 && (
                  <div className="relative">
                    <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-background flex items-center justify-center">
                      <MapPin size={8} className="text-white" />
                    </div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Day 3</p>
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
          </div>

          {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border rounded-2xl shadow-xl overflow-hidden">

              {/* Total header */}
              <div className="bg-primary p-5">
                <p className="text-primary-foreground/80 text-sm font-medium">Package total</p>
                <p className="text-3xl font-bold text-primary-foreground">
                  ${grandTotal.toFixed(0)} <span className="text-base font-normal">USD</span>
                </p>
                <p className="text-primary-foreground/80 text-xs mt-1">
                  ${perPerson.toFixed(0)}/person · {pax} traveler{pax !== 1 ? "s" : ""}
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
                      onClick={() => setPax(p => Math.min(45, p + 1))}
                      disabled={pax >= 45}
                      className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-xs text-muted-foreground ml-1">max 45</span>
                  </div>
                </div>

                <Separator />

                {/* Activities breakdown */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Activities
                  </p>
                  {tours.map((t) => (
                    <div key={t.slug} className="flex justify-between text-xs gap-2">
                      <span className="text-muted-foreground leading-snug">
                        {t.title.split("—")[0].trim().split(" ").slice(0, 5).join(" ")}
                        {t.title.split(" ").length > 5 ? "…" : ""}
                        <span className="text-muted-foreground/60 ml-1">
                          (${getTourUnitPrice(t, pax)}/pax × {pax})
                        </span>
                      </span>
                      <span className="font-medium flex-shrink-0">${getTourTotal(t, pax).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Transfers breakdown */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Transfers
                  </p>
                  <div className="flex justify-between text-xs gap-2">
                    <span className="text-muted-foreground">
                      Arrival transfer (GIG)
                      <span className="text-muted-foreground/60 ml-1">(${TRANSFER_PRICE_PER_PERSON}/pax × {pax})</span>
                    </span>
                    <span className="font-medium flex-shrink-0">${transferIn}</span>
                  </div>
                  <div className="flex justify-between text-xs gap-2">
                    <span className="text-muted-foreground">
                      Departure transfer (GIG)
                      <span className="text-muted-foreground/60 ml-1">(${TRANSFER_PRICE_PER_PERSON}/pax × {pax})</span>
                    </span>
                    <span className="font-medium flex-shrink-0">${transferOut}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground/60">
                    <span>Round-trip transport × 2 days ({vt.vehicle})</span>
                    <span>${vt.price * 2}</span>
                  </div>
                </div>

                <Separator />

                {/* Total row */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Package discount (5%)</span>
                    <span>−${discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-green-600">${grandTotal.toFixed(0)} USD</span>
                  </div>
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
            All prices include activities, round-trip transport for 2 activity days and both airport transfers (arrival + departure). 5% package discount already applied.
          </p>
          <div className="overflow-x-auto rounded-2xl border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b">
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Travelers</th>
                  <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Package Total (−5%)</th>
                  <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Per Person</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((n) => {
                  const { grandTotal: gt } = calcPackageTotal(tours, n);
                  const isActive = n === pax;
                  return (
                    <tr
                      key={n}
                      className={`border-b last:border-0 transition-colors ${
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
                      <td className="px-5 py-2.5 text-right font-bold text-green-600">${gt.toFixed(0)}</td>
                      <td className="px-5 py-2.5 text-right">${(gt / n).toFixed(0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Transport assigned proportionally to group: 1–2 pax = Private Car ($120/trip), 3–11 pax = Minivan ($300/trip), 12–16 pax = Minibus ($500/trip), 17+ pax = Coach Bus ($700/trip).
          </p>
        </div>
      </section>

      <PackageBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        packageSlug={pkg.slug}
        packageTitle={pkg.title}
        pax={pax}
        arrivalDate={arrivalDate}
        grandTotal={grandTotal}
      />
    </MainLayout>
  );
}
