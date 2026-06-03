import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useGetSettings } from "@workspace/api-client-react";
import { SearchWidget } from "@/components/ui/search-widget";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HERO_IMAGES = [
  "/images/hero-rio.png",
  "/images/hero-iguazu.png",
];

export function HeroSection() {
  const { t, lang } = useLanguage();
  const { data: settings } = useGetSettings();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const headline = t(settings, "heroHeadline", "Discover the Best of Brazil");
  const subheadline = t(settings, "heroSubheadline", "Premium tours, private experiences, and seamless transfers.");
  const primaryCta = t(settings, "heroPrimaryCtaText", "Book Now");
  const secondaryCta = t(settings, "heroSecondaryCtaText", "Explore Destinations");

  return (
    <div className="relative">
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={img}
              alt="Brazil Travel"
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white font-serif font-bold text-5xl md:text-7xl lg:text-8xl max-w-5xl leading-tight mb-6 drop-shadow-lg">
            {headline}
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl mb-10 font-medium drop-shadow-md">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tours">
              <Button size="lg" className="px-8 py-6 text-lg font-bold rounded-full">
                {primaryCta}
              </Button>
            </Link>
            <Link href="/destinations">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-bold rounded-full bg-white/10 border-white text-white hover:bg-white hover:text-foreground backdrop-blur-sm">
                {secondaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-30">
        <SearchWidget />
      </div>
    </div>
  );
}
