import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Check, Tag, Users, Clock } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20Rio%20tour%20packages";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is included in Rio tour packages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rio tour packages from Janeiro Tour & Travel include a curated combination of our most popular tours — such as Christ the Redeemer, Sugarloaf Mountain, cultural tours and beach experiences — bundled at a discounted price. Packages include transportation, guide fees and entrance tickets. Hotels and flights are not included.",
      },
    },
    {
      "@type": "Question",
      name: "How much do Rio de Janeiro tour packages cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Rio tour packages start from $289 per person. Three packages are available: Afro Rio Soul (cultural immersion, 2–3 days), Rio Highlights (iconic landmarks, 2 days) and Rio VIP (premium full experience, 3+ days). Each saves up to 27% compared to booking individual tours.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize a Rio tour package?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer a custom package service where you choose any combination of our tours and we price them as a bundle with a group discount. Contact us via WhatsApp to discuss your preferences and we'll create a personalized package.",
      },
    },
    {
      "@type": "Question",
      name: "Do Rio packages include airport transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our premium packages include airport transfers from Galeão (GIG) upon arrival and departure. This is noted in each package description. Transfers can also be added to any package for an additional fee.",
      },
    },
  ],
};

export default function RioTourPackagesPage() {
  return (
    <>
      <SeoHead
        title="Rio de Janeiro Tour Packages 2025 — Curated Multi-Day Experiences"
        description="Discover curated Rio de Janeiro tour packages. Save up to 27% by bundling multiple experiences — Afro-Brazilian culture, iconic landmarks and VIP experiences. No hotel or flights."
        canonical="/rio-tour-packages"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio Tour Packages", url: "/rio-tour-packages" },
        ]}
        schemas={[faqSchema]}
      />

      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img src="/uploads/escada.jpg" alt="Rio de Janeiro tour packages" className="absolute inset-0 w-full h-full object-cover opacity-40" loading="eager" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Save Up to 27%</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Rio de Janeiro Tour Packages</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Hand-picked combinations of our best tours — bundled for better value. No hotel, no flights. Just unforgettable Rio experiences, perfectly organized.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">See All Packages</Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Custom Package</Button></a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: <Tag className="h-4 w-4 text-[#FFB600]" />, text: "Save up to 27%" },
            { icon: <Clock className="h-4 w-4 text-blue-500" />, text: "2–3 day programs" },
            { icon: <Users className="h-4 w-4 text-[#1D8A3C]" />, text: "All group sizes" },
            { icon: <Check className="h-4 w-4 text-[#1D8A3C]" />, text: "All inclusive of tours" },
          ].map((p) => (
            <div key={p.text} className="flex flex-col items-center gap-1">
              {p.icon}
              <span className="font-medium text-neutral-700">{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Preview */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Rio Tour Packages</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Three curated programs designed to give you the most complete Rio de Janeiro experience possible.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[
            {
              badge: "BEST SELLER",
              badgeColor: "bg-green-600",
              name: "Afro Rio Soul",
              tagline: "Cultural Immersion — Rio's African Heart",
              price: "$289",
              original: "$395",
              duration: "2–3 days",
              desc: "The deepest cultural immersion in Rio. Cristo Redentor, the Afro-Brazilian History Tour, Little Africa, Santa Teresa and samba in Lapa — plus airport transfers.",
              features: ["Afro-Brazilian History Walking Tour", "Christ the Redeemer", "Santa Teresa & Lapa Night Tour", "Airport transfers (GIG)", "Up to 45 people"],
            },
            {
              badge: "POPULAR",
              badgeColor: "bg-amber-500",
              name: "Rio Highlights",
              tagline: "The Essential Rio Experience",
              price: "$349",
              original: "$450",
              duration: "2 days",
              desc: "Rio's two most iconic landmarks in one seamless package. Cristo Redentor, Sugarloaf Mountain, beaches and a favela community experience.",
              features: ["Full-Day City Tour (Cristo + Sugarloaf)", "Rocinha Favela Community Tour", "Ipanema & Copacabana Beach", "Airport transfers (GIG)", "Private or shared options"],
            },
            {
              badge: "PREMIUM",
              badgeColor: "bg-purple-700",
              name: "Rio VIP",
              tagline: "The Ultimate Rio Experience",
              price: "$599",
              original: "$795",
              duration: "3+ days",
              desc: "The complete Rio experience with helicopter flight, private city tour, cultural immersion and VIP transfers — for travelers who want the best.",
              features: ["Private Full-Day City Tour", "Helicopter Tour over Rio", "Afro-Brazilian Cultural Tour", "Rocinha Favela Experience", "VIP airport transfers & concierge"],
            },
          ].map((pkg) => (
            <div key={pkg.name} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={`${pkg.badgeColor} text-white text-xs font-bold px-4 py-2 flex items-center gap-1`}>
                ★ {pkg.badge}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-1">{pkg.name}</h3>
                <p className="text-sm text-neutral-500 mb-3">{pkg.tagline}</p>
                <p className="text-neutral-700 text-sm leading-relaxed mb-4">{pkg.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-700">
                      <Check className="h-3.5 w-3.5 text-[#1D8A3C] flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-2xl font-bold text-[#1D8A3C]">{pkg.price}</div>
                    <div className="text-xs text-neutral-400 line-through">{pkg.original}</div>
                    <div className="text-xs text-neutral-500">per person · {pkg.duration}</div>
                  </div>
                  <Link href="/packages">
                    <Button size="sm" className="bg-neutral-900 hover:bg-neutral-700 text-white">
                      Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/packages">
            <Button size="lg" className="bg-[#1D8A3C] hover:bg-[#166b30] text-white">
              View All Package Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Rich Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Why Book a Rio Package Instead of Individual Tours?</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Booking a curated tour package in Rio de Janeiro offers several advantages over piecing together individual experiences. First and most obviously: cost. By bundling multiple tours, we can offer discounts of up to 27% compared to booking each experience separately. For travelers who want to see several Rio highlights, the savings are significant.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Second: logistics. Planning a multi-day itinerary in Rio involves coordinating transportation, timing, ticket reservations and guide availability across multiple days. Our packages handle all of this for you — we design the optimal sequence, ensure transitions are smooth and confirm everything in advance.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Third: continuity. When you book a package, you often work with the same guide or guide team across multiple days, building a relationship and trust that makes each experience richer. Your guide learns your preferences and adapts accordingly.
          </p>
          <h3 className="text-xl font-bold text-neutral-900 mb-3">Custom Rio Packages</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Beyond our three standard packages, Janeiro Tour & Travel offers fully custom package design. Tell us your interests, budget, dates and group composition, and we'll create a bespoke multi-day Rio itinerary that combines any of our 12+ tours in the optimal order.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Custom packages are especially popular with groups celebrating special occasions (honeymoons, birthdays, family reunions, corporate retreats) who want a unique, memorable experience designed entirely around their needs.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Tour Packages FAQ</h2>
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
      </section>

      <section className="bg-[#1D8A3C] text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Get More Rio for Less</h2>
          <p className="text-white/80 mb-8">Browse our packages or request a custom bundle tailored to your interests.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/packages"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">See All Packages <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Custom Package</Button></a>
          </div>
          <p className="text-sm text-white/60">
            <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">Individual Tours</Link> ·{" "}
            <Link href="/private-tours-rio" className="underline hover:text-white">Private Tours</Link> ·{" "}
            <Link href="/transfers" className="underline hover:text-white">Airport Transfers</Link>
          </p>
        </div>
      </section>
    </>
  );
}
