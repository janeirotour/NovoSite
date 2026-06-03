import { useListFaqs } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  const { lang } = useLanguage();
  const { data: faqs, isLoading } = useListFaqs();

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-neutral-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Help Center</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-white/70 text-lg">Everything you need to know about booking with Janeiro Tour</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {faqs?.map((faq) => {
              const q = lang === "es" ? (faq.questionEs ?? faq.question) : lang === "pt" ? (faq.questionPt ?? faq.question) : faq.question;
              const a = lang === "es" ? (faq.answerEs ?? faq.answer) : lang === "pt" ? (faq.answerPt ?? faq.answer) : faq.answer;
              return (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border rounded-xl px-5 bg-card">
                  <AccordionTrigger className="text-left font-semibold text-base py-5">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">{a}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center p-10 bg-primary/10 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">Our team is available 7 days a week via WhatsApp or email</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/+5521972633333" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8">
                WhatsApp Us
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-12 px-8">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
