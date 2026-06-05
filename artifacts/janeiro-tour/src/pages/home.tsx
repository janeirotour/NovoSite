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

const TX = {
  en: {
    stat1: "Happy Travelers",
    stat1sub: "From every corner of the world",
    stat2link: "See all reviews ↗",
    stat3: "Years in Rio",
    stat3sub: "Founded 2014, Black-owned",
    stat4: "Languages",
    stat4sub: "English · Spanish · Portuguese",
    expEyebrow: "Curated for you",
    expTitle: "Experiences That Stay With You",
    expDesc: "Every tour is guided by someone who loves this place. That makes all the difference.",
    expLink: "All experiences",
    expMobile: "See all experiences",
    revEyebrow: "What travelers say",
    revTitle: "Real People. Real Experiences.",
    revDesc: "Don't take our word for it. These are the stories our travelers share after returning home.",
    revCta: "Read all reviews on Tripadvisor",
    pkgEyebrow: "Bundle & save up to 27%",
    pkgTitle: "Rio Experience Packages",
    pkgDesc: "Three curated experiences, one seamless journey — bundled at a lower price with transfers and transport included.",
    pkgLink: "All packages",
    pkgTransfers: "Airport transfers included",
    pkgBook: "See Prices & Book",
    pkgMobile: "See all packages",
    beliefEyebrow: "Our belief",
    beliefQuote: '"Tourism is more than visiting places — it\'s immersing yourself in the rich culture, history, and breathtaking landscapes that make Brazil unlike anywhere else on earth."',
    beliefYear: "est. 2014",
    exploreBtn: "Explore Experiences",
    destEyebrow: "Where will you go?",
    destTitle: "Six Destinations. Each One Stays With You.",
    destDesc: "Each destination has its own rhythm, its own flavor, its own way of welcoming you.",
    destLink: "All destinations",
    destMobile: "See all destinations",
    styleEyebrow: "Built around you",
    styleTitle: "Choose Your Travel Style",
    styleDesc: "Every traveler is different. We offer two ways to explore — both curated by local experts who know this land deeply.",
    sharedBadge: "Shared Tours",
    sharedTitle: "Connect & Explore Together",
    sharedDesc: "Join fellow travelers in a small group for an immersive, social experience. Perfect for solo travelers and those who love meeting people from around the world.",
    sharedLink: "Browse Shared Tours",
    privateBadge: "Private Tours",
    privateTitle: "Your Journey, Your Way",
    privateDesc: "A fully private, customized experience with a dedicated guide. Ideal for honeymoons, family trips, or anyone who wants a completely tailored adventure.",
    privateLink: "Browse Private Tours",
    ctaBadge: "Black-owned · Afrotourism · Est. 2014",
    ctaTitle: "Your Brazil story starts here.",
    ctaDesc: "Tell us what you dream of. We'll craft the journey that makes it real — with local knowledge, care, and a genuine love for this country.",
    ctaSub: "Free cancellation · No payment today · Instant confirmation",
    ctaExplore: "Explore Experiences",
    ctaWhatsApp: "Chat on WhatsApp",
    ctaContact: "Contact Us",
  },
  es: {
    stat1: "Viajeros Felices",
    stat1sub: "De todos los rincones del mundo",
    stat2link: "Ver reseñas ↗",
    stat3: "Años en Río",
    stat3sub: "Fundada 2014, empresa negra",
    stat4: "Idiomas",
    stat4sub: "Inglés · Español · Portugués",
    expEyebrow: "Seleccionado para ti",
    expTitle: "Experiencias que Permanecen Contigo",
    expDesc: "Cada tour es guiado por alguien que ama este lugar. Eso hace toda la diferencia.",
    expLink: "Ver experiencias",
    expMobile: "Ver todas las experiencias",
    revEyebrow: "Lo que dicen los viajeros",
    revTitle: "Personas Reales. Experiencias Reales.",
    revDesc: "No te fíes de nuestra palabra. Estas son las historias que nuestros viajeros comparten al volver.",
    revCta: "Leer todas las reseñas en Tripadvisor",
    pkgEyebrow: "Combina y ahorra hasta 27%",
    pkgTitle: "Paquetes de Experiencias en Río",
    pkgDesc: "Tres experiencias curadas, un viaje sin interrupciones — combinadas a mejor precio con transfers y transporte incluidos.",
    pkgLink: "Ver paquetes",
    pkgTransfers: "Transfers de aeropuerto incluidos",
    pkgBook: "Ver Precios",
    pkgMobile: "Ver todos los paquetes",
    beliefEyebrow: "Nuestra creencia",
    beliefQuote: '"El turismo es más que visitar lugares — es sumergirse en la rica cultura, historia y paisajes impresionantes que hacen de Brasil un lugar único en el mundo."',
    beliefYear: "desde 2014",
    exploreBtn: "Explorar Experiencias",
    destEyebrow: "¿A dónde irás?",
    destTitle: "Seis Destinos. Cada Uno te Marca.",
    destDesc: "Cada destino tiene su propio ritmo, su propio sabor, su propia forma de recibirte.",
    destLink: "Ver destinos",
    destMobile: "Ver todos los destinos",
    styleEyebrow: "Diseñado para ti",
    styleTitle: "Elige Tu Estilo de Viaje",
    styleDesc: "Cada viajero es diferente. Ofrecemos dos formas de explorar — ambas diseñadas por expertos locales.",
    sharedBadge: "Tours Compartidos",
    sharedTitle: "Conectar y Explorar Juntos",
    sharedDesc: "Únete a otros viajeros en un grupo pequeño. Perfecto para viajeros solos y quienes aman conocer personas de todo el mundo.",
    sharedLink: "Ver Tours Compartidos",
    privateBadge: "Tours Privados",
    privateTitle: "Tu Viaje, A Tu Manera",
    privateDesc: "Una experiencia privada y personalizada con un guía dedicado. Ideal para lunas de miel, viajes familiares o quien quiera una aventura completamente a medida.",
    privateLink: "Ver Tours Privados",
    ctaBadge: "Empresa Negra · Afroturismo · 2014",
    ctaTitle: "Tu historia en Brasil empieza aquí.",
    ctaDesc: "Cuéntanos lo que sueñas. Crearemos el viaje que lo haga realidad — con conocimiento local, cuidado y un amor genuino por este país.",
    ctaSub: "Cancelación gratuita · Sin pago hoy · Confirmación inmediata",
    ctaExplore: "Explorar Experiencias",
    ctaWhatsApp: "Chatear en WhatsApp",
    ctaContact: "Contáctanos",
  },
  pt: {
    stat1: "Viajantes Felizes",
    stat1sub: "De todos os cantos do mundo",
    stat2link: "Ver avaliações ↗",
    stat3: "Anos no Rio",
    stat3sub: "Fundada 2014, empresa negra",
    stat4: "Idiomas",
    stat4sub: "Inglês · Espanhol · Português",
    expEyebrow: "Selecionado para você",
    expTitle: "Experiências que Ficam com Você",
    expDesc: "Cada passeio é guiado por alguém que ama este lugar. Isso faz toda a diferença.",
    expLink: "Ver experiências",
    expMobile: "Ver todas as experiências",
    revEyebrow: "O que dizem os viajantes",
    revTitle: "Pessoas Reais. Experiências Reais.",
    revDesc: "Não acredite em nós. Estas são as histórias que nossos viajantes compartilham ao voltar para casa.",
    revCta: "Ler todas as avaliações no Tripadvisor",
    pkgEyebrow: "Combine e economize até 27%",
    pkgTitle: "Pacotes de Experiências no Rio",
    pkgDesc: "Três experiências curadas, uma jornada sem pausas — combinadas por um preço menor com transfers e transporte incluídos.",
    pkgLink: "Ver pacotes",
    pkgTransfers: "Transfers de aeroporto incluídos",
    pkgBook: "Ver Preços",
    pkgMobile: "Ver todos os pacotes",
    beliefEyebrow: "Nossa crença",
    beliefQuote: '"Turismo é mais do que visitar lugares — é mergulhar na rica cultura, história e paisagens que tornam o Brasil único no mundo."',
    beliefYear: "desde 2014",
    exploreBtn: "Explorar Experiências",
    destEyebrow: "Para onde vai?",
    destTitle: "Seis Destinos. Cada Um Fica em Você.",
    destDesc: "Cada destino tem seu próprio ritmo, seu próprio sabor, sua própria forma de recebê-lo.",
    destLink: "Ver destinos",
    destMobile: "Ver todos os destinos",
    styleEyebrow: "Feito para você",
    styleTitle: "Escolha Seu Estilo de Viagem",
    styleDesc: "Cada viajante é diferente. Oferecemos duas formas de explorar — ambas criadas por especialistas locais.",
    sharedBadge: "Tours Compartilhados",
    sharedTitle: "Conecte e Explore Juntos",
    sharedDesc: "Junte-se a outros viajantes em um pequeno grupo. Perfeito para viajantes solo e quem ama conhecer pessoas do mundo todo.",
    sharedLink: "Ver Tours Compartilhados",
    privateBadge: "Tours Privativos",
    privateTitle: "Sua Jornada, Do Seu Jeito",
    privateDesc: "Uma experiência totalmente privada e personalizada com um guia dedicado. Ideal para lua de mel, viagens em família ou quem quer uma aventura completamente personalizada.",
    privateLink: "Ver Tours Privativos",
    ctaBadge: "Empresa Negra · Afroturismo · 2014",
    ctaTitle: "A sua história no Brasil começa aqui.",
    ctaDesc: "Conte-nos o que você sonha. Vamos criar a jornada que o torna real — com conhecimento local, cuidado e um amor genuíno por este país.",
    ctaSub: "Cancelamento grátis · Sem pagamento hoje · Confirmação imediata",
    ctaExplore: "Explorar Experiências",
    ctaWhatsApp: "Conversar no WhatsApp",
    ctaContact: "Falar Conosco",
  },
  fr: {
    stat1: "Voyageurs Heureux",
    stat1sub: "Des quatre coins du monde",
    stat2link: "Voir les avis ↗",
    stat3: "Ans à Rio",
    stat3sub: "Fondée en 2014, entreprise noire",
    stat4: "Langues",
    stat4sub: "Anglais · Espagnol · Portugais",
    expEyebrow: "Sélectionné pour vous",
    expTitle: "Des Expériences Inoubliables",
    expDesc: "Chaque tour est guidé par quelqu'un qui aime cet endroit. Cela fait toute la différence.",
    expLink: "Toutes les expériences",
    expMobile: "Voir toutes les expériences",
    revEyebrow: "Ce que disent les voyageurs",
    revTitle: "Vraies Personnes. Vraies Expériences.",
    revDesc: "Ne vous fiez pas à notre parole. Ce sont les histoires que nos voyageurs partagent après leur retour.",
    revCta: "Lire tous les avis sur Tripadvisor",
    pkgEyebrow: "Groupez et économisez jusqu'à 27%",
    pkgTitle: "Forfaits d'Expériences à Rio",
    pkgDesc: "Trois expériences curatées, un voyage sans interruption — regroupées à prix réduit avec transferts et transport inclus.",
    pkgLink: "Tous les forfaits",
    pkgTransfers: "Transferts aéroport inclus",
    pkgBook: "Voir les Prix",
    pkgMobile: "Voir tous les forfaits",
    beliefEyebrow: "Notre conviction",
    beliefQuote: '"Le tourisme est plus que visiter des lieux — c\'est s\'immerger dans la riche culture, l\'histoire et les paysages époustouflants qui rendent le Brésil unique au monde."',
    beliefYear: "dep. 2014",
    exploreBtn: "Explorer les Expériences",
    destEyebrow: "Où irez-vous?",
    destTitle: "Six Destinations. Chacune Vous Marquera.",
    destDesc: "Chaque destination a son propre rythme, sa propre saveur, sa propre façon de vous accueillir.",
    destLink: "Toutes les destinations",
    destMobile: "Voir toutes les destinations",
    styleEyebrow: "Conçu pour vous",
    styleTitle: "Choisissez Votre Style de Voyage",
    styleDesc: "Chaque voyageur est différent. Nous offrons deux façons d'explorer — toutes deux curatées par des experts locaux.",
    sharedBadge: "Tours Partagés",
    sharedTitle: "Connectez et Explorez Ensemble",
    sharedDesc: "Rejoignez d'autres voyageurs dans un petit groupe. Parfait pour les voyageurs solo et ceux qui aiment rencontrer des gens du monde entier.",
    sharedLink: "Voir les Tours Partagés",
    privateBadge: "Tours Privés",
    privateTitle: "Votre Voyage, À Votre Façon",
    privateDesc: "Une expérience entièrement privée et personnalisée avec un guide dédié. Idéal pour les lunes de miel, voyages en famille ou quiconque veut une aventure sur mesure.",
    privateLink: "Voir les Tours Privés",
    ctaBadge: "Entreprise Noire · Afrotourisme · 2014",
    ctaTitle: "Votre histoire au Brésil commence ici.",
    ctaDesc: "Dites-nous ce que vous rêvez. Nous créerons le voyage qui le rend réel — avec une connaissance locale, soin et un véritable amour pour ce pays.",
    ctaSub: "Annulation gratuite · Sans paiement aujourd'hui · Confirmation instantanée",
    ctaExplore: "Explorer les Expériences",
    ctaWhatsApp: "Chatter sur WhatsApp",
    ctaContact: "Nous Contacter",
  },
  de: {
    stat1: "Glückliche Reisende",
    stat1sub: "Aus allen Ecken der Welt",
    stat2link: "Alle Bewertungen ↗",
    stat3: "Jahre in Rio",
    stat3sub: "Gegründet 2014, Schwarzes Unternehmen",
    stat4: "Sprachen",
    stat4sub: "Englisch · Spanisch · Portugiesisch",
    expEyebrow: "Für Sie kuratiert",
    expTitle: "Erlebnisse, die bleiben",
    expDesc: "Jede Tour wird von jemandem geleitet, der diesen Ort liebt. Das macht den Unterschied.",
    expLink: "Alle Erlebnisse",
    expMobile: "Alle Erlebnisse ansehen",
    revEyebrow: "Was Reisende sagen",
    revTitle: "Echte Menschen. Echte Erlebnisse.",
    revDesc: "Vertrauen Sie nicht nur unserem Wort. Dies sind die Geschichten, die unsere Reisenden nach der Heimkehr teilen.",
    revCta: "Alle Bewertungen auf Tripadvisor lesen",
    pkgEyebrow: "Bündeln und bis zu 27% sparen",
    pkgTitle: "Rio Erlebnispakete",
    pkgDesc: "Drei kuratierte Erlebnisse, eine nahtlose Reise — gebündelt zu einem günstigeren Preis mit Transfers und Transport inklusive.",
    pkgLink: "Alle Pakete",
    pkgTransfers: "Flughafentransfers inklusive",
    pkgBook: "Preise ansehen",
    pkgMobile: "Alle Pakete ansehen",
    beliefEyebrow: "Unsere Überzeugung",
    beliefQuote: '"Tourismus ist mehr als Orte besuchen — es ist das Eintauchen in die reiche Kultur, Geschichte und atemberaubende Landschaften, die Brasilien einzigartig machen."',
    beliefYear: "seit 2014",
    exploreBtn: "Erlebnisse entdecken",
    destEyebrow: "Wohin reisen Sie?",
    destTitle: "Sechs Reiseziele. Jedes bleibt in Erinnerung.",
    destDesc: "Jedes Ziel hat seinen eigenen Rhythmus, seinen eigenen Geschmack, seine eigene Art, Sie willkommen zu heißen.",
    destLink: "Alle Reiseziele",
    destMobile: "Alle Reiseziele ansehen",
    styleEyebrow: "Für Sie gestaltet",
    styleTitle: "Wählen Sie Ihren Reisestil",
    styleDesc: "Jeder Reisende ist anders. Wir bieten zwei Möglichkeiten zu erkunden — beide von lokalen Experten gestaltet.",
    sharedBadge: "Gruppentouren",
    sharedTitle: "Gemeinsam Entdecken",
    sharedDesc: "Schließen Sie sich anderen Reisenden in einer kleinen Gruppe an. Perfekt für Alleinreisende und alle, die Menschen aus der ganzen Welt kennenlernen möchten.",
    sharedLink: "Gruppentouren ansehen",
    privateBadge: "Private Touren",
    privateTitle: "Ihre Reise, Ihr Weg",
    privateDesc: "Ein vollständig privates, maßgeschneidertes Erlebnis mit einem persönlichen Führer. Ideal für Flitterwochen, Familienreisen oder alle, die ein völlig individuelles Abenteuer möchten.",
    privateLink: "Private Touren ansehen",
    ctaBadge: "Schwarzes Unternehmen · Afrotourismus · 2014",
    ctaTitle: "Ihre Brasilien-Geschichte beginnt hier.",
    ctaDesc: "Sagen Sie uns, wovon Sie träumen. Wir gestalten die Reise, die es wahr macht — mit lokalem Wissen, Fürsorge und echter Liebe für dieses Land.",
    ctaSub: "Kostenlose Stornierung · Keine Zahlung heute · Sofortige Bestätigung",
    ctaExplore: "Erlebnisse entdecken",
    ctaWhatsApp: "WhatsApp Chat",
    ctaContact: "Kontaktieren Sie uns",
  },
};

export default function Home() {
  const { lang } = useLanguage();
  const tx = TX[lang] ?? TX.en;
  const { data: featuredTours, isLoading: toursLoading } = useListFeaturedTours();
  const { data: destinations, isLoading: destLoading } = useListDestinations({ featured: true });
  const { data: packages, isLoading: pkgsLoading } = useListPackages();

  useEffect(() => {
    document.title = "Janeiro Tour | Brazil Travel Experiences";
  }, []);

  return (
    <div className="w-full">
      <HeroSection />

      {/* ── 1. Trust Strip ─────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">20k<span className="text-primary">+</span></p>
              <p className="font-semibold text-sm text-foreground mt-1">{tx.stat1}</p>
              <p className="text-xs text-muted-foreground leading-snug">{tx.stat1sub}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <div className="flex items-end gap-1">
                <p className="text-4xl font-extrabold text-foreground leading-none">5.0</p>
                <Star className="w-6 h-6 fill-[#00af87] text-[#00af87] mb-1" />
              </div>
              <p className="font-semibold text-sm text-foreground mt-1">TripAdvisor Rating</p>
              <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00af87] hover:underline">
                {tx.stat2link}
              </a>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">10<span className="text-primary">+</span></p>
              <p className="font-semibold text-sm text-foreground mt-1">{tx.stat3}</p>
              <p className="text-xs text-muted-foreground leading-snug">{tx.stat3sub}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-4xl font-extrabold text-foreground leading-none">3</p>
              <p className="font-semibold text-sm text-foreground mt-1">{tx.stat4}</p>
              <p className="text-xs text-muted-foreground leading-snug">{tx.stat4sub}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Experiences ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="eyebrow text-primary mb-4">{tx.expEyebrow}</p>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-foreground mb-4">{tx.expTitle}</h2>
              <p className="text-muted-foreground text-[1.0625rem] leading-relaxed max-w-xl">{tx.expDesc}</p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {tx.expLink} <ArrowRight className="w-4 h-4" />
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
              <Button variant="outline" className="w-full rounded-full">{tx.expMobile}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Reviews ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <p className="eyebrow text-primary mb-4">{tx.revEyebrow}</p>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-foreground mb-4">{tx.revTitle}</h2>
              <p className="text-muted-foreground text-[1.0625rem] leading-relaxed max-w-xl">{tx.revDesc}</p>
            </div>
            <div className="flex items-center gap-3 bg-[#fafaf8] rounded-2xl px-6 py-4 border border-gray-100 shrink-0">
              <div className="text-center">
                <p className="font-extrabold text-3xl text-foreground leading-none">5.0</p>
                <StarRow size={4} />
              </div>
              <div className="text-left pl-4 border-l border-gray-200">
                <p className="font-semibold text-sm text-foreground">Excellent</p>
                <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00af87] hover:underline flex items-center gap-1">
                  Tripadvisor <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <div key={review.name} className="bg-[#fafaf8] rounded-2xl p-6 border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-4 right-5 text-6xl font-serif text-gray-100 select-none leading-none">&ldquo;</div>
                <div className="flex items-center justify-between relative z-10">
                  <StarRow size={4} />
                  <span className="text-xs text-[#00af87] font-semibold">Tripadvisor</span>
                </div>
                <p className="text-foreground/85 text-sm leading-relaxed flex-1 relative z-10">&ldquo;{review.text}&rdquo;</p>
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
                {tx.revCta}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. Featured Packages ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="eyebrow text-primary mb-4">{tx.pkgEyebrow}</p>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-foreground mb-4">{tx.pkgTitle}</h2>
              <p className="text-muted-foreground text-[1.0625rem] leading-relaxed max-w-xl">{tx.pkgDesc}</p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {tx.pkgLink} <ArrowRight className="w-4 h-4" />
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
                      <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                          <span>{tx.pkgTransfers}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {pkg.durationLabel && <span className="flex items-center gap-1"><Clock size={10} />{pkg.durationLabel}</span>}
                        {pkg.groupSizeLabel && <span className="flex items-center gap-1"><Users size={10} />{pkg.groupSizeLabel}</span>}
                      </div>

                      <Link href={`/packages/${pkg.slug}`} className="mt-auto">
                        <Button className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold gap-2">
                          {tx.pkgBook} <ArrowRight size={14} />
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
              <Button variant="outline" className="w-full rounded-full">{tx.pkgMobile}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Cultural pull-quote ────────────────────────────────────────────── */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-janeirotour.webp')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </span>
          </div>
          <p className="eyebrow text-primary mb-6">{tx.beliefEyebrow}</p>
          <blockquote className="text-2xl md:text-4xl font-light leading-relaxed text-white/90 italic mb-8">
            {tx.beliefQuote}
          </blockquote>
          <p className="text-white/50 text-sm mb-10">— Janeiro Tour &amp; Travel, {tx.beliefYear}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-black font-semibold">
                {tx.exploreBtn}
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
              <p className="eyebrow text-primary mb-4">{tx.destEyebrow}</p>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-foreground mb-4">{tx.destTitle}</h2>
              <p className="text-muted-foreground text-[1.0625rem] leading-relaxed max-w-xl">{tx.destDesc}</p>
            </div>
            <Link href="/destinations" className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline gap-1">
              {tx.destLink} <ArrowRight className="w-4 h-4" />
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
              <Button variant="outline" className="w-full rounded-full">{tx.destMobile}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Choose Your Travel Style ───────────────────────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="eyebrow text-primary mb-4">{tx.styleEyebrow}</p>
            <h2 className="font-bold text-3xl md:text-[2.75rem] text-foreground mb-4">{tx.styleTitle}</h2>
            <p className="text-muted-foreground text-[1.0625rem] leading-relaxed max-w-xl mx-auto">{tx.styleDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/tours?type=group">
              <div className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
                <div className="aspect-[4/3]">
                  <img src="/images/group-tour.jpg" alt="Shared Tours" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute top-5 left-5">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {tx.sharedBadge}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl font-bold text-white mb-2">{tx.sharedTitle}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{tx.sharedDesc}</p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    {tx.sharedLink} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/tours?type=private">
              <div className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
                <div className="aspect-[4/3]">
                  <img src="/images/team-carnival.jpg" alt="Private Tours" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute top-5 left-5">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {tx.privateBadge}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl font-bold text-white mb-2">{tx.privateTitle}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{tx.privateDesc}</p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    {tx.privateLink} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/hero-janeirotour.webp')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <span className="eyebrow text-primary">{tx.ctaBadge}</span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">{tx.ctaTitle}</h2>
          <p className="text-white/70 text-lg mb-4 max-w-2xl mx-auto">{tx.ctaDesc}</p>
          <p className="text-white/40 text-sm mb-10">{tx.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 text-black border-0">
                {tx.ctaExplore}
              </Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white border-0 gap-2">
                <MessageCircle className="w-5 h-5" />
                {tx.ctaWhatsApp}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-full border-white/30 text-white hover:bg-white/10">
                {tx.ctaContact}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
