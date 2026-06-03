import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Globe, Shield, Heart, Star, Users } from "lucide-react";

const whyUs = [
  { icon: Globe, title: "Local Brazil Experts", desc: "Born and raised in Brazil, our guides bring authentic local knowledge and deep passion for their homeland." },
  { icon: Star, title: "Premium Experiences", desc: "We curate only the finest tours, transfers, and private experiences across every Brazilian destination." },
  { icon: Users, title: "Multilingual Team", desc: "Our team speaks English, Spanish, Portuguese, and more — so you always feel at home." },
  { icon: Shield, title: "Trusted & Secure", desc: "Fully licensed travel operator. Thousands of international travelers trust us every year." },
  { icon: Heart, title: "Personalized Service", desc: "From airport arrival to final departure, we are your dedicated travel partner throughout Brazil." },
  { icon: Check, title: "Flexible Booking", desc: "Free cancellation on most tours, flexible rescheduling, and transparent pricing — no hidden fees." },
];

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80"
          alt="Rio de Janeiro"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl">
            Brazil's Premier International Travel Experts
          </h1>
          <p className="text-white/80 text-xl max-w-2xl">
            Born in Rio. Built for the world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          Janeiro Tour is a premium Brazil travel company founded by local experts who believe that every traveler deserves an authentic, safe, and unforgettable Brazilian experience. From Rio de Janeiro's iconic landmarks to the depths of the Amazon Rainforest, we connect international travelers with the heart of Brazil.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We specialize in private tours, group experiences, airport transfers, and multi-day packages — all designed for English, Spanish, and Portuguese-speaking travelers from the US, Canada, Europe, and Latin America.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Janeiro Tour</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are not a generic travel operator. We are your dedicated Brazil specialists.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="text-primary" size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations We Cover */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Destinations We Cover</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Rio de Janeiro","São Paulo","Iguazu Falls","Amazon Rainforest","Salvador, Bahia","Paraty","Florianópolis","Pantanal"].map((dest) => (
            <div key={dest} className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <p className="font-semibold text-sm">{dest}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-24 text-center">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Start Your Journey</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Discover Brazil?</h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Browse our tours or contact our team to plan your perfect Brazilian adventure
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tours">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              Explore Tours
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/30 text-white hover:bg-white/10">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
