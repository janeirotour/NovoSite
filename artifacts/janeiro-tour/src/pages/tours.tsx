import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export default function ToursPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialDest = searchParams.get("destination") || "";
  const initialCategory = searchParams.get("category") || "";

  const [destination, setDestination] = useState(initialDest);
  const [category, setCategory] = useState(initialCategory);
  
  // Real parameters for API
  const [appliedParams, setAppliedParams] = useState({
    destination: initialDest,
    category: initialCategory,
  });

  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({
    destination: appliedParams.destination || undefined,
    category: appliedParams.category || undefined,
  });

  useEffect(() => {
    document.title = "All Tours | Janeiro Tour";
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedParams({ destination, category });
    
    // Update URL
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    const newUrl = `/tours${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="bg-primary text-primary-foreground py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
            {lang === "en" ? "Explore All Tours" : lang === "es" ? "Explorar Todos los Tours" : "Explorar Todos os Passeios"}
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            {lang === "en" ? "Find the perfect experience for your Brazil adventure." : "Encuentra la experiencia perfecta para tu aventura en Brasil."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                {lang === "en" ? "Filters" : "Filtros"}
              </div>
              
              <form onSubmit={handleFilter} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {lang === "en" ? "Destination" : "Destino"}
                  </label>
                  <Input 
                    placeholder="e.g. Rio de Janeiro" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {lang === "en" ? "Category" : "Categoría"}
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background"
                  >
                    <option value="">{lang === "en" ? "All" : "Todos"}</option>
                    <option value="City Tour">City Tour</option>
                    <option value="Nature">Nature</option>
                    <option value="Culture">Culture</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Package">Package</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full font-bold">
                  <Search className="w-4 h-4 mr-2" />
                  {lang === "en" ? "Apply Filters" : "Aplicar Filtros"}
                </Button>
              </form>
            </div>
          </aside>

          {/* Tour Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : tours && tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/50 rounded-2xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">
                  {lang === "en" ? "No tours found" : "No se encontraron tours"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en" ? "Try adjusting your filters to see more results." : "Intente ajustar sus filtros para ver más resultados."}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setDestination(""); setCategory(""); setAppliedParams({ destination: "", category: "" }); }}
                >
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
