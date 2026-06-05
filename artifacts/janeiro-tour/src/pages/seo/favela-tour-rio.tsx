import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, ArrowRight, MessageCircle, Shield, Heart } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20the%20favela%20tour%20in%20Rio";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is a favela tour in Rio de Janeiro safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our favela tours are conducted by local guides who live in or grew up in these communities, with established relationships and deep local knowledge. We visit Rocinha, Brazil's largest favela, which is a well-known community with thousands of visitors annually. Safety is our absolute priority and we have an excellent 10+ year safety record.",
      },
    },
    {
      "@type": "Question",
      name: "Is it ethical to do a favela tour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ethical favela tourism is possible and important when done correctly. Our tours are community-led — meaning local residents benefit directly from tourism income, guide employment and business promotion. We focus on education, dignity and cultural exchange, never poverty tourism or exploitation. We follow strict ethical guidelines developed with community leaders.",
      },
    },
    {
      "@type": "Question",
      name: "What will I see on the Rocinha favela tour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll explore Rocinha's main streets, visit local businesses, see vibrant street art, learn about community organization and infrastructure, and hear authentic stories from local guides. The tour focuses on the creativity, resilience and culture of one of Brazil's most dynamic urban communities.",
      },
    },
    {
      "@type": "Question",
      name: "How long is the Rocinha favela tour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Rocinha favela tour lasts approximately 2.5–3 hours. It can be combined with other Rio tours as part of a full-day experience.",
      },
    },
    {
      "@type": "Question",
      name: "What should I wear on a favela tour?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wear comfortable walking shoes, lightweight clothing and bring water. Avoid jewelry and expensive accessories. Bring some cash in local currency (BRL) if you'd like to purchase from local vendors and support community businesses.",
      },
    },
  ],
};

export default function FavelaTourRioPage() {
  return (
    <>
      <SeoHead
        title="Favela Tour Rio de Janeiro — Rocinha Community Tour with Local Guides"
        description="Join an ethical, community-led favela tour in Rio de Janeiro. Explore Rocinha with local guides, learn about Afro-Brazilian culture, street art and the real Rio. Book now."
        canonical="/favela-tour-rio"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio de Janeiro Tours", url: "/rio-de-janeiro-tours" },
          { name: "Favela Tour Rio", url: "/favela-tour-rio" },
        ]}
        schemas={[faqSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/1-rocinha-aerial-pano-2014.jpg"
          alt="Rocinha favela tour — Rio de Janeiro community experience"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Community-Led Experience</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Favela Tour Rio de Janeiro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            See the real Rio. Our ethical, community-led favela tour in Rocinha offers an authentic look at
            urban creativity, resilience and Afro-Brazilian culture — guided by people who call this place home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">Book This Tour</Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Heart className="h-5 w-5 text-red-500" />, title: "Community-Led", desc: "Local residents guide every tour, earning directly from your visit" },
            { icon: <Shield className="h-5 w-5 text-[#1D8A3C]" />, title: "Safe & Ethical", desc: "10+ years of ethical tourism with established community partnerships" },
            { icon: <Users className="h-5 w-5 text-blue-500" />, title: "Small Groups", desc: "Maximum 12 people ensures an intimate, respectful experience" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <div className="font-semibold text-neutral-900 mb-1">{item.title}</div>
                <div className="text-sm text-neutral-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Rocinha: Brazil's Largest Favela</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          With over 100,000 residents packed into a hillside between the affluent neighborhoods of São Conrado and Gávea in Rio de Janeiro's South Zone, Rocinha is Brazil's largest favela and one of the most densely populated urban communities in the world. It is not the crime-ridden slum of Hollywood stereotypes — it is a vibrant, self-organized city-within-a-city with its own economy, culture, businesses and social structures.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rocinha has its own shopping streets, banks, pharmacies, gyms, cable TV companies and even a McDonald's. Its residents are entrepreneurs, artists, teachers, tradespeople and community leaders who have built something remarkable under extraordinary circumstances. Understanding Rocinha means understanding something essential about Rio de Janeiro, Brazil and the human capacity for resilience.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          Janeiro Tour & Travel's favela tour is led by guides who are from Rocinha or have deep, long-standing relationships with the community. This isn't poverty tourism — it's an educational cultural exchange that benefits residents directly through employment, business referrals and tourism income.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">What You'll Experience</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          The tour begins with an overview of Rocinha from the Estrada da Gávea lookout point, which offers a striking aerial view of the favela climbing the hillside above the gleaming South Zone below. Your guide will explain the history of how Rocinha grew from a small settlement in the 1920s to the massive urban community it is today.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Inside Rocinha, you'll walk through the main commercial thoroughfare (Rua 1) lined with shops, snack bars and services that serve the local population. You'll see the impressive street art that covers many walls — some by internationally known artists, others by local talents expressing community identity and political statements. You'll visit local businesses, sample street food and hear stories that challenge everything you thought you knew about favela life.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          The tour includes a visit to a community project — a school, arts program, or social initiative — where you can learn about the extraordinary grassroots work being done by community organizations. These visits are arranged with full consent and cooperation of the people involved, with the goal of creating meaningful cultural exchange rather than spectacle.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Afro-Brazilian Roots in Rio's Favelas</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rio's favelas are deeply rooted in Afro-Brazilian history. The first favelas emerged in the late 19th century after the abolition of slavery in 1888, when hundreds of thousands of formerly enslaved Brazilians — the majority of African descent — were left without homes, land or economic support. Pushed to the hills (morros) above the city center, they built communities that became the incubators of some of Brazil's greatest cultural contributions.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Samba, Brazil's most iconic musical form, was born in the favelas of Rio de Janeiro in the early 20th century, developed by Afro-Brazilian musicians in neighborhoods like Cidade Nova and Praça Onze. Funk carioca, baile funk and pagode — the soundtrack of modern Rio — all emerged from favela communities. The culture of the favela is the culture of Afro-Brazilian Rio, and our tours honor this heritage with the depth and respect it deserves.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Our Ethical Approach to Favela Tourism</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Janeiro Tour & Travel has developed its favela tour approach in partnership with community leaders and residents over many years. We follow strict guidelines: no photography of individuals without explicit consent, no entering private homes, no portraying poverty as the main attraction, and a commitment to reinvesting in community businesses throughout the tour.
        </p>
        <p className="text-neutral-700 leading-relaxed">
          Every guide who leads our favela tours either lives in or has deep community roots in Rocinha. A portion of each tour's proceeds goes to a community fund that supports local social projects. We believe that ethical tourism should create real economic value for the communities it engages — not extract from them.
        </p>
      </section>

      {/* FAQs */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Favela Tour FAQ</h2>
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
          <h2 className="text-2xl font-bold mb-4">Join Our Ethical Favela Tour</h2>
          <p className="text-white/70 mb-8">Understand Rio beyond the postcards. Book your community tour today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/tours"><Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold">Book Now <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button></a>
          </div>
          <p className="text-sm text-white/50">
            Also explore: <Link href="/rio-de-janeiro-tours" className="underline hover:text-white">All Rio Tours</Link> ·{" "}
            <Link href="/rio-local-guide" className="underline hover:text-white">Rio Local Guide</Link> ·{" "}
            <Link href="/things-to-do-in-rio" className="underline hover:text-white">Things to Do in Rio</Link>
          </p>
        </div>
      </section>
    </>
  );
}
