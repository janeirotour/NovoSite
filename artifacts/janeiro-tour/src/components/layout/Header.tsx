import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useGetSettings } from "@workspace/api-client-react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/tours", label: { en: "Tours", es: "Tours", pt: "Passeios" } },
    { href: "/destinations", label: { en: "Destinations", es: "Destinos", pt: "Destinos" } },
    { href: "/transfers", label: { en: "Transfers", es: "Traslados", pt: "Translados" } },
    { href: "/private-tours", label: { en: "Private", es: "Privados", pt: "Privativos" } },
    { href: "/packages", label: { en: "Packages", es: "Paquetes", pt: "Pacotes" } },
    { href: "/blog", label: { en: "Blog", es: "Blog", pt: "Blog" } },
    { href: "/about", label: { en: "About", es: "Nosotros", pt: "Sobre" } },
    { href: "/contact", label: { en: "Contact", es: "Contacto", pt: "Contato" } },
  ];

  const headerClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled || location !== "/" || mobileMenuOpen
      ? "bg-white/90 backdrop-blur-md shadow-sm text-foreground"
      : "bg-transparent text-white"
  }`;

  const logoSrc = "/janeiro-tour-logo.png"; // We'll serve this from public

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          {/* Use a text logo if image fails, but try image first */}
          <span className="font-serif font-bold text-2xl tracking-tight text-primary">
            JANEIRO <span className={isScrolled || location !== "/" ? "text-foreground" : "text-white"}>TOUR</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium text-sm transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : ""
              }`}
            >
              {link.label[lang as keyof typeof link.label]}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("pt")}>Português</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6">
            {lang === "en" ? "Book Now" : lang === "es" ? "Reservar" : "Reservar"}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-background z-40 lg:hidden overflow-y-auto pb-20">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium p-3 border-b border-border ${
                  location === link.href ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label[lang as keyof typeof link.label]}
              </Link>
            ))}
            
            <div className="flex gap-4 mt-4 p-3">
              <Button variant={lang === "en" ? "default" : "outline"} onClick={() => { setLang("en"); setMobileMenuOpen(false); }}>EN</Button>
              <Button variant={lang === "es" ? "default" : "outline"} onClick={() => { setLang("es"); setMobileMenuOpen(false); }}>ES</Button>
              <Button variant={lang === "pt" ? "default" : "outline"} onClick={() => { setLang("pt"); setMobileMenuOpen(false); }}>PT</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
