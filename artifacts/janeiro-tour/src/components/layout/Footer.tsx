import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useGetSettings } from "@workspace/api-client-react";
import { Facebook, Instagram, MessageCircle, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const { lang, t } = useLanguage();
  const { data: settings } = useGetSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif font-bold text-2xl tracking-tight text-primary">
                JANEIRO <span className="text-white">TOUR</span>
              </span>
            </Link>
            <p className="mb-6 text-sm">
              {lang === "en" && "Premium Brazil travel experiences. We curate the best tours, transfers, and packages to ensure your journey is unforgettable."}
              {lang === "es" && "Experiencias de viaje premium en Brasil. Curamos los mejores tours, traslados y paquetes para asegurar que su viaje sea inolvidable."}
              {lang === "pt" && "Experiências de viagem premium no Brasil. Curamos os melhores passeios, transfers e pacotes para garantir que sua jornada seja inesquecível."}
            </p>
            <div className="flex gap-4">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-6">
              {lang === "en" ? "Quick Links" : lang === "es" ? "Enlaces" : "Links Úteis"}
            </h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/tours" className="hover:text-primary transition-colors">{lang === "en" ? "All Tours" : lang === "es" ? "Todos los Tours" : "Todos os Passeios"}</Link></li>
              <li><Link href="/destinations" className="hover:text-primary transition-colors">{lang === "en" ? "Destinations" : lang === "es" ? "Destinos" : "Destinos"}</Link></li>
              <li><Link href="/private-tours" className="hover:text-primary transition-colors">{lang === "en" ? "Private Tours" : lang === "es" ? "Tours Privados" : "Passeios Privativos"}</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">{lang === "en" ? "Travel Packages" : lang === "es" ? "Paquetes" : "Pacotes de Viagem"}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{lang === "en" ? "About Us" : lang === "es" ? "Sobre Nosotros" : "Sobre Nós"}</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-6">
              {lang === "en" ? "Contact Us" : lang === "es" ? "Contáctenos" : "Fale Conosco"}
            </h3>
            <ul className="flex flex-col gap-4">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-primary transition-colors">{settings.contactPhone}</a>
                </li>
              )}
              {settings?.contactWhatsapp && (
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-accent shrink-0" />
                  <a href={settings.contactWhatsapp} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">{settings.contactEmail}</a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-6">
              {lang === "en" ? "Newsletter" : lang === "es" ? "Boletín" : "Newsletter"}
            </h3>
            <p className="mb-4 text-sm">
              {lang === "en" && "Subscribe to receive special offers and travel inspiration."}
              {lang === "es" && "Suscríbase para recibir ofertas especiales e inspiración de viaje."}
              {lang === "pt" && "Inscreva-se para receber ofertas especiais e inspiração de viagem."}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={lang === "en" ? "Your email" : lang === "es" ? "Su email" : "Seu email"} 
                className="bg-slate-800 border-none rounded-md px-4 py-2 w-full text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none"
              />
              <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                {lang === "en" ? "Send" : "Enviar"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Janeiro Tour. {lang === "en" ? "All rights reserved." : lang === "es" ? "Todos los derechos reservados." : "Todos os direitos reservados."}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
