import { Link } from "wouter";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    country: "🇺🇸 United States",
    rating: 5,
    text: "Dandara and her team made our trip to Rio absolutely unforgettable. The Little Africa Walking Tour was the highlight of our entire Brazil trip — so much history, culture and heart. We felt welcomed like family.",
    tour: "Little Africa Walking Tour",
  },
  {
    name: "Carlos R.",
    country: "🇪🇸 Spain",
    rating: 5,
    text: "Excellent service from start to finish. Our private tour of Rio was perfectly organized and our guide was incredibly knowledgeable. I highly recommend Janeiro Tour & Travel to anyone visiting Brazil.",
    tour: "Private Rio Tour",
  },
  {
    name: "Isabelle D.",
    country: "🇫🇷 France",
    rating: 5,
    text: "We booked a customized package for Salvador da Bahia and it exceeded all expectations. Everything was arranged with care and professionalism. The team was always available and responsive. 5 stars without hesitation.",
    tour: "Custom Bahia Package",
  },
  {
    name: "James T.",
    country: "🇬🇧 United Kingdom",
    rating: 5,
    text: "Janeiro Tour & Travel organized our entire group trip — airport transfers, tours and activities across three cities. Flawless coordination. We were a group of 12 and everyone was delighted.",
    tour: "Group Tour — Rio & São Paulo",
  },
  {
    name: "Aisha K.",
    country: "🇺🇸 United States",
    rating: 5,
    text: "The best travel investment I made for my Brazil trip. Dandara's knowledge of Rio's Black history and culture is extraordinary. I came back home with a completely new understanding of Brazil.",
    tour: "Little Africa Walking Tour",
  },
  {
    name: "Marco F.",
    country: "🇮🇹 Italy",
    rating: 5,
    text: "Professional, warm and incredibly helpful. They arranged everything for our honeymoon in Foz do Iguaçu and the experience was magical. We will definitely use Janeiro Tour & Travel again.",
    tour: "Honeymoon Package — Foz do Iguaçu",
  },
];

export default function ReviewsPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-gray-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/banner-janeiro.jpg')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-5">
            What Travelers Say
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Reviews &amp; Testimonials
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Real experiences from real travelers. Their words mean everything to us.
          </p>
        </div>
      </section>

      {/* TripAdvisor badge */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Find us on TripAdvisor</p>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00af87] font-semibold hover:underline text-sm"
            >
              Janeiro Tour &amp; Travel on TripAdvisor ↗
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFB600] text-[#FFB600]" />
              ))}
            </div>
            <span className="font-bold text-gray-900">5.0</span>
            <span className="text-sm text-gray-400">· Excellent</span>
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4 text-center">
            Guest Stories
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-12 text-center">
            Experiences Shared by Our Travelers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= t.rating ? "fill-[#FFB600] text-[#FFB600]" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.country}</p>
                  <p className="text-xs text-[#FFB600] font-medium mt-1">{t.tour}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TripAdvisor widget placeholder */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold text-xs uppercase tracking-widest mb-4">
            TripAdvisor
          </p>
          <h2 className="font-bold text-2xl text-gray-900 mb-6">
            Read All Our Reviews
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 flex flex-col items-center gap-4 min-h-[180px] justify-center">
            <p className="text-gray-400 text-sm">TripAdvisor widget will appear here</p>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#00af87] text-white font-semibold text-sm hover:bg-[#009970] transition-colors"
            >
              View on TripAdvisor
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Own Story?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands of satisfied travelers who discovered Brazil with us.
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
