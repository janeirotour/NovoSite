import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchWidget() {
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    
    setLocation(`/tours?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-4xl mx-auto -mt-16 relative z-20 border border-border">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <label className="block text-sm font-bold text-foreground mb-1">
            {lang === "en" ? "Where to?" : lang === "es" ? "¿A dónde?" : "Para onde?"}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder={lang === "en" ? "E.g. Rio de Janeiro" : "Ex: Rio de Janeiro"}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 relative">
          <label className="block text-sm font-bold text-foreground mb-1">
            {lang === "en" ? "Experience type" : lang === "es" ? "Tipo de experiencia" : "Tipo de experiência"}
          </label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white appearance-none"
          >
            <option value="">{lang === "en" ? "All Experiences" : lang === "es" ? "Todas las experiencias" : "Todas as experiências"}</option>
            <option value="sightseeing">{lang === "en" ? "Sightseeing" : lang === "es" ? "City Tour" : "City Tour"}</option>
            <option value="culture">{lang === "en" ? "Cultural Experiences" : lang === "es" ? "Experiencias Culturales" : "Experiências Culturais"}</option>
            <option value="nature">{lang === "en" ? "Adventure Experiences" : lang === "es" ? "Experiencias de Aventura" : "Experiências de Aventura"}</option>
            <option value="aerial">{lang === "en" ? "Aerial Experiences" : lang === "es" ? "Experiencias Aéreas" : "Experiências Aéreas"}</option>
            <option value="transfer">{lang === "en" ? "Airport Transfers" : lang === "es" ? "Traslados Aeropuerto" : "Traslados Aeroporto"}</option>
            <option value="package">{lang === "en" ? "Multi-Day Experiences" : lang === "es" ? "Experiencias de Varios Días" : "Experiências de Vários Dias"}</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full md:w-auto px-8 h-[50px] text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <Search className="w-5 h-5 mr-2" />
            {lang === "en" ? "Search" : "Buscar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
