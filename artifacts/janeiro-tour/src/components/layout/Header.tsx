import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X, ChevronDown, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Lang = "en" | "es" | "pt";
type LabelMap = Record<Lang, string>;

interface NavItem { href: string; label: LabelMap; }
interface NavGroup { label: LabelMap; items: NavItem[]; }

const toursGroup: NavGroup = {
  label: { en: "Tours", es: "Tours", pt: "Passeios" },
  items: [
    { href: "/tours", label: { en: "All Tours", es: "Todos los Tours", pt: "Todos os Passeios" } },
    { href: "/tours?category=private", label: { en: "Private Tours", es: "Tours Privados", pt: "Tours Privativos" } },
    { href: "/tours?category=culture", label: { en: "Cultural Experiences", es: "Experiencias Culturales", pt: "Experiências Culturais" } },
    { href: "/tours?category=nature", label: { en: "Adventure Experiences", es: "Aventura y Naturaleza", pt: "Aventura e Natureza" } },
    { href: "/tours?category=transfer", label: { en: "Airport Transfers", es: "Traslados al Aeropuerto", pt: "Traslados Aeroporto" } },
    { href: "/tours?category=package", label: { en: "Multi-Day Packages", es: "Paquetes Multi-Día", pt: "Pacotes Multi-Dias" } },
  ],
};

const destinationsGroup: NavGroup = {
  label: { en: "Destinations", es: "Destinos", pt: "Destinos" },
  items: [
    { href: "/destinations/1", label: { en: "Rio de Janeiro", es: "Río de Janeiro", pt: "Rio de Janeiro" } },
    { href: "/destinations/2", label: { en: "São Paulo", es: "São Paulo", pt: "São Paulo" } },
    { href: "/destinations/5", label: { en: "Bahia", es: "Bahía", pt: "Bahia" } },
    { href: "/destinations/3", label: { en: "Foz do Iguaçu", es: "Foz do Iguazú", pt: "Foz do Iguaçu" } },
    { href: "/destinations", label: { en: "All Destinations", es: "Todos los Destinos", pt: "Todos os Destinos" } },
  ],
};

const aboutGroup: NavGroup = {
  label: { en: "About Us", es: "Nosotros", pt: "Sobre Nós" },
  items: [
    { href: "/about", label: { en: "Our Story", es: "Nuestra Historia", pt: "Nossa História" } },
    { href: "/about#why-us", label: { en: "Why Choose Us", es: "¿Por qué Elegirnos?", pt: "Por que nos Escolher?" } },
    { href: "/about#sustainability", label: { en: "Sustainability", es: "Sostenibilidad", pt: "Sustentabilidade" } },
    { href: "/about#reviews", label: { en: "Reviews & Testimonials", es: "Reseñas", pt: "Avaliações" } },
  ],
};

const guideGroup: NavGroup = {
  label: { en: "Travel Guide", es: "Guía de Viaje", pt: "Guia de Viagem" },
  items: [
    { href: "/blog", label: { en: "Brazil Travel Guide", es: "Guía de Brasil", pt: "Guia do Brasil" } },
    { href: "/blog?q=rio", label: { en: "Rio de Janeiro Guide", es: "Guía de Río", pt: "Guia do Rio" } },
    { href: "/blog?q=bahia", label: { en: "Bahia Guide", es: "Guía de Bahía", pt: "Guia da Bahia" } },
    { href: "/blog?q=iguazu", label: { en: "Foz do Iguaçu Guide", es: "Guía de Iguazú", pt: "Guia do Iguaçu" } },
    { href: "/blog?q=tips", label: { en: "Travel Tips", es: "Consejos de Viaje", pt: "Dicas de Viagem" } },
  ],
};

const navGroups: NavGroup[] = [toursGroup, destinationsGroup, aboutGroup, guideGroup];

function DropdownPanel({ group, lang, onClose }: { group: NavGroup; lang: Lang; onClose?: () => void }) {
  return (
    <ul className="grid gap-0.5 py-1 w-52">
      {group.items.map((item) => (
        <li key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              href={item.href}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md transition-colors font-medium"
            >
              {item.label[lang]}
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { lang, setLang } = useLanguage();
  const l = lang as Lang;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHero = location === "/" && !isScrolled && !mobileOpen;
  const headerBg = isHero
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100";
  const textColor = isHero ? "text-white" : "text-gray-800";
  const hoverColor = isHero ? "hover:text-primary" : "hover:text-primary";

  const ctaLabels: Record<Lang, string> = { en: "Book Now", es: "Reservar", pt: "Reservar" };
  const langLabels: Record<Lang, string> = { en: "EN", es: "ES", pt: "PT" };

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", headerBg)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center z-50" onClick={() => setMobileOpen(false)}>
            <img
              src="/janeiro-logo.png"
              alt="Janeiro Tour & Travel"
              className={cn("h-10 w-auto transition-all", isHero ? "brightness-0 invert" : "")}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (next) next.style.display = "flex";
              }}
            />
            <span
              className={cn("hidden items-center gap-1 font-bold text-xl tracking-tight", textColor)}
              style={{ display: "none" }}
            >
              <span className="text-[#009743]">Janeiro</span>
              <span className={isHero ? "text-white" : "text-gray-700"}>Tour</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {/* Home */}
                <NavigationMenuItem>
                  <Link href="/">
                    <span className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer inline-block",
                      textColor, hoverColor,
                      location === "/" && "text-primary"
                    )}>
                      {l === "en" ? "Home" : l === "es" ? "Inicio" : "Início"}
                    </span>
                  </Link>
                </NavigationMenuItem>

                {/* Dropdown Groups */}
                {navGroups.map((group) => (
                  <NavigationMenuItem key={group.label.en}>
                    <NavigationMenuTrigger
                      className={cn(
                        "px-4 py-2 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent transition-colors",
                        textColor, hoverColor,
                        "data-[state=open]:text-primary"
                      )}
                    >
                      {group.label[l]}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="rounded-xl shadow-xl border border-gray-100 bg-white overflow-hidden">
                        <DropdownPanel group={group} lang={l} />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                {/* Contact (no dropdown) */}
                <NavigationMenuItem>
                  <Link href="/contact">
                    <span className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer inline-block",
                      textColor, hoverColor,
                      location === "/contact" && "text-primary"
                    )}>
                      {l === "en" ? "Contact" : l === "es" ? "Contacto" : "Contato"}
                    </span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("gap-1.5 rounded-full h-9 px-3 font-medium text-sm", textColor, "hover:bg-white/10 hover:text-primary")}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {langLabels[l]}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setLang("en")} className={l === "en" ? "text-primary font-semibold" : ""}>
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("es")} className={l === "es" ? "text-primary font-semibold" : ""}>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("pt")} className={l === "pt" ? "text-primary font-semibold" : ""}>
                  🇧🇷 Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5521972633333"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                isHero ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              )}
              title="WhatsApp"
            >
              <MessageCircle className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </a>

            {/* Book Now CTA */}
            <Link href="/tours">
              <Button
                size="sm"
                className="ml-1 rounded-full px-5 h-9 font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black shadow-none border-0 text-sm"
              >
                {ctaLabels[l]}
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={cn("lg:hidden z-50 p-2 rounded-md transition-colors", textColor)}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[72px] left-0 right-0 bottom-0 bg-white overflow-y-auto">
            <nav className="flex flex-col divide-y divide-gray-100">

              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50"
              >
                {l === "en" ? "Home" : l === "es" ? "Inicio" : "Início"}
              </Link>

              {/* Dropdown Groups */}
              {navGroups.map((group) => (
                <div key={group.label.en}>
                  <button
                    className="flex items-center justify-between w-full px-6 py-4 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50"
                    onClick={() => setMobileExpanded(mobileExpanded === group.label.en ? null : group.label.en)}
                  >
                    <span>{group.label[l]}</span>
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", mobileExpanded === group.label.en && "rotate-180")} />
                  </button>
                  {mobileExpanded === group.label.en && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-8 py-3 text-sm text-gray-600 hover:text-primary hover:bg-primary/5"
                        >
                          {item.label[l]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50"
              >
                {l === "en" ? "Contact" : l === "es" ? "Contacto" : "Contato"}
              </Link>

              {/* Bottom Actions */}
              <div className="px-6 py-5 flex flex-col gap-3">
                {/* Language */}
                <div className="flex gap-2">
                  {(["en", "es", "pt"] as Lang[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); }}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                        l === code
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                      )}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
                {/* WhatsApp + Book Now */}
                <a
                  href="https://wa.me/5521972633333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-green-200 text-green-700 font-medium text-sm hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <Link href="/tours" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-12 rounded-xl font-semibold text-base bg-[#FFB600] hover:bg-[#e6a400] text-black">
                    {ctaLabels[l]}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
