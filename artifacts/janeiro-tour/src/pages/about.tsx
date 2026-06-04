import { Link } from "wouter";
import { type LucideIcon, Heart, Globe, Shield, Star, Users, Leaf, MapPin, Award, Landmark, CheckCircle2 } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    desc: "We share the Brazil we know and love — not a curated postcard version, but the real, breathing, vibrant country.",
  },
  {
    icon: Globe,
    title: "Cultural Immersion",
    desc: "Every experience is designed to connect you with local people, stories, and traditions that rarely make it into guidebooks.",
  },
  {
    icon: Leaf,
    title: "Sustainable Tourism",
    desc: "We support local communities, respect natural environments, and believe travel should leave places better than we found them.",
  },
  {
    icon: Star,
    title: "Excellence in Service",
    desc: "From the first message to the final farewell, we hold ourselves to the highest standards of quality, care, and attention.",
  },
];

const whyUs = [
  { icon: Globe, title: "Local Expertise Since 2014", desc: "Over a decade guiding travelers from around the world through Brazil's most iconic and hidden destinations." },
  { icon: Star, title: "Carefully Curated Experiences", desc: "Every tour, transfer, and itinerary is thoughtfully designed to showcase Brazil's beauty and culture." },
  { icon: Users, title: "Multilingual Team", desc: "Our team assists guests in Portuguese, English, Spanish and French — so you always feel at home." },
  { icon: Shield, title: "Trusted & Licensed", desc: "Fully certified travel operator. Thousands of international travelers have placed their trust in us." },
  { icon: Heart, title: "Dedicated Personal Service", desc: "Every reservation is treated with dedication and responsibility — because every trip represents a dream." },
  { icon: Leaf, title: "Community & Sustainability", desc: "We partner with local guides, support communities, and practice responsible tourism at every step." },
];

const journey = [
  { year: "2014", text: "Dandara began her career promoting local excursions for Brazilians — learning the country from the inside out, building knowledge that no guidebook can teach." },
  { year: "2016", text: "The doors opened to international travelers. The Little Africa Walking Tour launched, along with tours to other Brazilian states — a turning point that defined our identity." },
  { year: "2020", text: "We launched fully customized packages for international travelers exploring Bahia, Foz do Iguaçu, Recife and São Paulo — covering events, leisure and business travel — while also expanding into B2B partnerships with international agencies." },
  { year: "Today", text: "A trusted partner for thousands of travelers from around the world, serving five iconic Brazilian destinations with the same passion and dedication we started with." },
];

export default function AboutPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80"
          alt="Rio de Janeiro — Janeiro Tour & Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-5">
            Janeiro Tour &amp; Travel
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 max-w-3xl leading-tight">
            A Story Built on Passion for Brazil
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">
            Born in Rio. Dedicated to showing the world the Brazil we love.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section id="our-story" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Founder image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/team-carnival.jpg"
                  alt="Dandara — Founder of Janeiro Tour & Travel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#FFB600] text-black px-6 py-4 rounded-2xl shadow-lg hidden md:block">
                <p className="font-bold text-2xl leading-none">10+</p>
                <p className="text-xs font-semibold mt-1 leading-tight">Years of<br />Excellence</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">Our Founder</p>
              <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">
                Meet Dandara
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3d1c00] text-[#f5c07a]">
                  <Shield size={11} /> Black-owned Business
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743]">
                  Afrotourism Pioneer
                </span>
              </div>
              <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                <p>
                  At Janeiro Tour &amp; Travel, our story is built on passion, authenticity and a deep love for Brazil.
                </p>
                <p>
                  Founded by Dandara — an Afro-Brazilian entrepreneur from Rio de Janeiro — Janeiro Tour &amp; Travel was born from a simple belief: visitors deserve to experience Brazil beyond the postcards. They deserve genuine connections, local insights and unforgettable moments that reveal the true soul of the country.
                </p>
                <p>
                  Since 2014, we have been welcoming travelers from around the world and transforming ordinary trips into extraordinary memories. What began in Rio de Janeiro as a small project driven by passion and dedication has grown into a trusted travel company recognized for its personalized service, cultural immersion and commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full story */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">The Full Story</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-10 text-center leading-tight">
            Why We Do What We Do
          </h2>
          <div className="space-y-5 text-gray-600 text-[15px] leading-relaxed">
            <p>
              Our greatest inspiration has always been Brazil itself — its vibrant culture, breathtaking landscapes, rich history and warm people. Every tour, transfer, itinerary and travel package we create is carefully designed to showcase the country's beauty while respecting local communities, supporting sustainable tourism and delivering exceptional service.
            </p>
            <p>
              Over the years, we have built strong partnerships with some of Brazil's most talented guides, drivers and tourism professionals, allowing us to offer authentic experiences with the highest standards of quality and safety.
            </p>
            <p>
              Today, we proudly serve travelers from all over the world. Our multilingual team provides assistance in Portuguese, English, Spanish and French, ensuring that every guest feels welcome, comfortable and supported from the first contact to the final farewell.
            </p>
            <p>
              More than a travel company, Janeiro Tour &amp; Travel is a team of people who genuinely care about creating happiness through travel. Every reservation we receive is treated with dedication, responsibility and attention to detail — because we understand that every trip represents a dream, a celebration or a once-in-a-lifetime experience.
            </p>
            <p className="font-medium text-gray-800">
              Our mission is simple: to help you discover the very best of Brazil through authentic experiences, trusted local expertise and unforgettable moments that stay with you long after your journey ends.
            </p>
          </div>
        </div>
      </section>

      {/* Afro-Tourism & Black-owned section */}
      <section className="py-24 bg-[#141210] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1598977054078-a4dd2d53c2ef?w=1400&q=60')] bg-cover bg-center" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f5c07a]/15 text-[#f5c07a] uppercase tracking-widest mb-5">
              <Shield size={12} /> Black-owned Business · Afrotourism
            </span>
            <h2 className="font-bold text-3xl md:text-4xl text-white mb-5 leading-tight">
              Rooted in Afro-Brazilian Culture
            </h2>
            <p className="text-white/65 text-base max-w-2xl mx-auto leading-relaxed">
              Janeiro Tour &amp; Travel is proudly Black-owned — founded and led by an Afro-Brazilian woman. Our team reflects the rich diversity at the heart of Brazil, and our experiences are designed to celebrate, amplify and connect travelers with the Afro-Brazilian heritage that built this country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {(
              [
                {
                  icon: Shield as LucideIcon,
                  title: "Black-owned Business",
                  desc: "Founded, led and operated by a Black entrepreneur from Rio de Janeiro. We are proud to represent Black excellence in Brazilian tourism.",
                },
                {
                  icon: Users as LucideIcon,
                  title: "Afro Team",
                  desc: "Our team is a direct reflection of Brazil's Afro-Brazilian community — guides, storytellers and culture-bearers who share their heritage with every guest.",
                },
                {
                  icon: Globe as LucideIcon,
                  title: "Afrotourism",
                  desc: "We specialize in experiences that honor Black culture, history and traditions — from Little Africa in Rio to Afro-Brazilian roots in Salvador, Bahia.",
                },
              ] as Array<{ icon: LucideIcon; title: string; desc: string }>
            ).map((item) => (
              <div key={item.title} className="bg-white/6 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <item.icon size={28} className="text-[#f5c07a] mb-5" />
                <h3 className="font-bold text-white text-base mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <blockquote className="max-w-2xl mx-auto text-center">
            <p className="text-white/80 text-lg italic leading-relaxed mb-4">
              "Brazil's greatest beauty is its people — and Afro-Brazilian culture is the beating heart of everything that makes this country extraordinary. We share it with pride."
            </p>
            <cite className="text-[#f5c07a] text-sm font-semibold not-italic">— Dandara, Founder of Janeiro Tour &amp; Travel</cite>
          </blockquote>
        </div>
      </section>

      {/* Official Recognition — Moção da Câmara Municipal */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Certificate image */}
            <div className="relative flex justify-center">
              <div className="relative max-w-sm w-full">
                <div className="absolute -inset-3 rounded-3xl bg-[#FFB600]/15 blur-xl" />
                <img
                  src="/images/mocao-camara-rio.jpeg"
                  alt="Moção de Reconhecimento — Câmara Municipal do Rio de Janeiro"
                  className="relative rounded-2xl shadow-2xl w-full border border-gray-200"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#009743] text-white px-5 py-3 rounded-xl shadow-lg text-xs font-bold leading-snug hidden md:block">
                  <p>03 maio 2022</p>
                  <p className="font-normal opacity-80">Câmara Municipal RJ</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743] uppercase tracking-widest mb-5">
                <Award size={12} /> Official Recognition
              </span>
              <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-5 leading-tight">
                Motion of Recognition and Praise
              </h2>
              <p className="text-[#FFB600] font-semibold text-sm mb-6">
                Rio de Janeiro City Council · 2022
              </p>
              <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed mb-8">
                <p>
                  On May 3, 2022, the Rio de Janeiro City Council awarded <strong className="text-gray-800">Dandara de Souza Siqueira</strong> an official Motion of Recognition and Praise for her outstanding contribution to tourism in the city of Rio de Janeiro.
                </p>
                <p>
                  The recognition highlights her dedication to promoting the cultural, historical and social richness of Rio de Janeiro — connecting visitors from around the world with the authentic spirit of the city through immersive, community-rooted experiences.
                </p>
                <p>
                  The motion was signed by City Councilwoman <strong className="text-gray-800">Tainá de Paula</strong> at the Teotônio Villela Assembly Chamber.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  <Landmark size={12} /> Rio de Janeiro City Council
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743] border border-[#009743]/20">
                  <CheckCircle2 size={12} /> Official recognition in tourism
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">Timeline</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-14 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            <div className="space-y-10">
              {journey.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                    <span className="font-bold text-2xl text-[#FFB600]">{item.year}</span>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.text}</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0 w-4 h-4 rounded-full bg-[#FFB600] border-4 border-white shadow-sm self-start md:self-auto mt-1 md:mt-0 ml-6 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-2" />
                  <div className="md:hidden flex-1 pl-4">
                    <span className="font-bold text-xl text-[#FFB600]">{item.year}</span>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.text}</p>
                  </div>
                  <div className="hidden md:block w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">What We Stand For</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#FFB600]/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#FFB600]" />
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">The Difference</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4 text-center">Why Travel With Us</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto text-center mb-12">
            We are not a generic travel operator. We are your dedicated Brazil specialists — committed to your journey from first contact to final farewell.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-[#FFB600]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews placeholder */}
      <section id="reviews" className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">What Travelers Say</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">Tripadvisor Reviews</h2>
          <p className="text-gray-500 text-base mb-10">
            We're proud of every review — they reflect years of dedication, care and passion for what we do.
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[220px]">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#00af87]" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            <p className="text-gray-400 text-sm font-medium">Tripadvisor reviews widget will be displayed here.</p>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00af87] text-sm font-semibold hover:underline"
            >
              View all reviews on Tripadvisor ↗
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/banner-janeiro.jpg')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-5">
            Welcome to Brasil
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Experience the Authentic Soul of Brazil
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Welcome to Brazil. Welcome to Janeiro Tour &amp; Travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black transition-colors cursor-pointer">
                Explore Experiences
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer">
                Talk to Us
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
