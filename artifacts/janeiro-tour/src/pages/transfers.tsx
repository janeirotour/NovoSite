import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Car, Clock, Shield } from "lucide-react";

const features = [
  { icon: Car, title: "Door-to-Door Service", desc: "Private pickup from airport to your hotel, no shared shuttles" },
  { icon: Clock, title: "Flight Monitoring", desc: "We track your flight in real-time so we're always ready" },
  { icon: Shield, title: "Professional Drivers", desc: "Licensed, English-speaking drivers with clean, modern vehicles" },
  { icon: Check, title: "Fixed Pricing", desc: "No meters, no surprises — transparent pricing confirmed at booking" },
];

export default function TransfersPage() {
  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({ category: "transfer" });

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
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Seamless Arrivals</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Brazil Airport Transfers</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            Private, reliable, and stress-free airport transfers across Brazil's major cities
          </p>
          <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              Book a Transfer
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
        <h2 className="text-3xl font-bold mb-8">Available Transfer Services</h2>
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
            <p className="text-muted-foreground mb-4">Contact us for transfer availability</p>
            <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
              <Button>WhatsApp for Transfer Booking</Button>
            </a>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">Need a Custom Transfer?</h2>
        <p className="text-primary-foreground/80 mb-8">Contact us for point-to-point transfers, intercity routes, and group shuttles</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="h-12 px-8">WhatsApp Us</Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Contact Us</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
