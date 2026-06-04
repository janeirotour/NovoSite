import { useLanguage } from "@/hooks/use-language";
import { useGetSettings } from "@workspace/api-client-react";
import { SearchWidget } from "@/components/ui/search-widget";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    src: "/images/banner-janeiro.jpg",
    alt: "Janeiro Tour group at Cristo Redentor",
    positionY: "center",
  },
  {
    src: "/images/exp-christ.png",
    alt: "Cristo Redentor — Rio de Janeiro",
    positionY: "center",
  },
  {
    src: "/images/hero-rio.png",
    alt: "Pão de Açúcar — Rio de Janeiro",
    positionY: "center",
  },
  {
    src: "/images/hero-iguazu.png",
    alt: "Foz do Iguaçu — Cataratas",
    positionY: "bottom",
  },
  {
    src: "/images/dest-salvador.png",
    alt: "Bahia — Salvador",
    positionY: "center",
  },
  {
    src: "/images/dest-amazon.png",
    alt: "Amazônia — Floresta Tropical",
    positionY: "center",
  },
];

export function HeroSection() {
  const { t, lang } = useLanguage();
  const { data: settings } = useGetSettings();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const headline = t(settings, "heroHeadline",
    lang === "en" ? "Brazil Through the Eyes of Those Who Love It" :
    lang === "es" ? "Brasil a Través de los Ojos de Quienes lo Aman" :
    "Brasil pelos Olhos de Quem o Ama"
  );

  const subheadline = t(settings, "heroSubheadline",
    lang === "en" ? "Real places. Real people. Experiences that stay with you long after you leave." :
    lang === "es" ? "Lugares reales. Personas reales. Experiencias que permanecen contigo mucho después de partir." :
    "Lugares reais. Pessoas reais. Experiências que ficam com você muito depois de partir."
  );

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((index + slides.length) % slides.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(current + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <div className="relative">
      <div className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">

        {/* Slides */}
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{
              objectPosition: `center ${slide.positionY}`,
              opacity: i === current ? (fading ? 0 : 1) : 0,
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 z-10" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-28 md:pb-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto left-0 right-0">
          <div className="max-w-3xl">
            <p className="text-[#FFB600] font-semibold text-sm md:text-base tracking-widest uppercase mb-4 drop-shadow">
              Janeiro Tour &amp; Travel
            </p>
            <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-5 drop-shadow-lg">
              {headline}
            </h1>
            <p className="text-white/85 text-lg md:text-xl max-w-xl mb-8 leading-relaxed drop-shadow">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/tours">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black shadow-lg border-0"
                >
                  {lang === "en" ? "Explore Experiences" : lang === "es" ? "Explorar Experiencias" : "Explorar Experiências"}
                </Button>
              </Link>
              <Link href="/destinations">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 py-6 text-base font-semibold text-white border border-white/40 hover:bg-white/15 hover:border-white/60 backdrop-blur-sm gap-2"
                >
                  {lang === "en" ? "Discover Brazil" : lang === "es" ? "Descubrir Brasil" : "Descobrir o Brasil"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            onClick={() => goTo(current - 1)}
            className="w-7 h-7 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
          <button
            onClick={() => goTo(current + 1)}
            className="w-7 h-7 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="bg-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="flex text-[#FFB600]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-white font-semibold text-sm">
              {lang === "en"
                ? "Trusted by travelers from around the world"
                : lang === "es"
                ? "La confianza de viajeros de todo el mundo"
                : "Confiado por viajantes do mundo inteiro"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/50 text-xs">
            <span className="w-px h-4 bg-white/20" />
            <span className="text-white/70">🇺🇸 🇬🇧 🇿🇦 🇨🇦 🇫🇷 🇩🇪 🇦🇺 🇧🇷 🇯🇵</span>
            <span className="text-white/50">+50 countries</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <SearchWidget />
      </div>
    </div>
  );
}
