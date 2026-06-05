import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const TX = {
  whereTo:     { en: "Where to?",          es: "¿A dónde?",            pt: "Para onde?",           fr: "Où aller ?",            de: "Wohin?" },
  placeholder: { en: "E.g. Rio de Janeiro",es: "Ej: Rio de Janeiro",   pt: "Ex: Rio de Janeiro",   fr: "Ex: Rio de Janeiro",    de: "z.B. Rio de Janeiro" },
  expType:     { en: "Experience type",    es: "Tipo de experiencia",   pt: "Tipo de experiência",  fr: "Type d'expérience",     de: "Erlebnisart" },
  all:         { en: "All Experiences",    es: "Todas las experiencias",pt: "Todas as experiências",fr: "Toutes les expériences",de: "Alle Erlebnisse" },
  sightseeing: { en: "Sightseeing",        es: "City Tour",             pt: "City Tour",            fr: "Visites de la ville",   de: "Stadtbesichtigung" },
  culture:     { en: "Cultural Experiences",es:"Experiencias Culturales",pt:"Experiências Culturais",fr:"Expériences Culturelles",de:"Kulturerlebnisse" },
  nature:      { en: "Adventure Experiences",es:"Experiencias de Aventura",pt:"Experiências de Aventura",fr:"Expériences Aventure",de:"Abenteuererlebnisse" },
  aerial:      { en: "Aerial Experiences", es: "Experiencias Aéreas",   pt: "Experiências Aéreas",  fr: "Expériences Aériennes", de: "Lufterlebnisse" },
  transfer:    { en: "Airport Transfers",  es: "Traslados Aeropuerto",  pt: "Traslados Aeroporto",  fr: "Transferts Aéroport",   de: "Flughafentransfers" },
  multiDay:    { en: "Multi-Day Experiences",es:"Experiencias de Varios Días",pt:"Experiências de Vários Dias",fr:"Séjours Multi-Jours",de:"Mehrtägige Erlebnisse" },
  search:      { en: "Search",             es: "Buscar",                pt: "Buscar",                fr: "Rechercher",            de: "Suchen" },
} as const;

export function SearchWidget() {
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

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
          <label className="block text-sm font-bold text-foreground mb-1">{tx("whereTo")}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder={tx("placeholder")}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 relative">
          <label className="block text-sm font-bold text-foreground mb-1">{tx("expType")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white appearance-none"
          >
            <option value="">{tx("all")}</option>
            <option value="sightseeing">{tx("sightseeing")}</option>
            <option value="culture">{tx("culture")}</option>
            <option value="nature">{tx("nature")}</option>
            <option value="aerial">{tx("aerial")}</option>
            <option value="transfer">{tx("transfer")}</option>
            <option value="package">{tx("multiDay")}</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full md:w-auto px-8 h-[50px] text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <Search className="w-5 h-5 mr-2" />
            {tx("search")}
          </Button>
        </div>
      </form>
    </div>
  );
}
