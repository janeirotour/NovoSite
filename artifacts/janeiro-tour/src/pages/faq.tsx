import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown, MessageCircle, Award } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useListFaqs } from "@workspace/api-client-react";

const WHATSAPP = "https://wa.me/5521965297618";

type FaqDisplay = {
  id: number;
  en: { q: string; a: string };
  es: { q: string; a: string };
  pt: { q: string; a: string };
};

function FaqItem({ faq, lang, open, onToggle }: { faq: FaqDisplay; lang: string; open: boolean; onToggle: () => void }) {
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
  const [openId, setOpenId] = useState<number | null>(null);
  const { data: rawFaqs, isLoading } = useListFaqs();

  const faqs: FaqDisplay[] = (rawFaqs ?? []).map(f => ({
    id: f.id,
    en: { q: f.question, a: f.answer },
    es: { q: f.questionEs ?? f.question, a: f.answerEs ?? f.answer },
    pt: { q: f.questionPt ?? f.question, a: f.answerPt ?? f.answer },
  }));

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
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                lang={lang}
                open={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        )}

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
