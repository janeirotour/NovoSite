import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/contexts/CartContext";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Menu, X, ChevronDown, MessageCircle, ShoppingCart, Star, Shield, Globe, Map, BookOpen, Users, Plane, Crown, Clock, Package, MapPin, Gem, Anchor, Wind, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "en" | "es" | "pt" | "fr" | "de" | "no";

const LANGS: [Lang, string, string, string][] = [
  ["en", "EN", "English", "🇬🇧"],
  ["es", "ES", "Español", "🇪🇸"],
  ["pt", "PT", "Português", "🇧🇷"],
  ["fr", "FR", "Français", "🇫🇷"],
  ["de", "DE", "Deutsch", "🇩🇪"],
  ["no", "NO", "Norsk", "🇳🇴"],
];

const TX = {
  en: {
    tours: "Tours", packages: "Packages", guide: "Travel Guide", about: "About", contact: "Contact", book: "Book Now",
    allTours: "All Tours", privateTours: "Private Tours", aerialTours: "Aerial Experiences", transfers: "Airport Transfers",
    allPkgs: "All Packages", rioPkgs: "Rio Packages", luxuryPkgs: "Luxury Packages", familyPkgs: "Family Packages", cruisePkgs: "Cruise Visitors",
    thingsToDo: "Things To Do", destinations: "Destinations", travelTips: "FAQs & Tips",
    aboutUs: "About Us", ourStory: "Our Story", reviews: "Reviews & Testimonials",
    privateSub: "Exclusive tailored experiences", aerialSub: "Helicopter & paragliding", transferSub: "Private door-to-door",
    yearsExp: "10+ Years", tripAdv: "4.9★ TripAdvisor", certified: "Ministry Certified",
    whatsapp: "Chat on WhatsApp", trustMsg: "Trusted by 10,000+ travelers worldwide",
  },
  es: {
    tours: "Tours", packages: "Paquetes", guide: "Guía de Viaje", about: "Nosotros", contact: "Contacto", book: "Reservar",
    allTours: "Todos los Tours", privateTours: "Tours Privados", aerialTours: "Experiencias Aéreas", transfers: "Traslados Aeropuerto",
    allPkgs: "Todos los Paquetes", rioPkgs: "Paquetes Río", luxuryPkgs: "Paquetes de Lujo", familyPkgs: "Paquetes Familiares", cruisePkgs: "Visitantes de Crucero",
    thingsToDo: "Qué Hacer", destinations: "Destinos", travelTips: "Preguntas y Consejos",
    aboutUs: "Sobre Nosotros", ourStory: "Nuestra Historia", reviews: "Reseñas y Testimonios",
    privateSub: "Experiencias exclusivas a medida", aerialSub: "Helicóptero y parapente", transferSub: "Traslado privado puerta a puerta",
    yearsExp: "10+ Años", tripAdv: "4.9★ TripAdvisor", certified: "Certificado Ministerio",
    whatsapp: "Chat en WhatsApp", trustMsg: "Confianza de más de 10.000 viajeros",
  },
  pt: {
    tours: "Tours", packages: "Pacotes", guide: "Guia de Viagem", about: "Sobre Nós", contact: "Contato", book: "Reservar",
    allTours: "Todos os Tours", privateTours: "Tours Privativos", aerialTours: "Experiências Aéreas", transfers: "Transfers Aeroporto",
    allPkgs: "Todos os Pacotes", rioPkgs: "Pacotes Rio", luxuryPkgs: "Pacotes de Luxo", familyPkgs: "Pacotes Família", cruisePkgs: "Visitantes de Cruzeiro",
    thingsToDo: "O Que Fazer", destinations: "Destinos", travelTips: "Perguntas e Dicas",
    aboutUs: "Sobre Nós", ourStory: "Nossa História", reviews: "Avaliações e Depoimentos",
    privateSub: "Experiências exclusivas personalizadas", aerialSub: "Helicóptero e parapente", transferSub: "Transfer privado porta a porta",
    yearsExp: "10+ Anos", tripAdv: "4.9★ TripAdvisor", certified: "Certificado Ministério",
    whatsapp: "Chat no WhatsApp", trustMsg: "Confiança de mais de 10.000 viajantes",
  },
  fr: {
    tours: "Tours", packages: "Forfaits", guide: "Guide Voyage", about: "À Propos", contact: "Contact", book: "Réserver",
    allTours: "Tous les Tours", privateTours: "Tours Privés", aerialTours: "Expériences Aériennes", transfers: "Transferts Aéroport",
    allPkgs: "Tous les Forfaits", rioPkgs: "Forfaits Rio", luxuryPkgs: "Forfaits Luxe", familyPkgs: "Forfaits Famille", cruisePkgs: "Visiteurs de Croisière",
    thingsToDo: "Que Faire", destinations: "Destinations", travelTips: "FAQ & Conseils",
    aboutUs: "À Propos", ourStory: "Notre Histoire", reviews: "Avis et Témoignages",
    privateSub: "Expériences exclusives sur mesure", aerialSub: "Hélicoptère et parapente", transferSub: "Transport privé porte-à-porte",
    yearsExp: "10+ Ans", tripAdv: "4.9★ TripAdvisor", certified: "Certifié Ministère",
    whatsapp: "Chat sur WhatsApp", trustMsg: "Approuvé par plus de 10 000 voyageurs",
  },
  de: {
    tours: "Touren", packages: "Pakete", guide: "Reiseführer", about: "Über Uns", contact: "Kontakt", book: "Jetzt buchen",
    allTours: "Alle Touren", privateTours: "Private Touren", aerialTours: "Lufterlebnisse", transfers: "Flughafentransfers",
    allPkgs: "Alle Pakete", rioPkgs: "Rio-Pakete", luxuryPkgs: "Luxuspakete", familyPkgs: "Familienpakete", cruisePkgs: "Kreuzfahrtgäste",
    thingsToDo: "Aktivitäten", destinations: "Reiseziele", travelTips: "FAQ & Tipps",
    aboutUs: "Über Uns", ourStory: "Unsere Geschichte", reviews: "Bewertungen & Erfahrungen",
    privateSub: "Exklusive maßgeschneiderte Erlebnisse", aerialSub: "Hubschrauber & Gleitschirm", transferSub: "Privater Tür-zu-Tür-Transfer",
    yearsExp: "10+ Jahre", tripAdv: "4.9★ TripAdvisor", certified: "Ministerium zertifiziert",
    whatsapp: "WhatsApp Chat", trustMsg: "Vertraut von über 10.000 Reisenden",
  },
  no: {
    tours: "Turer", packages: "Pakker", guide: "Reiseguide", about: "Om oss", contact: "Kontakt", book: "Bestill nå",
    allTours: "Alle turer", privateTours: "Private turer", aerialTours: "Luftopplevelser", transfers: "Flyplasstransfer",
    allPkgs: "Alle pakker", rioPkgs: "Rio-pakker", luxuryPkgs: "Luksuspakker", familyPkgs: "Familiepakker", cruisePkgs: "Cruisegjester",
    thingsToDo: "Hva du kan gjøre", destinations: "Reisemål", travelTips: "FAQ og tips",
    aboutUs: "Om oss", ourStory: "Vår historie", reviews: "Anmeldelser og attester",
    privateSub: "Eksklusive skreddersydde opplevelser", aerialSub: "Helikopter og paragliding", transferSub: "Privat dør-til-dør-transport",
    yearsExp: "10+ År", tripAdv: "4.9★ TripAdvisor", certified: "Ministersertifisert",
    whatsapp: "Chat på WhatsApp", trustMsg: "Betrodd av over 10 000 reisende",
  },
};

function useHoverMenu(delay = 120) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const onLeave = useCallback(() => {
    timer.current = setTimeout(() => setOpen(false), delay);
  }, [delay]);

  const close = useCallback(() => setOpen(false), []);

  return { open, onEnter, onLeave, close };
}

function DesktopDropdown({
  label, children, isHero,
}: {
  label: string;
  children: React.ReactNode;
  isHero: boolean;
}) {
  const { open, onEnter, onLeave } = useHoverMenu();

  return (
    <div className="relative h-full flex items-center" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        className={cn(
          "flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-md",
          isHero
            ? "text-white/90 hover:text-white hover:bg-white/10"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
          open && (isHero ? "text-white bg-white/10" : "text-gray-900 bg-gray-50")
        )}
      >
        {label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 opacity-60", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-3 transition-all duration-200 z-50",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();
  const l = lang as Lang;
  const { totalItems, openCart } = useCart();
  const t = TX[l];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow:hidden`;
    } else {
      const savedY = parseInt(document.body.dataset.scrollY ?? "0", 10);
      document.body.style.cssText = "";
      delete document.body.dataset.scrollY;
      requestAnimationFrame(() => window.scrollTo(0, savedY));
    }
    return () => {
      const savedY = parseInt(document.body.dataset.scrollY ?? "0", 10);
      document.body.style.cssText = "";
      delete document.body.dataset.scrollY;
      if (savedY) window.scrollTo(0, savedY);
    };
  }, [mobileOpen]);

  const isHero = location === "/" && !isScrolled && !mobileOpen;
  const closeMobile = () => { setMobileOpen(false); setMobileSection(null); };
  const currentLang = LANGS.find(([code]) => code === l)!;

  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isScrolled || mobileOpen
      ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      : isHero
      ? "bg-transparent"
      : "bg-white border-b border-gray-200"
  );

  const linkClass = cn(
    "px-3.5 py-2 text-sm font-medium transition-colors rounded-md",
    isHero
      ? "text-white/90 hover:text-white hover:bg-white/10"
      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  );

  const dropdownBase = "bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden";

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center gap-2">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center mr-2" onClick={closeMobile}>
            <img
              src="/janeiro-logo.png"
              alt="Janeiro Tour & Travel"
              className={cn("h-11 w-auto transition-all", isHero ? "brightness-0 invert" : "")}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "flex";
              }}
            />
            <span className="hidden text-lg font-bold" style={{ display: "none" }}>Janeiro Tour</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex flex-1 items-center h-full">

            {/* TOURS mega-dropdown */}
            <DesktopDropdown label={t.tours} isHero={isHero}>
              <div className={cn(dropdownBase, "w-[520px]")}>
                <div className="grid grid-cols-2 gap-0">
                  {/* Left column — primary links */}
                  <div className="p-4 border-r border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Experiences</p>
                    <Link href="/tours" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Globe className="w-4 h-4 text-primary" /></span>
                      <span><span className="block text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{t.allTours}</span><span className="block text-xs text-gray-500 mt-0.5">Shared &amp; private experiences</span></span>
                    </Link>
                    <Link href="/private-tours" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 group transition-colors">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><Crown className="w-4 h-4 text-amber-600" /></span>
                      <span><span className="block text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{t.privateTours}</span><span className="block text-xs text-gray-500 mt-0.5">{t.privateSub}</span></span>
                    </Link>
                    <Link href="/tours?category=aerial" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 group transition-colors">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0"><Wind className="w-4 h-4 text-emerald-700" /></span>
                      <span><span className="block text-sm font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">{t.aerialTours}</span><span className="block text-xs text-gray-500 mt-0.5">{t.aerialSub}</span></span>
                    </Link>
                    <Link href="/transfers" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4 text-gray-600" /></span>
                      <span><span className="block text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{t.transfers}</span><span className="block text-xs text-gray-500 mt-0.5">{t.transferSub}</span></span>
                    </Link>
                  </div>
                  {/* Right column — featured CTA */}
                  <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Most Popular</p>
                      {[
                        { href: "/tours?category=christ", label: "Christ the Redeemer" },
                        { href: "/tours?category=sugarloaf", label: "Sugarloaf Mountain" },
                        { href: "/tours?category=favela", label: "Favela Experience" },
                        { href: "/tours?category=afro", label: "Afro-Brazilian Culture" },
                      ].map(({ href, label }) => (
                        <Link key={href} href={href} className="flex items-center gap-2 py-2 text-sm text-white/80 hover:text-white transition-colors group">
                          <span className="w-1 h-1 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <Link href="/contact" className="mt-4 block text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Custom Tour →
                    </Link>
                  </div>
                </div>
              </div>
            </DesktopDropdown>

            {/* PACKAGES dropdown */}
            <DesktopDropdown label={t.packages} isHero={isHero}>
              <div className={cn(dropdownBase, "w-60")}>
                <div className="p-2">
                  {[
                    { href: "/packages", label: t.allPkgs, icon: <Package className="w-4 h-4" />, color: "bg-primary/10 text-primary" },
                    { href: "/packages?type=rio", label: t.rioPkgs, icon: <MapPin className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700" },
                    { href: "/packages?type=luxury", label: t.luxuryPkgs, icon: <Gem className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
                    { href: "/packages?type=family", label: t.familyPkgs, icon: <Users className="w-4 h-4" />, color: "bg-orange-100 text-orange-700" },
                    { href: "/packages?type=cruise", label: t.cruisePkgs, icon: <Anchor className="w-4 h-4" />, color: "bg-gray-100 text-gray-600" },
                  ].map(({ href, label, icon, color }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", color)}>{icon}</span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </DesktopDropdown>

            {/* TRAVEL GUIDE dropdown */}
            <DesktopDropdown label={t.guide} isHero={isHero}>
              <div className={cn(dropdownBase, "w-52")}>
                <div className="p-2">
                  {[
                    { href: "/blog", label: t.thingsToDo, icon: <Map className="w-4 h-4" /> },
                    { href: "/destinations", label: t.destinations, icon: <Globe className="w-4 h-4" /> },
                    { href: "/faq", label: t.travelTips, icon: <BookOpen className="w-4 h-4" /> },
                  ].map(({ href, label, icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <span className="text-gray-400 group-hover:text-primary transition-colors">{icon}</span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </DesktopDropdown>

            {/* ABOUT dropdown */}
            <DesktopDropdown label={t.about} isHero={isHero}>
              <div className={cn(dropdownBase, "w-52")}>
                <div className="p-2">
                  {[
                    { href: "/about", label: t.aboutUs, icon: <Users className="w-4 h-4" /> },
                    { href: "/our-story", label: t.ourStory, icon: <Star className="w-4 h-4" /> },
                    { href: "/reviews", label: t.reviews, icon: <Shield className="w-4 h-4" /> },
                  ].map(({ href, label, icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <span className="text-gray-400 group-hover:text-primary transition-colors">{icon}</span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
                {/* Trust badge */}
                <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">4.9 · TripAdvisor</p>
                  <p className="text-xs text-gray-500">10+ years · Ministry certified</p>
                </div>
              </div>
            </DesktopDropdown>

            {/* CONTACT — plain link */}
            <Link href="/contact" className={cn(linkClass, location === "/contact" ? (isHero ? "text-white" : "text-gray-900 bg-gray-50") : "")}>
              {t.contact}
            </Link>
          </nav>

          {/* ── Right side ── */}
          <div className="hidden lg:flex items-center gap-1.5 ml-auto flex-shrink-0">

            {/* Currency */}
            <CurrencySelector isHero={isHero} />

            <div className={cn("w-px h-4 mx-1", isHero ? "bg-white/20" : "bg-gray-200")} />

            {/* Language */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                  isHero ? "text-white/90 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className="text-base leading-none">{currentLang[3]}</span>
                <span className="font-medium">{currentLang[1]}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {LANGS.map(([code, abbr, label, flag]) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors",
                        l === code ? "font-semibold text-gray-900 bg-gray-50" : "text-gray-600"
                      )}
                    >
                      <span className="text-base leading-none">{flag}</span>
                      <span className="text-xs font-bold text-gray-400 w-5">{abbr}</span>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp icon */}
            <a
              href="https://wa.me/5521965297618"
              target="_blank" rel="noopener noreferrer"
              title="WhatsApp"
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isHero ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Cart */}
            <button
              onClick={openCart}
              title="Cart"
              className={cn(
                "relative w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isHero ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* BOOK NOW — primary CTA */}
            <Link href="/tours" className="ml-1">
              <span className={cn(
                "inline-flex items-center px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95",
                isHero
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}>
                {t.book}
              </span>
            </Link>
          </div>

          {/* Mobile: right side (cart + hamburger) */}
          <div className="lg:hidden ml-auto flex items-center gap-2">
            <button
              onClick={openCart}
              className={cn("relative w-9 h-9 rounded-full flex items-center justify-center",
                isHero ? "text-white/90" : "text-gray-700")}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                mobileOpen
                  ? "bg-gray-100 text-gray-900"
                  : isHero
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={closeMobile}
        />

        {/* Slide-in panel */}
        <div
          className={cn(
            "absolute top-[68px] left-0 right-0 bottom-0 bg-white flex flex-col transition-transform duration-300 ease-out",
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          {/* Scrollable nav content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {t.tripAdv}
              </span>
              <span className="w-px h-3 bg-gray-300" />
              <span className="text-xs text-gray-600 font-medium">{t.yearsExp}</span>
              <span className="w-px h-3 bg-gray-300" />
              <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                <Shield className="w-3 h-3 text-green-600" />
                {t.certified}
              </span>
            </div>

            <div className="px-4 py-2">

              {/* TOURS section */}
              <div className="py-1">
                <button
                  onClick={() => setMobileSection(mobileSection === "tours" ? null : "tours")}
                  className="flex items-center justify-between w-full py-3.5 text-base font-semibold text-gray-900"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Globe className="w-4 h-4 text-primary" /></span>
                    {t.tours}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", mobileSection === "tours" && "rotate-180")} />
                </button>
                {mobileSection === "tours" && (
                  <div className="pl-10 pb-2 flex flex-col gap-0.5">
                    {[
                      { href: "/tours", label: t.allTours },
                      { href: "/private-tours", label: t.privateTours },
                      { href: "/tours?category=aerial", label: t.aerialTours },
                      { href: "/transfers", label: t.transfers },
                      { href: "/tours?category=christ", label: "Christ the Redeemer" },
                      { href: "/tours?category=sugarloaf", label: "Sugarloaf Mountain" },
                      { href: "/tours?category=favela", label: "Favela Experience" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href} href={href} onClick={closeMobile}
                        className="py-2.5 text-sm text-gray-600 hover:text-gray-900 active:text-primary border-l-2 border-gray-100 pl-3 transition-colors"
                        style={{ touchAction: "manipulation" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* PACKAGES section */}
              <div className="py-1">
                <button
                  onClick={() => setMobileSection(mobileSection === "packages" ? null : "packages")}
                  className="flex items-center justify-between w-full py-3.5 text-base font-semibold text-gray-900"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="w-4 h-4 text-primary" /></span>
                    {t.packages}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", mobileSection === "packages" && "rotate-180")} />
                </button>
                {mobileSection === "packages" && (
                  <div className="pl-10 pb-2 flex flex-col gap-0.5">
                    {[
                      { href: "/packages", label: t.allPkgs },
                      { href: "/packages?type=rio", label: t.rioPkgs },
                      { href: "/packages?type=luxury", label: t.luxuryPkgs },
                      { href: "/packages?type=family", label: t.familyPkgs },
                      { href: "/packages?type=cruise", label: t.cruisePkgs },
                    ].map(({ href, label }) => (
                      <Link
                        key={href} href={href} onClick={closeMobile}
                        className="py-2.5 text-sm text-gray-600 hover:text-gray-900 active:text-primary border-l-2 border-gray-100 pl-3 transition-colors"
                        style={{ touchAction: "manipulation" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* TRAVEL GUIDE section */}
              <div className="py-1">
                <button
                  onClick={() => setMobileSection(mobileSection === "guide" ? null : "guide")}
                  className="flex items-center justify-between w-full py-3.5 text-base font-semibold text-gray-900"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-emerald-600" /></span>
                    {t.guide}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", mobileSection === "guide" && "rotate-180")} />
                </button>
                {mobileSection === "guide" && (
                  <div className="pl-10 pb-2 flex flex-col gap-0.5">
                    {[
                      { href: "/blog", label: t.thingsToDo },
                      { href: "/destinations", label: t.destinations },
                      { href: "/faq", label: t.travelTips },
                    ].map(({ href, label }) => (
                      <Link
                        key={href} href={href} onClick={closeMobile}
                        className="py-2.5 text-sm text-gray-600 hover:text-gray-900 active:text-primary border-l-2 border-gray-100 pl-3 transition-colors"
                        style={{ touchAction: "manipulation" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* ABOUT section */}
              <div className="py-1">
                <button
                  onClick={() => setMobileSection(mobileSection === "about" ? null : "about")}
                  className="flex items-center justify-between w-full py-3.5 text-base font-semibold text-gray-900"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Star className="w-4 h-4 text-amber-500" /></span>
                    {t.about}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", mobileSection === "about" && "rotate-180")} />
                </button>
                {mobileSection === "about" && (
                  <div className="pl-10 pb-2 flex flex-col gap-0.5">
                    {[
                      { href: "/about", label: t.aboutUs },
                      { href: "/our-story", label: t.ourStory },
                      { href: "/reviews", label: t.reviews },
                    ].map(({ href, label }) => (
                      <Link
                        key={href} href={href} onClick={closeMobile}
                        className="py-2.5 text-sm text-gray-600 hover:text-gray-900 active:text-primary border-l-2 border-gray-100 pl-3 transition-colors"
                        style={{ touchAction: "manipulation" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* CONTACT direct link */}
              <Link
                href="/contact" onClick={closeMobile}
                className="flex items-center gap-2.5 py-3.5 text-base font-semibold text-gray-900"
                style={{ touchAction: "manipulation" }}
              >
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Phone className="w-4 h-4 text-gray-600" /></span>
                {t.contact}
              </Link>
            </div>

            {/* Language picker */}
            <div className="px-4 pt-2 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Language</p>
              <div className="grid grid-cols-3 gap-2">
                {LANGS.map(([code, abbr, , flag]) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    style={{ touchAction: "manipulation" }}
                    className={cn(
                      "py-2.5 px-1 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors",
                      l === code
                        ? "bg-gray-900 text-white border-gray-900"
                        : "text-gray-600 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-sm">{flag}</span>
                    {abbr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky bottom CTA bar */}
          <div className="border-t border-gray-100 px-4 py-3 bg-white flex gap-2.5 flex-shrink-0">
            <a
              href="https://wa.me/5521965297618"
              target="_blank" rel="noopener noreferrer"
              style={{ touchAction: "manipulation" }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold active:bg-green-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link href="/tours" onClick={closeMobile} className="flex-[2]" style={{ touchAction: "manipulation" }}>
              <span className="flex items-center justify-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:bg-primary/90 transition-colors">
                {t.book} →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
