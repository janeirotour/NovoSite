import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Facebook, Instagram, Youtube, MessageCircle, Mail, MapPin, Award } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618";
const EMAIL = "contato@janeirotour.com";
const PHONE = "+55 21 96529-7618";

export function Footer() {
  const { lang } = useLanguage();

  const destinations = [
    { href: "/destinations/1", label: "Rio de Janeiro" },
    { href: "/destinations/2", label: "São Paulo" },
    { href: "/destinations/5", label: "Bahia" },
    { href: "/destinations/3", label: "Foz do Iguaçu" },
    { href: "/destinations/9", label: "Recife" },
    { href: "/destinations", label: lang === "es" ? "Amazonía" : lang === "pt" ? "Floresta Amazônica" : "Amazon Rainforest" },
  ];

  const experiences = [
    { href: "/tours?category=private", label: lang === "en" ? "Private Tours" : lang === "es" ? "Tours Privados" : "Tours Privativos" },
    { href: "/tours?category=culture", label: lang === "en" ? "Cultural Experiences" : lang === "es" ? "Experiencias Culturales" : "Experiências Culturais" },
    { href: "/tours?category=transfer", label: lang === "en" ? "Airport Transfers" : lang === "es" ? "Traslados Aeropuerto" : "Traslados Aeroporto" },
    { href: "/tours?category=nature", label: lang === "en" ? "Adventure Experiences" : lang === "es" ? "Experiencias de Aventura" : "Experiências de Aventura" },
  ];

  return (
    <footer className="bg-[#141414] text-white/70">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <img
                src="/janeiro-logo.png"
                alt="Janeiro Tour & Travel"
                className="h-9 w-auto brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (next) next.style.display = "block";
                }}
              />
              <span className="hidden font-bold text-xl text-white tracking-tight">
                <span className="text-[#FFB600]">Janeiro</span> Tour &amp; Travel
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              {lang === "en" && "We believe travel is more than destinations — it's the people you meet, the stories you hear, and the moments that quietly change you."}
              {lang === "es" && "Creemos que viajar es más que destinos — son las personas que conoces, las historias que escuchas y los momentos que te cambian en silencio."}
              {lang === "pt" && "Acreditamos que viajar é mais do que destinos — são as pessoas que você encontra, as histórias que ouve e os momentos que silenciosamente te transformam."}
            </p>

            <div className="flex gap-3">
              <a href="https://www.facebook.com/janeirotour" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#FFB600] hover:text-black flex items-center justify-center text-white/60 transition-all duration-200"
                aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="http://instagram.com/janeirotour" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#FFB600] hover:text-black flex items-center justify-center text-white/60 transition-all duration-200"
                aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.youtube.com/@janeirotourtravel" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#FFB600] hover:text-black flex items-center justify-center text-white/60 transition-all duration-200"
                aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Destinations */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              {lang === "en" ? "Destinations" : lang === "es" ? "Destinos" : "Destinos"}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {destinations.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="text-sm hover:text-[#FFB600] transition-colors">{d.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Experiences */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              {lang === "en" ? "Experiences" : lang === "es" ? "Experiencias" : "Experiências"}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {experiences.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="text-sm hover:text-[#FFB600] transition-colors">{e.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              {lang === "en" ? "Contact" : lang === "es" ? "Contacto" : "Contato"}
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a href={WHATSAPP} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm hover:text-[#FFB600] transition-colors group">
                  <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-[#FFB600] shrink-0 transition-colors" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 text-sm hover:text-[#FFB600] transition-colors">
                  <Mail className="w-4 h-4 text-white/40 shrink-0" />
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span>Rio de Janeiro, Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Award className="w-3.5 h-3.5 text-[#FFB600]/60 flex-shrink-0" />
            <span>
              {lang === "en" && "Certified by the Brazilian Ministry of Tourism"}
              {lang === "es" && "Certificada por el Ministerio de Turismo de Brasil"}
              {lang === "pt" && "Certificada pelo Ministério do Turismo do Brasil"}
              {" — "}
              <span className="font-medium text-white/50">n° 20.966.047.0001/11</span>
            </span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/15" />
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="text-sm leading-none">✊🏿</span>
            <span className="font-medium text-white/50">
              {lang === "en" && "Black-owned Business"}
              {lang === "es" && "Empresa de propietario negro"}
              {lang === "pt" && "Empresa negra"}
            </span>
            <span className="text-white/25">·</span>
            <span>
              {lang === "en" && "Afrotourism"}
              {lang === "es" && "Afroturismo"}
              {lang === "pt" && "Afroturismo"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Janeiro Tour &amp; Travel.&nbsp;
            {lang === "en" ? "All rights reserved." : lang === "es" ? "Todos los derechos reservados." : "Todos os direitos reservados."}
          </p>
          <div className="flex gap-5 text-xs text-white/40">
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              {lang === "en" ? "Terms & Conditions" : lang === "es" ? "Términos y Condiciones" : "Termos e Condições"}
            </Link>
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              {lang === "en" ? "Privacy Policy" : lang === "es" ? "Política de Privacidad" : "Política de Privacidade"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
