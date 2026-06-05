import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Star } from "lucide-react";

const TX = {
  eyebrow:    { en: "What Travelers Say",                 es: "Lo Que Dicen los Viajeros",              pt: "O Que os Viajantes Dizem",               fr: "Ce Que Disent les Voyageurs",             de: "Was Reisende sagen",                        no: "Hva reisende sier" },
  heading:    { en: "Reviews & Testimonials",             es: "Reseñas y Testimonios",                  pt: "Avaliações e Depoimentos",               fr: "Avis et Témoignages",                     de: "Bewertungen & Testimonials",                no: "Anmeldelser og attester" },
  sub:        { en: "Real experiences from real travelers. Their words mean everything to us.", es: "Experiencias reales de viajeros reales. Sus palabras significan todo para nosotros.", pt: "Experiências reais de viajantes reais. Suas palavras significam tudo para nós.", fr: "Des expériences réelles de vrais voyageurs. Leurs mots comptent énormément pour nous.", de: "Echte Erfahrungen echter Reisender. Ihre Worte bedeuten uns alles.", no: "Ekte opplevelser fra ekte reisende. Ordene deres betyr alt for oss." },
  findOn:     { en: "Find us on TripAdvisor",             es: "Encuéntranos en TripAdvisor",            pt: "Encontre-nos no TripAdvisor",            fr: "Retrouvez-nous sur TripAdvisor",          de: "Finden Sie uns auf TripAdvisor",            no: "Finn oss på TripAdvisor" },
  tripLink:   { en: "Janeiro Tour & Travel on TripAdvisor ↗", es: "Janeiro Tour & Travel en TripAdvisor ↗", pt: "Janeiro Tour & Travel no TripAdvisor ↗", fr: "Janeiro Tour & Travel sur TripAdvisor ↗", de: "Janeiro Tour & Travel auf TripAdvisor ↗", no: "Janeiro Tour & Travel på TripAdvisor ↗" },
  excellent:  { en: "Excellent",                          es: "Excelente",                              pt: "Excelente",                              fr: "Excellent",                               de: "Ausgezeichnet",                             no: "Utmerket" },
  guestStories:{ en: "Guest Stories",                    es: "Historias de Huéspedes",                 pt: "Histórias de Hóspedes",                  fr: "Histoires de Clients",                    de: "Gästegeschichten",                          no: "Gjestenes historier" },
  experiences:{ en: "Experiences Shared by Our Travelers", es: "Experiencias Compartidas por Nuestros Viajeros", pt: "Experiências Compartilhadas pelos Nossos Viajantes", fr: "Expériences Partagées par Nos Voyageurs", de: "Von unseren Reisenden geteilte Erfahrungen", no: "Opplevelser delt av våre reisende" },
  tripTitle:  { en: "Read All Our Reviews",              es: "Leer Todas Nuestras Reseñas",            pt: "Ler Todas as Nossas Avaliações",         fr: "Lire Tous Nos Avis",                      de: "Alle unsere Bewertungen lesen",             no: "Les alle våre anmeldelser" },
  viewOn:     { en: "View on TripAdvisor",               es: "Ver en TripAdvisor",                     pt: "Ver no TripAdvisor",                     fr: "Voir sur TripAdvisor",                    de: "Auf TripAdvisor ansehen",                   no: "Se på TripAdvisor" },
  ctaTitle:   { en: "Ready to Create Your Own Story?",   es: "¿Listo para Crear Tu Propia Historia?",  pt: "Pronto para Criar a Sua Própria História?", fr: "Prêt à Créer Votre Propre Histoire ?",  de: "Bereit, Ihre eigene Geschichte zu schreiben?", no: "Klar til å skape din egen historie?" },
  ctaSub:     { en: "Join thousands of satisfied travelers who discovered Brazil with us.", es: "Únete a miles de viajeros satisfechos que descubrieron Brasil con nosotros.", pt: "Junte-se a milhares de viajantes satisfeitos que descobriram o Brasil conosco.", fr: "Rejoignez des milliers de voyageurs satisfaits qui ont découvert le Brésil avec nous.", de: "Schließen Sie sich Tausenden zufriedener Reisender an, die Brasilien mit uns entdeckt haben.", no: "Bli med tusenvis av fornøyde reisende som oppdaget Brasil med oss." },
  explore:    { en: "Explore Experiences",               es: "Explorar Experiencias",                  pt: "Explorar Experiências",                  fr: "Explorer les Expériences",                de: "Erlebnisse Erkunden",                       no: "Utforsk opplevelser" },
  talkToUs:   { en: "Talk to Us",                        es: "Habla con Nosotros",                     pt: "Fale Conosco",                           fr: "Nous Parler",                             de: "Sprechen Sie mit uns",                      no: "Snakk med oss" },
} as const;

const TESTIMONIALS_TX = {
  t1: { en: "Dandara and her team made our trip to Rio absolutely unforgettable. The Little Africa Walking Tour was the highlight of our entire Brazil trip — so much history, culture and heart. We felt welcomed like family.", fr: "Dandara et son équipe ont rendu notre voyage à Rio absolument inoubliable. Le Little Africa Walking Tour a été le point fort de tout notre voyage au Brésil — tellement d'histoire, de culture et de cœur.", de: "Dandara und ihr Team haben unsere Reise nach Rio absolut unvergesslich gemacht. Die Little Africa Walking Tour war das Highlight unserer gesamten Brasilienreise — so viel Geschichte, Kultur und Herzlichkeit." },
  t2: { en: "Excellent service from start to finish. Our private tour of Rio was perfectly organized and our guide was incredibly knowledgeable. I highly recommend Janeiro Tour & Travel to anyone visiting Brazil.", fr: "Un service excellent du début à la fin. Notre tour privé de Rio était parfaitement organisé et notre guide était incroyablement compétent. Je recommande vivement Janeiro Tour & Travel à tous ceux qui visitent le Brésil.", de: "Ausgezeichneter Service von Anfang bis Ende. Unsere private Tour durch Rio war perfekt organisiert und unser Reiseführer war unglaublich kompetent. Ich empfehle Janeiro Tour & Travel wärmstens jedem, der Brasilien besucht." },
  t3: { en: "We booked a customized package for Salvador da Bahia and it exceeded all expectations. Everything was arranged with care and professionalism. The team was always available and responsive. 5 stars without hesitation.", fr: "Nous avons réservé un forfait personnalisé pour Salvador da Bahia et il a dépassé toutes les attentes. Tout a été arrangé avec soin et professionnalisme. L'équipe était toujours disponible et réactive. 5 étoiles sans hésitation.", de: "Wir haben ein individuelles Paket für Salvador da Bahia gebucht und es hat alle Erwartungen übertroffen. Alles wurde mit Sorgfalt und Professionalität arrangiert. Das Team war immer verfügbar und reaktionsschnell. 5 Sterne ohne Zögern." },
  t4: { en: "Janeiro Tour & Travel organized our entire group trip — airport transfers, tours and activities across three cities. Flawless coordination. We were a group of 12 and everyone was delighted.", fr: "Janeiro Tour & Travel a organisé tout notre voyage en groupe — transferts aéroport, tours et activités dans trois villes. Une coordination parfaite. Nous étions un groupe de 12 et tout le monde était ravi.", de: "Janeiro Tour & Travel hat unsere gesamte Gruppenreise organisiert — Flughafentransfers, Touren und Aktivitäten in drei Städten. Makellose Koordination. Wir waren eine Gruppe von 12 und alle waren begeistert." },
  t5: { en: "The best travel investment I made for my Brazil trip. Dandara's knowledge of Rio's Black history and culture is extraordinary. I came back home with a completely new understanding of Brazil.", fr: "Le meilleur investissement voyage que j'ai fait pour mon voyage au Brésil. La connaissance de Dandara sur l'histoire noire et la culture de Rio est extraordinaire. Je suis rentré avec une compréhension complètement nouvelle du Brésil.", de: "Die beste Reiseinvestition, die ich für meine Brasilienreise getätigt habe. Dandaras Wissen über Rios schwarze Geschichte und Kultur ist außerordentlich. Ich bin mit einem völlig neuen Verständnis von Brasilien nach Hause gekommen." },
  t6: { en: "Professional, warm and incredibly helpful. They arranged everything for our honeymoon in Foz do Iguaçu and the experience was magical. We will definitely use Janeiro Tour & Travel again.", fr: "Professionnel, chaleureux et incroyablement utile. Ils ont tout organisé pour notre lune de miel à Foz do Iguaçu et l'expérience était magique. Nous utiliserons définitivement Janeiro Tour & Travel à nouveau.", de: "Professionell, herzlich und unglaublich hilfsbereit. Sie haben alles für unsere Flitterwochen in Foz do Iguaçu arrangiert und das Erlebnis war magisch. Wir werden Janeiro Tour & Travel definitiv wieder nutzen." },
} as const;

export default function ReviewsPage() {
  const { lang } = useLanguage();

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  const testimonials = [
    { name: "Sarah M.",  country: "United States",    textKey: "t1" as const, tour: "Little Africa Walking Tour" },
    { name: "Carlos R.", country: "España",            textKey: "t2" as const, tour: "Private Rio Tour" },
    { name: "Isabelle D.", country: "France",          textKey: "t3" as const, tour: "Custom Bahia Package" },
    { name: "James T.",  country: "United Kingdom",   textKey: "t4" as const, tour: "Group Tour — Rio & São Paulo" },
    { name: "Aisha K.",  country: "United States",    textKey: "t5" as const, tour: "Little Africa Walking Tour" },
    { name: "Marco F.",  country: "Italia",            textKey: "t6" as const, tour: "Honeymoon Package — Foz do Iguaçu" },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gray-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/banner-janeiro.jpg')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="eyebrow text-[#FFB600] mb-5">{tx("eyebrow")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{tx("heading")}</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">{tx("sub")}</p>
        </div>
      </section>

      {/* TripAdvisor badge */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">{tx("findOn")}</p>
            <a href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank" rel="noopener noreferrer" className="text-[#00af87] font-semibold hover:underline text-sm">
              {tx("tripLink")}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (<Star key={i} className="w-5 h-5 fill-[#FFB600] text-[#FFB600]" />))}
            </div>
            <span className="font-bold text-gray-900">5.0</span>
            <span className="text-sm text-gray-400">· {tx("excellent")}</span>
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4 text-center">{tx("guestStories")}</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-12 text-center">{tx("experiences")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => {
              const text = TESTIMONIALS_TX[t.textKey][lang as keyof typeof TESTIMONIALS_TX[typeof t.textKey]] ?? TESTIMONIALS_TX[t.textKey]["en"];
              return (
                <div key={t.name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (<Star key={i} className="w-4 h-4 fill-[#FFB600] text-[#FFB600]" />))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{text}"</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.country}</p>
                    <p className="text-xs text-[#FFB600] font-medium mt-1">{t.tour}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TripAdvisor widget */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="eyebrow text-[#FFB600] mb-4">TripAdvisor</p>
          <h2 className="font-bold text-2xl text-gray-900 mb-6">{tx("tripTitle")}</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 flex flex-col items-center gap-4 min-h-[180px] justify-center">
            <a href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#00af87] text-white font-semibold text-sm hover:bg-[#009970] transition-colors">
              {tx("viewOn")}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">{tx("ctaTitle")}</h2>
          <p className="text-white/70 mb-8">{tx("ctaSub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black transition-colors cursor-pointer">
                {tx("explore")}
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer">
                {tx("talkToUs")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
