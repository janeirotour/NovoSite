import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const TX = {
  eyebrow:   { en: "Exclusive Experiences",         es: "Experiencias Exclusivas",            pt: "Experiências Exclusivas",            fr: "Expériences Exclusives",             de: "Exklusive Erlebnisse" },
  heading:   { en: "Private Brazil Tours",           es: "Tours Privados en Brasil",           pt: "Tours Privativos no Brasil",         fr: "Tours Privés au Brésil",             de: "Private Brasilien-Touren" },
  sub:       {
    en: "Bespoke, fully customized private experiences across Brazil — your journey, your way",
    es: "Experiencias privadas totalmente personalizadas en Brasil — tu viaje, a tu manera",
    pt: "Experiências privadas totalmente personalizadas no Brasil — sua viagem, do seu jeito",
    fr: "Expériences privées entièrement personnalisées à travers le Brésil — votre voyage, à votre façon",
    de: "Maßgeschneiderte, vollständig individualisierte private Erlebnisse in Brasilien — Ihre Reise, Ihr Weg",
  },
  planBtn:   { en: "Plan My Private Tour",           es: "Planear Mi Tour Privado",            pt: "Planejar Meu Tour Privativo",        fr: "Planifier Mon Tour Privé",           de: "Meine Private Tour Planen" },
  diffTitle: { en: "The Private Tour Difference",    es: "La Diferencia del Tour Privado",     pt: "A Diferença do Tour Privativo",      fr: "La Différence du Tour Privé",        de: "Der Unterschied bei Privattouren" },
  diffSub:   {
    en: "Why share Brazil with strangers? A private tour means your dedicated guide, your pace, your priorities — and memories crafted just for you. Ideal for honeymoons, anniversaries, family trips, and discerning solo travelers.",
    es: "¿Por qué compartir Brasil con extraños? Un tour privado significa tu guía dedicado, tu ritmo, tus prioridades — y recuerdos creados solo para ti. Ideal para lunas de miel, aniversarios, viajes en familia y viajeros individuales exigentes.",
    pt: "Por que compartilhar o Brasil com estranhos? Um tour privativo significa seu guia dedicado, seu ritmo, suas prioridades — e memórias criadas só para você. Ideal para luas de mel, aniversários, viagens em família e viajantes individuais exigentes.",
    fr: "Pourquoi partager le Brésil avec des inconnus ? Un tour privé signifie votre guide dédié, votre rythme, vos priorités — et des souvenirs créés rien que pour vous. Idéal pour les lunes de miel, anniversaires, voyages en famille et voyageurs solo exigeants.",
    de: "Warum Brasilien mit Fremden teilen? Eine Privattour bedeutet Ihren eigenen Reiseführer, Ihr eigenes Tempo, Ihre eigenen Prioritäten — und Erinnerungen, die nur für Sie geschaffen wurden. Ideal für Flitterwochen, Jubiläen, Familienreisen und anspruchsvolle Alleinreisende.",
  },
  b1: { en: "100% customizable itinerary to your interests",  es: "Itinerario 100% personalizable según tus intereses",  pt: "Itinerário 100% personalizável aos seus interesses",  fr: "Itinéraire 100% personnalisable selon vos intérêts", de: "100% individuell anpassbares Reiseprogramm" },
  b2: { en: "Dedicated private guide throughout your experience", es: "Guía privado dedicado durante toda tu experiencia", pt: "Guia privado dedicado durante toda a sua experiência", fr: "Guide privé dédié tout au long de votre expérience", de: "Persönlicher Privatführer während des gesamten Erlebnisses" },
  b3: { en: "Flexible departure times — your schedule",        es: "Horarios de salida flexibles — tu horario",           pt: "Horários de saída flexíveis — sua programação",       fr: "Horaires de départ flexibles — votre emploi du temps", de: "Flexible Abfahrtszeiten — Ihr Zeitplan" },
  b4: { en: "Luxury air-conditioned private vehicle",          es: "Vehículo privado de lujo con aire acondicionado",    pt: "Veículo privado de luxo com ar-condicionado",         fr: "Véhicule privé de luxe climatisé",                    de: "Luxus-Klimafahrzeug für den Privatgebrauch" },
  b5: { en: "Priority access at all major attractions",        es: "Acceso prioritario en las principales atracciones",  pt: "Acesso prioritário nas principais atrações",          fr: "Accès prioritaire dans toutes les grandes attractions", de: "Vorrangiger Zugang zu allen wichtigen Sehenswürdigkeiten" },
  b6: { en: "Perfect for families, couples, and groups",       es: "Perfecto para familias, parejas y grupos",           pt: "Perfeito para famílias, casais e grupos",             fr: "Parfait pour les familles, couples et groupes",       de: "Perfekt für Familien, Paare und Gruppen" },
  b7: { en: "Photography stops at the best spots",             es: "Paradas fotográficas en los mejores lugares",        pt: "Paradas fotográficas nos melhores lugares",           fr: "Arrêts photo aux meilleurs endroits",                  de: "Fotostopps an den besten Aussichtspunkten" },
  b8: { en: "Personalized restaurant recommendations",         es: "Recomendaciones de restaurantes personalizadas",     pt: "Recomendações de restaurantes personalizadas",       fr: "Recommandations de restaurants personnalisées",        de: "Personalisierte Restaurantempfehlungen" },
  ourOptions:{ en: "Our Private Tour Options",                 es: "Nuestras Opciones de Tour Privado",                  pt: "Nossas Opções de Tour Privativo",                    fr: "Nos Options de Tour Privé",                           de: "Unsere Privattour-Optionen" },
  yourRio:   { en: "Your Private Rio Experience",              es: "Tu Experiencia Privada en Río",                      pt: "Sua Experiência Privativa no Rio",                    fr: "Votre Expérience Privée à Rio",                       de: "Ihr privates Rio-Erlebnis" },
  personalized:{ en: "Fully personalized from start to finish",es: "Totalmente personalizado de principio a fin",        pt: "Totalmente personalizado do início ao fim",           fr: "Entièrement personnalisé du début à la fin",          de: "Von Anfang bis Ende vollständig personalisiert" },
  customTitle:{ en: "Custom Private Itinerary",                es: "Itinerario Privado Personalizado",                   pt: "Itinerário Privativo Personalizado",                  fr: "Itinéraire Privé Personnalisé",                       de: "Individuelles Privat-Reiseprogramm" },
  customSub: {
    en: "Tell us your travel dates and interests — we'll create your perfect private Brazil experience",
    es: "Cuéntanos tus fechas de viaje e intereses — crearemos tu perfecta experiencia privada en Brasil",
    pt: "Conte-nos suas datas de viagem e interesses — criaremos sua experiência privativa perfeita no Brasil",
    fr: "Dites-nous vos dates de voyage et vos intérêts — nous créerons votre expérience privée parfaite au Brésil",
    de: "Teilen Sie uns Ihre Reisedaten und Interessen mit — wir erstellen Ihr perfektes privates Brasilien-Erlebnis",
  },
  planTrip:  { en: "Plan My Private Trip",                     es: "Planear Mi Viaje Privado",                          pt: "Planejar Meu Passeio Privativo",                      fr: "Planifier Mon Voyage Privé",                           de: "Meine private Reise planen" },
} as const;

export default function PrivateToursPage() {
  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({ type: "private" });

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  const benefits = [
    tx("b1"), tx("b2"), tx("b3"), tx("b4"), tx("b5"), tx("b6"), tx("b7"), tx("b8"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1600&q=80"
          alt="Private Tours"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">{tx("eyebrow")}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{tx("heading")}</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">{tx("sub")}</p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              {tx("planBtn")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{tx("diffTitle")}</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{tx("diffSub")}</p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-primary-foreground" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-80 lg:h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80"
              alt="Rio de Janeiro private tour"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-sm rounded-xl text-white text-sm">
              <p className="font-semibold">{tx("yourRio")}</p>
              <p className="text-white/80 text-xs mt-1">{tx("personalized")}</p>
            </div>
          </div>
        </div>

        {/* Private Tour Listings */}
        <h2 className="text-3xl font-bold mb-8">{tx("ourOptions")}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : tours?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
            <h3 className="text-xl font-bold mb-2">{tx("customTitle")}</h3>
            <p className="text-muted-foreground mb-6">{tx("customSub")}</p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">{tx("planTrip")}</Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
