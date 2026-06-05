import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, Check, ArrowRight, MessageCircle, Star, Camera } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20the%20Sugarloaf%20Mountain%20tour";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Sugarloaf Mountain in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sugarloaf Mountain (Pão de Açúcar) is a 396-meter granite peak located at the entrance of Guanabara Bay in Rio de Janeiro. It is reached by a two-stage cable car system and offers 360-degree panoramic views of the city, bay, and surrounding mountains. It is one of Brazil's most visited attractions.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the Sugarloaf Mountain tour take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Sugarloaf Mountain experience typically takes 2–3 hours. When combined with Christ the Redeemer on our full-day tour, the total duration is 7–8 hours including hotel pickup.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best time to visit Sugarloaf Mountain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sunset at Sugarloaf Mountain is considered one of Rio de Janeiro's most spectacular experiences. The golden light on Guanabara Bay and the city skyline creates unforgettable views. Clear days from May to October offer the best visibility.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Sugarloaf cable car safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the cable car (Bondinho do Pão de Açúcar) is a modern, regularly maintained system that has operated safely since 1912. The current system was upgraded in 2008 with Italian-made gondolas that carry up to 65 passengers each.",
      },
    },
    {
      "@type": "Question",
      name: "Can I hike up Sugarloaf Mountain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Via da Praia Vermelha trail allows hikers to climb to Morro da Urca (the first cable car stop). From there, the cable car takes you to the Sugarloaf summit. Our guides can arrange hiking options for adventurous visitors.",
      },
    },
  ],
};

const attractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Sugarloaf Mountain Tour — Rio de Janeiro",
  description: "Cable car tour to the summit of Pão de Açúcar (Sugarloaf Mountain) with panoramic views of Rio de Janeiro and Guanabara Bay.",
  url: "https://www.janeirotour.com/sugarloaf-mountain-tour",
  touristType: ["Sightseeing", "Photography", "Nature"],
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-22.9493",
    longitude: "-43.1572",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "92",
    bestRating: "5",
  },
};

export default function SugarloafMountainTourPage() {
  return (
    <>
      <SeoHead
        title="Sugarloaf Mountain Tour Rio de Janeiro — Cable Car & Panoramic Views"
        description="Book the best Sugarloaf Mountain tour in Rio de Janeiro. Ride the famous Bondinho cable car to the summit of Pão de Açúcar for breathtaking 360° views. Hotel pickup included."
        canonical="/sugarloaf-mountain-tour"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio de Janeiro Tours", url: "/rio-de-janeiro-tours" },
          { name: "Sugarloaf Mountain Tour", url: "/sugarloaf-mountain-tour" },
        ]}
        schemas={[faqSchema, attractionSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/img-header-pao-de-acucar-rio-bondinho.webp"
          alt="Sugarloaf Mountain cable car — Rio de Janeiro"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Rio de Janeiro's Iconic Summit</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sugarloaf Mountain Tour
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Ride the world-famous Bondinho cable car to the summit of Pão de Açúcar for the most spectacular
            views of Rio de Janeiro, Guanabara Bay and the Atlantic Ocean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">
                Book This Tour
              </Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Clock className="h-4 w-4" />, label: "Duration", value: "7 hours (full day)" },
            { icon: <Users className="h-4 w-4" />, label: "Groups", value: "Shared & Private" },
            { icon: <Camera className="h-4 w-4" />, label: "Best For", value: "Photography & Sunsets" },
            { icon: <Star className="h-4 w-4" />, label: "Rating", value: "5.0 Tripadvisor" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-center text-[#1D8A3C] mb-1">{item.icon}</div>
              <div className="text-xs text-neutral-500">{item.label}</div>
              <div className="text-sm font-semibold text-neutral-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Pão de Açúcar: The Gateway to Rio's Sky</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Standing at 396 meters above sea level at the mouth of Guanabara Bay, Sugarloaf Mountain (Pão de Açúcar in Portuguese) is one of Rio de Janeiro's most celebrated landmarks and a UNESCO World Heritage candidate site. Its distinctive silhouette — a rounded granite monolith rising dramatically from the sea — has made it one of the most recognizable natural features on Earth.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          The name "Sugarloaf" comes from the shape of refined sugar loaves that were common in the 16th century — the mountain resembles these conical molds. In Tupi, the indigenous language, it was called "Pau-nh-Acuqua," meaning "high, pointed, isolated hill," which Portuguese sailors later adapted into the name we know today.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          The cable car system (Bondinho do Pão de Açúcar) has operated since 1912, making it one of the oldest in the world. The current system, installed in 2008, features Italian-designed gondolas with 360-degree windows, holding up to 65 passengers each. The ride takes just 3 minutes and ascends in two stages — first to Morro da Urca at 215 meters, then to the Sugarloaf summit at 396 meters.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">The View from the Top</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          From the summit of Pão de Açúcar, the panorama of Rio de Janeiro is simply breathtaking. To the south, the curves of Copacabana and Ipanema beaches stretch along the Atlantic coast, bookended by the Dois Irmãos (Two Brothers) mountains. To the west, the city of Rio spreads across the valleys between mountain peaks, with the Christ the Redeemer statue visible on Corcovado in the distance. To the north, Guanabara Bay glitters with islands and ships, while the Niterói bridge spans the horizon.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          At sunset, the transformation is magical. As the sky turns from gold to pink to purple, Rio's city lights begin to sparkle below, and the iconic silhouette of Cristo Redentor stands illuminated on the distant mountainside. It is one of the most spectacular natural spectacles in South America.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Morro da Urca: The Hidden Gem</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Most visitors rush past Morro da Urca (the first stop) to reach the famous summit, but our guides know it's worth spending time at this intermediate peak. At 215 meters, it offers excellent views, has an open-air bar and restaurant, and frequently hosts live music events. Rocky trails along the edge allow for dramatic photography with the Sugarloaf rising dramatically behind you.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          The area around the base station at Praia Vermelha (Red Beach) is also worth exploring — a peaceful crescent beach sheltered from the open ocean that offers a tranquil contrast to Rio's famous crowded beaches.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Our Sugarloaf Mountain Tour Itinerary</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Our most popular option combines Sugarloaf Mountain with Christ the Redeemer for a complete full-day experience. Your guide will collect you from your hotel in the South Zone (Copacabana, Ipanema, Leblon) and structure the day to make the most of lighting conditions — typically visiting Cristo Redentor in the morning (when clouds are lower) and Sugarloaf in the afternoon for golden hour and sunset views.
        </p>
        <p className="text-neutral-700 leading-relaxed">
          Private Sugarloaf tours can be customized around your schedule and interests. Prefer to go at sunrise? Want to combine the cable car with a hike to Morro da Urca? Looking for a photography-focused tour? Our team will design the perfect experience for you.
        </p>
      </section>

      {/* FAQs */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Sugarloaf Mountain Tour — FAQ</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="bg-white rounded-xl border border-neutral-200 group">
                <summary className="flex items-center justify-between p-5 font-semibold text-neutral-900 cursor-pointer list-none">
                  {faq.name}
                  <span className="ml-4 text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-5 text-neutral-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Experience Sugarloaf Mountain with Local Experts</h2>
          <p className="text-white/70 mb-8">Book your tour today and see Rio from a whole new perspective.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
          <p className="text-sm text-white/50">
            Also see: <Link href="/christ-the-redeemer-tour" className="underline hover:text-white">Christ the Redeemer Tour</Link> ·{" "}
            <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">All Rio Tours</Link> ·{" "}
            <Link href="/things-to-do-in-rio" className="underline hover:text-white">Things to Do in Rio</Link>
          </p>
        </div>
      </section>
    </>
  );
}
