import { useListPackages } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Check, Star, ArrowRight, Clock, Users, Award, Tag,
  Layers, Heart, MessageCircle, Plane, Search, X, SlidersHorizontal,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useMemo } from "react";

const BADGE_STYLES: Record<string, string> = {
  green: "bg-green-600 text-white",
  amber: "bg-amber-500 text-black",
  purple: "bg-purple-700 text-white",
};

type TourIncluded = { slug: string; title: string; duration: string; description: string };

type FilterKey = "all" | "budget" | "mid" | "premium" | "short" | "long";

interface FilterOption {
  key: FilterKey;
  en: string;
  es: string;
  pt: string;
}

const FILTERS: FilterOption[] = [
  { key: "all",     en: "All Packages",  es: "Todos",          pt: "Todos"           },
  { key: "budget",  en: "Under $300",    es: "Menos de $300",  pt: "Até $300"        },
  { key: "mid",     en: "$300 – $500",   es: "$300 – $500",    pt: "$300 – $500"     },
  { key: "premium", en: "Over $500",     es: "Más de $500",    pt: "Acima de $500"   },
  { key: "short",   en: "Short (1–2 d)", es: "Corto (1–2 d)",  pt: "Curto (1–2 d)"  },
  { key: "long",    en: "3+ Days",       es: "3+ Días",        pt: "3+ Dias"         },
];

export default function PackagesPage() {
  const { lang } = useLanguage();
  const { data: packages, isLoading } = useListPackages();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (!packages) return [];
    let result = [...packages];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeFilter === "budget")  result = result.filter((p) => Number(p.priceFrom) < 300);
    if (activeFilter === "mid")     result = result.filter((p) => Number(p.priceFrom) >= 300 && Number(p.priceFrom) <= 500);
    if (activeFilter === "premium") result = result.filter((p) => Number(p.priceFrom) > 500);
    if (activeFilter === "short") {
      result = result.filter((p) => {
        const d = (p.durationLabel ?? "").toLowerCase();
        return d.includes("1") || d.includes("2") || d.includes("half") || d.includes("day");
      });
    }
    if (activeFilter === "long") {
      result = result.filter((p) => {
        const d = (p.durationLabel ?? "").toLowerCase();
        return d.includes("3") || d.includes("4") || d.includes("5") || d.includes("week");
      });
    }

    return result;
  }, [packages, query, activeFilter]);

  const l = lang as "en" | "es" | "pt";

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=1600&q=80"
          alt="Rio de Janeiro Packages"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-sm mb-3">
            {l === "en" ? "Curated Rio Experiences" : l === "es" ? "Experiencias Curadas en Río" : "Experiências Curadas no Rio"}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {l === "en" ? "Rio Experience Packages" : l === "es" ? "Paquetes de Experiencias en Río" : "Pacotes de Experiências no Rio"}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            {l === "en"
              ? "Hand-picked combinations of our best tours — bundled for better value. No hotel, no flights. Just unforgettable moments."
              : l === "es"
              ? "Combinaciones de nuestros mejores tours — sin hotel ni vuelos. Solo momentos inolvidables."
              : "Combinações dos nossos melhores tours — sem hotel nem passagens. Só momentos inesquecíveis."}
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: <Award size={18} />, text: l === "en" ? "Curated by locals" : l === "es" ? "Curado por locales" : "Curado por locais" },
            { icon: <Tag size={18} />,   text: l === "en" ? "Save up to 27%" : l === "es" ? "Ahorra hasta 27%" : "Economize até 27%" },
            { icon: <Layers size={18} />,text: l === "en" ? "No hotel or flights" : l === "es" ? "Sin hotel ni vuelos" : "Sem hotel nem voos" },
            { icon: <Heart size={18} />, text: l === "en" ? "Black-owned & community-led" : l === "es" ? "Empresa negra y comunitaria" : "Empresa negra e comunitária" },
          ].map((v) => (
            <div key={v.text} className="flex flex-col items-center gap-1">
              <span className="text-green-600">{v.icon}</span>
              <span className="font-medium text-muted-foreground text-xs md:text-sm">{v.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={l === "en" ? "Search packages…" : l === "es" ? "Buscar paquetes…" : "Buscar pacotes…"}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide flex-nowrap">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0 mr-0.5" />
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{ touchAction: "manipulation" }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
                  ${activeFilter === f.key
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                  }`}
              >
                {f[l]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages List */}
      <section className="max-w-6xl mx-auto px-4 py-12">

        {/* Result count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length === 0
              ? (l === "en" ? "No packages found" : l === "es" ? "No se encontraron paquetes" : "Nenhum pacote encontrado")
              : l === "en" ? `${filtered.length} package${filtered.length > 1 ? "s" : ""} found`
              : l === "es" ? `${filtered.length} paquete${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`
              : `${filtered.length} pacote${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`
            }
          </p>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold mb-2">
              {l === "en" ? "No packages match your search" : l === "es" ? "Ningún paquete coincide" : "Nenhum pacote encontrado"}
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {l === "en" ? "Try a different keyword or reset the filters." : l === "es" ? "Prueba otra palabra clave o restablece los filtros." : "Tente outra palavra-chave ou limpe os filtros."}
            </p>
            <Button variant="outline" onClick={() => { setQuery(""); setActiveFilter("all"); }}>
              {l === "en" ? "Clear filters" : l === "es" ? "Limpiar filtros" : "Limpar filtros"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((pkg, idx) => {
              const tours    = (pkg.toursIncluded ?? []) as TourIncluded[];
              const highlights = (pkg.highlights ?? []) as string[];
              const isReversed = idx % 2 === 1;

              return (
                <div
                  key={pkg.id}
                  className="relative bg-card border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 grid lg:grid-cols-5"
                >
                  {/* Image — col-span-2, shorter than before */}
                  <div className={`relative lg:col-span-2 min-h-52 lg:min-h-0 ${isReversed ? "lg:order-last" : ""}`}>
                    {pkg.badge && (
                      <div className={`absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow ${BADGE_STYLES[pkg.badgeColor ?? "green"] ?? BADGE_STYLES.green}`}>
                        {pkg.badge === "Best Seller" ? (
                          <span className="flex items-center gap-1"><Star size={10} fill="currentColor" />{pkg.badge}</span>
                        ) : pkg.badge}
                      </div>
                    )}
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {pkg.savingsPercent && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        Save {pkg.savingsPercent}%
                      </div>
                    )}
                  </div>

                  {/* Content — col-span-3, tighter padding */}
                  <div className="lg:col-span-3 p-5 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-xl font-bold leading-tight">{pkg.title}</h3>
                        {pkg.subtitle && <p className="text-muted-foreground text-xs mt-0.5">{pkg.subtitle}</p>}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          {pkg.durationLabel && <span className="flex items-center gap-1"><Clock size={10} />{pkg.durationLabel}</span>}
                          {pkg.groupSizeLabel && <span className="flex items-center gap-1"><Users size={10} />{pkg.groupSizeLabel}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-green-600">${Number(pkg.priceFrom).toFixed(0)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {l === "en" ? "per person" : l === "es" ? "por persona" : "por pessoa"}
                        </p>
                        {pkg.originalPrice && (
                          <p className="text-[11px] line-through text-muted-foreground">${Number(pkg.originalPrice).toFixed(0)}</p>
                        )}
                      </div>
                    </div>

                    {/* Included experiences — compact pills */}
                    {tours.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          {l === "en" ? "Included experiences" : l === "es" ? "Experiencias incluidas" : "Experiências incluídas"}
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {tours.map((t, ti) => (
                            <div key={t.slug} className="flex gap-2.5 items-start bg-muted/40 rounded-lg px-3 py-2 border">
                              <div className="w-5 h-5 rounded-md bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                                {ti + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs leading-tight">{t.title}</p>
                                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1 mt-0.5">{t.description}</p>
                              </div>
                              <span className="flex-shrink-0 text-[10px] text-green-600 font-medium flex items-center gap-0.5 mt-0.5">
                                <Clock size={9} />{t.duration}
                              </span>
                            </div>
                          ))}
                          {/* Transfers row — compact */}
                          <div className="flex gap-2 items-center bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-100 text-xs text-blue-700">
                            <Plane size={11} className="flex-shrink-0" />
                            <span className="font-medium">
                              {l === "en" ? "Airport transfers included (GIG — arrival & departure)" : l === "es" ? "Traslados aeropuerto incluidos (GIG — llegada y salida)" : "Transfers aeroporto incluídos (GIG — chegada e saída)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Highlights — compact */}
                    {highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5">
                        {highlights.slice(0, 4).map((h) => (
                          <div key={h} className="flex items-start gap-1.5 text-xs">
                            <Check size={11} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground leading-snug">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t mt-auto">
                      <Link href={`/packages/${pkg.slug}`} className="flex-1">
                        <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm gap-1.5">
                          {l === "en" ? "See Prices & Book" : l === "es" ? "Ver Precios y Reservar" : "Ver Preços e Reservar"}
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                      <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer" className="sm:w-auto">
                        <Button variant="outline" className="w-full h-10 border-green-300 text-green-700 hover:bg-green-50 text-sm gap-1.5 px-4">
                          <MessageCircle size={14} /> WhatsApp
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
        <div className="mt-14 text-center bg-primary/5 border border-primary/20 rounded-2xl p-10">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-2">
            {l === "en" ? "Something different in mind?" : l === "es" ? "¿Tienes algo diferente en mente?" : "Tem algo diferente em mente?"}
          </p>
          <h3 className="text-2xl font-bold mb-2">
            {l === "en" ? "Build a Custom Package" : l === "es" ? "Crea un Paquete Personalizado" : "Monte um Pacote Personalizado"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-7">
            {l === "en"
              ? "Tell us your group size, interests and dates — we'll put together a bespoke itinerary with any combination of our tours."
              : l === "es"
              ? "Cuéntanos el tamaño de tu grupo, intereses y fechas — armaremos un itinerario a medida con cualquier combinación de nuestros tours."
              : "Conte-nos o tamanho do seu grupo, interesses e datas — montaremos um roteiro personalizado com qualquer combinação dos nossos tours."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button size="lg" className="h-11 px-7 bg-green-600 hover:bg-green-700 text-white font-semibold">
                {l === "en" ? "Get a Custom Quote" : l === "es" ? "Obtener Cotización" : "Solicitar Orçamento"}
              </Button>
            </Link>
            <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-11 px-7 border-green-300 text-green-700 hover:bg-green-50">
                {l === "en" ? "Chat on WhatsApp" : l === "es" ? "Chatear en WhatsApp" : "Conversar no WhatsApp"}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
