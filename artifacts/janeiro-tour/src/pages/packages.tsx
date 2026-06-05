import { useListPackages } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Check, Star, ArrowRight, Clock, Users, Award, Tag,
  Layers, Heart, MessageCircle, Plane, Search, X, SlidersHorizontal,
} from "lucide-react";
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
  en: string; es: string; pt: string; fr: string; de: string;
}

const FILTERS: FilterOption[] = [
  { key: "all",     en: "All Packages",  es: "Todos",          pt: "Todos",          fr: "Tous",              de: "Alle" },
  { key: "budget",  en: "Under $300",    es: "Menos de $300",  pt: "Até $300",       fr: "Moins de $300",     de: "Unter $300" },
  { key: "mid",     en: "$300 – $500",   es: "$300 – $500",    pt: "$300 – $500",    fr: "$300 – $500",       de: "$300 – $500" },
  { key: "premium", en: "Over $500",     es: "Más de $500",    pt: "Acima de $500",  fr: "Plus de $500",      de: "Über $500" },
  { key: "short",   en: "Short (1–2 d)", es: "Corto (1–2 d)",  pt: "Curto (1–2 d)", fr: "Court (1–2 j)",     de: "Kurz (1–2 T)" },
  { key: "long",    en: "3+ Days",       es: "3+ Días",        pt: "3+ Dias",        fr: "3+ Jours",          de: "3+ Tage" },
];

const TX = {
  eyebrow:   { en: "Curated Rio Experiences",        es: "Experiencias Curadas en Río",       pt: "Experiências Curadas no Rio",       fr: "Expériences Sélectionnées à Rio",   de: "Kuratierte Rio-Erlebnisse" },
  heading:   { en: "Rio Experience Packages",        es: "Paquetes de Experiencias en Río",   pt: "Pacotes de Experiências no Rio",    fr: "Forfaits Expériences à Rio",        de: "Rio-Erlebnispakete" },
  sub:       {
    en: "Hand-picked combinations of our best tours — bundled for better value. No hotel, no flights. Just unforgettable moments.",
    es: "Combinaciones de nuestros mejores tours — sin hotel ni vuelos. Solo momentos inolvidables.",
    pt: "Combinações dos nossos melhores tours — sem hotel nem passagens. Só momentos inesquecíveis.",
    fr: "Combinaisons de nos meilleurs tours — sans hôtel ni vols. Juste des moments inoubliables.",
    de: "Handverlesene Kombinationen unserer besten Touren — ohne Hotel und Flüge. Nur unvergessliche Momente.",
  },
  curated:   { en: "Curated by locals",              es: "Curado por locales",                pt: "Curado por locais",                 fr: "Sélectionné par des locaux",        de: "Von Einheimischen zusammengestellt" },
  save:      { en: "Save up to 27%",                 es: "Ahorra hasta 27%",                  pt: "Economize até 27%",                 fr: "Économisez jusqu'à 27%",            de: "Bis zu 27% sparen" },
  noHotel:   { en: "No hotel or flights",            es: "Sin hotel ni vuelos",               pt: "Sem hotel nem voos",                fr: "Sans hôtel ni vols",                de: "Ohne Hotel oder Flüge" },
  blackOwned:{ en: "Black-owned & community-led",    es: "Empresa negra y comunitaria",       pt: "Empresa negra e comunitária",       fr: "Entreprise afro & communautaire",   de: "Afro-geführt & gemeinschaftlich" },
  searchPh:  { en: "Search packages…",               es: "Buscar paquetes…",                  pt: "Buscar pacotes…",                   fr: "Rechercher des forfaits…",          de: "Pakete suchen…" },
  noFound:   { en: "No packages found",              es: "No se encontraron paquetes",        pt: "Nenhum pacote encontrado",          fr: "Aucun forfait trouvé",              de: "Keine Pakete gefunden" },
  noMatch:   { en: "No packages match your search",  es: "Ningún paquete coincide",           pt: "Nenhum pacote encontrado",          fr: "Aucun forfait ne correspond",       de: "Keine Pakete entsprechen Ihrer Suche" },
  tryOther:  { en: "Try a different keyword or reset the filters.", es: "Prueba otra palabra clave o restablece los filtros.", pt: "Tente outra palavra-chave ou limpe os filtros.", fr: "Essayez un autre mot-clé ou réinitialisez les filtres.", de: "Versuchen Sie ein anderes Stichwort oder setzen Sie die Filter zurück." },
  clear:     { en: "Clear filters",                  es: "Limpiar filtros",                   pt: "Limpar filtros",                    fr: "Effacer les filtres",               de: "Filter löschen" },
  perPerson: { en: "per person",                     es: "por persona",                       pt: "por pessoa",                        fr: "par personne",                      de: "pro Person" },
  included:  { en: "Included experiences",           es: "Experiencias incluidas",            pt: "Experiências incluídas",            fr: "Expériences incluses",              de: "Enthaltene Erlebnisse" },
  transfers: { en: "Airport transfers included (GIG — arrival & departure)", es: "Traslados aeropuerto incluidos (GIG — llegada y salida)", pt: "Transfers aeroporto incluídos (GIG — chegada e saída)", fr: "Transferts aéroport inclus (GIG — arrivée & départ)", de: "Flughafentransfers inbegriffen (GIG — Ankunft & Abflug)" },
  seePrices: { en: "See Prices & Book",              es: "Ver Precios y Reservar",            pt: "Ver Preços e Reservar",             fr: "Voir les Prix et Réserver",         de: "Preise anzeigen & buchen" },
  different: { en: "Something different in mind?",   es: "¿Tienes algo diferente en mente?",  pt: "Tem algo diferente em mente?",      fr: "Quelque chose de différent en tête?", de: "Etwas anderes im Sinn?" },
  custom:    { en: "Build a Custom Package",         es: "Crea un Paquete Personalizado",     pt: "Monte um Pacote Personalizado",     fr: "Créez un Forfait Personnalisé",     de: "Individuelles Paket zusammenstellen" },
  customSub: {
    en: "Tell us your group size, interests and dates — we'll put together a bespoke itinerary with any combination of our tours.",
    es: "Cuéntanos el tamaño de tu grupo, intereses y fechas — armaremos un itinerario a medida con cualquier combinación de nuestros tours.",
    pt: "Conte-nos o tamanho do seu grupo, interesses e datas — montaremos um roteiro personalizado com qualquer combinação dos nossos tours.",
    fr: "Parlez-nous de votre groupe, vos intérêts et vos dates — nous créerons un itinéraire sur mesure avec nos tours.",
    de: "Sagen Sie uns Ihre Gruppengröße, Interessen und Daten — wir stellen ein maßgeschneidertes Reiseprogramm zusammen.",
  },
  getQuote:  { en: "Get a Custom Quote",             es: "Obtener Cotización",                pt: "Solicitar Orçamento",               fr: "Obtenir un Devis",                  de: "Angebot anfordern" },
  whatsapp:  { en: "Chat on WhatsApp",               es: "Chatear en WhatsApp",               pt: "Conversar no WhatsApp",             fr: "Discuter sur WhatsApp",             de: "Per WhatsApp chatten" },
} as const;

export default function PackagesPage() {
  const { lang } = useLanguage();
  const { data: packages, isLoading } = useListPackages();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  const filtered = useMemo(() => {
    if (!packages) return [];
    let result = [...packages];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
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

  const foundText = () => {
    const n = filtered.length;
    if (n === 0) return tx("noFound");
    if (lang === "es") return `${n} paquete${n > 1 ? "s" : ""} encontrado${n > 1 ? "s" : ""}`;
    if (lang === "pt") return `${n} pacote${n > 1 ? "s" : ""} encontrado${n > 1 ? "s" : ""}`;
    if (lang === "fr") return `${n} forfait${n > 1 ? "s" : ""} trouvé${n > 1 ? "s" : ""}`;
    if (lang === "de") return `${n} Paket${n > 1 ? "e" : ""} gefunden`;
    return `${n} package${n > 1 ? "s" : ""} found`;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/images/bonde_santa_teresa.jpg"
          alt="Bonde de Santa Teresa, Rio de Janeiro"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-[0.06em] text-sm mb-3">{tx("eyebrow")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{tx("heading")}</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">{tx("sub")}</p>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: <Award size={18} />, text: tx("curated") },
            { icon: <Tag size={18} />,   text: tx("save") },
            { icon: <Layers size={18} />,text: tx("noHotel") },
            { icon: <Heart size={18} />, text: tx("blackOwned") },
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
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tx("searchPh")}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

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
                {f[lang as keyof FilterOption] ?? f.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages List */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">{foundText()}</p>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold mb-2">{tx("noMatch")}</p>
            <p className="text-muted-foreground text-sm mb-6">{tx("tryOther")}</p>
            <Button variant="outline" onClick={() => { setQuery(""); setActiveFilter("all"); }}>
              {tx("clear")}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((pkg, idx) => {
              const tours      = (pkg.toursIncluded ?? []) as TourIncluded[];
              const highlights = (pkg.highlights ?? []) as string[];
              const isReversed = idx % 2 === 1;

              return (
                <div key={pkg.id} className="relative bg-card border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 grid lg:grid-cols-5">
                  <div className={`relative lg:col-span-2 min-h-52 lg:min-h-0 ${isReversed ? "lg:order-last" : ""}`}>
                    {pkg.badge && (
                      <div className={`absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow ${BADGE_STYLES[pkg.badgeColor ?? "green"] ?? BADGE_STYLES.green}`}>
                        {pkg.badge === "Best Seller" ? (
                          <span className="flex items-center gap-1"><Star size={10} fill="currentColor" />{pkg.badge}</span>
                        ) : pkg.badge}
                      </div>
                    )}
                    <img src={pkg.imageUrl} alt={pkg.title} className="absolute inset-0 w-full h-full object-cover" />
                    {pkg.savingsPercent && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        Save {pkg.savingsPercent}%
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-3 p-5 flex flex-col gap-4">
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
                        <p className="text-[11px] text-muted-foreground">{tx("perPerson")}</p>
                        {pkg.originalPrice && (
                          <p className="text-[11px] line-through text-muted-foreground">${Number(pkg.originalPrice).toFixed(0)}</p>
                        )}
                      </div>
                    </div>

                    {tours.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground tracking-[0.05em] mb-1.5">{tx("included")}</p>
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
                          <div className="flex gap-2 items-center bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-100 text-xs text-blue-700">
                            <Plane size={11} className="flex-shrink-0" />
                            <span className="font-medium">{tx("transfers")}</span>
                          </div>
                        </div>
                      </div>
                    )}

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

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t mt-auto">
                      <Link href={`/packages/${pkg.slug}`} className="flex-1">
                        <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm gap-1.5">
                          {tx("seePrices")} <ArrowRight size={14} />
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
          <p className="eyebrow text-[#FFB600] mb-2">{tx("different")}</p>
          <h3 className="text-2xl font-bold mb-2">{tx("custom")}</h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-7">{tx("customSub")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button size="lg" className="h-11 px-7 bg-green-600 hover:bg-green-700 text-white font-semibold">
                {tx("getQuote")}
              </Button>
            </Link>
            <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-11 px-7 border-green-300 text-green-700 hover:bg-green-50">
                {tx("whatsapp")}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
