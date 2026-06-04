import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown, MessageCircle, Award } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP = "https://wa.me/5521965297618";

type FAQ = {
  id: number;
  en: { q: string; a: string };
  es: { q: string; a: string };
  pt: { q: string; a: string };
};

const FAQS: FAQ[] = [
  {
    id: 1,
    en: {
      q: "How do I book a tour with Janeiro Tour & Travel?",
      a: "You can book directly through our website or contact us via WhatsApp at +55 21 96529-7618. Just tell us your travel dates, group size, and interests — we'll confirm availability and send you all the details within a few hours.",
    },
    es: {
      q: "¿Cómo reservo un tour con Janeiro Tour & Travel?",
      a: "Puedes reservar directamente en nuestro sitio web o contactarnos por WhatsApp al +55 21 96529-7618. Cuéntanos tus fechas de viaje, tamaño del grupo e intereses — confirmaremos disponibilidad y te enviaremos todos los detalles en pocas horas.",
    },
    pt: {
      q: "Como faço para reservar um tour com a Janeiro Tour & Travel?",
      a: "Você pode reservar diretamente pelo nosso site ou nos contatar pelo WhatsApp no +55 21 96529-7618. Basta nos informar suas datas de viagem, tamanho do grupo e interesses — confirmaremos a disponibilidade e enviaremos todos os detalhes em poucas horas.",
    },
  },
  {
    id: 2,
    en: {
      q: "What payment methods do you accept?",
      a: "We accept bank transfers, PayPal, and major credit cards. For some day tours, payment can also be made in cash on the day (USD or BRL). Contact us to arrange the best payment option for your booking.",
    },
    es: {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos transferencias bancarias, PayPal y las principales tarjetas de crédito. Para algunos tours de día, el pago también puede realizarse en efectivo el mismo día (USD o BRL). Contáctenos para acordar la mejor opción de pago para su reserva.",
    },
    pt: {
      q: "Quais formas de pagamento vocês aceitam?",
      a: "Aceitamos transferências bancárias, PayPal e os principais cartões de crédito. Para alguns tours de dia, o pagamento também pode ser feito em dinheiro no dia (USD ou BRL). Entre em contato para combinarmos a melhor opção para sua reserva.",
    },
  },
  {
    id: 3,
    en: {
      q: "What is your cancellation policy?",
      a: "Most tours offer free cancellation up to 24 hours before the scheduled time. Our 4-day Rio Essentials Package requires at least 7 days' notice for a full refund. If a tour is cancelled due to severe weather or unforeseen circumstances, we always offer a full refund or an alternative date.",
    },
    es: {
      q: "¿Cuál es su política de cancelación?",
      a: "La mayoría de los tours ofrecen cancelación gratuita hasta 24 horas antes del horario programado. Nuestro Paquete Rio Essentials de 4 días requiere al menos 7 días de aviso para reembolso completo. Si un tour se cancela por mal clima o circunstancias imprevistas, siempre ofrecemos reembolso completo o una fecha alternativa.",
    },
    pt: {
      q: "Qual é a política de cancelamento?",
      a: "A maioria dos tours oferece cancelamento gratuito até 24 horas antes do horário programado. O Pacote Rio Essenciais de 4 dias requer pelo menos 7 dias de aviso para reembolso integral. Se um tour for cancelado por mau tempo ou circunstâncias imprevistas, sempre oferecemos reembolso completo ou uma data alternativa.",
    },
  },
  {
    id: 4,
    en: {
      q: "Do your guides speak English and Spanish?",
      a: "Yes! All our guides are fluent in English, Spanish, and Portuguese. We are a multicultural team with extensive experience guiding travelers from North America, Europe, and Latin America.",
    },
    es: {
      q: "¿Sus guías hablan inglés y español?",
      a: "¡Sí! Todos nuestros guías hablan inglés, español y portugués con fluidez. Somos un equipo multicultural con amplia experiencia guiando viajeros de América del Norte, Europa y América Latina.",
    },
    pt: {
      q: "Os guias falam inglês e espanhol?",
      a: "Sim! Todos os nossos guias falam inglês, espanhol e português com fluência. Somos uma equipe multicultural com vasta experiência conduzindo viajantes da América do Norte, Europa e América Latina.",
    },
  },
  {
    id: 5,
    en: {
      q: "Can the tours be arranged as private experiences?",
      a: "Absolutely. Every tour we offer can be arranged as a fully private experience for individuals, couples, families, or groups. Private tours allow for flexible timing, customized itineraries, and a more personal connection with your guide.",
    },
    es: {
      q: "¿Los tours pueden organizarse como experiencias privadas?",
      a: "Por supuesto. Cada tour que ofrecemos puede organizarse como una experiencia completamente privada para individuos, parejas, familias o grupos. Los tours privados permiten horarios flexibles, itinerarios personalizados y una conexión más personal con su guía.",
    },
    pt: {
      q: "Os tours podem ser organizados como experiências privadas?",
      a: "Com certeza. Cada tour que oferecemos pode ser organizado como uma experiência totalmente privada para indivíduos, casais, famílias ou grupos. Os tours privativos permitem horários flexíveis, itinerários personalizados e uma conexão mais pessoal com seu guia.",
    },
  },
  {
    id: 6,
    en: {
      q: "Is Rio de Janeiro safe for tourists?",
      a: "Rio de Janeiro is a vibrant city enjoyed by millions of visitors every year. Our guides are locals who know the city deeply and lead all groups through safe, well-known routes. We monitor conditions daily and your safety is always our first priority. We'll share practical tips after booking to help you enjoy Rio with confidence.",
    },
    es: {
      q: "¿Es Río de Janeiro seguro para los turistas?",
      a: "Río de Janeiro es una ciudad vibrante que disfrutan millones de visitantes cada año. Nuestros guías son locales que conocen la ciudad profundamente y llevan a todos los grupos por rutas seguras y conocidas. Monitoreamos las condiciones diariamente y su seguridad siempre es nuestra primera prioridad. Compartiremos consejos prácticos después de la reserva para que disfrute Río con confianza.",
    },
    pt: {
      q: "O Rio de Janeiro é seguro para turistas?",
      a: "O Rio de Janeiro é uma cidade vibrante desfrutada por milhões de visitantes todos os anos. Nossos guias são locais que conhecem a cidade profundamente e levam todos os grupos por rotas seguras e conhecidas. Monitoramos as condições diariamente e sua segurança é sempre nossa primeira prioridade. Compartilharemos dicas práticas após a reserva para que você aproveite o Rio com confiança.",
    },
  },
  {
    id: 7,
    en: {
      q: "What should I wear and bring on a tour?",
      a: "Comfortable walking shoes are a must. We also recommend sunscreen, a hat, a refillable water bottle, and a small bag for personal items. For outdoor adventures like hang gliding or Amazon tours, specific gear recommendations will be shared after booking. Light, breathable clothing works best in Rio's tropical climate.",
    },
    es: {
      q: "¿Qué debo usar y llevar a un tour?",
      a: "Los zapatos cómodos para caminar son imprescindibles. También recomendamos protector solar, sombrero, botella de agua reutilizable y una pequeña bolsa para artículos personales. Para aventuras al aire libre como parapente o tours por el Amazonas, se compartirán recomendaciones específicas de equipo después de la reserva. La ropa ligera y transpirable funciona mejor en el clima tropical de Río.",
    },
    pt: {
      q: "O que devo usar e levar em um tour?",
      a: "Calçados confortáveis para caminhada são essenciais. Também recomendamos protetor solar, chapéu, garrafa de água reutilizável e uma mochila pequena para itens pessoais. Para aventuras ao ar livre como asa delta ou tours pela Amazônia, recomendações específicas de equipamentos serão compartilhadas após a reserva. Roupas leves e respiráveis funcionam melhor no clima tropical do Rio.",
    },
  },
  {
    id: 8,
    en: {
      q: "How far in advance should I book?",
      a: "We recommend booking at least 2–3 days in advance, especially during peak season (December–February and July). For our 4-day Rio Essentials Package or any custom itinerary, we suggest booking at least 1 week ahead to secure availability and make all necessary arrangements.",
    },
    es: {
      q: "¿Con cuánta anticipación debo reservar?",
      a: "Recomendamos reservar con al menos 2 a 3 días de anticipación, especialmente durante la temporada alta (diciembre-febrero y julio). Para nuestro Paquete Rio Essentials de 4 días o cualquier itinerario personalizado, sugerimos reservar con al menos 1 semana de anticipación para asegurar disponibilidad y hacer todos los arreglos necesarios.",
    },
    pt: {
      q: "Com quanto tempo de antecedência devo reservar?",
      a: "Recomendamos reservar com pelo menos 2 a 3 dias de antecedência, especialmente durante a alta temporada (dezembro-fevereiro e julho). Para o Pacote Rio Essenciais de 4 dias ou qualquer itinerário personalizado, sugerimos reservar com pelo menos 1 semana de antecedência para garantir disponibilidade e fazer todos os arranjos necessários.",
    },
  },
  {
    id: 9,
    en: {
      q: "Is Janeiro Tour & Travel a licensed operator?",
      a: "Yes. Janeiro Tour & Travel is certified by the Brazilian Ministry of Tourism under registration n° 20.966.047.0001/11, in full compliance with Brazilian tourism regulations. You can book with complete confidence.",
    },
    es: {
      q: "¿Janeiro Tour & Travel es un operador con licencia?",
      a: "Sí. Janeiro Tour & Travel está certificada por el Ministerio de Turismo de Brasil bajo el registro n° 20.966.047.0001/11, en plena conformidad con las regulaciones turísticas brasileñas. Puede reservar con total confianza.",
    },
    pt: {
      q: "A Janeiro Tour & Travel é uma operadora licenciada?",
      a: "Sim. A Janeiro Tour & Travel é certificada pelo Ministério do Turismo do Brasil sob o registro n° 20.966.047.0001/11, em plena conformidade com as regulamentações turísticas brasileiras. Você pode reservar com total confiança.",
    },
  },
  {
    id: 10,
    en: {
      q: "What makes Janeiro Tour & Travel different?",
      a: "We are a small, local team — born and raised in Rio de Janeiro. We offer authentic, human, and personalized experiences rather than mass tourism. Our guides are passionate storytellers who genuinely love sharing Brazil with the world. Every tour is an opportunity to connect with the real soul of this extraordinary country.",
    },
    es: {
      q: "¿Qué hace diferente a Janeiro Tour & Travel?",
      a: "Somos un equipo local pequeño — nacidos y criados en Río de Janeiro. Ofrecemos experiencias auténticas, humanas y personalizadas en lugar de turismo masivo. Nuestros guías son narradores apasionados que genuinamente aman compartir Brasil con el mundo. Cada tour es una oportunidad para conectarse con el verdadero alma de este extraordinario país.",
    },
    pt: {
      q: "O que diferencia a Janeiro Tour & Travel?",
      a: "Somos uma equipe local pequena — nascidos e criados no Rio de Janeiro. Oferecemos experiências autênticas, humanas e personalizadas em vez de turismo em massa. Nossos guias são narradores apaixonados que genuinamente amam compartilhar o Brasil com o mundo. Cada tour é uma oportunidade de se conectar com a verdadeira alma deste país extraordinário.",
    },
  },
];

function FaqItem({ faq, lang, open, onToggle }: { faq: FAQ; lang: string; open: boolean; onToggle: () => void }) {
  const content = lang === "es" ? faq.es : lang === "pt" ? faq.pt : faq.en;
  return (
    <div className={cn("border rounded-xl overflow-hidden transition-colors", open ? "border-[#FFB600]/40 bg-[#FFB600]/5" : "border-gray-200 bg-white")}>
      <button
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
        onClick={onToggle}
      >
        <span className="font-semibold text-gray-900 text-base leading-snug">{content.q}</span>
        <ChevronDown className={cn("w-5 h-5 text-[#FFB600] flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {content.a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { lang } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(1);

  const t = {
    en: {
      tag: "Help Center",
      h1: "Frequently Asked Questions",
      sub: "Everything you need to know about traveling with Janeiro Tour & Travel.",
      still: "Still have questions?",
      stillSub: "Our team is available 7 days a week via WhatsApp or email.",
      wa: "Chat on WhatsApp",
      contact: "Contact Us",
      cert: "Certified by the Brazilian Ministry of Tourism",
      certNum: "Registration n° 20.966.047.0001/11",
    },
    es: {
      tag: "Centro de Ayuda",
      h1: "Preguntas Frecuentes",
      sub: "Todo lo que necesitas saber sobre viajar con Janeiro Tour & Travel.",
      still: "¿Todavía tienes preguntas?",
      stillSub: "Nuestro equipo está disponible 7 días a la semana por WhatsApp o email.",
      wa: "Chatear en WhatsApp",
      contact: "Contáctenos",
      cert: "Certificada por el Ministerio de Turismo de Brasil",
      certNum: "Registro n° 20.966.047.0001/11",
    },
    pt: {
      tag: "Central de Ajuda",
      h1: "Perguntas Frequentes",
      sub: "Tudo o que você precisa saber sobre viajar com a Janeiro Tour & Travel.",
      still: "Ainda tem dúvidas?",
      stillSub: "Nossa equipe está disponível 7 dias por semana via WhatsApp ou email.",
      wa: "Chat no WhatsApp",
      contact: "Fale Conosco",
      cert: "Certificada pelo Ministério do Turismo do Brasil",
      certNum: "Registro n° 20.966.047.0001/11",
    },
  }[lang] ?? {
    tag: "Help Center",
    h1: "Frequently Asked Questions",
    sub: "Everything you need to know about traveling with Janeiro Tour & Travel.",
    still: "Still have questions?",
    stillSub: "Our team is available 7 days a week via WhatsApp or email.",
    wa: "Chat on WhatsApp",
    contact: "Contact Us",
    cert: "Certified by the Brazilian Ministry of Tourism",
    certNum: "Registration n° 20.966.047.0001/11",
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB600]/15 to-[#009743]/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-4">{t.tag}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.h1}</h1>
          <p className="text-white/70 text-lg">{t.sub}</p>
        </div>
      </section>

      {/* Certification badge */}
      <div className="bg-[#009743]/8 border-b border-[#009743]/15">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
          <Award className="w-5 h-5 text-[#009743] flex-shrink-0" />
          <p className="text-sm text-[#009743] font-medium">
            {t.cert} — <span className="font-semibold">{t.certNum}</span>
          </p>
        </div>
      </div>

      {/* FAQ list */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              lang={lang}
              open={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-10 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.still}</h3>
          <p className="text-gray-500 mb-7">{t.stillSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 font-semibold gap-2">
                <MessageCircle className="w-4 h-4" />
                {t.wa}
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-12 px-8">
                {t.contact}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
