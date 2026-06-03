import { useListFeaturedTours, useListDestinations, useGetSettings } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { HeroSection } from "@/components/home/hero-section";
import { TourCard } from "@/components/ui/tour-card";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Map, Clock, HeartHandshake } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { lang } = useLanguage();
  const { data: featuredTours, isLoading: toursLoading } = useListFeaturedTours();
  const { data: destinations, isLoading: destLoading } = useListDestinations({ featured: true });

  useEffect(() => {
    document.title = "Janeiro Tour | Premium Brazil Travel";
  }, []);

  return (
    <div className="w-full">
      <HeroSection />

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold">{lang === "en" ? "Secure Booking" : "Reserva Segura"}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? "100% safe payment processing" : "Procesamiento de pago 100% seguro"}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-bold">{lang === "en" ? "Local Experts" : "Expertos Locales"}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? "Guides with deep local knowledge" : "Guías con profundo conocimiento local"}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold">{lang === "en" ? "Flexible Cancellation" : "Cancelación Flexible"}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? "Free cancellation up to 24h" : "Cancelación gratuita hasta 24h"}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold">{lang === "en" ? "Multilingual Support" : "Soporte Multilingüe"}</h3>
              <p className="text-sm text-muted-foreground">{lang === "en" ? "24/7 assistance in EN, ES, PT" : "Asistencia 24/7 en EN, ES, PT"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                {lang === "en" ? "Explore Brazil" : lang === "es" ? "Explora Brasil" : "Explore o Brasil"}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {lang === "en" ? "From vibrant cities to pristine nature, discover the magic of South America's largest country." : "Desde ciudades vibrantes hasta naturaleza prístina, descubra la magia del país más grande de Sudamérica."}
              </p>
            </div>
            <Link href="/destinations" className="hidden md:flex items-center text-primary font-bold hover:underline">
              {lang === "en" ? "See all destinations" : "Ver todos los destinos"} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {destLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/2] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations?.slice(0, 4).map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/destinations">
              <Button variant="outline" className="w-full">
                {lang === "en" ? "See all destinations" : "Ver todos los destinos"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                {lang === "en" ? "Unforgettable Experiences" : lang === "es" ? "Experiencias Inolvidables" : "Experiências Inesquecíveis"}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {lang === "en" ? "Handpicked tours and activities for the discerning traveler." : "Tours y actividades seleccionados para el viajero exigente."}
              </p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center text-primary font-bold hover:underline">
              {lang === "en" ? "See all tours" : "Ver todos los tours"} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredTours?.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/tours">
              <Button variant="outline" className="w-full">
                {lang === "en" ? "See all tours" : "Ver todos los tours"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/dest-amazon.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6">
            {lang === "en" ? "Ready for the journey of a lifetime?" : "Listos para el viaje de su vida?"}
          </h2>
          <p className="text-xl text-white/80 mb-10">
            {lang === "en" ? "Let our local experts craft the perfect Brazil itinerary for you." : "Deje que nuestros expertos locales diseñen el itinerario perfecto en Brasil para usted."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="px-8 py-6 text-lg font-bold rounded-full w-full sm:w-auto">
                {lang === "en" ? "Find Tours" : "Buscar Tours"}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-bold rounded-full w-full sm:w-auto border-white text-white hover:bg-white hover:text-foreground">
                {lang === "en" ? "Contact Us" : "Contáctenos"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
