import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Car, Clock, Shield } from "lucide-react";

const TX = {
  eyebrow:    { en: "Seamless Arrivals",            es: "Llegadas sin Complicaciones",        pt: "Chegadas sem Complicações",          fr: "Arrivées Sans Stress",               de: "Entspannte Ankünfte" },
  heading:    { en: "Brazil Airport Transfers",     es: "Traslados Aeropuerto Brasil",        pt: "Transfers Aeroporto Brasil",         fr: "Transferts Aéroport Brésil",         de: "Brasilien Flughafentransfers" },
  sub:        {
    en: "Private, reliable, and stress-free airport transfers across Brazil's major cities",
    es: "Traslados aeropuerto privados, confiables y sin estrés en las principales ciudades de Brasil",
    pt: "Transfers aeroporto privados, confiáveis e sem estresse nas principais cidades do Brasil",
    fr: "Transferts aéroport privés, fiables et sans stress dans les principales villes du Brésil",
    de: "Private, zuverlässige und stressfreie Flughafentransfers in Brasiliens wichtigsten Städten",
  },
  book:       { en: "Book a Transfer",              es: "Reservar un Traslado",               pt: "Reservar um Transfer",               fr: "Réserver un Transfert",              de: "Transfer buchen" },
  f1title:    { en: "Door-to-Door Service",         es: "Servicio Puerta a Puerta",           pt: "Serviço Porta a Porta",              fr: "Service Porte-à-Porte",              de: "Tür-zu-Tür-Service" },
  f1desc:     { en: "Private pickup from airport to your hotel, no shared shuttles", es: "Traslado privado del aeropuerto a tu hotel, sin shuttles compartidos", pt: "Traslado privado do aeroporto ao seu hotel, sem shuttles compartilhados", fr: "Prise en charge privée de l'aéroport à votre hôtel, sans navettes partagées", de: "Privater Transfer vom Flughafen zum Hotel, keine gemeinsamen Shuttles" },
  f2title:    { en: "Flight Monitoring",            es: "Seguimiento de Vuelo",               pt: "Monitoramento de Voo",               fr: "Suivi de Vol",                       de: "Flugüberwachung" },
  f2desc:     { en: "We track your flight in real-time so we're always ready", es: "Seguimos tu vuelo en tiempo real para estar siempre listos", pt: "Acompanhamos seu voo em tempo real para estar sempre prontos", fr: "Nous suivons votre vol en temps réel pour être toujours prêts", de: "Wir verfolgen Ihren Flug in Echtzeit, damit wir immer bereit sind" },
  f3title:    { en: "Professional Drivers",         es: "Conductores Profesionales",          pt: "Motoristas Profissionais",           fr: "Chauffeurs Professionnels",          de: "Professionelle Fahrer" },
  f3desc:     { en: "Licensed, English-speaking drivers with clean, modern vehicles", es: "Conductores licenciados, que hablan inglés, con vehículos modernos y limpios", pt: "Motoristas licenciados, que falam inglês, com veículos modernos e limpos", fr: "Chauffeurs licenciés, anglophones, avec des véhicules propres et modernes", de: "Lizenzierte, englischsprachige Fahrer mit sauberen, modernen Fahrzeugen" },
  f4title:    { en: "Fixed Pricing",                es: "Precio Fijo",                        pt: "Preço Fixo",                         fr: "Prix Fixes",                         de: "Feste Preise" },
  f4desc:     { en: "No meters, no surprises — transparent pricing confirmed at booking", es: "Sin taxímetros, sin sorpresas — precios transparentes confirmados al reservar", pt: "Sem taxímetros, sem surpresas — preços transparentes confirmados na reserva", fr: "Pas de compteur, pas de surprises — prix transparents confirmés à la réservation", de: "Keine Taxameter, keine Überraschungen — transparente Preise bei der Buchung bestätigt" },
  available:  { en: "Available Transfer Services",  es: "Servicios de Traslado Disponibles",  pt: "Serviços de Transfer Disponíveis",   fr: "Services de Transfert Disponibles",  de: "Verfügbare Transferdienste" },
  contactUs:  { en: "Contact us for transfer availability", es: "Contáctanos para disponibilidad de traslados", pt: "Contacte-nos para disponibilidade de transfers", fr: "Contactez-nous pour la disponibilité des transferts", de: "Kontaktieren Sie uns für die Transferverfügbarkeit" },
  whatsapp:   { en: "WhatsApp for Transfer Booking",es: "WhatsApp para Reservas",             pt: "WhatsApp para Reservas",             fr: "WhatsApp pour les Réservations",    de: "WhatsApp für Buchungen" },
  ctaTitle:   { en: "Need a Custom Transfer?",      es: "¿Necesitas un Traslado Personalizado?", pt: "Precisa de um Transfer Personalizado?", fr: "Besoin d'un Transfert Personnalisé?", de: "Brauchen Sie einen individuellen Transfer?" },
  ctaSub:     { en: "Contact us for point-to-point transfers, intercity routes, and group shuttles", es: "Contáctanos para traslados punto a punto, rutas interurbanas y shuttles grupales", pt: "Contacte-nos para transfers ponto a ponto, rotas intermunicipais e shuttles em grupo", fr: "Contactez-nous pour des transferts point à point, des trajets interurbains et des navettes de groupe", de: "Kontaktieren Sie uns für Punkt-zu-Punkt-Transfers, Stadtverbindungen und Gruppen-Shuttles" },
  whatsappUs: { en: "WhatsApp Us",                  es: "Escríbenos por WhatsApp",            pt: "Fale pelo WhatsApp",                 fr: "Contactez-nous par WhatsApp",        de: "WhatsApp schreiben" },
  contactLink:{ en: "Contact Us",                   es: "Contáctanos",                        pt: "Contacte-nos",                       fr: "Nous Contacter",                     de: "Kontakt aufnehmen" },
} as const;

export default function TransfersPage() {
  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({ category: "transfer" });

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  const features = [
    { icon: Car,    title: tx("f1title"), desc: tx("f1desc") },
    { icon: Clock,  title: tx("f2title"), desc: tx("f2desc") },
    { icon: Shield, title: tx("f3title"), desc: tx("f3desc") },
    { icon: Check,  title: tx("f4title"), desc: tx("f4desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1600&q=80"
          alt="Airport Transfer"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="eyebrow text-primary mb-4">{tx("eyebrow")}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{tx("heading")}</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">{tx("sub")}</p>
          <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              {tx("book")}
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 bg-card border rounded-2xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="text-primary" size={24} />
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Transfer Listings */}
        <h2 className="text-3xl font-bold mb-8">{tx("available")}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : tours?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{tx("contactUs")}</p>
            <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
              <Button>{tx("whatsapp")}</Button>
            </a>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">{tx("ctaTitle")}</h2>
        <p className="text-primary-foreground/80 mb-8">{tx("ctaSub")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="h-12 px-8">{tx("whatsappUs")}</Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">{tx("contactLink")}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
