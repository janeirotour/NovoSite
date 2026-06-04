import { useListFeaturedTours, useListDestinations, useListPackages } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { HeroSection } from "@/components/home/hero-section";
import { TourCard } from "@/components/ui/tour-card";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, MapPin, Heart, Star, ExternalLink, Clock, Package, MessageCircle, ShieldCheck, Award } from "lucide-react";
import { useEffect } from "react";

const TRIPADVISOR_URL = "https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html";
const WHATSAPP_URL = "https://wa.me/5521972633333";

const reviews = [
  {
    name: "Thomas L.",
    title: "Amazing experience",
    text: "This trip was awesome mainly because of this team. Traveling to a foreign country is great but can be overwhelming trying to figure out what to do and how to do it. These guys turn curiosity into fun, challenges to ease and expectations to awesome experiences. I highly recommend them — I missed them already.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Jasmine N.",
    title: "Rio Little Africa Tour",
    text: "I did the Little Africa tour with Dandara and had an amazing experience. She was so knowledgeable and informative. I highly recommend.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "V. Ncube",
    title: "Incredible tour of Rio's Afro-Brazilian history",
    text: "Incredible tour of Rio's Afro-Brazilian history. Our guide brought every story to life — the history, the culture, the food. This is what travel should feel like.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Michelle H.",
    title: "Best Tour in Rio",
    text: "Best Tour in Rio. Professional, warm, and genuinely passionate about sharing their city. You can feel how much they love what they do.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Katrina A.",
    title: "Couldn't imagine a better tour!",
    text: "Couldn't imagine a better tour! The energy, the knowledge, the connection — everything was perfect. I came back a different person.",
    source: "Tripadvisor",
    stars: 5,
  },
  {
    name: "Dianne S.",
    title: "Bom Dia!",
    text: "Dance, eat, explore, and relax. That's exactly what we did. Our guide made sure we felt at home in a city that isn't ours — and now it feels like it is.",
    source: "Tripadvisor",
    stars: 5,
  },
];

function StarRow({ size = 4 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-${size} h-${size} fill-[#00af87] text-[#00af87]`} />
      ))}
    </div>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const { data: featuredTours, isLoading: toursLoading } = useListFeaturedTours();
  const { data: destinations, isLoading: destLoading } = useListDestinations({ featured: true });
  const { data: packages, isLoading: pkgsLoading } = useListPackages();

  useEffect(() => {
    document.title = "Janeiro Tour | Brazil Travel Experiences";
  }, []);

  return (
    <div className="w-full">
      <HeroSection />

      {/* ── 1. Trust Strip — numbers that build instant credibility ─────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">20k<span className="text-primary">+</span></p>
              <p className="font-semibold text-sm text-foreground mt-1">
                {lang === "en" ? "Happy Travelers" : lang === "es" ? "Viajeros Felices" : "Viajantes Felizes"}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "From every corner of the world" : lang === "es" ? "De todos los rincones del mundo" : "De todos os cantos do mundo"}
              </p>
            </div>
            {/* Stat 2 — TripAdvisor rating */}
            <div className="flex flex-col items-center text-center gap-1">
              <div className="flex items-end gap-1">
                <p className="text-4xl font-extrabold text-foreground leading-none">5.0</p>
                <Star className="w-6 h-6 fill-[#00af87] text-[#00af87] mb-1" />
              </div>
              <p className="font-semibold text-sm text-foreground mt-1">TripAdvisor Rating</p>
              <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00af87] hover:underline">
                {lang === "en" ? "See all reviews ↗" : lang === "es" ? "Ver reseñas ↗" : "Ver avaliações ↗"}
              </a>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">10<span className="text-primary">+</span></p>
              <p className="font-semibold text-sm text-foreground mt-1">
                {lang === "en" ? "Years in Rio" : lang === "es" ? "Años en Río" : "Anos no Rio"}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "Founded 2014, Black-owned" : lang === "es" ? "Fundada 2014, empresa negra" : "Fundada 2014, empresa negra"}
              </p>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">3</p>
              <p className="font-semibold text-sm text-foreground mt-1">
                {lang === "en" ? "Languages" : lang === "es" ? "Idiomas" : "Idiomas"}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {lang === "en" ? "English · Spanish · Portuguese" : lang === "es" ? "Inglés · Español · Portugués" : "Inglês · Espanhol · Português"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Experiences — show the product first ─────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
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

      {/* ── 3. Reviews — social proof right after showing the product ─────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with overall rating badge inline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
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
                  ? "No te fíes de nuestra palabra. Estas son las historias que nuestros viajeros comparten al volver."
                  : "Não acredite em nós. Estas são as histórias que nossos viajantes compartilham ao voltar para casa."}
              </p>
            </div>
            {/* Rating pill */}
            <div className="flex items-center gap-3 bg-[#fafaf8] rounded-2xl px-6 py-4 border border-gray-100 shrink-0">
              <div className="text-center">
                <p className="font-extrabold text-3xl text-foreground leading-none">5.0</p>
                <StarRow size={4} />
              </div>
              <div className="text-left pl-4 border-l border-gray-200">
                <p className="font-semibold text-sm text-foreground">Excellent</p>
                <a
                  href={TRIPADVISOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00af87] hover:underline flex items-center gap-1"
                >
                  Tripadvisor <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <div key={review.name} className="bg-[#fafaf8] rounded-2xl p-6 border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                {/* decorative quote mark */}
                <div className="absolute top-4 right-5 text-6xl font-serif text-gray-100 select-none leading-none">&ldquo;</div>
                <div className="flex items-center justify-between relative z-10">
                  <StarRow size={4} />
                  <span className="text-xs text-[#00af87] font-semibold">Tripadvisor</span>
                </div>
                <p className="text-foreground/85 text-sm leading-relaxed flex-1 relative z-10">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground italic">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full gap-2 border-[#00af87] text-[#00af87] hover:bg-[#00af87]/10">
                <ExternalLink className="w-4 h-4" />
                {lang === "en" ? "Read all reviews on Tripadvisor" : lang === "es" ? "Leer todas las reseñas en Tripadvisor" : "Ler todas as avaliações no Tripadvisor"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. Featured Packages — upsell bundled deals ───────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                {lang === "en" ? "Bundle & save up to 27%" : lang === "es" ? "Combina y ahorra hasta 27%" : "Combine e economize até 27%"}
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
                {lang === "en" ? "Rio Experience Packages" : lang === "es" ? "Paquetes de Experiencias en Río" : "Pacotes de Experiências no Rio"}
              </h2>
              <p className="text-muted-foreground text-base max-w-xl">
                {lang === "en"
                  ? "Three curated experiences, one seamless journey — bundled at a lower price with transfers and transport included."
                  : lang === "es"
                  ? "Tres experiencias curadas, un viaje sin interrupciones — combinadas a mejor precio con transfers y transporte incluidos."
                  : "Três experiências curadas, uma jornada sem pausas — combinadas por um preço menor com transfers e transporte incluídos."}
              </p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {lang === "en" ? "All packages" : lang === "es" ? "Ver paquetes" : "Ver pacotes"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {pkgsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[420px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(packages ?? []).slice(0, 3).map((pkg) => {
                const tours = (pkg.toursIncluded ?? []) as { title: string; duration: string }[];
                const BADGE_COLORS: Record<string, string> = {
                  green: "bg-green-600 text-white",
                  amber: "bg-amber-500 text-black",
                  purple: "bg-purple-700 text-white",
                };
                const badgeStyle = BADGE_COLORS[pkg.badgeColor ?? "green"] ?? BADGE_COLORS.green;
                return (
                  <div key={pkg.id} className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {pkg.badge && (
                        <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${badgeStyle}`}>
                          {pkg.badge}
                        </div>
                      )}
                      {pkg.savingsPercent && (
                        <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                          Save {pkg.savingsPercent}%
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base leading-tight">{pkg.title}</h3>
                          {pkg.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{pkg.subtitle}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-bold text-green-600">${Number(pkg.priceFrom).toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {tours.slice(0, 3).map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Package size={11} className="text-green-600 flex-shrink-0" />
                            <span className="leading-snug line-clamp-1">{t.title}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <ShieldCheck size={11} className="flex-shrink-0" />
                          <span>{lang === "en" ? "Airport transfers included" : lang === "es" ? "Transfers de aeropuerto incluidos" : "Transfers de aeroporto incluídos"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {pkg.durationLabel && <span className="flex items-center gap-1"><Clock size={10} />{pkg.durationLabel}</span>}
                        {pkg.groupSizeLabel && <span className="flex items-center gap-1"><Users size={10} />{pkg.groupSizeLabel}</span>}
                      </div>

                      <Link href={`/packages/${pkg.slug}`} className="mt-auto">
                        <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold gap-2">
                          {lang === "en" ? "See Prices & Book" : lang === "es" ? "Ver Precios" : "Ver Preços"}
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/packages">
              <Button variant="outline" className="w-full rounded-full">
                {lang === "en" ? "See all packages" : lang === "es" ? "Ver todos los paquetes" : "Ver todos os pacotes"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Cultural pull-quote — emotional connection ─────────────────────── */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-janeirotour.webp')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </span>
          </div>
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
          <p className="text-white/50 text-sm mb-10">
            — Janeiro Tour &amp; Travel, {lang === "en" ? "est. 2014" : "desde 2014"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-black font-semibold">
                {lang === "en" ? "Explore Experiences" : lang === "es" ? "Explorar Experiencias" : "Explorar Experiências"}
              </Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10 gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. Featured Destinations ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
                {lang === "en" ? "Where will you go?" : lang === "es" ? "¿A dónde irás?" : "Para onde vai?"}
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
                {lang === "en" ? "Six Destinations. Each One Stays With You." : lang === "es" ? "Seis Destinos. Cada Uno te Marca." : "Seis Destinos. Cada Um Fica em Você."}
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

      {/* ── 7. Choose Your Travel Style ──────────────────────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
              {lang === "en" ? "Built around you" : lang === "es" ? "Diseñado para ti" : "Feito para você"}
            </p>
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
              {lang === "en" ? "Choose Your Travel Style" : lang === "es" ? "Elige Tu Estilo de Viaje" : "Escolha Seu Estilo de Viagem"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              {lang === "en"
                ? "Every traveler is different. We offer two ways to explore — both curated by local experts who know this land deeply."
                : lang === "es"
                ? "Cada viajero es diferente. Ofrecemos dos formas de explorar — ambas diseñadas por expertos locales."
                : "Cada viajante é diferente. Oferecemos duas formas de explorar — ambas criadas por especialistas locais."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shared Tours */}
            <Link href="/tours?type=group">
              <div className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
                <div className="aspect-[4/3]">
                  <img src="/images/group-tour.jpg" alt="Shared Tours" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute top-5 left-5">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {lang === "en" ? "Shared Tours" : lang === "es" ? "Tours Compartidos" : "Tours Compartilhados"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lang === "en" ? "Connect & Explore Together" : lang === "es" ? "Conectar y Explorar Juntos" : "Conecte e Explore Juntos"}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {lang === "en"
                      ? "Join fellow travelers in a small group for an immersive, social experience. Perfect for solo travelers and those who love meeting people from around the world."
                      : lang === "es"
                      ? "Únete a otros viajeros en un grupo pequeño. Perfecto para viajeros solos y quienes aman conocer personas de todo el mundo."
                      : "Junte-se a outros viajantes em um pequeno grupo. Perfeito para viajantes solo e quem ama conhecer pessoas do mundo todo."}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    {lang === "en" ? "Browse Shared Tours" : lang === "es" ? "Ver Tours Compartidos" : "Ver Tours Compartilhados"}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Private Tours */}
            <Link href="/tours?type=private">
              <div className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
                <div className="aspect-[4/3]">
                  <img src="/images/team-carnival.jpg" alt="Private Tours" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute top-5 left-5">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {lang === "en" ? "Private Tours" : lang === "es" ? "Tours Privados" : "Tours Privativos"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lang === "en" ? "Your Journey, Your Way" : lang === "es" ? "Tu Viaje, A Tu Manera" : "Sua Jornada, Do Seu Jeito"}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {lang === "en"
                      ? "A fully private, customized experience with a dedicated guide. Ideal for honeymoons, family trips, or anyone who wants a completely tailored adventure."
                      : lang === "es"
                      ? "Una experiencia privada y personalizada con un guía dedicado. Ideal para lunas de miel, viajes familiares o quien quiera una aventura completamente a medida."
                      : "Uma experiência totalmente privada e personalizada com um guia dedicado. Ideal para lua de mel, viagens em família ou quem quer uma aventura completamente personalizada."}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    {lang === "en" ? "Browse Private Tours" : lang === "es" ? "Ver Tours Privados" : "Ver Tours Privativos"}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA — strong close with dual CTA ────────────────────────── */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/hero-janeirotour.webp')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              {lang === "en" ? "Black-owned · Afrotourism · Est. 2014" : lang === "es" ? "Empresa Negra · Afroturismo · 2014" : "Empresa Negra · Afroturismo · 2014"}
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            {lang === "en" ? "Your Brazil story starts here." : lang === "es" ? "Tu historia en Brasil empieza aquí." : "A sua história no Brasil começa aqui."}
          </h2>
          <p className="text-white/70 text-lg mb-4 max-w-2xl mx-auto">
            {lang === "en"
              ? "Tell us what you dream of. We'll craft the journey that makes it real — with local knowledge, care, and a genuine love for this country."
              : lang === "es"
              ? "Cuéntanos lo que sueñas. Crearemos el viaje que lo haga realidad — con conocimiento local, cuidado y un amor genuino por este país."
              : "Conte-nos o que você sonha. Vamos criar a jornada que o torna real — com conhecimento local, cuidado e um amor genuíno por este país."}
          </p>
          <p className="text-white/40 text-sm mb-10">
            {lang === "en" ? "Free cancellation · No payment today · Instant confirmation" : lang === "es" ? "Cancelación gratuita · Sin pago hoy · Confirmación inmediata" : "Cancelamento grátis · Sem pagamento hoje · Confirmação imediata"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 text-black border-0">
                {lang === "en" ? "Explore Experiences" : lang === "es" ? "Explorar Experiencias" : "Explorar Experiências"}
              </Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white border-0 gap-2">
                <MessageCircle className="w-5 h-5" />
                {lang === "en" ? "Chat on WhatsApp" : lang === "es" ? "Chatear en WhatsApp" : "Conversar no WhatsApp"}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-full border-white/30 text-white hover:bg-white/10">
                {lang === "en" ? "Contact Us" : lang === "es" ? "Contáctanos" : "Falar Conosco"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
