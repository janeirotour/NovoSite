import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X, ChevronDown, Globe, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "en" | "es" | "pt";

const destinations = [
  { href: "/destinations/1", en: "Rio de Janeiro", es: "Río de Janeiro", pt: "Rio de Janeiro" },
  { href: "/destinations/2", en: "São Paulo", es: "São Paulo", pt: "São Paulo" },
  { href: "/destinations/5", en: "Bahia", es: "Bahía", pt: "Bahia" },
  { href: "/destinations/3", en: "Foz do Iguaçu", es: "Foz do Iguazú", pt: "Foz do Iguaçu" },
  { href: "/destinations/9", en: "Recife", es: "Recife", pt: "Recife" },
];

const experiences = [
  { href: "/tours", en: "All Experiences", es: "Todas las Experiencias", pt: "Todas as Experiências" },
  { href: "/tours?category=private", en: "Private Tours", es: "Tours Privados", pt: "Tours Privativos" },
  { href: "/tours?category=culture", en: "Cultural Experiences", es: "Experiencias Culturales", pt: "Experiências Culturais" },
  { href: "/tours?category=nature", en: "Adventure Experiences", es: "Experiencias de Aventura", pt: "Experiências de Aventura" },
  { href: "/tours?category=transfer", en: "Airport Transfers", es: "Traslados Aeropuerto", pt: "Traslados Aeroporto" },
];

const about = [
  { href: "/about", en: "Our Story", es: "Nuestra Historia", pt: "Nossa História" },
  { href: "/about#why-us", en: "Why Travel With Us", es: "¿Por qué Viajar con Nosotros?", pt: "Por que Viajar Conosco?" },
  { href: "/about#reviews", en: "Reviews", es: "Reseñas", pt: "Avaliações" },
];

function NavDropdown({
  label,
  items,
  lang,
  isHero,
  onNavigate,
}: {
  label: string;
  items: Array<{ href: string; en: string; es: string; pt: string }>;
  lang: Lang;
  isHero: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm transition-colors",
          isHero
            ? "text-white/90 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        {label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { setOpen(false); onNavigate(); }}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {item[lang]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();
  const l = lang as Lang;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHero = location === "/" && !isScrolled && !mobileOpen;

  const navLink = cn(
    "px-3 py-2 text-sm transition-colors",
    isHero ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"
  );

  const t = {
    en: { home: "Home", guide: "Travel Guide", contact: "Contact", book: "Book Now", dest: "Destinations", exp: "Experiences", about: "About Us" },
    es: { home: "Inicio", guide: "Guía de Viaje", contact: "Contacto", book: "Reservar", dest: "Destinos", exp: "Experiencias", about: "Nosotros" },
    pt: { home: "Início", guide: "Guia de Viagem", contact: "Contato", book: "Reservar", dest: "Destinos", exp: "Experiências", about: "Sobre Nós" },
  }[l];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isHero
            ? "bg-transparent"
            : "bg-white border-b border-gray-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" onClick={() => setMobileOpen(false)}>
            <img
              src="/janeiro-logo.png"
              alt="Janeiro Tour"
              className={cn("h-8 w-auto transition-all", isHero ? "brightness-0 invert" : "")}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "flex";
              }}
            />
            <span className="hidden text-lg font-bold" style={{ display: "none" }}>
              Janeiro Tour
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 items-center gap-0">
            <Link href="/">
              <span className={cn(navLink, location === "/" && !isHero ? "text-gray-900 font-medium" : "")}>{t.home}</span>
            </Link>
            <NavDropdown
              label={t.dest}
              items={destinations}
              lang={l}
              isHero={isHero}
              onNavigate={() => setMobileOpen(false)}
            />
            <NavDropdown
              label={t.exp}
              items={experiences}
              lang={l}
              isHero={isHero}
              onNavigate={() => setMobileOpen(false)}
            />
            <NavDropdown
              label={t.about}
              items={about}
              lang={l}
              isHero={isHero}
              onNavigate={() => setMobileOpen(false)}
            />
            <Link href="/blog">
              <span className={cn(navLink, location === "/blog" ? "text-gray-900 font-medium" : "")}>{t.guide}</span>
            </Link>
            <Link href="/contact">
              <span className={cn(navLink, location === "/contact" ? "text-gray-900 font-medium" : "")}>{t.contact}</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {/* Language */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                  isHero ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{l.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {([["en","🇬🇧 English"],["es","🇪🇸 Español"],["pt","🇧🇷 Português"]] as [Lang,string][]).map(([code, label]) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                      className={cn(
                        "flex w-full items-center px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors",
                        l === code ? "font-semibold text-gray-900" : "text-gray-600"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className={cn("w-px h-4", isHero ? "bg-white/20" : "bg-gray-200")} />

            {/* WhatsApp */}
            <a
              href="https://wa.me/5521972633333"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isHero ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Book Now */}
            <Link href="/tours">
              <span className={cn(
                "ml-1 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer",
                isHero
                  ? "border-white/50 text-white hover:bg-white hover:text-gray-900"
                  : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              )}>
                {t.book}
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn("lg:hidden ml-auto p-2 rounded-md transition-colors", isHero ? "text-white" : "text-gray-700 hover:bg-gray-50")}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto">
            <nav className="flex flex-col divide-y divide-gray-100">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-sm text-gray-700 hover:bg-gray-50">{t.home}</Link>

              {[
                { key: "dest", label: t.dest, items: destinations },
                { key: "exp", label: t.exp, items: experiences },
                { key: "about", label: t.about, items: about },
              ].map(({ key, label, items }) => (
                <div key={key}>
                  <button
                    className="flex items-center justify-between w-full px-6 py-4 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                  >
                    {label}
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", mobileExpanded === key && "rotate-180")} />
                  </button>
                  {mobileExpanded === key && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {items.map((item) => (
                        <Link key={item.href} href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-8 py-3 text-sm text-gray-600 hover:bg-gray-100">
                          {item[l]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link href="/blog" onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-sm text-gray-700 hover:bg-gray-50">{t.guide}</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-sm text-gray-700 hover:bg-gray-50">{t.contact}</Link>

              <div className="px-6 py-5 flex flex-col gap-3">
                <div className="flex gap-2">
                  {(["en","es","pt"] as Lang[]).map((code) => (
                    <button key={code} onClick={() => setLang(code)}
                      className={cn("flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                        l === code ? "bg-gray-900 text-white border-gray-900" : "text-gray-600 border-gray-200 hover:border-gray-400"
                      )}>
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
                <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-green-200 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </a>
                <Link href="/tours" onClick={() => setMobileOpen(false)}>
                  <span className="flex items-center justify-center py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
                    {t.book}
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
