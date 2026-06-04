import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const popularRoutes = [
  { title: "Classic Rio + Iguazu", days: "5 Days", highlights: "Rio, Corcovado, Sugarloaf, Iguaçu Falls" },
  { title: "Brazil Grand Tour", days: "14 Days", highlights: "Rio, Salvador, Amazon Rainforest, Foz do Iguaçu" },
  { title: "Amazon Explorer", days: "8 Days", highlights: "Manaus jungle lodge, Amazon River, local communities" },
  { title: "Cultural Brazil", days: "10 Days", highlights: "Rio, Salvador Bahia, São Paulo" },
];

export default function PackagesPage() {
  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({ category: "package" });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=1600&q=80"
          alt="Brazil Packages"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-sm mb-4">
            {lang === "en" ? "Multi-Destination Travel" : lang === "es" ? "Viajes Multi-Destino" : "Viagens Multi-Destino"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {lang === "en" ? "Brazil Travel Packages" : lang === "es" ? "Paquetes de Viaje a Brasil" : "Pacotes de Viagem ao Brasil"}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            {lang === "en"
              ? "Expertly crafted multi-destination Brazil packages — everything planned, nothing left to chance"
              : lang === "es"
              ? "Paquetes multi-destino en Brasil cuidadosamente diseñados — todo planificado, nada al azar"
              : "Pacotes multi-destino no Brasil cuidadosamente elaborados — tudo planejado, nada ao acaso"}
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black">
              {lang === "en" ? "Plan My Package" : lang === "es" ? "Planificar Mi Paquete" : "Planejar Meu Pacote"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {lang === "en" ? "Popular Brazil Routes" : lang === "es" ? "Rutas Populares de Brasil" : "Rotas Populares do Brasil"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "en"
              ? "Our most popular multi-destination itineraries — all fully customizable"
              : lang === "es"
              ? "Nuestros itinerarios multi-destino más populares — todos completamente personalizables"
              : "Nossos roteiros multi-destino mais populares — todos completamente personalizáveis"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {popularRoutes.map((route) => (
            <div key={route.title} className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-[#FFB600] text-sm font-semibold mb-1 uppercase tracking-wide">{route.days}</div>
              <h3 className="font-bold text-lg mb-2">{route.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{route.highlights}</p>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  {lang === "en" ? "Inquire" : lang === "es" ? "Consultar" : "Consultar"}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Package Listings */}
        <h2 className="text-3xl font-bold mb-8">
          {lang === "en" ? "Available Packages" : lang === "es" ? "Paquetes Disponibles" : "Pacotes Disponíveis"}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : tours?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFB600]/5 rounded-2xl border border-[#FFB600]/20">
            <h3 className="text-xl font-bold mb-2">
              {lang === "en" ? "Custom Brazil Package" : lang === "es" ? "Paquete Personalizado en Brasil" : "Pacote Personalizado no Brasil"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {lang === "en"
                ? "We specialize in building bespoke Brazil packages. Tell us your dates, interests, and budget — we'll craft your perfect itinerary."
                : lang === "es"
                ? "Nos especializamos en crear paquetes a medida en Brasil. Cuéntanos tus fechas, intereses y presupuesto — crearemos tu itinerario perfecto."
                : "Somos especialistas em criar pacotes personalizados no Brasil. Informe suas datas, interesses e orçamento — criaremos seu itinerário perfeito."}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black">
                {lang === "en" ? "Plan My Brazil Package" : lang === "es" ? "Planificar Mi Paquete" : "Planejar Meu Pacote"}
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
