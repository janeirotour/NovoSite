import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, MapPin, Coffee, Music, Camera, Utensils } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27d%20love%20local%20tips%20for%20Rio";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What do locals do in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Locals (called cariocas) in Rio go to the beach almost daily, gather at kiosks (quiosques) on the promenade for cold beer and snacks, watch sunset at Arpoador rock, eat feijoada on Saturdays, go to samba shows in Lapa on weekends, play footvolley on the beach, and spend weekend evenings at botequins (local bars). The beach is the great equalizer of Rio's social life.",
      },
    },
    {
      "@type": "Question",
      name: "What is a carioca?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A carioca is a person from Rio de Janeiro. The term comes from the Tupi word 'cari'oka' (house of the white men). Cariocas are known for their laid-back attitude (the famous 'jeitinho carioca'), love of the beach, passion for football and samba, and extraordinary openness and warmth to visitors.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best local restaurants in Rio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For traditional carioca food, look for botequins (traditional bars serving petiscos/bar snacks), kilo restaurants (pay-by-weight buffets with fresh Brazilian food), and local churrascarias. Avoid tourist trap restaurants near the main beaches — our guides know the places where cariocas actually eat.",
      },
    },
    {
      "@type": "Question",
      name: "What is the local currency and are prices high in Rio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brazil uses the Real (BRL). For international visitors from the US, Europe, UK and Australia, Rio is generally an affordable destination due to favorable exchange rates. Budget travelers can eat well for $10–15/day at local restaurants. Mid-range dining costs $20–40 per meal. Tours start from $49 per person.",
      },
    },
    {
      "@type": "Question",
      name: "What music do people listen to in Rio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rio's soundtrack is rich and varied: samba (traditional and pagode), funk carioca (baile funk), bossa nova, MPB (Música Popular Brasileira), axé and forró. On any given night, you can find live samba in Lapa, electronic funk at nightclubs, bossa nova in intimate bars, and percussion circles (rodas de samba) in neighborhood squares.",
      },
    },
  ],
};

const LOCAL_SECRETS = [
  { icon: <Camera className="h-5 w-5 text-[#FFB600]" />, title: "Best Viewpoints (Mirantes)", items: ["Mirante da Urca — before the cable car, often overlooked", "Parque das Ruínas in Santa Teresa — free entry, sweeping views", "Vista Chinesa — Tijuca Forest viewpoint with city panorama", "Morro do Leme — quiet park with panoramic bay views"] },
  { icon: <Coffee className="h-5 w-5 text-blue-500" />, title: "Local Café Culture", items: ["Confeitaria Colombo (Centro) — Belle Époque masterpiece since 1894", "Cobal do Leblon — market with great coffee, food and local vibe", "Bossa Nova bars in Ipanema for late afternoon drinks", "Kiosk culture on Copacabana — cold Brahma and petiscos"] },
  { icon: <Music className="h-5 w-5 text-purple-500" />, title: "Music & Nightlife", items: ["Pedra do Sal — outdoor samba every Monday and Friday", "Lapa on weekend nights — the best free samba in the city", "Rio Scenarium — iconic samba venue in Lapa", "Clube dos Democráticos — historic samba club"] },
  { icon: <Utensils className="h-5 w-5 text-red-500" />, title: "Real Local Food", items: ["Acarajé in the Feira de São Cristóvão (Bahian market)", "Pão de queijo at any padaria (bakery) before 10am", "Feijoada at a botequim on Saturday", "Pastel de nata from a neighborhood padaria"] },
];

export default function RioLocalGuidePage() {
  return (
    <>
      <SeoHead
        title="Rio de Janeiro Local Guide 2025 — Insider Tips from Carioca Experts"
        description="Discover Rio de Janeiro like a local. Insider tips on the best viewpoints, local food, music, beaches and hidden gems from Janeiro Tour & Travel's expert carioca guides."
        canonical="/rio-local-guide"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio Local Guide", url: "/rio-local-guide" },
        ]}
        schemas={[faqSchema]}
      />

      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img src="/uploads/escada.jpg" alt="Rio de Janeiro local guide — insider tips from cariocas" className="absolute inset-0 w-full h-full object-cover opacity-35" loading="eager" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Insider Knowledge</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Rio Local Guide</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            See Rio through carioca eyes. Our local expert guides share the insider knowledge — the secret viewpoints,
            local restaurants, music venues and hidden gems that most visitors never find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">Book a Local Guide</Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Get Local Tips</Button></a>
          </div>
        </div>
      </section>

      {/* Local Secrets */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Carioca Secrets: What Locals Know</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">These are the things that rarely make it into guidebooks — the insider knowledge that our local guides bring to every tour.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {LOCAL_SECRETS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                {section.icon}
                <h3 className="font-bold text-neutral-900">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                    <MapPin className="h-3.5 w-3.5 text-[#1D8A3C] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Rich Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Understanding Carioca Culture</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            To understand Rio de Janeiro, you must understand the carioca — the term for a person born in Rio. The carioca worldview is shaped by the city's extraordinary geography (living between mountains and sea), its tropical climate (which makes outdoor living essential) and its cultural richness (the synthesis of African, Indigenous and European traditions that created samba, carnival and one of the world's most distinctive urban cultures).
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            The beach is central to carioca identity in a way that goes far beyond recreation. The beach in Rio is a democratic social institution — a rare public space where people of all classes, races and ages share the same strip of sand. At the beach, the elaborate social hierarchies of Rio's urban life dissolve momentarily. The doctor from Ipanema plays footvolley next to the construction worker from the North Zone. The wealthy student from Leblon shares a volleyball court with teenagers from Rocinha.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Understanding this democratic beach culture — and the way it exists in tension with Rio's very real inequalities — is essential for understanding the city. Our local guides bridge these worlds for visitors, creating experiences that go beyond the surface to reveal the complex, beautiful, contradictory city that Rio de Janeiro truly is.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">The Language of Rio: Learning a Few Cariocismos</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Cariocas are known for a distinctive accent and a collection of expressions (cariocismos) that differ from standard Brazilian Portuguese. A few essentials: <strong>Mano</strong> (friend, buddy), <strong>Que barato</strong> (how cool!), <strong>Tipo assim</strong> (like, you know), <strong>Tá ligado?</strong> (you know what I mean?), <strong>Vish</strong> (oh no!), <strong>Bora</strong> (let's go). Speaking even a few words of Portuguese will be warmly received — cariocas deeply appreciate the effort.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">The Rhythm of Rio: A Day in the Life</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            A typical Rio day starts late by international standards. Breakfast is light — bread, cheese, cold cuts, fresh juice and coffee (often very strong and sweet). Lunch is the main meal: a plate with rice, beans (feijão), a protein and salad. Dinner is eaten late, often after 9pm. The afternoon heat makes this rhythm logical — siesta is common.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            The beach is most active in the morning (before 11am) and late afternoon (after 4pm). The hottest midday hours see locals retreating to shade, kiosks and the cooling ocean. Sunset is a ritual — at Arpoador rock on the Ipanema/Copacabana border, the entire neighborhood gathers on the rocks to watch the sun set over the Two Brothers mountains, applauding as it disappears below the horizon.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Weekends have their own rhythm. Saturday is feijoada day — every botequim and restaurant serves the traditional black bean stew with all the trimmings. Saturday night is for samba. Sunday morning is for the beach, leisurely brunch and family. If you can align your Rio visit with at least one Saturday, the city reveals a whole other dimension.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Local Guide FAQ</h2>
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

      <section className="bg-neutral-900 text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">See Rio Through Local Eyes</h2>
          <p className="text-white/70 mb-8">Our carioca guides bring decades of local knowledge to every experience. Book a tour or ask for personalized tips.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">Book a Local Guide <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us</Button></a>
          </div>
          <p className="text-sm text-white/50">
            <Link href="/rio-travel-guide" className="underline hover:text-white">Travel Guide</Link> ·{" "}
            <Link href="/things-to-do-in-rio" className="underline hover:text-white">Things to Do</Link> ·{" "}
            <Link href="/favela-tour-rio" className="underline hover:text-white">Favela Tours</Link>
          </p>
        </div>
      </section>
    </>
  );
}
