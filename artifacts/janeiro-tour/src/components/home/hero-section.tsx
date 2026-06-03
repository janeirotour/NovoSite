import { useLanguage } from "@/hooks/use-language";
import { useGetSettings } from "@workspace/api-client-react";
import { SearchWidget } from "@/components/ui/search-widget";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE = "/images/hero-janeirotour.webp";
const HERO_FALLBACK = "https://janeirotour.com/wp-content/uploads/2025/10/IMG_2261-scaled-1.webp";

export function HeroSection() {
  const { t, lang } = useLanguage();
  const { data: settings } = useGetSettings();

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

  return (
    <div className="relative">
      <div className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Janeiro Tour — Brazil Travel"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = HERO_FALLBACK;
          }}
        />

        {/* Gradient overlay — bottom-heavy for text readability, subtle at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-28 md:pb-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto left-0 right-0">
          <div className="max-w-3xl">
            <p className="text-primary font-semibold text-sm md:text-base tracking-widest uppercase mb-4 drop-shadow">
              {lang === "en" ? "Janeiro Tour & Travel" : lang === "es" ? "Janeiro Tour & Travel" : "Janeiro Tour & Travel"}
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
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <SearchWidget />
      </div>
    </div>
  );
}
