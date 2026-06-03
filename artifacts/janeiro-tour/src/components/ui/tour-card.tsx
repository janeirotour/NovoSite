import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Tour } from "@workspace/api-client-react";
import { Clock, MapPin, Users, Globe2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TourCard({ tour }: { tour: Tour }) {
  const { t, lang } = useLanguage();

  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={tour.imageUrl || "/images/exp-city.png"}
            alt={t(tour, "title")}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {tour.featured && (
              <Badge className="bg-primary text-primary-foreground font-bold border-none px-3 py-1">
                {lang === "en" ? "Top Rated" : lang === "es" ? "Destacado" : "Destaque"}
              </Badge>
            )}
            <Badge className="bg-white/90 text-foreground font-semibold border-none backdrop-blur-sm px-3 py-1">
              {tour.category}
            </Badge>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-white">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium drop-shadow-md">{tour.destination}</span>
            </div>
            {tour.tourType === "private" && (
              <Badge className="bg-accent text-accent-foreground border-none px-2 py-0.5 text-xs">
                {lang === "en" ? "Private" : lang === "es" ? "Privado" : "Privativo"}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif font-bold text-xl leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {t(tour, "title")}
          </h3>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{tour.durationHours} {lang === "en" ? "hours" : lang === "es" ? "horas" : "horas"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Up to {tour.groupSizeMax}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4" />
              <span>{tour.languages.join(", ")}</span>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">
                {lang === "en" ? "From" : lang === "es" ? "Desde" : "A partir de"}
              </span>
              <span className="font-bold text-lg text-foreground">
                {tour.currency} {tour.priceFrom}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded font-bold text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>5.0</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default TourCard;
