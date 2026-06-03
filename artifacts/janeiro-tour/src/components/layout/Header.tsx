import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X, ChevronDown, Globe, MessageCircle } from "lucide-react";
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

const destinationsGroup: NavGroup = {
  label: { en: "Destinations", es: "Destinos", pt: "Destinos" },
  items: [
    { href: "/destinations/1", label: { en: "Rio de Janeiro", es: "Río de Janeiro", pt: "Rio de Janeiro" } },
    { href: "/destinations/2", label: { en: "São Paulo", es: "São Paulo", pt: "São Paulo" } },
    { href: "/destinations/5", label: { en: "Bahia", es: "Bahía", pt: "Bahia" } },
    { href: "/destinations/3", label: { en: "Foz do Iguaçu", es: "Foz do Iguazú", pt: "Foz do Iguaçu" } },
    { href: "/destinations/9", label: { en: "Recife", es: "Recife", pt: "Recife" } },
  ],
};

const experiencesGroup: NavGroup = {
  label: { en: "Experiences", es: "Experiencias", pt: "Experiências" },
  items: [
    { href: "/tours", label: { en: "All Experiences", es: "Todas las Experiencias", pt: "Todas as Experiências" } },
    { href: "/tours?category=private", label: { en: "Private Tours", es: "Tours Privados", pt: "Tours Privativos" } },
    { href: "/tours?category=culture", label: { en: "Cultural Experiences", es: "Experiencias Culturales", pt: "Experiências Culturais" } },
    { href: "/tours?category=nature", label: { en: "Adventure Experiences", es: "Experiencias de Aventura", pt: "Experiências de Aventura" } },
    { href: "/tours?category=transfer", label: { en: "Airport Transfers", es: "Traslados Aeropuerto", pt: "Traslados Aeroporto" } },
  ],
};

const aboutGroup: NavGroup = {
  label: { en: "About Us", es: "Nosotros", pt: "Sobre Nós" },
  items: [
    { href: "/about", label: { en: "Our Story", es: "Nuestra Historia", pt: "Nossa História" } },
    { href: "/about#why-us", label: { en: "Why Travel With Us", es: "¿Por qué Viajar con Nosotros?", pt: "Por que Viajar Conosco?" } },
    { href: "/about#reviews", label: { en: "Reviews", es: "Reseñas", pt: "Avaliações" } },
  ],
};

const navGroups: NavGroup[] = [destinationsGroup, experiencesGroup, aboutGroup];

function DropdownPanel({ group, lang, onClose }: { group: NavGroup; lang: Lang; onClose?: () => void }) {
  return (
    <ul className="grid gap-0 py-2 w-56">
      {group.items.map((item) => (
        <li key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              href={item.href}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { lang, setLang } = useLanguage();
  const l = lang as Lang;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const ctaLabels: Record<Lang, string> = { en: "Book Now", es: "Reservar", pt: "Reservar" };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center z-50" onClick={() => setMobileOpen(false)}>
            <img
              src="/janeiro-logo.png"
              alt="Janeiro Tour & Travel"
              className="h-8 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (next) next.style.display = "flex";
              }}
            />
            <span
              className="hidden items-center gap-1 font-bold text-lg tracking-tight text-gray-800"
              style={{ display: "none" }}
            >
              <span className="text-[#009743]">Janeiro</span>
              <span>Tour</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {/* Home */}
                <NavigationMenuItem>
                  <Link href="/">
                    <span className={cn(
                      "px-3 py-2 text-sm transition-colors cursor-pointer inline-block text-gray-600 hover:text-gray-900",
                      location === "/" && "text-gray-900 font-medium"
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
                        "px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-gray-900 transition-colors font-normal h-auto"
                      )}
                    >
                      {group.label[l]}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden">
                        <DropdownPanel group={group} lang={l} />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                {/* Travel Guide */}
                <NavigationMenuItem>
                  <Link href="/blog">
                    <span className={cn(
                      "px-3 py-2 text-sm transition-colors cursor-pointer inline-block text-gray-600 hover:text-gray-900",
                      location === "/blog" && "text-gray-900 font-medium"
                    )}>
                      {l === "en" ? "Travel Guide" : l === "es" ? "Guía de Viaje" : "Guia de Viagem"}
                    </span>
                  </Link>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <Link href="/contact">
                    <span className={cn(
                      "px-3 py-2 text-sm transition-colors cursor-pointer inline-block text-gray-600 hover:text-gray-900",
                      location === "/contact" && "text-gray-900 font-medium"
                    )}>
                      {l === "en" ? "Contact" : l === "es" ? "Contacto" : "Contato"}
                    </span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="font-medium">{l.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[130px]">
                <DropdownMenuItem onClick={() => setLang("en")} className={l === "en" ? "font-semibold" : ""}>
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("es")} className={l === "es" ? "font-semibold" : ""}>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("pt")} className={l === "pt" ? "font-semibold" : ""}>
                  🇧🇷 Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-200 mx-1" />

            {/* WhatsApp */}
            <a
              href="https://wa.me/5521972633333"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Book Now CTA */}
            <Link href="/tours">
              <button className="ml-1 px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-900 hover:bg-gray-700 text-white transition-colors">
                {ctaLabels[l]}
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden z-50 p-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
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
          <div className="absolute top-[64px] left-0 right-0 bottom-0 bg-white overflow-y-auto">
            <nav className="flex flex-col divide-y divide-gray-100">

              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-6 py-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {l === "en" ? "Home" : l === "es" ? "Inicio" : "Início"}
              </Link>

              {navGroups.map((group) => (
                <div key={group.label.en}>
                  <button
                    className="flex items-center justify-between w-full px-6 py-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
                          className="flex items-center px-8 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          {item.label[l]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-6 py-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {l === "en" ? "Travel Guide" : l === "es" ? "Guía de Viaje" : "Guia de Viagem"}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-6 py-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {l === "en" ? "Contact" : l === "es" ? "Contacto" : "Contato"}
              </Link>

              <div className="px-6 py-5 flex flex-col gap-3">
                <div className="flex gap-2">
                  {(["en", "es", "pt"] as Lang[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                        l === code
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
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
                  <button className="w-full py-3 rounded-xl font-semibold text-base bg-gray-900 hover:bg-gray-700 text-white transition-colors">
                    {ctaLabels[l]}
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
