import { useListTours } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { TourCard } from "@/components/ui/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "100% customizable itinerary to your interests",
  "Dedicated private guide throughout your experience",
  "Flexible departure times — your schedule",
  "Luxury air-conditioned private vehicle",
  "Priority access at all major attractions",
  "Perfect for families, couples, and groups",
  "Photography stops at the best spots",
  "Personalized restaurant recommendations",
];

export default function PrivateToursPage() {
  const { lang } = useLanguage();
  const { data: tours, isLoading } = useListTours({ type: "private" });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1600&q=80"
          alt="Private Tours"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Exclusive Experiences</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Private Brazil Tours</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            Bespoke, fully customized private experiences across Brazil — your journey, your way
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              Plan My Private Tour
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Private Tour Difference</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Why share Brazil with strangers? A private tour means your dedicated guide, your pace, your priorities — and memories crafted just for you. Ideal for honeymoons, anniversaries, family trips, and discerning solo travelers.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-primary-foreground" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-80 lg:h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80"
              alt="Rio de Janeiro private tour"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-sm rounded-xl text-white text-sm">
              <p className="font-semibold">Your Private Rio Experience</p>
              <p className="text-white/80 text-xs mt-1">Fully personalized from start to finish</p>
            </div>
          </div>
        </div>

        {/* Private Tour Listings */}
        <h2 className="text-3xl font-bold mb-8">Our Private Tour Options</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : tours?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20">
            <h3 className="text-xl font-bold mb-2">Custom Private Itinerary</h3>
            <p className="text-muted-foreground mb-6">Tell us your travel dates and interests — we'll create your perfect private Brazil experience</p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Plan My Private Trip</Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
