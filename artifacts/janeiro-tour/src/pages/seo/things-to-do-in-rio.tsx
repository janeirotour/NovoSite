import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, MapPin, Star, Clock } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27d%20like%20to%20know%20what%20to%20do%20in%20Rio";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the top things to do in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The top things to do in Rio de Janeiro include: visiting Christ the Redeemer on Corcovado Mountain, riding the cable car up Sugarloaf Mountain (Pão de Açúcar), exploring Ipanema and Copacabana beaches, experiencing an Afro-Brazilian cultural tour, visiting Santa Teresa's bohemian streets, joining a community tour in Rocinha favela, watching a samba show in Lapa, and exploring the Tijuca National Forest.",
      },
    },
    {
      "@type": "Question",
      name: "How many days do you need in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend at least 4–5 days to experience Rio's main highlights. With 7 days you can explore the city thoroughly including day trips to Niterói, Petrópolis or Búzios. A 3-day visit is possible for the absolute highlights (Cristo, Sugarloaf, a beach and a cultural experience).",
      },
    },
    {
      "@type": "Question",
      name: "Is Rio de Janeiro worth visiting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Rio de Janeiro is one of the world's great cities — combining dramatic natural beauty (mountains, beaches, bay, rainforest), extraordinary cultural richness (samba, Afro-Brazilian heritage, art, architecture) and vibrant street life. With good planning and local guides, it is an incredible destination.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best neighborhood to stay in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For first-time visitors, Ipanema and Copacabana in the South Zone offer the best location — close to beaches, restaurants, transportation and major attractions. Leblon is more upscale. Santa Teresa is ideal for boutique hotel seekers who want a bohemian, cultural atmosphere.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best time of year to visit Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "May through October is generally the best time to visit Rio, with mild temperatures (22–28°C), lower rainfall and clear skies perfect for sightseeing. February/March offers the world-famous Carnival. December through February is hot and humid with frequent afternoon showers.",
      },
    },
  ],
};

const THINGS_TO_DO = [
  { category: "Iconic Landmarks", color: "bg-blue-50 border-blue-200", items: [
    { name: "Christ the Redeemer (Cristo Redentor)", desc: "Visit the New Seven Wonder of the World atop Corcovado Mountain", link: "/christ-the-redeemer-tour" },
    { name: "Sugarloaf Mountain (Pão de Açúcar)", desc: "Ride the famous cable car for 360° panoramic views", link: "/sugarloaf-mountain-tour" },
    { name: "Maracanã Stadium", desc: "Tour the world's most legendary football stadium", link: "/tours" },
    { name: "Selaron Steps (Escadaria Selarón)", desc: "The iconic mosaic staircase of Lapa, a true Rio treasure", link: "/tours" },
  ]},
  { category: "Beaches & Nature", color: "bg-green-50 border-green-200", items: [
    { name: "Ipanema Beach", desc: "Rio's most fashionable beach, home of the Girl from Ipanema", link: "/rio-travel-guide" },
    { name: "Copacabana Beach", desc: "4km of white sand, beachfront cafés and iconic kiosks", link: "/rio-travel-guide" },
    { name: "Tijuca National Forest", desc: "Hike through the world's largest urban rainforest", link: "/tours" },
    { name: "Lagoa Rodrigo de Freitas", desc: "Scenic lagoon surrounded by Rio's most beautiful neighborhoods", link: "/rio-travel-guide" },
  ]},
  { category: "Culture & History", color: "bg-amber-50 border-amber-200", items: [
    { name: "Afro-Brazilian History Tour", desc: "Discover Little Africa, Valongo Wharf and Rio's African heritage", link: "/rio-de-janeiro-tours" },
    { name: "Santa Teresa Neighborhood", desc: "Cobblestone streets, colonial mansions and vibrant art scene", link: "/rio-local-guide" },
    { name: "Lapa Arches & Nightlife", desc: "The iconic aqueduct and Rio's legendary samba scene", link: "/rio-travel-guide" },
    { name: "Rocinha Favela Tour", desc: "Ethical community tour of Brazil's largest favela", link: "/favela-tour-rio" },
  ]},
  { category: "Unique Experiences", color: "bg-purple-50 border-purple-200", items: [
    { name: "Helicopter Tour over Rio", desc: "Breathtaking aerial views of the Marvelous City", link: "/rio-de-janeiro-tours" },
    { name: "Hang Gliding at Pedra Bonita", desc: "Tandem hang glide over Tijuca Forest to Pepino Beach", link: "/tours" },
    { name: "Sunset at Arpoador Rock", desc: "The best free sunset spot in Rio, where locals gather nightly", link: "/rio-local-guide" },
    { name: "Street Art in Centro", desc: "Explore the vibrant murals and public art of Rio's center", link: "/rio-local-guide" },
  ]},
];

export default function ThingsToDoInRioPage() {
  return (
    <>
      <SeoHead
        title="Things to Do in Rio de Janeiro 2025 — Ultimate Activity Guide"
        description="Discover the best things to do in Rio de Janeiro. From Christ the Redeemer to favela tours, beaches, samba and Afro-Brazilian culture — your complete guide to Rio's top experiences."
        canonical="/things-to-do-in-rio"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Things to Do in Rio", url: "/things-to-do-in-rio" },
        ]}
        schemas={[faqSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/9eae9198-b493-4243-8b4e-e34f9a9ff837-2.jpg"
          alt="Things to do in Rio de Janeiro — Janeiro Tour experiences"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">The Marvelous City</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Things to Do in Rio de Janeiro</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            From world-famous landmarks to hidden local secrets, Rio de Janeiro offers an extraordinary
            range of experiences. Let our local experts guide you to the best of all of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">Explore Tours</Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-4 w-4" /> Ask a Local
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Rio's Best Experiences by Category</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Whether you have one day or one week in Rio, here are the experiences that should be on every visitor's list.</p>
        </div>
        <div className="space-y-10">
          {THINGS_TO_DO.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1D8A3C]" /> {cat.category}
              </h3>
              <div className={`grid md:grid-cols-2 gap-4 p-5 rounded-2xl border ${cat.color}`}>
                {cat.items.map((item) => (
                  <Link key={item.name} href={item.link} className="flex gap-3 group">
                    <ArrowRight className="h-4 w-4 text-[#1D8A3C] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-[#1D8A3C] transition-colors text-sm">{item.name}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Rio de Janeiro: A City Unlike Any Other</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Rio de Janeiro earns its nickname "A Cidade Maravilhosa" (The Marvelous City) every single day. Wedged between tropical mountains and the Atlantic Ocean, it offers a concentration of natural beauty, cultural depth and human energy that few places on Earth can match. The question for visitors isn't whether there's enough to do — it's how to prioritize an abundance that could fill months.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            The key to getting the most out of Rio de Janeiro is having local expertise. The city rewards those who go beyond the obvious tourist trail — who discover the neighborhood bar where musicians gather spontaneously, the viewpoint that Google Maps doesn't know about, the market stall serving the best pastel de carne in the city. That's what Janeiro Tour & Travel does: we unlock the layers of Rio that make it truly unforgettable.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">The Must-See Landmarks of Rio</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            <strong>Christ the Redeemer</strong> is the non-negotiable first choice. Standing at 30 meters atop Corcovado Mountain in the middle of Tijuca National Forest, it's one of the most powerful sights in the world. The journey there — by van through the rainforest or by cogwheel train — is itself an experience. Once at the top, the 360° view of Rio stretching from mountain to sea is simply awe-inspiring.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            <strong>Sugarloaf Mountain</strong> comes second. The two-stage cable car ride to the summit provides some of the most dramatic panoramic views in South America. At sunset, when the city lights begin to flicker and the sky turns gold over Guanabara Bay, it becomes one of the world's great spectacles. Plan this for late afternoon — your guide will time it perfectly.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            <strong>The Escadaria Selarón (Selaron Steps)</strong> connect Lapa and Santa Teresa in a 215-step mosaic staircase that took Chilean artist Jorge Selarón 23 years to complete. He covered the steps with more than 2,000 tiles from 60 countries — each donated by visitors from around the world. It became his life's work, and a symbol of Rio's capacity for art, obsession and beauty.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">Rio's Beaches: More Than Just Sun and Sand</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Copacabana and Ipanema are world-famous for good reason, but Rio's beach culture goes far deeper than sunbathing. The beach in Rio is a social institution — a democratic public space where all classes mix, where volleyball and footvolley games run continuously, where vendors weave through the crowds selling everything from cold beer to fresh coconuts, and where the city's most creative young people gather at sunset for impromptu concerts and drum circles.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Each beach has its own character. Arpoador, at the tip of Ipanema, is where the whole city gathers to watch the sunset from the rocks — a nightly ritual that ends with applause as the sun disappears below the horizon. Leblon, the quieter, more upscale extension of Ipanema, is where you'll see Rio's families picnicking on the sand. Leme, at the far end of Copacabana, is peaceful and local. Grumari and Prainha, further southwest, are wild, clean beaches loved by surfers.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">Culture, Music and Afro-Brazilian Heritage</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Rio de Janeiro is an Afro-Brazilian city at its core. Over half the population identifies as Black or mixed-race, and the cultural contributions of the African diaspora define everything from the city's music and food to its spiritual traditions and social movements. No visit to Rio is complete without engaging with this history.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Our Afro-Brazilian History Walking Tour takes you to Pequena África (Little Africa) in Rio's port zone — the neighborhood where hundreds of thousands of enslaved Africans first arrived in Brazil and where the foundations of Afro-Brazilian culture were laid. You'll visit UNESCO World Heritage Sites, learn about resistance movements, and understand how the African diaspora created the music, food and spiritual practices that make Rio what it is today.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Things to Do in Rio — FAQ</h2>
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
          <h2 className="text-2xl font-bold mb-4">Start Planning Your Rio Adventure</h2>
          <p className="text-white/80 mb-8">Let our local experts help you make the most of every hour in Rio de Janeiro.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">Browse All Tours <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/packages"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Tour Packages</Button></Link>
          </div>
          <p className="text-sm text-white/60">
            <Link href="/rio-travel-guide" className="underline hover:text-white">Rio Travel Guide</Link> ·{" "}
            <Link href="/rio-local-guide" className="underline hover:text-white">Local Tips</Link> ·{" "}
            <Link href="/faq" className="underline hover:text-white">FAQ</Link>
          </p>
        </div>
      </section>
    </>
  );
}
