import { useEffect } from "react";
import { useListDestinations } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { DestinationCard } from "@/components/ui/destination-card";
import { MapPin } from "lucide-react";

export default function DestinationsPage() {
  const { lang } = useLanguage();
  const { data: destinations, isLoading } = useListDestinations({ featured: true });

  useEffect(() => {
    document.title = "Destinations | Janeiro Tour";
  }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 text-center mb-14">
        <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">
          {lang === "en" ? "Where will you go?" : lang === "es" ? "¿A dónde irás?" : "Para onde vai?"}
        </p>
        <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-4">
          {lang === "en" ? "Five Cities. Each One Stays With You." : lang === "es" ? "Cinco Ciudades. Cada Una te Marca." : "Cinco Cidades. Cada Uma Fica em Você."}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {lang === "en"
            ? "Each destination has its own rhythm, its own flavor, its own way of welcoming you."
            : lang === "es"
            ? "Cada destino tiene su propio ritmo, su propio sabor, su propia forma de recibirte."
            : "Cada destino tem seu próprio ritmo, seu próprio sabor, sua própria forma de recebê-lo."}
        </p>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {destinations.slice(0, 5).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-700">
              {lang === "en" ? "No destinations found" : lang === "es" ? "No se encontraron destinos" : "Nenhum destino encontrado"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
