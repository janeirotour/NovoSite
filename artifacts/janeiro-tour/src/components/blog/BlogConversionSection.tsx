import { Link } from "wouter";
import { Crown, Car, Package, Globe, MapPin, ExternalLink, Plane, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSettings } from "@workspace/api-client-react";

export interface BlogConversionService {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export interface BlogConversionCta {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

export interface AffiliateCard {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  url: string;
}

export interface BlogConversionData {
  promoEnabled: boolean;
  promoTitle: string;
  promoDescription: string;
  promoServices: BlogConversionService[];
  promoDestinations: string[];
  promoCtas: BlogConversionCta[];
  affiliatesEnabled: boolean;
  affiliatesTitle: string;
  affiliatesDescription: string;
  affiliateCards: AffiliateCard[];
}

export const DEFAULT_BLOG_CONVERSION: BlogConversionData = {
  promoEnabled: true,
  promoTitle: "Plan Your Trip with Janeiro Tour & Travel",
  promoDescription:
    "Looking for unforgettable experiences in Brazil? Janeiro Tour & Travel offers carefully curated tours, private experiences, airport transfers, travel packages and customized itineraries designed for international travelers seeking authentic experiences across Brazil.",
  promoServices: [
    { icon: "Crown", title: "Private Tours", description: "Personalized experiences with expert local guides and flexible itineraries.", href: "/private-tours" },
    { icon: "Car", title: "Airport Transfers", description: "Reliable private transportation between airports, hotels and destinations.", href: "/transfers" },
    { icon: "Package", title: "Travel Packages", description: "Multi-day itineraries designed to help travelers discover the best of Brazil.", href: "/packages" },
    { icon: "Globe", title: "Cultural Experiences", description: "Authentic local experiences, walking tours and immersive cultural activities.", href: "/tours" },
  ],
  promoDestinations: ["Rio de Janeiro", "São Paulo", "Bahia", "Recife", "Foz do Iguaçu", "Amazon Rainforest"],
  promoCtas: [
    { label: "Explore Experiences", href: "/tours", variant: "primary" },
    { label: "View Travel Packages", href: "/packages", variant: "outline" },
    { label: "Contact Our Team", href: "/contact", variant: "outline" },
  ],
  affiliatesEnabled: true,
  affiliatesTitle: "Travel Resources for Your Trip to Brazil",
  affiliatesDescription:
    "Planning your trip to Brazil? Here are our recommended travel resources for flights, hotels, car rentals and international payments.",
  affiliateCards: [
    {
      id: "car-rental",
      enabled: true,
      title: "Car Rental in Brazil",
      description: "Compare prices from major car rental companies and find the best option for your trip.",
      buttonLabel: "Compare Car Rentals",
      url: "https://www.rentcars.com/en/?requestorid=2308&utm_source=janeirotour.com&utm_medium=afiliado-link",
    },
    {
      id: "flights-hotels",
      enabled: true,
      title: "Flights & Hotels",
      description: "Search for flights, hotels and travel deals for your trip to Brazil.",
      buttonLabel: "Search Flights & Hotels",
      url: "https://expedia.com/affiliates/expedia-home.SKrg7Z1",
    },
    {
      id: "wise",
      enabled: true,
      title: "International Travel Card",
      description: "Save money on international payments and currency exchange while traveling.",
      buttonLabel: "Get Wise",
      url: "https://wise.com/invite/ilpc/dandarad12",
    },
  ],
};

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Crown, Car, Package, Globe, MapPin, Plane, CreditCard,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = SERVICE_ICONS[name] ?? Globe;
  return <Icon className="w-5 h-5" />;
}

const AFFILIATE_ICONS: Record<string, React.ElementType> = {
  "car-rental": Car,
  "flights-hotels": Plane,
  "wise": CreditCard,
};

export function BlogConversionSection() {
  const { data: settings } = useGetSettings();

  const data: BlogConversionData = (() => {
    const raw = (settings as { blogConversionData?: unknown } | undefined)?.blogConversionData;
    if (raw && typeof raw === "object") {
      return { ...DEFAULT_BLOG_CONVERSION, ...(raw as Partial<BlogConversionData>) };
    }
    return DEFAULT_BLOG_CONVERSION;
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

      {/* ── Section 1: Janeiro Tour Promo ─────────────────────────────── */}
      {data.promoEnabled && (
        <div className="rounded-2xl border border-[#009743]/20 bg-gradient-to-br from-[#009743]/5 to-transparent overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#009743] flex items-center justify-center shrink-0 mt-0.5">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{data.promoTitle}</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{data.promoDescription}</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
              {data.promoServices.map((svc) => (
                <Link key={svc.href} href={svc.href}
                  className="group flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-[#009743]/40 hover:shadow-sm transition-all">
                  <span className="w-8 h-8 rounded-lg bg-[#009743]/10 flex items-center justify-center text-[#009743] shrink-0">
                    <ServiceIcon name={svc.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#009743] transition-colors leading-tight">{svc.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{svc.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#009743] transition-colors shrink-0 mt-0.5 ml-auto" />
                </Link>
              ))}
            </div>

            {/* Destinations */}
            {data.promoDestinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {data.promoDestinations.map((dest) => (
                  <span key={dest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    <MapPin className="w-3 h-3 text-[#009743]" />
                    {dest}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {data.promoCtas.map((cta) =>
                cta.variant === "primary" ? (
                  <Link key={cta.href} href={cta.href}>
                    <Button size="sm" className="bg-[#009743] hover:bg-[#007a36] text-white h-9 px-5">
                      {cta.label}
                    </Button>
                  </Link>
                ) : (
                  <Link key={cta.href} href={cta.href}>
                    <Button size="sm" variant="outline" className="h-9 px-5 border-[#009743]/40 text-[#009743] hover:bg-[#009743]/5">
                      {cta.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Section 2: Affiliate Resources ────────────────────────────── */}
      {data.affiliatesEnabled && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/60 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground mb-1">{data.affiliatesTitle}</h2>
            <p className="text-sm text-muted-foreground mb-5">{data.affiliatesDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.affiliateCards.filter((c) => c.enabled).map((card) => {
                const Icon = AFFILIATE_ICONS[card.id] ?? Globe;
                return (
                  <div key={card.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{card.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{card.description}</p>
                    <a
                      href={card.url}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                    >
                      {card.buttonLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-gray-400 mt-4">
              * Some links above may be affiliate links. We only recommend services we trust.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
