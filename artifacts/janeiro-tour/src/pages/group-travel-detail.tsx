import { useGetGroupProgram } from "@workspace/api-client-react";
import { AccommodationAddon } from "@/components/accommodation/AccommodationAddon";
import { useParams } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import {
  Clock, Users, CheckCircle, XCircle, ArrowLeft, MessageCircle,
  Download, MapPin, Star, ChevronDown, ChevronUp, Bed, Bus,
  Sparkles, Globe, ArrowRight, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TX = {
  back:         { en: "All Group Programs",        es: "Todos los Programas",       pt: "Todos os Programas",        fr: "Tous les Programmes",         de: "Alle Programme",              no: "Alle programmer" },
  overview:     { en: "Program Overview",          es: "Resumen del Programa",      pt: "Visão Geral do Programa",   fr: "Aperçu du Programme",         de: "Programmübersicht",           no: "Programoversikt" },
  highlights:   { en: "Program Highlights",        es: "Puntos Destacados",         pt: "Destaques do Programa",     fr: "Points Forts du Programme",   de: "Programm-Highlights",         no: "Programhøydepunkter" },
  itinerary:    { en: "Suggested Itinerary",       es: "Itinerario Sugerido",       pt: "Itinerário Sugerido",       fr: "Itinéraire Suggéré",          de: "Vorgeschlagene Reiseroute",   no: "Foreslått reiserute" },
  included:     { en: "What's Included",           es: "Qué Está Incluido",         pt: "O Que Está Incluído",       fr: "Ce Qui Est Inclus",           de: "Was ist inbegriffen",         no: "Hva som er inkludert" },
  notIncluded:  { en: "Not Included",              es: "No Incluido",               pt: "Não Incluído",              fr: "Non Inclus",                  de: "Nicht inbegriffen",           no: "Ikke inkludert" },
  accommodation:{ en: "Accommodation Options",     es: "Opciones de Alojamiento",   pt: "Opções de Alojamento",      fr: "Options d'Hébergement",       de: "Unterkunftsoptionen",         no: "Overnattingsalternativer" },
  transport:    { en: "Transportation",            es: "Transporte",                pt: "Transporte",                fr: "Transport",                   de: "Transport",                   no: "Transport" },
  optionals:    { en: "Optional Experiences",      es: "Experiencias Opcionales",   pt: "Experiências Opcionais",    fr: "Expériences Optionnelles",    de: "Optionale Erlebnisse",        no: "Valgfrie opplevelser" },
  pricing:      { en: "Group Pricing",             es: "Precios por Grupo",         pt: "Preços por Grupo",          fr: "Tarifs de Groupe",            de: "Gruppenpreise",               no: "Gruppepriser" },
  landOnly:     { en: "Land Only",                 es: "Solo Tierra",               pt: "Só Terra",                  fr: "Terrestre Seulement",         de: "Nur Land",                    no: "Bare land" },
  complete:     { en: "Complete Package",          es: "Paquete Completo",          pt: "Pacote Completo",           fr: "Forfait Complet",             de: "Komplett-Paket",              no: "Komplett pakke" },
  pax:          { en: "passengers",                es: "pasajeros",                 pt: "passageiros",               fr: "passagers",                   de: "Passagiere",                  no: "passasjerer" },
  perPerson:    { en: "/ person",                  es: "/ persona",                 pt: "/ pessoa",                  fr: "/ personne",                  de: "/ Person",                    no: "/ person" },
  request:      { en: "Request a Custom Proposal", es: "Solicitar Propuesta",       pt: "Solicitar Proposta",        fr: "Demander un Devis",           de: "Angebot anfordern",           no: "Be om tilbud" },
  whatsapp:     { en: "WhatsApp us",               es: "WhatsApp",                  pt: "WhatsApp",                  fr: "WhatsApp",                    de: "WhatsApp",                    no: "WhatsApp" },
  download:     { en: "Download PDF Brochure",     es: "Descargar Brochure PDF",    pt: "Baixar Brochura PDF",       fr: "Télécharger Brochure PDF",    de: "PDF-Broschüre herunterladen", no: "Last ned PDF-brosjyre" },
  day:          { en: "Day",                       es: "Día",                       pt: "Dia",                       fr: "Jour",                        de: "Tag",                         no: "Dag" },
  targetAudience: { en: "Ideal For",              es: "Ideal Para",                pt: "Ideal Para",                fr: "Idéal Pour",                  de: "Ideal Für",                   no: "Ideell for" },
  ctaTitle:     { en: "Ready to book your group?", es: "¿Listo para reservar?",     pt: "Pronto para reservar?",     fr: "Prêt à réserver votre groupe?", de: "Bereit zu buchen?",         no: "Klar til å bestille gruppen?" },
  ctaSub:       {
    en: "Our B2B specialists are ready to create a tailored proposal for your group — including custom dates, exclusive experiences, and full DMC support.",
    es: "Nuestros especialistas B2B están listos para crear una propuesta adaptada a su grupo.",
    pt: "Nossos especialistas B2B estão prontos para criar uma proposta personalizada para o seu grupo.",
    fr: "Nos spécialistes B2B sont prêts à créer une proposition sur mesure pour votre groupe.",
    de: "Unsere B2B-Spezialisten erstellen gerne ein maßgeschneidertes Angebot für Ihre Gruppe.",
    no: "Våre B2B-spesialister er klare til å lage et skreddersydd tilbud for gruppen din.",
  },
  notFound:     { en: "Program not found",         es: "Programa no encontrado",    pt: "Programa não encontrado",   fr: "Programme introuvable",       de: "Programm nicht gefunden",     no: "Program ikke funnet" },
  currency:     { en: "USD",                       es: "USD",                       pt: "USD",                       fr: "USD",                         de: "USD",                         no: "USD" },
  optional:     { en: "optional add-on",           es: "complemento opcional",      pt: "complemento opcional",      fr: "option en supplément",        de: "Optionaler Zusatz",           no: "valgfritt tillegg" },
};

function PricingTable({
  title,
  tiers,
  formatPrice,
  highlight,
}: {
  title: string;
  tiers: { minPax: number; maxPax: number; pricePerPerson: number }[];
  formatPrice: (n: number) => string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border p-5", highlight ? "border-primary bg-primary/5" : "border-gray-100 bg-white")}>
      <h4 className={cn("text-sm font-bold uppercase tracking-widest mb-4", highlight ? "text-primary" : "text-gray-500")}>{title}</h4>
      <div className="space-y-2">
        {tiers.map((tier, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{tier.minPax}–{tier.maxPax} pax</span>
            <span className="text-base font-bold text-gray-900">{formatPrice(tier.pricePerPerson)}<span className="text-xs text-gray-400 font-normal"> /pp</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GroupTravelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const t = (key: keyof typeof TX) => TX[key][lang] ?? TX[key].en;

  const [openDay, setOpenDay] = useState<number | null>(0);

  const { data: prog, isLoading } = useGetGroupProgram(slug!);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!prog) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 text-lg">{t("notFound")}</p>
        <Link href="/group-travel">
          <Button className="mt-6" variant="outline">{t("back")}</Button>
        </Link>
      </div>
    );
  }

  const whatsappUrl = prog.whatsappNumber
    ? `https://wa.me/${prog.whatsappNumber.replace(/\D/g, "")}`
    : "https://wa.me/5521999999999";

  return (
    <>
      <SeoHead
        title={`${prog.title} — Janeiro Tour Group Travel`}
        description={prog.overview.slice(0, 160)}
      />

      {/* ── Hero ── */}
      <section className="relative h-80 lg:h-[460px] overflow-hidden">
        <img src={prog.heroImageUrl} alt={prog.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-4 pb-10 w-full">
            <Link href="/group-travel" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("back")}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Clock className="w-4 h-4" />{prog.duration}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/25 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wide">
                Land Only · No accommodation included
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>{prog.targetAudience}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white">{prog.title}</h1>
            {prog.subtitle && <p className="text-white/70 text-lg mt-1">{prog.subtitle}</p>}
          </div>
        </div>
      </section>

      {/* ── Sticky sidebar layout ── */}
      <div className="max-w-5xl mx-auto px-4 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> {t("overview")}
              </h2>
              <p className="text-gray-600 leading-relaxed">{prog.overview}</p>
            </section>

            {/* Highlights */}
            {prog.highlights?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" /> {t("highlights")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prog.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#009743] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {prog.suggestedItinerary?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> {t("itinerary")}
                </h2>
                <div className="space-y-2">
                  {prog.suggestedItinerary.map((day, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {t("day")} {day.day}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">{day.title}</span>
                        </div>
                        {openDay === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {openDay === i && (
                        <div className="px-4 pb-4 pt-0">
                          <p className="text-sm text-gray-600 leading-relaxed ml-11">{day.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What's Included / Not Included */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prog.whatsIncluded?.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#009743]" /> {t("included")}
                  </h2>
                  <ul className="space-y-1.5">
                    {prog.whatsIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-[#009743] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {prog.whatsNotIncluded?.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" /> {t("notIncluded")}
                  </h2>
                  <ul className="space-y-1.5">
                    {prog.whatsNotIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Accommodation */}
            {prog.accommodationOptions?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" /> {t("accommodation")}
                </h2>
                <div className="space-y-3">
                  {prog.accommodationOptions.map((acc, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{acc.name}</p>
                        {acc.description && <p className="text-xs text-gray-500 mt-0.5">{acc.description}</p>}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">{acc.category}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Transportation */}
            {prog.transportation && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Bus className="w-5 h-5 text-primary" /> {t("transport")}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{prog.transportation}</p>
              </section>
            )}

            {/* Optional Experiences */}
            {prog.optionalExperiences?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> {t("optionals")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prog.optionalExperiences.map((exp, i) => (
                    <div key={i} className="border border-dashed border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-gray-800 text-sm">{exp.name}</p>
                        <span className="text-sm font-bold text-primary whitespace-nowrap">+{formatPrice(exp.price)}</span>
                      </div>
                      {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                      <p className="text-[10px] text-gray-400 mt-1.5">{t("optional")}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accommodation Add-On */}
            <AccommodationAddon />

            {/* Pricing */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> {t("pricing")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prog.pricingLandOnly?.length > 0 && (
                  <PricingTable
                    title={t("landOnly")}
                    tiers={prog.pricingLandOnly}
                    formatPrice={formatPrice}
                  />
                )}
                {prog.pricingComplete?.length > 0 && (
                  <PricingTable
                    title={t("complete")}
                    tiers={prog.pricingComplete}
                    formatPrice={formatPrice}
                    highlight
                  />
                )}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Quick info card */}
              <div className="border border-gray-100 rounded-2xl bg-white p-5 shadow-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("landOnly")}</p>
                  <p className="text-3xl font-black text-gray-900">{formatPrice(prog.landOnlyFromPrice)}</p>
                  <p className="text-xs text-gray-400">{t("perPerson")}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("complete")}</p>
                  <p className="text-3xl font-black text-primary">{formatPrice(prog.completeFromPrice)}</p>
                  <p className="text-xs text-gray-400">{t("perPerson")}</p>
                </div>
                <div className="pt-2 space-y-2">
                  <Link href="/contact">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl">
                      {t("request")} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 rounded-xl">
                      <MessageCircle className="w-4 h-4 mr-2" /> {t("whatsapp")}
                    </Button>
                  </a>
                  {prog.pdfUrl && (
                    <a href={prog.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" className="w-full text-gray-600 rounded-xl">
                        <Download className="w-4 h-4 mr-2" /> {t("download")}
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Target audience */}
              <div className="border border-gray-100 rounded-2xl bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t("targetAudience")}</p>
                <p className="text-sm text-gray-700">{prog.targetAudience}</p>
              </div>

              {/* Certifications */}
              <div className="border border-primary/20 rounded-2xl bg-primary/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Why Janeiro Tour?</p>
                {[
                  "Ministry-certified DMC",
                  "Black-owned & community-led",
                  "10+ years of group expertise",
                  "Bilingual guides & staff",
                  "24/7 on-trip support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#009743] flex-shrink-0" />
                    <span className="text-xs text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <section className="bg-gray-950 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3">{t("ctaTitle")}</h2>
          <p className="text-white/60 mb-7">{t("ctaSub")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold rounded-xl px-8">
                <MessageCircle className="w-4 h-4 mr-2" /> {t("whatsapp")}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8">
                <Phone className="w-4 h-4 mr-2" /> {t("request")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
