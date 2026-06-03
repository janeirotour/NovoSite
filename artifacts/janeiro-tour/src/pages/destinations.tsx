import { useEffect } from "react";
import { useListDestinations } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { DestinationCard } from "@/components/ui/destination-card";
import { MapPin } from "lucide-react";

export default function DestinationsPage() {
  const { lang } = useLanguage();
  const { data: destinations, isLoading } = useListDestinations();

  useEffect(() => {
    document.title = "Destinations | Janeiro Tour";
  }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
          {lang === "en" ? "Explore Brazil Destinations" : lang === "es" ? "Explora Destinos en Brasil" : "Explore Destinos no Brasil"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {lang === "en" ? "Discover the most incredible places across the country." : "Descubre los lugares más increíbles en todo el país."}
        </p>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/2] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">
              {lang === "en" ? "No destinations found" : "No se encontraron destinos"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
