import { Link } from "wouter";

const journey = [
  { year: "2014", text: "Dandara began her career promoting local excursions for Brazilians — learning the country from the inside out, building knowledge that no guidebook can teach." },
  { year: "2016", text: "The doors opened to international travelers. The Little Africa Walking Tour launched, along with tours to other Brazilian states — a turning point that defined our identity." },
  { year: "2020", text: "We launched fully customized packages for international travelers exploring Bahia, Foz do Iguaçu, Recife and São Paulo — covering events, leisure and business travel — while also expanding into B2B partnerships with international agencies." },
  { year: "Today", text: "A trusted partner for thousands of travelers from around the world, serving five iconic Brazilian destinations with the same passion and dedication we started with." },
];

export default function OurStoryPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80"
          alt="Rio de Janeiro"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-5">
            Janeiro Tour &amp; Travel
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
            Our Story
          </h1>
          <p className="text-white/75 text-lg max-w-xl">
            Born in Rio. Built on passion. Dedicated to Brazil.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/team-carnival.jpg"
                  alt="Dandara — Founder of Janeiro Tour & Travel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#FFB600] text-black px-6 py-4 rounded-2xl shadow-lg hidden md:block">
                <p className="font-bold text-2xl leading-none">10+</p>
                <p className="text-xs font-semibold mt-1 leading-tight">
                  Years of<br />Excellence
                </p>
              </div>
            </div>

            <div>
              <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">
                Our Founder
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">
                Meet Dandara
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3d1c00] text-[#f5c07a]">
                  ✊🏿 Black-owned Business
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
                  Founded by Dandara — an Afro-Brazilian entrepreneur born and raised in Rio de Janeiro — Janeiro Tour &amp; Travel was born from a simple belief: visitors deserve to experience Brazil beyond the postcards. They deserve genuine connections, local insights and unforgettable moments that reveal the true soul of the country, including its powerful Afro-Brazilian heritage.
                </p>
                <p>
                  Since 2014, we have been welcoming travelers from around the world and transforming ordinary trips into extraordinary memories. What began as a small project driven by passion has grown into a trusted travel company that proudly puts Afrotourism, Black culture and community at the center of everything we do.
                </p>
                <p>
                  Our Afro team reflects the rich diversity of Brazil — guides, storytellers and culture-bearers who share their heritage with every guest who travels with us.
                </p>
                <p>
                  Today, we proudly serve travelers from all over the world. Our multilingual team provides assistance in Portuguese, English, Spanish and French, ensuring that every guest feels welcome, comfortable and supported from the first contact to the final farewell.
                </p>
                <p className="font-medium text-gray-800">
                  Our mission: to help you discover the very best of Brazil — including the Afro-Brazilian roots that make this country extraordinary — through authentic experiences, trusted local expertise and unforgettable moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">
            Timeline
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-14 text-center">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            <div className="space-y-10">
              {journey.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
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

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to Brasil
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Welcome to Janeiro Tour &amp; Travel.
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
