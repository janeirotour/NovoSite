import { useGetPackage } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Minus, Plus, Clock, Users, ArrowRight, AlertCircle, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";

// ─── Transport + Transfer tiers (same across all packages) ────────────────────
const VEHICLE_TIERS = [
  { minPax: 1,  maxPax: 2,  vehicle: "Private Car",  price: 120 },
  { minPax: 3,  maxPax: 11, vehicle: "Minivan",       price: 300 },
  { minPax: 12, maxPax: 16, vehicle: "Minibus",       price: 500 },
  { minPax: 17, maxPax: null, vehicle: "Minibus",     price: 700 },
];

function getVehicleTier(pax: number) {
  return VEHICLE_TIERS.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax)) ?? VEHICLE_TIERS[VEHICLE_TIERS.length - 1];
}

type PricingRule = { minPax: number; maxPax: number | null; pricePerPerson: number };
type TourEntry = { slug: string; title: string; duration: string; description: string; priceFrom: number; pricingRules: PricingRule[] };

function getTourPrice(tour: TourEntry, pax: number): number {
  if (tour.pricingRules && tour.pricingRules.length > 0) {
    const tier = tour.pricingRules.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax))
      ?? tour.pricingRules[tour.pricingRules.length - 1];
    return tier.pricePerPerson * pax;
  }
  return tour.priceFrom * pax;
}

function getTourUnitPrice(tour: TourEntry, pax: number): number {
  if (tour.pricingRules && tour.pricingRules.length > 0) {
    const tier = tour.pricingRules.find(t => pax >= t.minPax && (t.maxPax === null || pax <= t.maxPax))
      ?? tour.pricingRules[tour.pricingRules.length - 1];
    return tier.pricePerPerson;
  }
  return tour.priceFrom;
}

const BADGE_STYLES: Record<string, string> = {
  green: "bg-green-600 text-white",
  amber: "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
};

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading } = useGetPackage(slug!);
  const [pax, setPax] = useState(2);

  const tours = useMemo(() => (pkg?.toursIncluded ?? []) as TourEntry[], [pkg]);
  const highlights = useMemo(() => (pkg?.highlights ?? []) as string[], [pkg]);

  const vehicleTier = getVehicleTier(pax);

  // Breakdown
  const toursTotal = useMemo(() => tours.reduce((sum, t) => sum + getTourPrice(t, pax), 0), [tours, pax]);
  const transport2x = vehicleTier.price * 2;      // 2 activity days round-trip
  const airportArrival = vehicleTier.price;         // arrival transfer
  const airportDeparture = vehicleTier.price;       // departure transfer
  const airportTotal = airportArrival + airportDeparture;
  const subtotal = toursTotal + transport2x + airportTotal;
  const discountAmt = subtotal * 0.05;
  const grandTotal = subtotal - discountAmt;
  const perPerson = pax > 0 ? grandTotal / pax : grandTotal;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">Loading package...</div>
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
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={pkg.imageUrl} alt={pkg.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 pb-10">
          <Link href="/packages">
            <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ChevronLeft size={15} /> Back to Packages
            </button>
          </Link>
          <div className="flex flex-wrap items-start gap-3 mb-3">
            {pkg.badge && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeStyle}`}>{pkg.badge}</span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{pkg.title}</h1>
          {pkg.subtitle && <p className="text-white/80 text-lg mt-2">{pkg.subtitle}</p>}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
            {pkg.durationLabel && <span className="flex items-center gap-1.5"><Clock size={13} />{pkg.durationLabel}</span>}
            {pkg.groupSizeLabel && <span className="flex items-center gap-1.5"><Users size={13} />{pkg.groupSizeLabel}</span>}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left: description + tours + highlights */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-muted-foreground text-lg leading-relaxed">{pkg.description}</p>

            {/* Included Tours */}
            <div>
              <h2 className="text-xl font-bold mb-4">Included Experiences</h2>
              <div className="space-y-4">
                {tours.map((t, i) => (
                  <div key={t.slug} className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-semibold leading-tight">{t.title}</h3>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><Clock size={10} />{t.duration}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-green-600">${getTourPrice(t, pax).toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">${getTourUnitPrice(t, pax)}/person × {pax}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div>
              <h2 className="text-xl font-bold mb-4">Transportation & Transfers</h2>
              <div className="space-y-3">
                {[
                  { label: "Round-trip transport — Day 1", sublabel: `${vehicleTier.vehicle} for ${pax} traveler${pax !== 1 ? "s" : ""}`, price: vehicleTier.price, icon: "🚐" },
                  { label: "Round-trip transport — Day 2", sublabel: `${vehicleTier.vehicle} for ${pax} traveler${pax !== 1 ? "s" : ""}`, price: vehicleTier.price, icon: "🚐" },
                  { label: "Airport transfer — Arrival (GIG)", sublabel: `${vehicleTier.vehicle} · proportional to group`, price: airportArrival, icon: "✈️" },
                  { label: "Airport transfer — Departure (GIG)", sublabel: `${vehicleTier.vehicle} · proportional to group`, price: airportDeparture, icon: "✈️" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 border rounded-xl p-4">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                    </div>
                    <p className="font-bold text-green-600 flex-shrink-0">${item.price}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5 bg-muted/40 rounded-lg px-3 py-2 border">
                <AlertCircle size={11} className="flex-shrink-0 mt-0.5 text-amber-500" />
                Vehicle assigned automatically based on group size. Prices shown are per vehicle, shared by the whole group.
              </p>
            </div>

            {/* Highlights */}
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

          {/* Right: Pricing sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border rounded-2xl shadow-xl overflow-hidden">

              {/* Header */}
              <div className="bg-primary p-5">
                <p className="text-primary-foreground/80 text-sm font-medium">Total for your group</p>
                <p className="text-3xl font-bold text-primary-foreground">${grandTotal.toFixed(0)} <span className="text-base font-normal">USD</span></p>
                <p className="text-primary-foreground/80 text-xs mt-1">${perPerson.toFixed(0)}/person · {pax} traveler{pax !== 1 ? "s" : ""}</p>
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

                {/* Cost breakdown */}
                <div className="space-y-1.5 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Price Breakdown</p>

                  {tours.map((t) => (
                    <div key={t.slug} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate pr-2">{t.title.split("—")[0].trim().split(" ").slice(0, 4).join(" ")}…</span>
                      <span className="font-medium flex-shrink-0">${getTourPrice(t, pax).toFixed(0)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">🚐 Transport × 2 days ({vehicleTier.vehicle})</span>
                    <span className="font-medium">${transport2x}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">✈️ Airport transfers × 2</span>
                    <span className="font-medium">${airportTotal}</span>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Package discount (5%)</span>
                    <span>−${discountAmt.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-sm pt-2 border-t mt-1">
                    <span>Total</span>
                    <span className="text-green-600">${grandTotal.toFixed(0)} USD</span>
                  </div>
                </div>

                <Separator />

                {/* CTAs */}
                <div className="space-y-2">
                  <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold gap-2">
                      Book via WhatsApp <ArrowRight size={15} />
                    </Button>
                  </a>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full h-10 border-green-300 text-green-700 hover:bg-green-50 text-sm">
                      Request a Custom Quote
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Free cancellation up to 48h before · Secure payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
