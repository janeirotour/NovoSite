import { useListFeaturedTours, useListDestinations } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { HeroSection } from "@/components/home/hero-section";
import { TourCard } from "@/components/ui/tour-card";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, MapPin, Heart, Star, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const TRIPADVISOR_URL = "https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html";

const reviews = [
  {
    name: "Thomas L.",
    flag: "🇺🇸",
    title: "Amazing experience",
    text: "This trip was awesome mainly because of this team. Traveling to a foreign country is great but can be overwhelming trying to figure out what to do and how to do it. These guys turn curiosity into fun, challenges to ease and expectations to awesome experiences. I highly recommend them — I missed them already.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Jasmine N.",
    flag: "🇺🇸",
    title: "Rio Little Africa Tour",
    text: "I did the Little Africa tour with Dandara and had an amazing experience. She was so knowledgeable and informative. I highly recommend.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "V. Ncube",
    flag: "🇿🇦",
    title: "Incredible tour of Rio's Afro-Brazilian history",
    text: "Incredible tour of Rio's Afro-Brazilian history. Our guide brought every story to life — the history, the culture, the food. This is what travel should feel like.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Michelle H.",
    flag: "🇬🇧",
    title: "Best Tour in Rio",
    text: "Best Tour in Rio. Professional, warm, and genuinely passionate about sharing their city. You can feel how much they love what they do.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Katrina A.",
    flag: "🇨🇦",
    title: "Couldn't imagine a better tour!",
    text: "Couldn't imagine a better tour! The energy, the knowledge, the connection — everything was perfect. I came back a different person.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Dianne S.",
    flag: "🇺🇸",
    title: "Bom Dia!",
    text: "Dance, eat, explore, and relax. That's exactly what we did. Our guide made sure we felt at home in a city that isn't ours — and now it feels like it is.",
    source: "Tripadvisor",
    stars: 5,
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="w-4 h-4 fill-[#00af87] text-[#00af87]" />
      ))}
    </div>
  );
}

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
                {lang === "en" ? "Five Cities. Each One Stays With You." : lang === "es" ? "Cinco Ciudades. Cada Una te Marca." : "Cinco Cidades. Cada Uma Fica em Você."}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {destinations?.slice(0, 5).map((dest) => (
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

      {/* Cultural pull-quote */}
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

      {/* Real moments — photo section */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <img
                src="/images/team-carnival.jpg"
                alt="Janeiro Tour carnival experience"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="text-white font-semibold text-base drop-shadow">
                  {lang === "en" ? "Carnival Experience, Rio de Janeiro" : lang === "es" ? "Experiencia Carnaval, Río de Janeiro" : "Experiência Carnaval, Rio de Janeiro"}
                </span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <img
                src="/images/group-tour.jpg"
                alt="Janeiro Tour group at Christ the Redeemer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="text-white font-semibold text-base drop-shadow">
                  {lang === "en" ? "Group Tour, Cristo Redentor" : lang === "es" ? "Tour en Grupo, Cristo Redentor" : "Passeio em Grupo, Cristo Redentor"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TripAdvisor Reviews */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                {lang === "en" ? "What travelers say" : lang === "es" ? "Lo que dicen los viajeros" : "O que dizem os viajantes"}
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
                {lang === "en" ? "Real People. Real Experiences." : lang === "es" ? "Personas Reales. Experiencias Reales." : "Pessoas Reais. Experiências Reais."}
              </h2>
              <p className="text-muted-foreground text-base max-w-xl">
                {lang === "en"
                  ? "Don't take our word for it. These are the stories our travelers share after returning home."
                  : lang === "es"
                  ? "No te fíes de nuestra palabra. Estas son las historias que nuestros viajeros comparten al volver a casa."
                  : "Não acredite em nós. Estas são as histórias que nossos viajantes compartilham ao voltar para casa."}
              </p>
            </div>
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#00af87] hover:underline shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00af87]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              {lang === "en" ? "See all on Tripadvisor" : lang === "es" ? "Ver todo en Tripadvisor" : "Ver tudo no Tripadvisor"}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <StarRow />
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#00af87]" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    Tripadvisor
                  </span>
                </div>
                <p className="text-foreground/85 text-sm leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-base">
                    {review.flag}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall rating badge */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
              <div>
                <p className="font-bold text-3xl text-foreground">5.0</p>
                <StarRow />
              </div>
              <div className="text-left pl-3 border-l border-gray-100">
                <p className="font-semibold text-sm text-foreground">
                  {lang === "en" ? "Excellent" : lang === "es" ? "Excelente" : "Excelente"}
                </p>
                <a
                  href={TRIPADVISOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00af87] hover:underline"
                >
                  Tripadvisor ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
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
