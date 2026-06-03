import { useListFeaturedTours, useListDestinations } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { HeroSection } from "@/components/home/hero-section";
import { TourCard } from "@/components/ui/tour-card";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, MapPin, Heart, Star } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { lang } = useLanguage();
  const { data: featuredTours, isLoading: toursLoading } = useListFeaturedTours();
  const { data: destinations, isLoading: destLoading } = useListDestinations({ featured: true });

  useEffect(() => {
    document.title = "Janeiro Tour | Brazil Travel Experiences";
  }, []);

  return (
    <div className="w-full">
      <HeroSection />

      {/* Trust strip */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Star className="w-5 h-5 fill-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {lang === "en" ? "20,000+ Happy Travelers" : lang === "es" ? "20,000+ Viajeros Felices" : "20.000+ Viajantes Felizes"}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "Stories from around the world" : lang === "es" ? "Historias de todo el mundo" : "Histórias de todo o mundo"}
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {lang === "en" ? "Local Guides, Real Stories" : lang === "es" ? "Guías Locales, Historias Reales" : "Guias Locais, Histórias Reais"}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "People who grew up here" : lang === "es" ? "Personas que crecieron aquí" : "Pessoas que cresceram aqui"}
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {lang === "en" ? "Founded in Rio, 2014" : lang === "es" ? "Fundados en Río, 2014" : "Fundados no Rio, 2014"}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "A decade of crafting journeys" : lang === "es" ? "Una década creando viajes" : "Uma década criando jornadas"}
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {lang === "en" ? "Multilingual & Caring" : lang === "es" ? "Multilingüe y Comprometidos" : "Multilíngue e Dedicados"}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "EN, ES & PT — always here" : lang === "es" ? "EN, ES y PT — siempre aquí" : "EN, ES e PT — sempre aqui"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                {lang === "en" ? "Where will you go?" : lang === "es" ? "¿A dónde irás?" : "Para onde vai?"}
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
                {lang === "en" ? "Five Countries. One Brazil." : lang === "es" ? "Cinco Países. Un Brasil." : "Cinco Países. Um Brasil."}
              </h2>
              <p className="text-muted-foreground text-base max-w-xl">
                {lang === "en"
                  ? "Each destination has its own rhythm, its own flavor, its own way of welcoming you."
                  : lang === "es"
                  ? "Cada destino tiene su propio ritmo, su propio sabor, su propia forma de recibirte."
                  : "Cada destino tem seu próprio ritmo, seu próprio sabor, sua própria forma de recebê-lo."}
              </p>
            </div>
            <Link href="/destinations" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {lang === "en" ? "All destinations" : lang === "es" ? "Ver destinos" : "Ver destinos"}
              <ArrowRight className="w-4 h-4" />
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
              <Button variant="outline" className="w-full rounded-full">
                {lang === "en" ? "See all destinations" : lang === "es" ? "Ver todos los destinos" : "Ver todos os destinos"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural pull-quote section */}
      <section className="py-20 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-janeirotour.webp')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-6">
            {lang === "en" ? "Our belief" : lang === "es" ? "Nuestra creencia" : "Nossa crença"}
          </p>
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-white/90 italic mb-8">
            {lang === "en"
              ? "\"Tourism is more than visiting places — it's immersing yourself in the rich culture, history, and breathtaking landscapes that make Brazil unlike anywhere else on earth.\""
              : lang === "es"
              ? "\"El turismo es más que visitar lugares — es sumergirse en la rica cultura, historia y paisajes impresionantes que hacen de Brasil un lugar único en el mundo.\""
              : "\"Turismo é mais do que visitar lugares — é mergulhar na rica cultura, história e paisagens que tornam o Brasil único no mundo.\""}
          </blockquote>
          <p className="text-white/50 text-sm">
            — Janeiro Tour &amp; Travel, {lang === "en" ? "est. 2014" : "desde 2014"}
          </p>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                {lang === "en" ? "Curated for you" : lang === "es" ? "Seleccionado para ti" : "Selecionado para você"}
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
                {lang === "en" ? "Experiences That Stay With You" : lang === "es" ? "Experiencias que Permanecen Contigo" : "Experiências que Ficam com Você"}
              </h2>
              <p className="text-muted-foreground text-base max-w-xl">
                {lang === "en"
                  ? "Every tour is guided by someone who loves this place. That makes all the difference."
                  : lang === "es"
                  ? "Cada tour es guiado por alguien que ama este lugar. Eso hace toda la diferencia."
                  : "Cada passeio é guiado por alguém que ama este lugar. Isso faz toda a diferença."}
              </p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {lang === "en" ? "All experiences" : lang === "es" ? "Ver experiencias" : "Ver experiências"}
              <ArrowRight className="w-4 h-4" />
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
              <Button variant="outline" className="w-full rounded-full">
                {lang === "en" ? "See all experiences" : lang === "es" ? "Ver todas las experiencias" : "Ver todas as experiências"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-5">
            {lang === "en" ? "Ready to go?" : lang === "es" ? "¿Listo para ir?" : "Pronto para ir?"}
          </p>
          <h2 className="font-bold text-4xl md:text-5xl text-foreground mb-5 leading-tight">
            {lang === "en" ? "Your Brazil story starts here." : lang === "es" ? "Tu historia en Brasil empieza aquí." : "A sua história no Brasil começa aqui."}
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            {lang === "en"
              ? "Tell us what you dream of. We'll craft the journey that makes it real — with local knowledge, care, and a genuine love for this country."
              : lang === "es"
              ? "Cuéntanos lo que sueñas. Crearemos el viaje que lo haga realidad — con conocimiento local, cuidado y un amor genuino por este país."
              : "Conte-nos o que você sonha. Vamos criar a jornada que o torna real — com conhecimento local, cuidado e um amor genuíno por este país."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-full bg-[#FFB600] hover:bg-[#e6a400] text-black border-0">
                {lang === "en" ? "Explore Experiences" : lang === "es" ? "Explorar Experiencias" : "Explorar Experiências"}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-full border-gray-300 text-foreground hover:border-primary hover:text-primary">
                {lang === "en" ? "Talk to Us" : lang === "es" ? "Hablar con Nosotros" : "Falar Conosco"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
