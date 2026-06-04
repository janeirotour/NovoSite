import { useEffect, useState } from "react";
import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

const DESTINATIONS = [
  "Rio de Janeiro", "São Paulo", "Bahia", "Foz do Iguaçu", "Recife", "Amazon Rainforest",
];

const CATEGORIES_EN = [
  { value: "", label: "All Categories" },
  { value: "culture", label: "Cultural Experiences" },
  { value: "nature", label: "Adventure Experiences" },
  { value: "aerial", label: "Aerial Experiences" },
  { value: "food", label: "Food Experiences" },
  { value: "transfer", label: "Airport Transfers" },
  { value: "package", label: "Multi-Day Experiences" },
  { value: "sightseeing", label: "Sightseeing" },
];

type TourTypeFilter = "" | "group" | "private";

export default function ToursPage() {
  const sp = new URLSearchParams(window.location.search);
  const [destination, setDestination] = useState(sp.get("destination") || "");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [tourType, setTourType] = useState<TourTypeFilter>((sp.get("type") as TourTypeFilter) || "");
  const [applied, setApplied] = useState({ destination: sp.get("destination") || "", category: sp.get("category") || "", tourType: (sp.get("type") || "") as TourTypeFilter });

  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({
    destination: applied.destination || undefined,
    category: applied.category || undefined,
    type: (applied.tourType || "all") as "private" | "group" | "all" | "shared",
  });

  useEffect(() => {
    document.title = "All Experiences | Janeiro Tour";
  }, []);

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault();
    setApplied({ destination, category, tourType });
    const p = new URLSearchParams();
    if (destination) p.set("destination", destination);
    if (category) p.set("category", category);
    if (tourType) p.set("type", tourType);
    window.history.replaceState({}, "", `/tours${p.toString() ? `?${p}` : ""}`);
  };

  const clear = () => {
    setDestination(""); setCategory(""); setTourType("");
    setApplied({ destination: "", category: "", tourType: "" });
    window.history.replaceState({}, "", "/tours");
  };

  const hasFilters = applied.destination || applied.category || applied.tourType;

  const heroTitle = lang === "en" ? "Explore All Experiences" : lang === "es" ? "Explorar Todas las Experiencias" : "Explorar Todas as Experiências";
  const heroSub = lang === "en" ? "Find the perfect tour for your Brazil adventure." : lang === "es" ? "Encuentra el tour perfecto para tu aventura en Brasil." : "Encontre o passeio perfeito para sua aventura no Brasil.";

  return (
    <div className="pt-24 pb-20">
      <div className="bg-primary text-primary-foreground py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">{heroTitle}</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">{heroSub}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Filter className="w-5 h-5 text-primary" />
                  {lang === "en" ? "Filters" : "Filtros"}
                </div>
                {hasFilters && (
                  <button onClick={clear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>

              <form onSubmit={apply} className="space-y-5">
                {/* Tour Type */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {lang === "en" ? "Tour Type" : lang === "es" ? "Tipo de Tour" : "Tipo de Tour"}
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "" as TourTypeFilter, en: "All Tours", es: "Todos los Tours", pt: "Todos os Passeios" },
                      { value: "group" as TourTypeFilter, en: "Shared Tours", es: "Tours Compartidos", pt: "Tours Compartilhados" },
                      { value: "private" as TourTypeFilter, en: "Private Tours", es: "Tours Privados", pt: "Tours Privativos" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${tourType === opt.value ? "border-primary bg-primary" : "border-muted-foreground/40 group-hover:border-primary"}`}
                          onClick={() => setTourType(opt.value)}
                        >
                          {tourType === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm text-foreground" onClick={() => setTourType(opt.value)}>
                          {lang === "es" ? opt.es : lang === "pt" ? opt.pt : opt.en}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {lang === "en" ? "Destination" : "Destino"}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">{lang === "en" ? "All Destinations" : "Todos los Destinos"}</option>
                    {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {lang === "en" ? "Category" : "Categoría"}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    {CATEGORIES_EN.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <Button type="submit" className="w-full font-bold">
                  <Search className="w-4 h-4 mr-2" />
                  {lang === "en" ? "Apply Filters" : "Aplicar Filtros"}
                </Button>
              </form>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {/* Active filters summary */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {applied.tourType && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                    {applied.tourType === "private" ? (lang === "en" ? "Private Tours" : "Tours Privados") : (lang === "en" ? "Shared Tours" : "Tours Compartidos")}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => { setTourType(""); setApplied(a => ({ ...a, tourType: "" })); }} />
                  </span>
                )}
                {applied.destination && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                    {applied.destination}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => { setDestination(""); setApplied(a => ({ ...a, destination: "" })); }} />
                  </span>
                )}
                {applied.category && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                    {CATEGORIES_EN.find(c => c.value === applied.category)?.label ?? applied.category}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => { setCategory(""); setApplied(a => ({ ...a, category: "" })); }} />
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : tours && tours.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {tours.length} {lang === "en" ? "experiences found" : lang === "es" ? "experiencias encontradas" : "experiências encontradas"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-muted/50 rounded-2xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">
                  {lang === "en" ? "No experiences found" : "No se encontraron experiencias"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {lang === "en" ? "Try adjusting your filters." : "Intenta ajustar tus filtros."}
                </p>
                <Button variant="outline" onClick={clear}>
                  {lang === "en" ? "Clear Filters" : "Limpiar Filtros"}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
