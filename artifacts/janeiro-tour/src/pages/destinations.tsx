import { useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";

type Lang = "en" | "es" | "pt";

const DESTINATIONS = [
  {
    id: 1,
    slug: "/destinations/1",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&q=80",
    en: {
      name: "Rio de Janeiro",
      tagline: "The Marvellous City",
      desc: "Christ the Redeemer, Copacabana, Lapa, Sugarloaf — Rio is a city that overwhelms the senses and stays in the soul. Experience its rhythm, its beauty, its people.",
    },
    es: {
      name: "Río de Janeiro",
      tagline: "La Ciudad Maravillosa",
      desc: "Cristo Redentor, Copacabana, Lapa, Pan de Azúcar — Río es una ciudad que abruma los sentidos y se queda en el alma. Siente su ritmo, su belleza, su gente.",
    },
    pt: {
      name: "Rio de Janeiro",
      tagline: "A Cidade Maravilhosa",
      desc: "Cristo Redentor, Copacabana, Lapa, Pão de Açúcar — o Rio é uma cidade que impressiona os sentidos e fica na alma. Sinta seu ritmo, sua beleza, sua gente.",
    },
  },
  {
    id: 2,
    slug: "/destinations/2",
    image: "https://images.unsplash.com/photo-1618164564882-46e6e94e4bdb?w=900&q=80",
    en: {
      name: "São Paulo",
      tagline: "The City That Never Stops",
      desc: "Gastronomy, art, architecture and culture at an extraordinary scale. São Paulo is Brazil's cosmopolitan heart — a world within a city.",
    },
    es: {
      name: "São Paulo",
      tagline: "La Ciudad Que Nunca Para",
      desc: "Gastronomía, arte, arquitectura y cultura a una escala extraordinaria. São Paulo es el corazón cosmopolita de Brasil — un mundo dentro de una ciudad.",
    },
    pt: {
      name: "São Paulo",
      tagline: "A Cidade Que Nunca Para",
      desc: "Gastronomia, arte, arquitetura e cultura em escala extraordinária. São Paulo é o coração cosmopolita do Brasil — um mundo dentro de uma cidade.",
    },
  },
  {
    id: 5,
    slug: "/destinations/5",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=900&q=80",
    en: {
      name: "Bahia",
      tagline: "The Heart of Afro-Brazilian Culture",
      desc: "Salvador's historic Pelourinho, Axé music, candomblé, and the most vibrant carnival in Brazil. Bahia is where the soul of Brazil truly lives.",
    },
    es: {
      name: "Bahía",
      tagline: "El Corazón de la Cultura Afro-Brasileña",
      desc: "El histórico Pelourinho de Salvador, música Axé, candomblé, y el carnaval más vibrante de Brasil. Bahía es donde verdaderamente vive el alma de Brasil.",
    },
    pt: {
      name: "Bahia",
      tagline: "O Coração da Cultura Afro-Brasileira",
      desc: "O histórico Pelourinho de Salvador, música Axé, candomblé e o carnaval mais vibrante do Brasil. A Bahia é onde a alma do Brasil verdadeiramente vive.",
    },
  },
  {
    id: 3,
    slug: "/destinations/3",
    image: "https://images.unsplash.com/photo-1516638022313-53b4b7829b7c?w=900&q=80",
    en: {
      name: "Foz do Iguaçu",
      tagline: "One of the World's Greatest Wonders",
      desc: "The most powerful waterfall system on the planet. Iguaçu Falls spans the border of Brazil and Argentina — a spectacle that leaves even the most seasoned traveler breathless.",
    },
    es: {
      name: "Foz do Iguazú",
      tagline: "Una de las Maravillas del Mundo",
      desc: "El sistema de cascadas más poderoso del planeta. Las Cataratas del Iguazú abarcan la frontera entre Brasil y Argentina — un espectáculo que deja sin aliento incluso al viajero más experimentado.",
    },
    pt: {
      name: "Foz do Iguaçu",
      tagline: "Uma das Maiores Maravilhas do Mundo",
      desc: "O sistema de cachoeiras mais poderoso do planeta. As Cataratas do Iguaçu se estendem pela fronteira entre Brasil e Argentina — um espetáculo que tira o fôlego até do viajante mais experiente.",
    },
  },
  {
    id: 9,
    slug: "/destinations/9",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=900&q=80",
    en: {
      name: "Recife",
      tagline: "The Venice of Brazil",
      desc: "Waterways, colonial bridges, stunning beaches, and a frevo carnival unlike anywhere else. Recife and Olinda offer culture and beauty in equal measure.",
    },
    es: {
      name: "Recife",
      tagline: "La Venecia de Brasil",
      desc: "Canales, puentes coloniales, playas impresionantes y un carnaval de frevo único en el mundo. Recife y Olinda ofrecen cultura y belleza a partes iguales.",
    },
    pt: {
      name: "Recife",
      tagline: "A Veneza do Brasil",
      desc: "Canais, pontes coloniais, praias deslumbrantes e um carnaval de frevo único no mundo. Recife e Olinda oferecem cultura e beleza em igual medida.",
    },
  },
  {
    id: 0,
    slug: "/contact",
    image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=900&q=80",
    en: {
      name: "Amazon Rainforest",
      tagline: "The Lungs of the Earth",
      desc: "The world's largest tropical rainforest — 5.5 million square kilometres of wildlife, rivers and ancient life. A once-in-a-lifetime journey into the extraordinary.",
    },
    es: {
      name: "Amazonía",
      tagline: "Los Pulmones de la Tierra",
      desc: "La selva tropical más grande del mundo — 5,5 millones de kilómetros cuadrados de fauna, ríos y vida ancestral. Un viaje único en la vida hacia lo extraordinario.",
    },
    pt: {
      name: "Floresta Amazônica",
      tagline: "Os Pulmões da Terra",
      desc: "A maior floresta tropical do mundo — 5,5 milhões de quilômetros quadrados de fauna, rios e vida ancestral. Uma jornada única na vida rumo ao extraordinário.",
    },
  },
];

const t = {
  en: {
    eyebrow: "Discover Brazil",
    heading: "Six Extraordinary Destinations",
    sub: "Each destination has its own rhythm, its own culture, its own way of staying with you long after you leave.",
    cta: "Explore",
    inquire: "Inquire About This Destination",
  },
  es: {
    eyebrow: "Descubre Brasil",
    heading: "Seis Destinos Extraordinarios",
    sub: "Cada destino tiene su propio ritmo, su propia cultura, su propia manera de quedarse contigo mucho después de que te vayas.",
    cta: "Explorar",
    inquire: "Consultar Este Destino",
  },
  pt: {
    eyebrow: "Descubra o Brasil",
    heading: "Seis Destinos Extraordinários",
    sub: "Cada destino tem seu próprio ritmo, sua própria cultura, sua própria forma de ficar com você muito depois de partir.",
    cta: "Explorar",
    inquire: "Consultar Este Destino",
  },
};

export default function DestinationsPage() {
  const { lang } = useLanguage();
  const l = lang as Lang;
  const tx = t[l];

  useEffect(() => {
    document.title =
      l === "en"
        ? "Destinations | Janeiro Tour & Travel"
        : l === "es"
        ? "Destinos | Janeiro Tour & Travel"
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
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-5">
            {tx.eyebrow}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {tx.heading}
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">
            {tx.sub}
          </p>
        </div>
      </section>

      {/* Destination Cards */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {DESTINATIONS.map((dest, i) => {
            const info = dest[l];
            const isReversed = i % 2 !== 0;
            return (
              <div
                key={dest.id}
                className={`group relative overflow-hidden rounded-3xl flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} min-h-[420px] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500`}
              >
                {/* Image */}
                <div className="relative w-full lg:w-3/5 overflow-hidden min-h-[280px] lg:min-h-0">
                  <img
                    src={dest.image}
                    alt={info.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  {/* Tagline badge */}
                  <div className={`absolute bottom-5 ${isReversed ? "right-5" : "left-5"}`}>
                    <span className="bg-[#FFB600] text-black text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {info.tagline}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`w-full lg:w-2/5 flex flex-col justify-center p-10 lg:p-14 bg-white ${isReversed ? "lg:pr-14 lg:pl-10" : ""}`}>
                  <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">
                    {tx.eyebrow}
                  </p>
                  <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-5 leading-tight">
                    {info.name}
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-8">
                    {info.desc}
                  </p>
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
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">
            {l === "en" ? "Ready to Travel?" : l === "es" ? "¿Listo para Viajar?" : "Pronto para Viajar?"}
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            {l === "en"
              ? "Not sure where to go?"
              : l === "es"
              ? "¿No sabes a dónde ir?"
              : "Não sabe para onde ir?"}
          </h2>
          <p className="text-gray-500 text-base mb-10">
            {l === "en"
              ? "Our team knows every destination inside out. Tell us your travel style and we'll craft the perfect Brazilian journey for you."
              : l === "es"
              ? "Nuestro equipo conoce cada destino a fondo. Cuéntanos tu estilo de viaje y crearemos el viaje perfecto por Brasil para ti."
              : "Nossa equipa conhece cada destino a fundo. Conte-nos o seu estilo de viagem e criaremos a jornada brasileira perfeita para você."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FFB600] hover:bg-[#e6a400] text-black text-sm font-semibold transition-colors cursor-pointer">
                {l === "en" ? "Browse Experiences" : l === "es" ? "Ver Experiencias" : "Ver Experiências"}
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer">
                {l === "en" ? "Talk to Us" : l === "es" ? "Hablar con Nosotros" : "Falar Conosco"}
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
