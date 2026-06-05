import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, ArrowRight, MessageCircle, Star, Shield, Zap } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20a%20private%20tour%20in%20Rio";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is included in a private tour in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our private tours include a dedicated licensed local guide, comfortable private transportation, entrance tickets to included attractions, hotel pickup and drop-off, and a fully flexible itinerary tailored to your interests and schedule.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a private tour in Rio cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private tours in Rio de Janeiro start from approximately $149 for a half-day experience. Full-day private tours start from $249. Pricing varies based on the number of attractions, group size and specific requests. Contact us for a custom quote.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize my private tour itinerary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Private tours are fully customizable. Tell us your interests — whether it's Afro-Brazilian culture, photography spots, beaches, nightlife, food, favelas or landmarks — and we'll design the perfect itinerary for you.",
      },
    },
    {
      "@type": "Question",
      name: "Are private tours good for families with children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private tours are ideal for families. You control the pace, choose child-friendly activities, take breaks when needed and avoid the logistics of group transport. Our guides are experienced with family groups and adapt beautifully to all ages.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum group size for a private tour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private tours can accommodate from 1 to 45+ people depending on the experience and transportation needed. For larger groups, we coordinate multiple vehicles and guides to maintain a quality experience.",
      },
    },
  ],
};

const TOUR_TYPES = [
  { title: "Private City Tour", desc: "Christ the Redeemer, Sugarloaf, beaches and neighborhoods at your own pace", duration: "4–8 hours", from: "$249" },
  { title: "Private Cultural Tour", desc: "Afro-Brazilian history, Santa Teresa, Lapa and local culture", duration: "4–6 hours", from: "$189" },
  { title: "Private Helicopter Tour", desc: "Exclusive aerial experience over Rio's most iconic landscapes", duration: "1–2 hours", from: "$399" },
  { title: "Private Favela Tour", desc: "Intimate community experience in Rocinha with local guides", duration: "3 hours", from: "$149" },
  { title: "Private Food Tour", desc: "Rio's best flavors — from street snacks to fine dining with a local", duration: "4 hours", from: "$169" },
  { title: "Private Night Tour", desc: "Lapa, Santa Teresa, samba bars and Rio after dark", duration: "4 hours", from: "$179" },
];

export default function PrivateToursRioPage() {
  return (
    <>
      <SeoHead
        title="Private Tours Rio de Janeiro — Exclusive Local Guide Experiences"
        description="Book exclusive private tours in Rio de Janeiro. Fully customizable itineraries with dedicated local expert guides. Perfect for couples, families and groups. Hotel pickup included."
        canonical="/private-tours-rio"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Private Tours Rio", url: "/private-tours-rio" },
        ]}
        schemas={[faqSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/313436534-5783652584990398-6005883414559693748-n.jpg"
          alt="Private tour Rio de Janeiro — exclusive local guide experience"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Exclusive Experiences</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Private Tours in Rio de Janeiro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Your city. Your schedule. Your guide. Private tours with Janeiro Tour & Travel give you
            the freedom to explore Rio exactly how you want — with expert knowledge and zero compromises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">
                Get a Custom Quote
              </Button>
            </a>
            <Link href="/tours">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse All Tours <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Zap className="h-5 w-5 text-[#FFB600]" />, title: "Fully Custom", desc: "Itinerary designed around your interests" },
            { icon: <Shield className="h-5 w-5 text-[#1D8A3C]" />, title: "Private Guide", desc: "Dedicated expert, just for your group" },
            { icon: <Clock className="h-5 w-5 text-blue-500" />, title: "Your Schedule", desc: "Start and end when you want" },
            { icon: <Star className="h-5 w-5 text-[#FFB600]" />, title: "5-Star Rated", desc: "Consistently praised on Tripadvisor" },
          ].map((b) => (
            <div key={b.title} className="text-center">
              <div className="flex justify-center mb-2">{b.icon}</div>
              <div className="font-bold text-neutral-900 text-sm mb-1">{b.title}</div>
              <div className="text-xs text-neutral-600">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tour Types */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Private Tour Options in Rio</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Choose from our most popular private experiences — or ask us to design something completely unique.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {TOUR_TYPES.map((tour) => (
            <div key={tour.title} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-neutral-900 mb-2">{tour.title}</h3>
              <p className="text-neutral-600 text-sm mb-4">{tour.desc}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration}</span>
                <span className="font-bold text-[#1D8A3C]">{tour.from} <span className="text-xs font-normal text-neutral-500">per group</span></span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
              <MessageCircle className="mr-2 h-4 w-4" /> Request Your Custom Tour
            </Button>
          </a>
        </div>
      </section>

      {/* Why Private */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Why Choose a Private Tour in Rio?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Perfect for Couples", desc: "Romantic, intimate and tailored to your pace. Private tours are the ideal way for couples to experience Rio's beauty without crowds or schedules." },
              { title: "Ideal for Families", desc: "Kids set the pace. Private tours allow bathroom breaks, child-friendly meal stops and activities suited to all ages — with no waiting for other group members." },
              { title: "Best for Photographers", desc: "Stop when inspiration strikes. Our guides know the best light conditions, hidden viewpoints and optimal times for golden-hour photography at every location." },
              { title: "Great for Groups", desc: "Corporate groups, birthday trips, reunion travel — private tours scale to any group size and can incorporate special activities, meals and unique experiences." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-neutral-200">
                <h3 className="font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rich Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Private Tours Rio de Janeiro: Everything You Need to Know</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          A private tour in Rio de Janeiro is the most flexible, personalized and immersive way to experience this extraordinary city. Unlike group tours where you follow a fixed schedule and share your guide with 20 strangers, a private tour belongs entirely to you — your timeline, your interests, your pace.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Janeiro Tour & Travel's private tours are led by the same expert local guides who conduct our acclaimed group experiences — but with undivided attention and complete flexibility. Want to spend an extra hour at Cristo Redentor because the clouds lifted and the views are perfect? Done. Want to skip the tourist restaurant and eat at the hole-in-the-wall bacalhau place our guide loves? Absolutely.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          Private tours are particularly popular with travelers who have limited time in Rio and want to maximize every hour, with families who need flexibility around children's schedules, and with photography enthusiasts who want to shoot at specific times and locations without group constraints.
        </p>
        <h3 className="text-xl font-bold text-neutral-900 mb-3">How to Book a Private Tour in Rio</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          The easiest way to book a private tour with Janeiro Tour & Travel is via WhatsApp or our website. Send us a message with your dates, group size, interests and any specific places you'd like to visit. Within a few hours, we'll send you a customized itinerary and quote. Once you confirm and pay your deposit, you're all set.
        </p>
        <p className="text-neutral-700 leading-relaxed">
          We recommend booking at least 48–72 hours in advance to ensure your preferred guide and vehicle are available, though we do our best to accommodate last-minute requests.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Private Tours FAQ</h2>
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

      <section className="bg-[#1D8A3C] text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Design Your Perfect Private Tour</h2>
          <p className="text-white/80 mb-8">Contact us on WhatsApp and we'll create a custom itinerary within hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us Now
              </Button>
            </a>
            <Link href="/tours">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Tours <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/60">
            Also see: <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">All Rio Tours</Link> ·{" "}
            <Link href="/rio-tour-packages" className="underline hover:text-white">Tour Packages</Link> ·{" "}
            <Link href="/transfers" className="underline hover:text-white">Airport Transfers</Link>
          </p>
        </div>
      </section>
    </>
  );
}
