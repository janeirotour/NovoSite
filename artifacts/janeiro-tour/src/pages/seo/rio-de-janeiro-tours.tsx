import { Link } from "wouter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, MapPin, Shield, Award, ArrowRight, MessageCircle, Check } from "lucide-react";

const WHATSAPP = "https://wa.me/5521965297618?text=Hi%2C%20I%27m%20interested%20in%20Rio%20de%20Janeiro%20tours";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best tours in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best tours in Rio de Janeiro include the Christ the Redeemer & Sugarloaf Mountain full-day tour, the Afro-Brazilian History Walking Tour in Santa Teresa and the Rocinha Favela community tour. Janeiro Tour & Travel offers all these experiences with expert local guides.",
      },
    },
    {
      "@type": "Question",
      name: "Are tours in Rio de Janeiro safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Janeiro Tour & Travel's tours are carefully designed with safety as the top priority. Our local expert guides know the city deeply and all tours are conducted in trusted, well-traveled areas. We've been operating since 2014 with an excellent safety record.",
      },
    },
    {
      "@type": "Question",
      name: "How much do Rio de Janeiro tours cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rio de Janeiro tours with Janeiro Tour & Travel start from $49 per person for half-day shared tours. Private tours and multi-day packages are also available. Prices vary by duration, group size and experience type.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer private tours in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer fully private tours in Rio de Janeiro for individuals, couples, families and groups. Private tours are customizable, flexible and provide an exclusive experience with a dedicated local guide.",
      },
    },
    {
      "@type": "Question",
      name: "What languages do your Rio tour guides speak?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our guides speak English, Portuguese, Spanish and French. We serve travelers from the United States, Canada, United Kingdom, Australia, Germany, France, the Netherlands and Scandinavia.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a tour in Rio de Janeiro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book directly on our website at janeirotour.com, or contact us via WhatsApp at +55 21 96529-7618. We recommend booking at least 48 hours in advance to secure your preferred date and time.",
      },
    },
  ],
};

const tourSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Rio de Janeiro Tours by Janeiro Tour & Travel",
  description: "Premium guided tours in Rio de Janeiro, Brazil",
  url: "https://www.janeirotour.com/rio-de-janeiro-tours",
  numberOfItems: 12,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "TouristTrip",
        name: "Full-Day Rio de Janeiro City Tour",
        description: "Visit Christ the Redeemer, Sugarloaf Mountain, Ipanema and more on this comprehensive private or shared city tour.",
        url: "https://www.janeirotour.com/tours",
        touristType: "Cultural",
        itinerary: {
          "@type": "ItemList",
          itemListElement: ["Christ the Redeemer", "Sugarloaf Mountain", "Ipanema Beach", "Santa Teresa"],
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "TouristTrip",
        name: "Afro-Brazilian History Walking Tour",
        description: "Discover the hidden Afro-Brazilian history of Rio de Janeiro with an expert local guide in the Little Africa district.",
        url: "https://www.janeirotour.com/tours",
        touristType: "Cultural",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "TouristTrip",
        name: "Rocinha Favela Community Tour",
        description: "Experience authentic community life in Rocinha, Brazil's largest favela, guided by local residents.",
        url: "https://www.janeirotour.com/tours",
        touristType: "Community",
      },
    },
  ],
};

const TOURS = [
  {
    title: "Full-Day Rio City Tour",
    desc: "Christ the Redeemer, Sugarloaf, Ipanema & more",
    duration: "8 hours",
    group: "Up to 45",
    price: "from $89",
    type: "Shared & Private",
    slug: "full-day-rio-city-tour",
  },
  {
    title: "Afro-Brazilian History Tour",
    desc: "Little Africa, Gamboa & Afro-Brazilian heritage",
    duration: "4 hours",
    group: "Up to 15",
    price: "from $59",
    type: "Shared & Private",
    slug: "afro-brazilian-history-immersion-walking-tour",
  },
  {
    title: "Cristo Redentor & Tijuca Forest",
    desc: "Iconic monument + Atlantic rainforest",
    duration: "7 hours",
    group: "Up to 45",
    price: "from $75",
    type: "Shared & Private",
    slug: "cristo-redentor-tijuca-forest-city-tour",
  },
  {
    title: "Rocinha Favela Tour",
    desc: "Authentic community experience with local guides",
    duration: "3 hours",
    group: "Up to 12",
    price: "from $49",
    type: "Small Group",
    slug: "rocinha-favela-tour",
  },
  {
    title: "Helicopter Tour Rio",
    desc: "Breathtaking aerial views of the Marvelous City",
    duration: "1 hour",
    group: "Up to 6",
    price: "from $199",
    type: "Private",
    slug: "helicopter-tour-rio",
  },
  {
    title: "Lapa & Santa Teresa Night Tour",
    desc: "Samba, street art, nightlife & local culture",
    duration: "4 hours",
    group: "Up to 20",
    price: "from $65",
    type: "Shared & Private",
    slug: "lapa-santa-teresa-tour",
  },
];

export default function RioDeJaneiroToursPage() {
  return (
    <>
      <SeoHead
        title="Rio de Janeiro Tours 2025 — Best Guided Tours in Rio"
        description="Discover the best tours in Rio de Janeiro with Janeiro Tour & Travel. Explore Christ the Redeemer, Sugarloaf Mountain, favelas, Afro-Brazilian culture and more with expert local guides. Book now."
        canonical="/rio-de-janeiro-tours"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Rio de Janeiro Tours", url: "/rio-de-janeiro-tours" },
        ]}
        schemas={[faqSchema, tourSchema]}
      />

      {/* Hero */}
      <section className="relative bg-neutral-900 py-28 overflow-hidden">
        <img
          src="/uploads/img-header-pao-de-acucar-rio-bondinho.webp"
          alt="Rio de Janeiro tours — Sugarloaf Mountain panoramic view"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          loading="eager"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold tracking-widest text-sm mb-3 uppercase">Janeiro Tour & Travel</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Rio de Janeiro Tours
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Experience Rio through the eyes of local experts. Cultural tours, private experiences,
            helicopter rides and Afro-Brazilian heritage journeys — all with the city's top-rated guide team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">
                See All Tours
              </Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#1a1a1a] text-white py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm">
          {[
            { icon: <Star className="h-4 w-4 text-[#FFB600]" />, text: "5-Star Rated on Tripadvisor" },
            { icon: <Shield className="h-4 w-4 text-green-400" />, text: "Safety-First Approach" },
            { icon: <Award className="h-4 w-4 text-[#FFB600]" />, text: "Black-Owned Since 2014" },
            { icon: <Users className="h-4 w-4 text-blue-400" />, text: "10,000+ Happy Travelers" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2">
              {t.icon}
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tours Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-[#1D8A3C] font-semibold text-sm uppercase tracking-widest mb-2">Handpicked Experiences</p>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Our Most Popular Rio Tours</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Whether you're looking for the iconic landmarks, hidden cultural gems, or authentic community experiences,
            we have the perfect tour for your Rio de Janeiro adventure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {TOURS.map((tour) => (
            <Link key={tour.slug} href={`/tours/${tour.slug}`} className="group block bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-neutral-900 group-hover:text-[#1D8A3C] transition-colors">{tour.title}</h3>
                  <span className="text-xs bg-[#FFB600]/10 text-[#b38600] font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2">{tour.type}</span>
                </div>
                <p className="text-neutral-600 text-sm mb-4">{tour.desc}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{tour.group}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-[#1D8A3C]">{tour.price}</span>
                  <span className="text-sm text-[#1D8A3C] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/tours">
            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
              View All 12 Experiences <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Rio */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Book Rio de Janeiro Tours with Us?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Janeiro Tour & Travel is Rio's premier Black-owned Afrotourism agency. Here's what sets our tours apart.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Expert Local Guides",
                desc: "Our guides are Rio natives with deep knowledge of the city's history, culture and hidden gems. Many specialize in Afro-Brazilian heritage, which makes our tours uniquely authentic.",
              },
              {
                title: "Safety & Comfort First",
                desc: "Every tour route is carefully vetted. We use trusted transportation, visit well-known areas and our guides are trained to ensure every visitor feels secure and welcome throughout the experience.",
              },
              {
                title: "Small Groups, Big Impact",
                desc: "We keep group sizes small so you get personal attention and genuine interaction. No overcrowded buses — just meaningful, immersive experiences with local culture at the center.",
              },
              {
                title: "Multilingual Team",
                desc: "We serve travelers from the US, UK, Canada, Australia, Germany, France, Netherlands and Scandinavia. Our team speaks English, Portuguese, Spanish and French fluently.",
              },
              {
                title: "Flexible Booking",
                desc: "Book online anytime or contact us via WhatsApp. We're flexible with scheduling and can accommodate last-minute requests when availability allows.",
              },
              {
                title: "Black-Owned & Community-Led",
                desc: "Founded in 2014 by Dandara, an Afro-Brazilian entrepreneur, our agency gives back to the communities we visit. Booking with us directly supports local livelihoods.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-[#1D8A3C]" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content — SEO rich text */}
      <section className="max-w-4xl mx-auto px-4 py-16 prose prose-neutral max-w-none">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Rio de Janeiro Tours: The Complete Guide</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rio de Janeiro is one of the world's most breathtaking cities — a place where mountains meet the sea, vibrant street culture pulses through every neighborhood, and centuries of Afro-Brazilian history shape the identity of an entire nation. Visiting Rio without a knowledgeable local guide means missing the layers that make this city truly extraordinary.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          Janeiro Tour & Travel has been operating premium tours in Rio de Janeiro since 2014. Our team of expert local guides takes you beyond the postcard images to the authentic heart of the city — the samba bars of Lapa, the Afro-Brazilian temples of Candomblé in the Zona Norte, the breathtaking viewpoints known only to cariocas, and the vibrant communities of Santa Teresa and Rocinha.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">The Most Famous Landmarks in Rio de Janeiro</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Christ the Redeemer (Cristo Redentor)</strong> sits atop Corcovado Mountain at 710 meters above sea level and is recognized as one of the New Seven Wonders of the World. Our tours include transportation by van or cogwheel train through Tijuca National Forest — the world's largest urban rainforest — to reach the iconic 30-meter statue that watches over the entire city.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Sugarloaf Mountain (Pão de Açúcar)</strong> offers some of the most dramatic panoramic views in the world. The cable car ride to the summit of this 396-meter granite peak passes through Morro da Urca and delivers visitors to sweeping 360-degree views of Guanabara Bay, Copacabana Beach and the city skyline. Sunset at Sugarloaf is an unforgettable experience.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          <strong>Copacabana and Ipanema Beaches</strong> are two of the world's most famous stretches of sand. Ipanema, with its mosaic sidewalks and chic neighborhoods of Leblon and Ipanema, is where Rio's intellectual and artistic elite gather. Copacabana's 4km arc of white sand has hosted everything from New Year's Eve concerts to World Cup celebrations.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Cultural & Afro-Brazilian Tours in Rio</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rio de Janeiro is fundamentally an Afro-Brazilian city. Over 50% of its population identifies as Black or mixed-race, and the cultural contributions of the African diaspora are woven into every aspect of carioca life — from the syncopated rhythms of samba and funk to the spiritual practices of Candomblé and Umbanda, and the cuisine of acarajé and feijoada.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Our <strong>Afro-Brazilian History Walking Tour</strong> explores the Pequena África (Little Africa) district in the port zone — where enslaved Africans first arrived in Brazil and where the foundations of Afro-Brazilian culture were laid. You'll visit Valongo Wharf (a UNESCO World Heritage Site), the Instituto dos Pretos Novos and learn about the resistance movements that shaped Brazilian identity.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          The <strong>Santa Teresa neighborhood</strong>, perched on a hillside above Centro, is Rio's bohemian heart — a maze of cobblestone streets, colonial mansions converted into art studios, and the famous yellow streetcar (Bonde) that winds through the neighborhood. Our guides bring the stories of artists, revolutionaries and communities that have called Santa Teresa home for centuries.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Neighborhoods to Explore in Rio de Janeiro</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Rio's neighborhoods each have a distinct personality. <strong>Lapa</strong>, the city's nightlife district centered around the famous Arcos da Lapa (Rio aqueduct), comes alive on weekends with open-air samba and forró parties in the streets. <strong>Centro</strong> is home to the Museu de Arte do Rio, the Museu do Amanhã and historic buildings from the colonial era.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          <strong>Rocinha</strong>, with over 100,000 residents, is Brazil's largest favela and an urban phenomenon unto itself. Our community-based favela tours are conducted with local guides who live in Rocinha, ensuring an authentic, respectful and educational experience that challenges stereotypes and reveals the true resilience and creativity of favela communities.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-6">
          <strong>Leblon and Ipanema</strong> are Rio's most upscale neighborhoods, home to world-class restaurants, beach clubs and the famous Lagoa Rodrigo de Freitas. A walk along the mosaic-tiled Avenida Vieira Souto at sunset, with the Two Brothers Mountain (Dois Irmãos) in the background, is one of Rio's most iconic views.
        </p>

        <h3 className="text-xl font-bold text-neutral-900 mb-3">Planning Your Rio de Janeiro Tour</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          The best time to visit Rio de Janeiro is from May to October, when temperatures are mild (22–28°C) and rainfall is lower. However, Rio is a year-round destination — the famous carnival takes place in February or March and offers an unparalleled cultural experience.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Most of our tours depart from hotels in the South Zone (Zona Sul), covering Copacabana, Ipanema and Leblon. We also offer hotel pickups from Barra da Tijuca and parts of Centro for an additional fee. All tours are conducted in English, Portuguese or Spanish — just let us know your preference when booking.
        </p>
        <p className="text-neutral-700 leading-relaxed">
          Whether you have one day or one week in Rio, January Tour & Travel can design the perfect itinerary. From half-day introductions to the city to full-week immersion programs covering all of Rio's major highlights and hidden gems, we'll create memories that last a lifetime.
        </p>
      </section>

      {/* FAQs */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Frequently Asked Questions</h2>
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
      <section className="bg-[#1D8A3C] py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Rio de Janeiro?</h2>
          <p className="text-white/80 mb-8">
            Join thousands of travelers who've discovered the real Rio with Janeiro Tour & Travel.
            Book your tour today or chat with our team on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold px-8">
                Browse All Tours <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Also explore: <Link href="/packages" className="underline hover:text-white">Tour Packages</Link> · <Link href="/private-tours" className="underline hover:text-white">Private Tours</Link> · <Link href="/transfers" className="underline hover:text-white">Airport Transfers</Link>
          </p>
        </div>
      </section>
    </>
  );
}
