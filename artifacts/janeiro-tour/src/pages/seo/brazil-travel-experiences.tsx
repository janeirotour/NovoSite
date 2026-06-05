import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, MapPin } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20Brazil%20travel%20experiences";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best travel experiences in Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brazil's top travel experiences include: visiting Christ the Redeemer and Sugarloaf Mountain in Rio de Janeiro, attending Carnival, experiencing Afro-Brazilian culture and Candomblé in Bahia and Rio, exploring the Amazon Rainforest, visiting Iguaçu Falls, and enjoying the beaches of Florianópolis and Fernando de Noronha.",
      },
    },
    {
      "@type": "Question",
      name: "Is Brazil a good destination for first-time visitors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Brazil is an excellent destination for first-time visitors, especially Rio de Janeiro which has excellent tourist infrastructure. The key is to book with reputable local tour operators who know the country well, use reliable transportation and follow sensible safety practices.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Brazil unique as a travel destination?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brazil is unique for its extraordinary combination of natural wonders (Amazon, Iguaçu Falls, Pantanal, beaches), cultural diversity (Afro-Brazilian, Indigenous, European, Japanese influences), vibrant city life (Rio de Janeiro, São Paulo, Salvador), and the warmth of its people. It is the world's fifth largest country and offers experiences found nowhere else on Earth.",
      },
    },
    {
      "@type": "Question",
      name: "What language is spoken in Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Portuguese is the official language of Brazil. Brazilian Portuguese differs from European Portuguese in pronunciation and some vocabulary. English is widely spoken in tourist areas of Rio de Janeiro. Our guides speak English, Spanish, French and Portuguese.",
      },
    },
  ],
};

const DESTINATIONS = [
  { name: "Rio de Janeiro", desc: "The Marvelous City — Christ the Redeemer, Sugarloaf, beaches, samba and Afro-Brazilian culture", link: "/rio-de-janeiro-tours", img: "/uploads/img-header-pao-de-acucar-rio-bondinho.webp" },
  { name: "Bahia", desc: "Brazil's most African state — Salvador's Pelourinho, Candomblé rituals and stunning coastal beauty", link: "/tours", img: "/uploads/pelourinho.jpg" },
  { name: "Amazon Rainforest", desc: "The world's greatest rainforest — wildlife, indigenous communities and unparalleled natural wonder", link: "/tours", img: "/uploads/lh-blog-sao-paulo-river-bridge-getty878377556-1920x1080.jpg" },
  { name: "Foz do Iguaçu", desc: "The world's most spectacular waterfalls — 275 falls spanning the Brazil-Argentina border", link: "/tours", img: "/uploads/6ccd9bf7-6d89-4a75-b6fd-7c007a72740a.webp" },
];

export default function BrazilTravelExperiencesPage() {
  return (
    <>
      <SeoHead
        title="Brazil Travel Experiences — Best Tours & Cultural Journeys in Brazil"
        description="Explore the best travel experiences in Brazil. From Rio de Janeiro tours to Bahia, the Amazon and beyond — discover authentic Brazil with expert local guides from Janeiro Tour & Travel."
        canonical="/brazil-travel-experiences"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Brazil Travel Experiences", url: "/brazil-travel-experiences" },
        ]}
        schemas={[faqSchema]}
      />

      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img src="/uploads/313436534-5783652584990398-6005883414559693748-n.jpg" alt="Brazil travel experiences" className="absolute inset-0 w-full h-full object-cover opacity-35" loading="eager" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">South America's Greatest Adventure</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Brazil Travel Experiences</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">From the mountains of Rio to the rainforests of the Amazon, Brazil offers travel experiences that exist nowhere else on Earth. Let our local experts introduce you to the real Brazil.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">Explore Experiences</Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Plan My Trip</Button></a>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Brazil's Most Incredible Destinations</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Janeiro Tour & Travel specializes in Rio de Janeiro but also helps clients experience the best of Brazil beyond the Marvelous City.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {DESTINATIONS.map((dest) => (
            <Link key={dest.name} href={dest.link} className="group block rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-1 text-sm font-semibold"><MapPin className="h-3.5 w-3.5" />{dest.name}</div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-neutral-600 text-sm">{dest.desc}</p>
                <div className="mt-3 text-[#1D8A3C] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Why Brazil is a Once-in-a-Lifetime Destination</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Brazil is the fifth largest country on Earth, the largest in South America, and one of the most biologically and culturally diverse places on the planet. It contains the Amazon Rainforest (the world's largest tropical rainforest), the Pantanal (the world's largest tropical wetland), and over 7,000 kilometers of Atlantic coastline with some of the world's most beautiful beaches.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            But Brazil's greatest treasure may be its people and culture. Brazilian civilization is a remarkable synthesis of Indigenous South American, African, Portuguese, Italian, German, Japanese and other immigrant traditions — producing a unique cultural identity expressed in music (samba, forró, bossa nova, baile funk, MPB), food (feijoada, açaí, acarajé, churrasco, pão de queijo), art, literature and spiritual practice.
          </p>
          <p className="text-neutral-700 leading-relaxed mb-6">
            The Afro-Brazilian contribution to this culture is immeasurable. Brought to Brazil involuntarily over 300 years of the slave trade, African peoples created the foundations of Brazilian music, cuisine and spirituality under conditions of extreme oppression — a testament to human resilience and creativity that Janeiro Tour & Travel is dedicated to honoring and sharing with the world.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">Rio de Janeiro: The Heart of Brazilian Travel</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            For most international visitors, Brazil begins in Rio de Janeiro — and it's easy to understand why. Rio concentrates so much of what makes Brazil extraordinary in one spectacular city: dramatic natural beauty (the meeting of mountains, sea and Guanabara Bay), world-famous landmarks (Cristo Redentor, Pão de Açúcar), iconic beaches (Copacabana, Ipanema), vibrant Afro-Brazilian culture and one of the world's greatest parties (Carnival).
          </p>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Janeiro Tour & Travel is based in Rio de Janeiro and specializes in helping international visitors — particularly from the US, UK, Canada, Australia, Germany, France, Netherlands and Scandinavia — discover the full depth of what Rio has to offer, with a particular focus on the city's Afro-Brazilian heritage.
          </p>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">Bahia: Brazil's Most African State</h3>
          <p className="text-neutral-700 leading-relaxed mb-4">
            If Rio is Brazil's most visited city, Bahia is its most African state — and for many Black international travelers, it is the most emotionally resonant destination in Brazil. Salvador, Bahia's capital, is the city with the highest proportion of Afro-Brazilian residents in the country and the center of Candomblé (the Afro-Brazilian spiritual tradition that survived centuries of suppression).
          </p>
          <p className="text-neutral-700 leading-relaxed">
            The historic Pelourinho district of Salvador, a UNESCO World Heritage Site, is a stunning collection of colonial architecture that bears witness to both the wealth generated by slave labor and the enduring culture of those who were enslaved there. Capoeira, the Afro-Brazilian martial art/dance form, was born in Bahia. So was axé music and much of what makes Brazilian culture unique and powerful.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Brazil Travel FAQ</h2>
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
          <h2 className="text-2xl font-bold mb-4">Start Your Brazil Adventure</h2>
          <p className="text-white/70 mb-8">Rio de Janeiro is the perfect starting point. Let us introduce you to the real Brazil.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">Explore Rio Tours <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> Plan My Trip</Button></a>
          </div>
          <p className="text-sm text-white/50">
            <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">Rio Tours</Link> ·{" "}
            <Link href="/rio-tour-packages" className="underline hover:text-white">Tour Packages</Link> ·{" "}
            <Link href="/rio-travel-guide" className="underline hover:text-white">Travel Guide</Link>
          </p>
        </div>
      </section>
    </>
  );
}
