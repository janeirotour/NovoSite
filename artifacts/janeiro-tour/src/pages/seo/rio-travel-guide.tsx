import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, MapPin, Sun, Clock, Shield } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%20need%20help%20planning%20my%20Rio%20trip";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Rio de Janeiro safe for tourists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rio de Janeiro is safe for tourists when you take sensible precautions and use experienced local guides. The South Zone (Ipanema, Copacabana, Leblon) is Rio's most visitor-friendly area. Avoid displaying expensive jewelry or electronics in public, use licensed taxis or ride apps (Uber, 99) and book tours with reputable operators like Janeiro Tour & Travel who know the city well.",
      },
    },
    {
      "@type": "Question",
      name: "What currency is used in Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brazil uses the Brazilian Real (BRL). USD, EUR and other major currencies are not widely accepted at local businesses but can be exchanged at airports, banks and currency exchange offices. Credit cards are accepted at most hotels, restaurants and tourist sites. ATMs are widely available.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a visa to visit Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brazil has introduced visa-free travel for citizens of the US, Canada, Australia and UK (as of 2024) for stays up to 90 days. EU citizens from most countries do not require a visa. Always check the latest entry requirements from the Brazilian consulate or your government's travel advisory before booking.",
      },
    },
    {
      "@type": "Question",
      name: "What language is spoken in Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Portuguese is the official language of Brazil. English is spoken at most hotels and tourist attractions in Rio de Janeiro. Our guides speak English, Portuguese, Spanish and French fluently.",
      },
    },
    {
      "@type": "Question",
      name: "What is the weather like in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rio has a tropical climate. Summer (December–March) is hot and humid (30–38°C) with frequent afternoon rain. Winter (June–September) is mild and dry (20–25°C) — the best time for sightseeing. Spring (October–November) and fall (April–May) offer warm temperatures and moderate rainfall.",
      },
    },
  ],
};

export default function RioTravelGuidePage() {
  return (
    <>
      <SeoHead
        title="Rio de Janeiro Travel Guide 2025 — Essential Tips for Visitors"
        description="Your complete Rio de Janeiro travel guide. Essential tips on safety, neighborhoods, weather, transport, food, culture and the best experiences in Rio. Updated for 2025."
        canonical="/rio-travel-guide"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio Travel Guide", url: "/rio-travel-guide" },
        ]}
        schemas={[faqSchema]}
      />

      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img src="/uploads/lh-blog-sao-paulo-river-bridge-getty878377556-1920x1080.jpg" alt="Rio de Janeiro travel guide" className="absolute inset-0 w-full h-full object-cover opacity-35" loading="eager" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Essential Planning Guide</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Rio de Janeiro Travel Guide</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Everything you need to know before visiting Rio — from safety tips to neighborhoods, food, transport and the experiences that make this city unforgettable.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">Book a Tour</Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Ask a Local</Button></a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Sun className="h-5 w-5" />, label: "Best Season", value: "May – October" },
            { icon: <Clock className="h-5 w-5" />, label: "Time Zone", value: "BRT (UTC-3)" },
            { icon: <MapPin className="h-5 w-5" />, label: "Airport", value: "GIG (Galeão)" },
            { icon: <Shield className="h-5 w-5" />, label: "Safety", value: "Use local guides" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-center text-[#1D8A3C] mb-1">{s.icon}</div>
              <div className="text-xs text-neutral-500 mb-0.5">{s.label}</div>
              <div className="font-bold text-neutral-900 text-sm">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rich Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Getting to Rio de Janeiro</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rio de Janeiro has two international airports. <strong>Galeão International Airport (GIG)</strong> on Ilha do Governador is the main international hub, handling flights from the US, Europe, and beyond. <strong>Santos Dumont Airport (SDU)</strong> is closer to the city center and handles domestic flights and some regional routes.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          From Galeão to the South Zone (Copacabana, Ipanema), you can take a taxi (official yellow taxis from the metered rank), Uber, or the BRT express bus that connects to the metro. We recommend booking an airport transfer in advance — Janeiro Tour & Travel offers private airport transfers in comfortable vehicles with professional drivers.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Rio's Best Neighborhoods</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Copacabana</strong> is Rio's most famous neighborhood, centered on its iconic crescent beach. It's cosmopolitan, busy and full of hotels, restaurants and nightlife. The mosaic-tile sidewalk (calçadão) is one of Rio's most recognizable features. Copacabana is where carioca beach culture is at its most electric.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Ipanema</strong> sits just west of Copacabana and has a more sophisticated, artistic atmosphere. The beach is less crowded but more fashionable. The streets behind the beach are lined with boutiques, galleries, bookshops and excellent restaurants. The weekly antique fair on Praça General Osório (Sundays) is a Rio institution.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Santa Teresa</strong> perches on a hillside above Centro, connected to the rest of the city by the famous yellow streetcar (Bonde). This is Rio's most bohemian neighborhood — a maze of cobblestone streets, colonial mansions, artist studios, independent restaurants and some of the best views in the city. It's where Rio's creative class lives and where you'll find the most authentic Rio cultural experience.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Lapa</strong>, adjacent to Santa Teresa, is Rio's entertainment district. The famous Arcos da Lapa (aqueduct) frames a neighborhood that comes alive on Thursday, Friday and Saturday nights with open-air samba and forró parties, live music bars and the sound of Rio's nightlife at its most authentic.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          <strong>Leblon</strong> is Rio's most upscale neighborhood, quieter and more residential than Copacabana. It has excellent restaurants, bars, and one of Rio's best markets (Cobal do Leblon). The beach at Leblon is slightly less crowded and offers stunning views of the Dois Irmãos mountains.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Food in Rio de Janeiro</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Brazilian cuisine in Rio reflects the city's multicultural character. <strong>Feijoada</strong> (a rich black bean stew with various cuts of pork, served with rice, farofa, couve and orange) is Brazil's national dish and a Rio tradition, typically served on Wednesdays and Saturdays. <strong>Churrasco</strong> (Brazilian barbecue) is an institution — the rodízio (all-you-can-eat) format is uniquely Brazilian.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Street food in Rio is excellent. <strong>Pastéis</strong> (fried pastry pockets with various fillings) are the classic street snack. <strong>Açaí</strong> (frozen açaí berry pulp, served as a thick bowl with granola, banana and honey) originated in the Amazon but became a carioca obsession. <strong>Pão de queijo</strong> (cheesy bread rolls made with cassava flour) and <strong>coxinha</strong> (chicken-filled croquettes) are everywhere.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          Afro-Brazilian cuisine is one of Rio's most exciting food scenes. <strong>Acarajé</strong> (deep-fried black-eyed pea fritters filled with vatapá and shrimp) comes from Bahia but has strong Rio connections. Our food tours explore the best of carioca cuisine with passionate local guides who know exactly where to eat.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Getting Around Rio</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Metro</strong>: Rio's metro system is clean, safe and efficient but limited to the South Zone, Centro and Barra da Tijuca. The Orange Line (Line 4) connects Ipanema to Barra in 15 minutes. The metro operates from 5am to midnight on weekdays, and 24 hours on weekends and holidays.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Ride Apps</strong>: Uber and 99 are widely available and reliable in Rio. We recommend using them for most city travel, especially at night. They're safe, metered and cashless.
        </p>
        <p className="text-neutral-700 leading-relaxed">
          <strong>Walking</strong>: The South Zone neighborhoods (Ipanema, Copacabana, Leblon, Botafogo) are very walkable. Santa Teresa is best explored on foot once you're there. Centro is walkable in the daytime but requires awareness about your surroundings.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Rio Travel Guide — FAQ</h2>
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

      <section className="bg-neutral-900 text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Plan Your Rio Trip with Local Experts</h2>
          <p className="text-white/70 mb-8">Let Janeiro Tour & Travel handle the logistics while you enjoy the experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">See All Tours <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button></a>
          </div>
          <p className="text-sm text-white/50">
            <Link href="/things-to-do-in-rio" className="underline hover:text-white">Things to Do in Rio</Link> ·{" "}
            <Link href="/rio-local-guide" className="underline hover:text-white">Local Guide</Link> ·{" "}
            <Link href="/transfers" className="underline hover:text-white">Airport Transfers</Link>
          </p>
        </div>
      </section>
    </>
  );
}
