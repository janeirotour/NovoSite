import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/contexts/CartContext";
import { Tour } from "@workspace/api-client-react";
import { Clock, MapPin, Users, Globe2, Star, Crown, ShoppingCart, CalendarDays, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const PREMIUM_BADGE_LABELS: Record<string, string> = {
  "Most Personalized Experience": "Most Personalized",
  "Best for Families": "Best for Families",
  "Luxury Option": "Luxury",
  "Luxury Experience": "Luxury Experience",
  "Most Popular": "Most Popular",
  "Best Seller": "Best Seller",
  "Recommended": "Recommended",
  "Local Expert Guide": "Local Expert",
  "Fully Customizable": "Fully Customizable",
};

function formatDuration(hours: number, lang: string): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours} ${lang === "en" ? "hours" : "horas"}`;
}

function TourTypeBadge({ tourType, lang }: { tourType: string; lang: string }) {
  const isPrivate = tourType === "private";
  if (isPrivate) {
    return (
      <Badge className="bg-accent text-accent-foreground border-none px-2.5 py-0.5 text-xs font-semibold">
        {lang === "en" ? "Private Tour" : lang === "es" ? "Tour Privado" : "Tour Privativo"}
      </Badge>
    );
  }
  return (
    <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold">
      {lang === "en" ? "Shared Tour" : lang === "es" ? "Tour Compartido" : "Tour Compartilhado"}
    </Badge>
  );
}

export function TourCard({ tour }: { tour: Tour }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const premiumBadge = (tour as Tour & { premiumBadge?: string | null }).premiumBadge;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date | undefined>();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const handleConfirmDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pickerDate) return;
    addItem({
      tourSlug: tour.slug,
      title: t(tour, "title"),
      imageUrl: tour.imageUrl || "/images/exp-city.png",
      priceFrom: Number(tour.priceFrom),
      currency: tour.currency,
      pax: 1,
      preferredDate: format(pickerDate, "yyyy-MM-dd"),
    });
    setPickerOpen(false);
    setPickerDate(undefined);
  };

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

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {tour.featured && (
              <Badge className="bg-primary text-primary-foreground font-bold border-none px-3 py-1">
                {lang === "en" ? "Top Rated" : lang === "es" ? "Destacado" : "Destaque"}
              </Badge>
            )}
            <Badge className="bg-white/90 text-foreground font-semibold border-none backdrop-blur-sm px-3 py-1">
              {tour.category === "aerial" ? "Aerial"
                : tour.category === "nature" ? "Adventure"
                : tour.category === "culture" ? "Culture"
                : tour.category === "sightseeing" ? "Sightseeing"
                : tour.category === "transfer" ? "Transfer"
                : tour.category === "food" ? "Food"
                : tour.category}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-white">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium drop-shadow-md">{tour.destination}</span>
            </div>
            <TourTypeBadge tourType={tour.tourType} lang={lang} />
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {premiumBadge && (
            <div className="flex items-center gap-1.5 mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                {PREMIUM_BADGE_LABELS[premiumBadge] ?? premiumBadge}
              </span>
            </div>
          )}

          <h3 className="font-serif font-bold text-xl leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {t(tour, "title")}
          </h3>

          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(tour.durationHours, lang)}</span>
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

          <div className="mt-auto pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
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

            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPickerOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {lang === "en" ? "Book Now" : lang === "es" ? "Reservar" : "Reservar"}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="center"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <div className="p-3 space-y-3">
                  <div className="text-center">
                    <p className="font-semibold text-sm flex items-center justify-center gap-1.5">
                      <CalendarDays size={15} className="text-primary" />
                      {lang === "en" ? "Choose a date" : lang === "es" ? "Elige una fecha" : "Escolha uma data"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(tour, "title")}</p>
                  </div>
                  <Calendar
                    mode="single"
                    selected={pickerDate}
                    onSelect={setPickerDate}
                    disabled={(date) => date < tomorrow}
                    autoFocus
                  />
                  <div className="pt-1 border-t">
                    <button
                      onClick={handleConfirmDate}
                      disabled={!pickerDate}
                      className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {pickerDate ? (
                        <>
                          <ChevronRight size={14} />
                          {format(pickerDate, "MMM d, yyyy")} — Add to Cart
                        </>
                      ) : (
                        lang === "en" ? "Select a date first" : lang === "es" ? "Selecciona una fecha" : "Selecione uma data"
                      )}
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default TourCard;
