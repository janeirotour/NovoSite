import { useListGroupPrograms } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Users, Clock, ArrowRight, CheckCircle, Star, Award, Globe,
  MessageCircle, Shield, Briefcase, Building2, HeartHandshake,
} from "lucide-react";

const TX = {
  eyebrow:    { en: "B2B Group Travel Programs",             es: "Programas de Viaje Grupal B2B",         pt: "Programas de Viagem em Grupo B2B",       fr: "Programmes Voyage de Groupe B2B",         de: "B2B-Gruppenreiseprogramme",              no: "B2B-gruppereiseprogrammer" },
  heading:    { en: "Group Travel Programs",                 es: "Programas de Viajes en Grupo",          pt: "Programas de Viagem em Grupo",           fr: "Programmes de Voyages de Groupe",         de: "Gruppenreiseprogramme",                  no: "Gruppereiseprogrammer" },
  sub:        {
    en: "Curated multi-day programs for incentive groups, corporate travel, affinity travel, and cultural tours. Fully customizable for groups of 10–200+ travelers.",
    es: "Programas de varios días curados para grupos de incentivos, viajes corporativos, turismo de afinidad y tours culturales.",
    pt: "Programas de vários dias para grupos de incentivo, viagens corporativas, turismo de afinidade e tours culturais.",
    fr: "Programmes de plusieurs jours pour groupes incentive, voyages d'entreprise, affinité et tours culturels.",
    de: "Kuratierte Mehrtagesprogramme für Incentive-Gruppen, Geschäftsreisen, Affinitätsreisen und Kulturtouren.",
    no: "Kurerte flerdagsprogrammer for incentivgrupper, bedriftsreiser, affinitetsreiser og kulturturisme.",
  },
  trust1:     { en: "Ministry-certified operator",          es: "Operador certificado por el Ministerio", pt: "Operadora certificada pelo Ministério",  fr: "Opérateur certifié par le Ministère",     de: "Ministeriumszertifizierter Betreiber",    no: "Ministergodkjent operatør" },
  trust2:     { en: "10+ years group expertise",            es: "10+ años de experiencia en grupos",     pt: "10+ anos de experiência em grupos",      fr: "10+ ans d'expertise en groupes",          de: "10+ Jahre Gruppen-Expertise",            no: "10+ års gruppeekspertise" },
  trust3:     { en: "Black-owned & Afrotourism certified",  es: "Empresa negra y certificada Afrotoursimo", pt: "Empresa negra certificada em Afroturismo", fr: "Propriété noire & certifié Afrotourisme", de: "Schwarz-geführt & Afrotourismus-zertifiziert", no: "Svart eid og Afroturisme-sertifisert" },
  landOnly:   { en: "Land Only from",                       es: "Solo Tierra desde",                     pt: "Só Terra a partir de",                   fr: "Terrestre seulement à partir de",         de: "Nur Land ab",                            no: "Bare land fra" },
  complete:   { en: "Complete Package from",                es: "Paquete Completo desde",                pt: "Pacote Completo a partir de",            fr: "Forfait Complet à partir de",             de: "Komplett-Paket ab",                      no: "Komplett pakke fra" },
  perPerson:  { en: "/ person",                             es: "/ persona",                             pt: "/ pessoa",                               fr: "/ personne",                              de: "/ Person",                               no: "/ person" },
  details:    { en: "View Program Details",                 es: "Ver Detalles del Programa",             pt: "Ver Detalhes do Programa",               fr: "Voir les Détails du Programme",           de: "Programm-Details anzeigen",              no: "Se programdetaljer" },
  request:    { en: "Request a Custom Proposal",            es: "Solicitar Propuesta Personalizada",     pt: "Solicitar Proposta Personalizada",       fr: "Demander une Proposition Personnalisée",  de: "Maßgeschneiderte Angebote anfordern",    no: "Be om et tilpasset tilbud" },
  ctaTitle:   { en: "Planning a group trip to Rio?",        es: "¿Planificando un viaje grupal a Río?", pt: "Planejando uma viagem em grupo ao Rio?", fr: "Vous planifiez un voyage de groupe à Rio ?", de: "Gruppenreise nach Rio planen?",          no: "Planlegger du en gruppetur til Rio?" },
  ctaSub:     {
    en: "Our B2B specialists will tailor any program to your group's needs, dates, and budget — with full DMC support.",
    es: "Nuestros especialistas B2B adaptarán cualquier programa a las necesidades, fechas y presupuesto de su grupo.",
    pt: "Nossos especialistas B2B adaptarão qualquer programa às necessidades, datas e orçamento do seu grupo.",
    fr: "Nos spécialistes B2B adapteront tout programme aux besoins, aux dates et au budget de votre groupe.",
    de: "Unsere B2B-Spezialisten passen jedes Programm an die Bedürfnisse, Termine und das Budget Ihrer Gruppe an.",
    no: "Våre B2B-spesialister skreddersyr ethvert program til gruppens behov, datoer og budsjett.",
  },
  whatsapp:   { en: "WhatsApp us now",                      es: "Escríbenos por WhatsApp",               pt: "Fale conosco pelo WhatsApp",             fr: "Écrivez-nous sur WhatsApp",               de: "Jetzt per WhatsApp schreiben",           no: "Kontakt oss på WhatsApp" },
  contactUs:  { en: "Contact our B2B team",                 es: "Contactar equipo B2B",                  pt: "Contactar equipa B2B",                   fr: "Contacter notre équipe B2B",              de: "B2B-Team kontaktieren",                  no: "Kontakt B2B-teamet" },
  noPrograms: { en: "Programs coming soon",                 es: "Programas próximamente",                pt: "Programas em breve",                     fr: "Programmes bientôt disponibles",          de: "Programme demnächst",                    no: "Programmer kommer snart" },
  duration:   { en: "Duration",                             es: "Duración",                              pt: "Duração",                                fr: "Durée",                                   de: "Dauer",                                  no: "Varighet" },
  ideal:      { en: "Ideal for",                            es: "Ideal para",                            pt: "Ideal para",                             fr: "Idéal pour",                              de: "Ideal für",                              no: "Ideell for" },
};

const PILLARS = [
  { icon: <Briefcase className="w-5 h-5" />, key: "trust1" as const, color: "text-primary bg-primary/10" },
  { icon: <Award className="w-5 h-5" />,     key: "trust2" as const, color: "text-[#009743] bg-[#009743]/10" },
  { icon: <HeartHandshake className="w-5 h-5" />, key: "trust3" as const, color: "text-primary bg-primary/10" },
];

function ProgramSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function GroupTravelPage() {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const t = (key: keyof typeof TX) => TX[key][lang] ?? TX[key].en;

  const { data: allPrograms, isLoading } = useListGroupPrograms();
  const programs = allPrograms?.filter((p) => p.published);

  return (
    <>
      <SeoHead
        title="Group Travel Programs — Janeiro Tour"
        description="B2B group travel programs for incentive groups, corporates, and affinity travel in Rio de Janeiro. Land-only and complete packages with DMC support."
      />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/75 to-gray-800/60" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-5">
              <Globe className="w-3.5 h-3.5" />
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-4 text-white">
              {t("heading")}
            </h1>
            <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
              {t("sub")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold rounded-xl px-6">
                  {t("request")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="https://wa.me/5521999999999" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6">
                  <MessageCircle className="w-4 h-4 mr-2" /> {t("whatsapp")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust pillars ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PILLARS.map(({ icon, key, color }) => (
              <div key={key} className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</span>
                <span className="text-sm font-medium text-gray-700">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Program cards ── */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => <ProgramSkeleton key={i} />)}
            </div>
          ) : !programs?.length ? (
            <div className="text-center py-20 text-gray-500">{t("noPrograms")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.map((prog) => (
                <article key={prog.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={prog.heroImageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{prog.duration}</span>
                      </div>
                      <h2 className="text-white text-xl font-bold">{prog.title}</h2>
                      {prog.subtitle && <p className="text-white/70 text-sm mt-0.5">{prog.subtitle}</p>}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">{prog.overview}</p>

                    {/* Highlights */}
                    {prog.highlights?.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <CheckCircle className="w-4 h-4 text-[#009743] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{h}</span>
                      </div>
                    ))}

                    {/* Pricing */}
                    <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("landOnly")}</p>
                        <p className="text-2xl font-black text-gray-900">{formatPrice(prog.landOnlyFromPrice)}</p>
                        <p className="text-xs text-gray-500">{t("perPerson")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("complete")}</p>
                        <p className="text-2xl font-black text-primary">{formatPrice(prog.completeFromPrice)}</p>
                        <p className="text-xs text-gray-500">{t("perPerson")}</p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="mt-5 flex gap-3">
                      <Link href={`/group-travel/${prog.slug}`} className="flex-1">
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold">
                          {t("details")} <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 text-sm font-semibold px-4">
                          {t("request")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── B2B CTA banner ── */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">{t("ctaSub")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/5521999999999" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold rounded-xl px-8">
                <MessageCircle className="w-4 h-4 mr-2" /> {t("whatsapp")}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8">
                {t("contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
