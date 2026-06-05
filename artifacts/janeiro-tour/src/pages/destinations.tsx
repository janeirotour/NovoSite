import { useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";
import { useListDestinations } from "@workspace/api-client-react";

type Lang = "en" | "es" | "pt" | "fr" | "de" | "no";

const DESTINATIONS = [
  {
    id: 1,
    slug: "/destinations/1",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&q=80",
    en: { name: "Rio de Janeiro", tagline: "The Marvellous City", desc: "Christ the Redeemer, Copacabana, Lapa, Sugarloaf — Rio is a city that overwhelms the senses and stays in the soul. Experience its rhythm, its beauty, its people." },
    es: { name: "Río de Janeiro", tagline: "La Ciudad Maravillosa", desc: "Cristo Redentor, Copacabana, Lapa, Pan de Azúcar — Río es una ciudad que abruma los sentidos y se queda en el alma. Siente su ritmo, su belleza, su gente." },
    pt: { name: "Rio de Janeiro", tagline: "A Cidade Maravilhosa", desc: "Cristo Redentor, Copacabana, Lapa, Pão de Açúcar — o Rio é uma cidade que impressiona os sentidos e fica na alma. Sinta seu ritmo, sua beleza, sua gente." },
    fr: { name: "Rio de Janeiro", tagline: "La Ville Merveilleuse", desc: "Le Christ Rédempteur, Copacabana, Lapa, le Pain de Sucre — Rio est une ville qui submerge les sens et reste dans l'âme. Vivez son rythme, sa beauté, ses habitants." },
    de: { name: "Rio de Janeiro", tagline: "Die Wunderbare Stadt", desc: "Christus der Erlöser, Copacabana, Lapa, Zuckerhut — Rio ist eine Stadt, die die Sinne überwältigt und in der Seele bleibt. Erleben Sie ihren Rhythmus, ihre Schönheit, ihre Menschen." },
    no: { name: "Rio de Janeiro", tagline: "Den vidunderlige byen", desc: "Kristus Frelseren, Copacabana, Lapa, Sugarloaf — Rio er en by som overveldende sansene og som blir i sjelen. Opplev dens rytme, dens skjønnhet, dens mennesker." },
  },
  {
    id: 2,
    slug: "/destinations/2",
    image: "https://images.unsplash.com/photo-1618164564882-46e6e94e4bdb?w=900&q=80",
    en: { name: "São Paulo", tagline: "The City That Never Stops", desc: "Gastronomy, art, architecture and culture at an extraordinary scale. São Paulo is Brazil's cosmopolitan heart — a world within a city." },
    es: { name: "São Paulo", tagline: "La Ciudad Que Nunca Para", desc: "Gastronomía, arte, arquitectura y cultura a una escala extraordinaria. São Paulo es el corazón cosmopolita de Brasil — un mundo dentro de una ciudad." },
    pt: { name: "São Paulo", tagline: "A Cidade Que Nunca Para", desc: "Gastronomia, arte, arquitetura e cultura em escala extraordinária. São Paulo é o coração cosmopolita do Brasil — um mundo dentro de uma cidade." },
    fr: { name: "São Paulo", tagline: "La Ville Qui Ne S'Arrête Jamais", desc: "Gastronomie, art, architecture et culture à une échelle extraordinaire. São Paulo est le cœur cosmopolite du Brésil — un monde dans une ville." },
    de: { name: "São Paulo", tagline: "Die Stadt, die niemals schläft", desc: "Gastronomie, Kunst, Architektur und Kultur in außergewöhnlichem Ausmaß. São Paulo ist Brasiliens kosmopolitisches Herz — eine Welt in einer Stadt." },
    no: { name: "São Paulo", tagline: "Byen som aldri stopper", desc: "Gastronomi, kunst, arkitektur og kultur i eksepsjonelt omfang. São Paulo er Brasils kosmopolitiske hjerte — en verden i én by." },
  },
  {
    id: 5,
    slug: "/destinations/5",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=900&q=80",
    en: { name: "Bahia", tagline: "The Heart of Afro-Brazilian Culture", desc: "Salvador's historic Pelourinho, Axé music, candomblé, and the most vibrant carnival in Brazil. Bahia is where the soul of Brazil truly lives." },
    es: { name: "Bahía", tagline: "El Corazón de la Cultura Afro-Brasileña", desc: "El histórico Pelourinho de Salvador, música Axé, candomblé, y el carnaval más vibrante de Brasil. Bahía es donde verdaderamente vive el alma de Brasil." },
    pt: { name: "Bahia", tagline: "O Coração da Cultura Afro-Brasileira", desc: "O histórico Pelourinho de Salvador, música Axé, candomblé e o carnaval mais vibrante do Brasil. A Bahia é onde a alma do Brasil verdadeiramente vive." },
    fr: { name: "Bahia", tagline: "Le Cœur de la Culture Afro-Brésilienne", desc: "Le Pelourinho historique de Salvador, la musique Axé, le candomblé et le carnaval le plus vibrant du Brésil. Bahia est là où l'âme du Brésil vit vraiment." },
    de: { name: "Bahia", tagline: "Das Herz der Afro-Brasilianischen Kultur", desc: "Das historische Pelourinho in Salvador, Axé-Musik, Candomblé und der lebendigste Karneval Brasiliens. Bahia ist der Ort, wo Brasiliens Seele wirklich lebt." },
    no: { name: "Bahia", tagline: "Hjertet av afro-brasiliansk kultur", desc: "Det historiske Pelourinho i Salvador, Axé-musikk, Candomblé og det mest levende karnevalet i Brasil. Bahia er der Brasils sjel virkelig lever." },
  },
  {
    id: 3,
    slug: "/destinations/3",
    image: "https://images.unsplash.com/photo-1516638022313-53b4b7829b7c?w=900&q=80",
    en: { name: "Foz do Iguaçu", tagline: "One of the World's Greatest Wonders", desc: "The most powerful waterfall system on the planet. Iguaçu Falls spans the border of Brazil and Argentina — a spectacle that leaves even the most seasoned traveler breathless." },
    es: { name: "Foz do Iguazú", tagline: "Una de las Maravillas del Mundo", desc: "El sistema de cascadas más poderoso del planeta. Las Cataratas del Iguazú abarcan la frontera entre Brasil y Argentina — un espectáculo que deja sin aliento incluso al viajero más experimentado." },
    pt: { name: "Foz do Iguaçu", tagline: "Uma das Maiores Maravilhas do Mundo", desc: "O sistema de cachoeiras mais poderoso do planeta. As Cataratas do Iguaçu se estendem pela fronteira entre Brasil e Argentina — um espetáculo que tira o fôlego até do viajante mais experiente." },
    fr: { name: "Foz do Iguaçu", tagline: "Une des Plus Grandes Merveilles du Monde", desc: "Le système de chutes d'eau le plus puissant de la planète. Les chutes d'Iguaçu s'étendent à la frontière entre le Brésil et l'Argentine — un spectacle qui coupe le souffle même au voyageur le plus aguerri." },
    de: { name: "Foz do Iguaçu", tagline: "Eines der größten Weltwunder", desc: "Das mächtigste Wasserfallsystem des Planeten. Die Iguaçu-Fälle erstrecken sich über die Grenze zwischen Brasilien und Argentinien — ein Spektakel, das selbst erfahrenen Reisenden den Atem verschlägt." },
    no: { name: "Foz do Iguaçu", tagline: "Et av verdens største naturundere", desc: "Det mektigste fossesystemet på planeten. Iguaçu-fossene strekker seg over grensen mellom Brasil og Argentina — et skuespill som tar pusten fra selv erfarne reisende." },
  },
  {
    id: 9,
    slug: "/destinations/9",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=900&q=80",
    en: { name: "Recife", tagline: "The Venice of Brazil", desc: "Waterways, colonial bridges, stunning beaches, and a frevo carnival unlike anywhere else. Recife and Olinda offer culture and beauty in equal measure." },
    es: { name: "Recife", tagline: "La Venecia de Brasil", desc: "Canales, puentes coloniales, playas impresionantes y un carnaval de frevo único en el mundo. Recife y Olinda ofrecen cultura y belleza a partes iguales." },
    pt: { name: "Recife", tagline: "A Veneza do Brasil", desc: "Canais, pontes coloniais, praias deslumbrantes e um carnaval de frevo único no mundo. Recife e Olinda oferecem cultura e beleza em igual medida." },
    fr: { name: "Recife", tagline: "La Venise du Brésil", desc: "Voies navigables, ponts coloniaux, plages magnifiques et un carnaval frevo unique au monde. Recife et Olinda offrent culture et beauté à parts égales." },
    de: { name: "Recife", tagline: "Das Venedig Brasiliens", desc: "Wasserstraßen, Kolonialbrücken, atemberaubende Strände und ein einzigartiger Frevo-Karneval. Recife und Olinda bieten Kultur und Schönheit in gleichem Maß." },
    no: { name: "Recife", tagline: "Brasils Venezia", desc: "Vannveier, kolonialbroer, fantastiske strender og en unik Frevo-karneval. Recife og Olinda tilbyr kultur og skjønnhet i like store doser." },
  },
  {
    id: 0,
    slug: "/contact",
    image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=900&q=80",
    en: { name: "Amazon Rainforest", tagline: "The Lungs of the Earth", desc: "The world's largest tropical rainforest — 5.5 million square kilometres of wildlife, rivers and ancient life. A once-in-a-lifetime journey into the extraordinary." },
    es: { name: "Amazonía", tagline: "Los Pulmones de la Tierra", desc: "La selva tropical más grande del mundo — 5,5 millones de kilómetros cuadrados de fauna, ríos y vida ancestral. Un viaje único en la vida hacia lo extraordinario." },
    pt: { name: "Floresta Amazônica", tagline: "Os Pulmões da Terra", desc: "A maior floresta tropical do mundo — 5,5 milhões de quilômetros quadrados de fauna, rios e vida ancestral. Uma jornada única na vida rumo ao extraordinário." },
    fr: { name: "Forêt Amazonienne", tagline: "Les Poumons de la Terre", desc: "La plus grande forêt tropicale du monde — 5,5 millions de kilomètres carrés de faune, de rivières et de vie ancestrale. Un voyage unique dans l'extraordinaire." },
    de: { name: "Amazonas-Regenwald", tagline: "Die Lunge der Erde", desc: "Der größte tropische Regenwald der Welt — 5,5 Millionen Quadratkilometer Tierwelt, Flüsse und uraltes Leben. Eine einmalige Reise ins Außergewöhnliche." },
    no: { name: "Amazonas-regnskogen", tagline: "Jordens lunge", desc: "Verdens største tropiske regnskog — 5,5 millioner kvadratkilometer med dyreliv, elver og eldgammelt liv. En enestående reise inn i det ekstraordinære." },
  },
];

const t = {
  en: {
    eyebrow: "Discover Brazil",
    heading: "Six Extraordinary Destinations",
    sub: "Each destination has its own rhythm, its own culture, its own way of staying with you long after you leave.",
    cta: "Explore",
    inquire: "Inquire About This Destination",
    readyEyebrow: "Ready to Travel?",
    readyTitle: "Not sure where to go?",
    readyDesc: "Our team knows every destination inside out. Tell us your travel style and we'll craft the perfect Brazilian journey for you.",
    browse: "Browse Experiences",
    talk: "Talk to Us",
  },
  es: {
    eyebrow: "Descubre Brasil",
    heading: "Seis Destinos Extraordinarios",
    sub: "Cada destino tiene su propio ritmo, su propia cultura, su propia manera de quedarse contigo mucho después de que te vayas.",
    cta: "Explorar",
    inquire: "Consultar Este Destino",
    readyEyebrow: "¿Listo para Viajar?",
    readyTitle: "¿No sabes a dónde ir?",
    readyDesc: "Nuestro equipo conoce cada destino a fondo. Cuéntanos tu estilo de viaje y crearemos el viaje perfecto por Brasil para ti.",
    browse: "Ver Experiencias",
    talk: "Hablar con Nosotros",
  },
  pt: {
    eyebrow: "Descubra o Brasil",
    heading: "Seis Destinos Extraordinários",
    sub: "Cada destino tem seu próprio ritmo, sua própria cultura, sua própria forma de ficar com você muito depois de partir.",
    cta: "Explorar",
    inquire: "Consultar Este Destino",
    readyEyebrow: "Pronto para Viajar?",
    readyTitle: "Não sabe para onde ir?",
    readyDesc: "Nossa equipa conhece cada destino a fundo. Conte-nos o seu estilo de viagem e criaremos a jornada brasileira perfeita para você.",
    browse: "Ver Experiências",
    talk: "Falar Conosco",
  },
  fr: {
    eyebrow: "Découvrez le Brésil",
    heading: "Six Destinations Extraordinaires",
    sub: "Chaque destination a son propre rythme, sa propre culture, sa propre façon de rester avec vous longtemps après votre départ.",
    cta: "Explorer",
    inquire: "Renseigner sur cette Destination",
    readyEyebrow: "Prêt à Voyager?",
    readyTitle: "Vous ne savez pas où aller?",
    readyDesc: "Notre équipe connaît chaque destination sur le bout des doigts. Parlez-nous de votre style de voyage et nous créerons le voyage brésilien parfait pour vous.",
    browse: "Voir les Expériences",
    talk: "Nous Contacter",
  },
  de: {
    eyebrow: "Brasilien entdecken",
    heading: "Sechs Außergewöhnliche Reiseziele",
    sub: "Jedes Reiseziel hat seinen eigenen Rhythmus, seine eigene Kultur, seine eigene Art, noch lange nach der Abreise bei Ihnen zu bleiben.",
    cta: "Erkunden",
    inquire: "Über dieses Reiseziel anfragen",
    readyEyebrow: "Bereit zu Reisen?",
    readyTitle: "Nicht sicher, wohin?",
    readyDesc: "Unser Team kennt jedes Reiseziel in- und auswendig. Erzählen Sie uns von Ihrem Reisestil und wir gestalten die perfekte Brasilien-Reise für Sie.",
    browse: "Erlebnisse ansehen",
    talk: "Sprechen Sie uns an",
  },
  no: {
    eyebrow: "Utforsk Brasil",
    heading: "Seks eksepsjonelle reisemål",
    sub: "Hvert reisemål har sin egen rytme, sin egen kultur, sin egen måte å bli hos deg lenge etter avreise.",
    cta: "Utforsk",
    inquire: "Spør om dette reisemålet",
    readyEyebrow: "Klar til å reise?",
    readyTitle: "Ikke sikker på hvor du vil?",
    readyDesc: "Teamet vårt kjenner hvert reisemål inn og ut. Fortell oss om reisestilen din, så lager vi den perfekte Brasil-reisen for deg.",
    browse: "Se opplevelser",
    talk: "Kontakt oss",
  },
};

export default function DestinationsPage() {
  const { lang } = useLanguage();
  const l = lang as Lang;
  const tx = t[l] ?? t.en;

  const { data: dbDestinations } = useListDestinations();
  const dbImageMap = Object.fromEntries(
    (dbDestinations ?? []).map((d) => [d.id, d.imageUrl]).filter(([, url]) => url)
  );

  useEffect(() => {
    document.title = l === "en"
      ? "Destinations | Janeiro Tour & Travel"
      : l === "de"
      ? "Reiseziele | Janeiro Tour & Travel"
      : l === "no"
      ? "Reisemål | Janeiro Tour & Travel"
      : "Destinos | Janeiro Tour & Travel";
  }, [l]);

  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80"
          alt="Brasil"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="eyebrow text-[#FFB600] mb-5">{tx.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">{tx.heading}</h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">{tx.sub}</p>
        </div>
      </section>

      {/* Destination Cards */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {DESTINATIONS.map((dest, i) => {
            const info = dest[l] ?? dest.en;
            const isReversed = i % 2 !== 0;
            return (
              <div
                key={dest.id}
                className={`group relative overflow-hidden rounded-3xl flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} min-h-[420px] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500`}
              >
                <div className="relative w-full lg:w-3/5 overflow-hidden min-h-[280px] lg:min-h-0">
                  <img src={(dbImageMap[dest.id] as string | undefined) ?? dest.image} alt={info.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  <div className={`absolute bottom-5 ${isReversed ? "right-5" : "left-5"}`}>
                    <span className="bg-[#FFB600] text-black text-xs font-bold tracking-[0.06em] px-3 py-1.5 rounded-full">
                      {info.tagline}
                    </span>
                  </div>
                </div>

                <div className={`w-full lg:w-2/5 flex flex-col justify-center p-10 lg:p-14 bg-white ${isReversed ? "lg:pr-14 lg:pl-10" : ""}`}>
                  <p className="eyebrow text-[#FFB600] mb-4">{tx.eyebrow}</p>
                  <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-5 leading-tight">{info.name}</h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-8">{info.desc}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {dest.id > 0 ? (
                      <Link href={dest.slug}>
                        <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
                          {tx.cta} <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    ) : (
                      <Link href="/contact">
                        <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
                          {tx.inquire} <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#fafaf8] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4">{tx.readyEyebrow}</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">{tx.readyTitle}</h2>
          <p className="text-gray-500 text-base mb-10">{tx.readyDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FFB600] hover:bg-[#e6a400] text-black text-sm font-semibold transition-colors cursor-pointer">
                {tx.browse}
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer">
                {tx.talk}
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
