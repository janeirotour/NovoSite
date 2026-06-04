import { useListPackages } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, Clock, Users, Award, Tag, Layers, Heart, MessageCircle, Plane, Car } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

const BADGE_STYLES: Record<string, string> = {
  green: "bg-green-600 text-white",
  amber: "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
};

type TourIncluded = { slug: string; title: string; duration: string; description: string };

export default function PackagesPage() {
  const { lang } = useLanguage();
  const { data: packages, isLoading } = useListPackages();

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=1600&q=80"
          alt="Rio de Janeiro Packages"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-sm mb-4">
            {lang === "en" ? "Curated Rio Experiences" : lang === "es" ? "Experiencias Curadas en Río" : "Experiências Curadas no Rio"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {lang === "en" ? "Rio Experience Packages" : lang === "es" ? "Paquetes de Experiencias en Río" : "Pacotes de Experiências no Rio"}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            {lang === "en"
              ? "Hand-picked combinations of our best tours — bundled for better value and a seamless Rio experience. No hotel, no flights. Just unforgettable moments."
              : lang === "es"
              ? "Combinaciones de nuestros mejores tours — agrupadas para mayor valor y una experiencia perfecta en Río. Sin hotel ni vuelos. Solo momentos inolvidables."
              : "Combinações dos nossos melhores tours — agrupadas para maior valor e uma experiência perfeita no Rio. Sem hotel nem passagens. Só momentos inesquecíveis."}
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
          {[
            { icon: <Award size={20} />, text: lang === "en" ? "Curated by locals" : lang === "es" ? "Curado por locales" : "Curado por locais" },
            { icon: <Tag size={20} />, text: lang === "en" ? "Save up to 27%" : lang === "es" ? "Ahorra hasta 27%" : "Economize até 27%" },
            { icon: <Layers size={20} />, text: lang === "en" ? "No hotel or flights" : lang === "es" ? "Sin hotel ni vuelos" : "Sem hotel nem voos" },
            { icon: <Heart size={20} />, text: lang === "en" ? "Black-owned & community-led" : lang === "es" ? "Empresa negra y comunitaria" : "Empresa negra e comunitária" },
          ].map((v) => (
            <div key={v.text} className="flex flex-col items-center gap-1">
              <span className="text-green-600">{v.icon}</span>
              <span className="font-medium text-muted-foreground">{v.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "en" ? "Choose Your Experience" : lang === "es" ? "Elige Tu Experiencia" : "Escolha Sua Experiência"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "en"
              ? "Each package bundles 3 of our best experiences at a lower combined price — no hotel, no flights included."
              : lang === "es"
              ? "Cada paquete combina 3 de nuestras mejores experiencias a un precio menor — sin hotel ni vuelos incluidos."
              : "Cada pacote combina 3 das nossas melhores experiências por um preço menor — sem hotel nem passagens."}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 rounded-3xl" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {(packages ?? []).map((pkg, idx) => {
              const tours = (pkg.toursIncluded ?? []) as TourIncluded[];
              const highlights = (pkg.highlights ?? []) as string[];
              const included = (pkg.includedItems ?? []) as string[];
              const isReversed = idx % 2 === 1;

              return (
                <div
                  key={pkg.id}
                  className={`relative bg-card border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 grid lg:grid-cols-5`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className={`absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow ${BADGE_STYLES[pkg.badgeColor ?? "green"] ?? BADGE_STYLES.green}`}>
                      {pkg.badge === "Best Seller" ? (
                        <span className="flex items-center gap-1"><Star size={11} fill="currentColor" />{pkg.badge}</span>
                      ) : pkg.badge}
                    </div>
                  )}

                  {/* Image — col-span-2 */}
                  <div className={`relative lg:col-span-2 min-h-72 lg:min-h-0 ${isReversed ? "lg:order-last" : ""}`}>
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Savings chip */}
                    {pkg.savingsPercent && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm">
                        Save {pkg.savingsPercent}%
                      </div>
                    )}
                  </div>

                  {/* Content — col-span-3 */}
                  <div className="lg:col-span-3 p-7 flex flex-col gap-5">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="text-2xl font-bold">{pkg.title}</h3>
                          {pkg.subtitle && <p className="text-muted-foreground text-sm mt-0.5">{pkg.subtitle}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-3xl font-bold text-green-600">${Number(pkg.priceFrom).toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">per person</p>
                          {pkg.originalPrice && (
                            <p className="text-xs line-through text-muted-foreground">${Number(pkg.originalPrice).toFixed(0)} individually</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {pkg.durationLabel && <span className="flex items-center gap-1"><Clock size={11} />{pkg.durationLabel}</span>}
                        {pkg.groupSizeLabel && <span className="flex items-center gap-1"><Users size={11} />{pkg.groupSizeLabel}</span>}
                      </div>
                    </div>

                    {/* What's included tours */}
                    {tours.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {lang === "en" ? "Included experiences" : lang === "es" ? "Experiencias incluidas" : "Experiências incluídas"}
                        </p>
                        <div className="grid gap-2">
                          {tours.map((t) => (
                            <div key={t.slug} className="flex gap-3 bg-muted/40 rounded-xl p-3 border">
                              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                {tours.indexOf(t) + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm leading-tight">{t.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{t.description}</p>
                                <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1"><Clock size={10} />{t.duration}</p>
                              </div>
                            </div>
                          ))}
                          {/* Airport transfers — always included in every package */}
                          <div className="flex gap-3 bg-muted/40 rounded-xl p-3 border">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Plane size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm leading-tight">
                                {lang === "en" ? "Airport Arrival Transfer (GIG)" : lang === "es" ? "Transfer de Llegada al Aeropuerto (GIG)" : "Transfer de Chegada no Aeroporto (GIG)"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {lang === "en" ? "Pick-up from Galeão airport to your hotel on Day 1" : lang === "es" ? "Recogida del aeropuerto de Galeão a tu hotel el Día 1" : "Busca no aeroporto de Galeão até o hotel no Dia 1"}
                              </p>
                              <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1"><Clock size={10} />~2h · Included</p>
                            </div>
                          </div>
                          <div className="flex gap-3 bg-muted/40 rounded-xl p-3 border">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Plane size={14} className="rotate-45" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm leading-tight">
                                {lang === "en" ? "Airport Departure Transfer (GIG)" : lang === "es" ? "Transfer de Salida al Aeropuerto (GIG)" : "Transfer de Saída para o Aeroporto (GIG)"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {lang === "en" ? "Drop-off from hotel to Galeão airport on Day 3" : lang === "es" ? "Traslado del hotel al aeropuerto de Galeão el Día 3" : "Traslado do hotel para o aeroporto de Galeão no Dia 3"}
                              </p>
                              <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1"><Clock size={10} />~2h · Included</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2 text-sm">
                            <Check size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground leading-snug">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-1 border-t mt-auto">
                      <Link href={`/packages/${pkg.slug}`} className="flex-1">
                        <Button className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold gap-2">
                          {lang === "en" ? "See Prices & Book" : lang === "es" ? "Ver Precios y Reservar" : "Ver Preços e Reservar"}
                          <ArrowRight size={15} />
                        </Button>
                      </Link>
                      <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full h-11 border-green-300 text-green-700 hover:bg-green-50 gap-2">
                          <MessageCircle size={15} /> WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Package CTA */}
        <div className="mt-16 text-center bg-primary/5 border border-primary/20 rounded-3xl p-12">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-sm mb-3">
            {lang === "en" ? "Something different in mind?" : lang === "es" ? "¿Tienes algo diferente en mente?" : "Tem algo diferente em mente?"}
          </p>
          <h3 className="text-2xl font-bold mb-3">
            {lang === "en" ? "Build a Custom Package" : lang === "es" ? "Crea un Paquete Personalizado" : "Monte um Pacote Personalizado"}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {lang === "en"
              ? "Tell us your group size, interests and dates — we'll put together a bespoke itinerary with any combination of our tours."
              : lang === "es"
              ? "Cuéntanos el tamaño de tu grupo, intereses y fechas — armaremos un itinerario a medida con cualquier combinación de nuestros tours."
              : "Conte-nos o tamanho do seu grupo, interesses e datas — montaremos um roteiro personalizado com qualquer combinação dos nossos tours."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold">
                {lang === "en" ? "Get a Custom Quote" : lang === "es" ? "Obtener Cotización" : "Solicitar Orçamento"}
              </Button>
            </Link>
            <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-12 px-8 border-green-300 text-green-700 hover:bg-green-50">
                {lang === "en" ? "Chat on WhatsApp" : lang === "es" ? "Chatear en WhatsApp" : "Conversar no WhatsApp"}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
