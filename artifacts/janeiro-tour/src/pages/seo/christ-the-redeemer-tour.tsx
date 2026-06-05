import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, Check, ArrowRight, MessageCircle, Star } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20the%20Christ%20the%20Redeemer%20tour";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do you get to Christ the Redeemer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cristo Redentor can be reached by van (the most common and comfortable option), cogwheel train (Trem do Corcovado) or by hiking trails through Tijuca Forest. Our tours use comfortable vans with a pickup service from your hotel. The van takes you to the base station and from there an escalator, elevator or short walk brings you to the statue.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the Christ the Redeemer tour take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Christ the Redeemer portion of the tour typically takes 2–3 hours including travel time. Our full-day tours combine Cristo Redentor with Sugarloaf Mountain and last 7–8 hours in total.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best time to visit Christ the Redeemer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Early morning (before 10am) is the best time to visit Cristo Redentor to avoid crowds and low clouds. Clear days from May to October offer the best visibility. Our guides know the best timing and will adjust the itinerary to maximize your experience.",
      },
    },
    {
      "@type": "Question",
      name: "Can I visit Christ the Redeemer independently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but booking with a local guide offers significant advantages: skip-the-line access, expert historical commentary, photo opportunities at the best spots, and a seamless experience without logistical stress. Our tours handle all tickets, transportation and timing.",
      },
    },
    {
      "@type": "Question",
      name: "Is Christ the Redeemer open every day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cristo Redentor is open daily from 8am to 7pm. It may close due to heavy rain, lightning or fog. Our guides monitor conditions and will reschedule or adjust the tour if access is not possible.",
      },
    },
  ],
};

const attractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Christ the Redeemer Tour — Rio de Janeiro",
  description: "Guided tour to Cristo Redentor on Corcovado Mountain, one of the New Seven Wonders of the World, offered by Janeiro Tour & Travel.",
  url: "https://www.janeirotour.com/christ-the-redeemer-tour",
  touristType: ["Cultural", "Sightseeing", "Photography"],
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-22.9519",
    longitude: "-43.2105",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  image: "https://www.janeirotour.com/uploads/img-2261-scaled.jpg",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "87",
    bestRating: "5",
  },
};

const INCLUDED = [
  "Hotel pickup and drop-off (South Zone)",
  "Expert licensed local guide",
  "Round-trip van transportation to Corcovado",
  "Entrance tickets to Cristo Redentor",
  "Panoramic photo stops",
  "Historical and cultural commentary",
  "Bottled water",
];

const NOT_INCLUDED = [
  "Cogwheel train upgrade (optional, ~$30 extra)",
  "Meals and personal expenses",
  "Tips for guide (appreciated)",
];

export default function ChristTheRedeemerTourPage() {
  return (
    <>
      <SeoHead
        title="Christ the Redeemer Tour Rio de Janeiro — Book with Local Experts"
        description="Book the best Christ the Redeemer tour in Rio de Janeiro. Visit Cristo Redentor on Corcovado Mountain with expert local guides. Hotel pickup included. Private & shared options available."
        canonical="/christ-the-redeemer-tour"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio de Janeiro Tours", url: "/rio-de-janeiro-tours" },
          { name: "Christ the Redeemer Tour", url: "/christ-the-redeemer-tour" },
        ]}
        schemas={[faqSchema, attractionSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/img-2261-scaled.jpg"
          alt="Christ the Redeemer statue — Rio de Janeiro tour"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">New Seven Wonders of the World</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Christ the Redeemer Tour
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Stand at the feet of one of the world's most iconic monuments. Our expert guides take you to
            Cristo Redentor with seamless logistics, insider knowledge and the best photo spots in Rio.
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
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="h-4 w-4" />, label: "Duration", value: "7–8 hours (full day)" },
            { icon: <Users className="h-4 w-4" />, label: "Group Size", value: "Up to 45 (shared) / Private" },
            { icon: <MapPin className="h-4 w-4" />, label: "Start", value: "Hotel pickup, South Zone" },
            { icon: <Star className="h-4 w-4" />, label: "Rating", value: "5.0 / 5.0 Tripadvisor" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="flex justify-center text-[#1D8A3C] mb-1">{item.icon}</div>
              <div className="text-xs text-neutral-500 font-medium">{item.label}</div>
              <div className="text-sm font-semibold text-neutral-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Included / Not Included */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-[#1D8A3C]" /> What's Included
          </h2>
          <ul className="space-y-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-neutral-700 text-sm">
                <Check className="h-4 w-4 text-[#1D8A3C] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Not Included</h2>
          <ul className="space-y-2">
            {NOT_INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-neutral-500 text-sm">
                <span className="text-neutral-400 mt-0.5">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About Christ the Redeemer — Rio's Most Iconic Monument</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Cristo Redentor (Christ the Redeemer) stands at 30 meters tall atop Corcovado Mountain at 710 meters above sea level, with open arms spanning 28 meters wide — embracing the entire city of Rio de Janeiro below. Named one of the New Seven Wonders of the World in 2007, this Art Deco masterpiece was designed by Brazilian engineer Heitor da Silva Costa, sculpted by French artist Paul Landowski, and completed in 1931 after nine years of construction.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Situated within Tijuca National Park — the world's largest urban rainforest — the journey to Cristo Redentor is itself a remarkable experience. As your van winds through the Atlantic rainforest, your guide will share the ecological and cultural significance of this extraordinary urban wilderness, home to exotic bird species, howler monkeys and hundreds of plant species found nowhere else on Earth.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            At the summit, the panoramic views of Rio de Janeiro are simply breathtaking. You'll see Guanabara Bay stretching into the distance, the sweep of Copacabana and Ipanema beaches, the business district of Centro, the Maracanã stadium and the distinctive profile of Sugarloaf Mountain rising from the bay. On clear days, you can see for over 60 kilometers.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">The History of Cristo Redentor</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            The idea for a large statue of Jesus Christ on Corcovado Mountain was first proposed in the 1850s but the project didn't gain traction until the 1920s, when the Catholic Circle of Rio de Janeiro organized a fundraising campaign. The Brazilian government donated the land and the statue was funded primarily by donations from Brazilian Catholics.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Construction began in 1922 during Brazil's centenary of independence. The soapstone tiles covering the statue were crafted by local artisans and carried up the mountain by workers who left their signatures, prayers and messages on the interior surfaces — a touching piece of hidden history that our guides love to share.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            The statue was inaugurated on October 12, 1931 by President Getúlio Vargas and has since become the most recognizable symbol of Brazil — and one of the most photographed monuments in the world.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">What to Expect on Our Tour</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Our Christ the Redeemer tours typically combine Cristo Redentor with Sugarloaf Mountain for a complete introduction to Rio's most iconic landmarks. Your guide will collect you from your hotel in the South Zone (Copacabana, Ipanema or Leblon) and take you first to Corcovado, timing the visit to avoid the busiest crowds.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            At the monument, you'll have at least 45–60 minutes to explore, take photographs and absorb the extraordinary atmosphere. Your guide will show you the best photo spots, explain the statue's construction, share stories of Rio's history and culture, and point out landmarks visible from the summit.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            After Cristo Redentor, the tour continues to Sugarloaf Mountain for panoramic cable car rides and sunset views of the city — creating a perfect full day of Rio's greatest highlights. All entrance fees and transportation are included, so all you need to bring is comfortable shoes, sunscreen and your camera.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Christ the Redeemer Tour — FAQ</h2>
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

      {/* Internal links & CTA */}
      <section className="bg-neutral-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Visit Cristo Redentor?</h2>
          <p className="text-white/70 mb-8">Book your Christ the Redeemer tour or combine it with other Rio experiences.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
            Also see: <Link href="/sugarloaf-mountain-tour" className="underline hover:text-white">Sugarloaf Mountain Tour</Link> ·{" "}
            <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">All Rio Tours</Link> ·{" "}
            <Link href="/private-tours-rio" className="underline hover:text-white">Private Tours</Link>
          </p>
        </div>
      </section>
    </>
  );
}
