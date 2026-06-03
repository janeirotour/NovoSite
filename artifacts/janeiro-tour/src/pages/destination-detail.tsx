import { useParams, Link } from "wouter";
import { useGetDestination, useListTours } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/ui/tour-card";

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const destId = parseInt(id ?? "0", 10);
  const { lang } = useLanguage();

  const { data: destination, isLoading } = useGetDestination(destId);
  const { data: tours } = useListTours({ destination: destination?.name });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">Loading destination...</div>
        </div>
      </MainLayout>
    );
  }

  if (!destination) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Destination not found</h1>
          <Link href="/destinations"><Button>Back to Destinations</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const name = lang === "es" ? (destination.nameEs ?? destination.name) : lang === "pt" ? (destination.namePt ?? destination.name) : destination.name;
  const description = lang === "es" ? (destination.descriptionEs ?? destination.description) : lang === "pt" ? (destination.descriptionPt ?? destination.description) : destination.description;
  const heroImg = destination.heroImageUrl ?? destination.imageUrl;

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[450px] bg-neutral-900">
        <img src={heroImg} alt={name} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Link href="/destinations" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors text-sm">
            <ChevronLeft size={16} /> All Destinations
          </Link>
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">{destination.country}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">{name}</h1>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
      </section>

      {/* Tours in this Destination */}
      {tours && tours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold mb-8">Tours in {name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-20 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Explore {name}?</h2>
        <p className="text-primary-foreground/80 mb-8 text-lg">Book your tour with our local experts</p>
        <Link href="/tours">
          <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold">
            See All Tours
          </Button>
        </Link>
      </section>
    </MainLayout>
  );
}
