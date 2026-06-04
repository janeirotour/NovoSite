import { useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetTour, useGetTourBySlug, useListReviews, useListFaqs } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { Star, Clock, Users, Globe, MapPin, Check, X, ChevronLeft, MessageCircle, Info, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function RegionodoWidget({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !code.trim()) return;

    // Set HTML directly so the custom element lands in the real DOM immediately.
    // Scripts injected via innerHTML are inert — we replace them with live ones below.
    container.innerHTML = code;

    // Re-create every <script> in place so the browser fetches/executes it.
    Array.from(container.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      // Copy inline content (empty for external scripts, harmless).
      if (oldScript.textContent) newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });

    return () => {
      container.innerHTML = "";
    };
  }, [code]);

  return <div ref={containerRef} className="regiondo-widget w-full min-h-[200px]" />;
}

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const param = id ?? "";
  const isNumeric = /^\d+$/.test(param);
  const tourId = isNumeric ? parseInt(param, 10) : 0;
  const { lang } = useLanguage();

  // Enable only the relevant hook — both must be called unconditionally (React rules).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tourById, isLoading: loadingById } = useGetTour(tourId, { query: { enabled: isNumeric } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tourBySlug, isLoading: loadingBySlug } = useGetTourBySlug(param, { query: { enabled: !isNumeric && param.length > 0 } as any });

  const tour = isNumeric ? tourById : tourBySlug;
  const isLoading = isNumeric ? loadingById : loadingBySlug;

  const resolvedId = (tour as { id?: number } | undefined)?.id ?? tourId;
  const { data: reviews } = useListReviews({ tourId: resolvedId });
  const { data: faqs } = useListFaqs({ tourId: resolvedId });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">Loading tour...</div>
        </div>
      </MainLayout>
    );
  }

  if (!tour) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Tour not found</h1>
          <Link href="/tours"><Button>Back to Tours</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const title = lang === "es" ? (tour.titleEs ?? tour.title) : lang === "pt" ? (tour.titlePt ?? tour.title) : tour.title;
  const overview = lang === "es" ? (tour.overviewEs ?? tour.overview) : lang === "pt" ? (tour.overviewPt ?? tour.overview) : tour.overview;
  const images = [tour.imageUrl, ...((tour.galleryImages as string[]) ?? [])].filter(Boolean);
  const itinerary = (tour.itinerary as Array<{ order: number; title: string; description: string; duration?: string }>) || [];
  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const hasRegionodo = !!(tour.regiondoWidget as string | null | undefined)?.trim();

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] bg-neutral-900 overflow-hidden">
        <img src={images[0]} alt={title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Link href="/tours" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors text-sm">
            <ChevronLeft size={16} /> Back to Tours
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-primary/90 text-primary-foreground">{tour.destination}</Badge>
            <Badge variant="outline" className="text-white border-white/50 capitalize">{tour.category}</Badge>
            {tour.tourType !== "group" && <Badge className="bg-accent text-accent-foreground capitalize">{tour.tourType}</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">{title}</h1>
          <div className="flex flex-wrap items-center gap-6 mt-4 text-white/90 text-sm">
            <span className="flex items-center gap-1.5"><Clock size={16} /> {tour.durationHours}h duration</span>
            <span className="flex items-center gap-1.5"><Users size={16} /> Max {tour.groupSizeMax} people</span>
            <span className="flex items-center gap-1.5"><Globe size={16} /> {((tour.languages as string[]) ?? []).join(", ")}</span>
            {reviews && reviews.length > 0 && (
              <span className="flex items-center gap-1.5"><Star size={16} className="fill-primary text-primary" /> {avgRating} ({reviews.length} reviews)</span>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      {images.length > 1 && (
        <div className="bg-neutral-900 py-2 px-4">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {images.slice(1, 6).map((img, i) => (
              <img key={i} src={img} alt="" className="h-20 w-32 object-cover rounded-md flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" />
            ))}
          </div>
        </div>
      )}

      {/* Content + Booking Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Tour Highlights</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {((tour.highlights as string[]) ?? []).map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check size={12} className="text-primary" />
                  </span>
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{overview}</p>
          </section>

          <Separator />

          {/* What's Included / Not Included */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"><Check size={14} className="text-green-600" /></span>
                What's Included
              </h3>
              <ul className="space-y-2">
                {((tour.includedItems as string[]) ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="mt-0.5 text-green-600 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><X size={14} className="text-red-500" /></span>
                Not Included
              </h3>
              <ul className="space-y-2">
                {((tour.notIncludedItems as string[]) ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <X size={14} className="mt-0.5 text-red-500 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
                <div className="space-y-6">
                  {itinerary.map((step) => (
                    <div key={step.order} className="flex gap-6 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold z-10">
                        {step.order}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                          {step.duration && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex-shrink-0">{step.duration}</span>}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary flexibility note — always shown */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <Info size={15} className="flex-shrink-0 mt-0.5 text-amber-700" />
                <p>
                  {lang === "pt"
                    ? "A ordem das atividades pode ser alterada de acordo com a logística e as condições do dia, sempre priorizando a melhor experiência para o grupo."
                    : lang === "es"
                    ? "El orden de las actividades puede cambiar según la logística y las condiciones del día, priorizando siempre la mejor experiencia para el grupo."
                    : "The order of activities may be adjusted based on logistics and daily conditions, always prioritising the best experience for the group."}
                </p>
              </div>

              {/* Transport add-on note — shown only when transport is NOT included */}
              {!((tour.includedItems as string[]) ?? []).some((item) =>
                /transport|transfer|pickup|pick.?up|shuttle|van|train|bus/i.test(item)
              ) && (
                <div className="mt-3 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                  <Truck size={15} className="flex-shrink-0 mt-0.5 text-blue-700" />
                  <p>
                    {lang === "pt"
                      ? "Transporte de ida e volta não está incluso, mas pode ser adicionado como serviço extra no momento da reserva."
                      : lang === "es"
                      ? "El transporte de ida y vuelta no está incluido, pero puede añadirse como servicio adicional al momento de reservar."
                      : "Round-trip transportation is not included but can be added as an optional extra at the time of booking."}
                  </p>
                </div>
              )}
            </section>
          )}

          <Separator />

          {/* Meeting Point */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-primary" size={22} /> Meeting Point
            </h2>
            <p className="text-muted-foreground">{tour.meetingPoint}</p>
          </section>

          <Separator />

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Cancellation Policy</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm">{tour.cancellationPolicy}</p>
            </div>
          </section>

          {/* FAQs */}
          {faqs && faqs.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq) => {
                    const q = lang === "es" ? (faq.questionEs ?? faq.question) : lang === "pt" ? (faq.questionPt ?? faq.question) : faq.question;
                    const a = lang === "es" ? (faq.answerEs ?? faq.answer) : lang === "pt" ? (faq.answerPt ?? faq.answer) : faq.answer;
                    return (
                      <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border rounded-xl px-4">
                        <AccordionTrigger className="text-left font-medium">{q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            </>
          )}

          {/* Reviews */}
          {reviews && reviews.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-2xl font-bold mb-6">Traveler Reviews</h2>
                <div className="flex items-center gap-4 mb-6 p-4 bg-primary/10 rounded-xl">
                  <div className="text-5xl font-bold text-primary">{avgRating}</div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={18} className={s <= Number(avgRating) ? "fill-primary text-primary" : "text-muted-foreground"} />)}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviews.length} verified reviews</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-5 rounded-xl border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{r.authorName}</p>
                          <p className="text-sm text-muted-foreground">{r.authorCountry}</p>
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= r.rating ? "fill-primary text-primary" : "text-muted-foreground"} />)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"{r.comment}"</p>
                      {r.source && <p className="text-xs text-muted-foreground mt-2">Via {r.source}</p>}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
              {/* Price Header */}
              <div className="bg-primary p-5">
                <p className="text-primary-foreground/80 text-sm font-medium">From</p>
                <p className="text-3xl font-bold text-primary-foreground">${tour.priceFrom} <span className="text-lg font-normal">{tour.currency}</span></p>
                <p className="text-primary-foreground/80 text-xs mt-1">per person</p>
              </div>

              <div className="p-5 space-y-3">
                {/* Quick Info */}
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>{tour.durationHours} hours duration</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users size={16} className="text-muted-foreground" />
                  <span>Max {tour.groupSizeMax} travelers</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={16} className="text-muted-foreground" />
                  <span>{((tour.languages as string[]) ?? []).join(", ")}</span>
                </div>

                <Separator />

                {/* Regiondo Widget or Placeholder */}
                {hasRegionodo ? (
                  <div className="mt-2">
                    <RegionodoWidget code={tour.regiondoWidget as string} />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center bg-primary/5">
                    <p className="text-sm font-semibold text-primary mb-1">Book This Tour</p>
                    <p className="text-xs text-muted-foreground mb-3">Online booking powered by Regiondo</p>
                    <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-primary hover:bg-primary/90 font-semibold">
                        Request Availability
                      </Button>
                    </a>
                  </div>
                )}

                {/* WhatsApp CTA */}
                <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 gap-2">
                    <MessageCircle size={16} />
                    <span>Ask on WhatsApp</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-card border rounded-xl p-4 space-y-2">
              {["Free cancellation available", "Multilingual guides", "Small group experience", "Secure online payment"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-accent flex-shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-xl font-bold text-primary">${tour.priceFrom} <span className="text-sm font-normal">{tour.currency}</span></p>
        </div>
        <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer" className="flex-1 max-w-xs">
          <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">Book Now</Button>
        </a>
      </div>
    </MainLayout>
  );
}
