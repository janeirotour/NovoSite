import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_URL = "https://wa.me/5521965297618";
const WHATSAPP_DISPLAY = "+55 21 96529-7618";
const EMAIL = "contato@janeirotour.com";

const TX = {
  eyebrow:    { en: "Get In Touch",          es: "Ponte en Contacto",         pt: "Entre em Contato",           fr: "Nous Contacter",              de: "Kontakt aufnehmen",           no: "Ta kontakt" },
  heading:    { en: "Contact Janeiro Tour & Travel", es: "Contactar Janeiro Tour & Travel", pt: "Contato Janeiro Tour & Travel", fr: "Contacter Janeiro Tour & Travel", de: "Janeiro Tour & Travel kontaktieren", no: "Kontakt Janeiro Tour & Travel" },
  sub:        { en: "Our team of Brazil travel experts is ready to help you plan the perfect experience.", es: "Nuestro equipo de expertos en viajes a Brasil está listo para ayudarte a planificar la experiencia perfecta.", pt: "Nossa equipe de especialistas em viagens ao Brasil está pronta para ajudá-lo a planejar a experiência perfeita.", fr: "Notre équipe d'experts en voyage au Brésil est prête à vous aider à planifier l'expérience parfaite.", de: "Unser Team von Brasilien-Reiseexperten steht Ihnen gerne zur Verfügung, um das perfekte Erlebnis zu planen.", no: "Teamet vårt av Brasil-reiseeksperter er klare til å hjelpe deg med å planlegge den perfekte opplevelsen." },
  howToReach: { en: "How to Reach Us",       es: "Cómo Contactarnos",         pt: "Como Nos Contatar",          fr: "Comment Nous Joindre",        de: "So erreichen Sie uns",        no: "Slik når du oss" },
  emailLabel: { en: "Email",                 es: "Correo",                    pt: "E-mail",                     fr: "E-mail",                      de: "E-Mail",                      no: "E-post" },
  phoneLabel: { en: "Phone / WhatsApp",      es: "Teléfono / WhatsApp",       pt: "Telefone / WhatsApp",        fr: "Téléphone / WhatsApp",        de: "Telefon / WhatsApp",          no: "Telefon / WhatsApp" },
  basedIn:    { en: "Based In",              es: "Con Sede En",               pt: "Com Sede Em",                fr: "Basés À",                     de: "Standort",                    no: "Basert i" },
  chatTitle:  { en: "Chat on WhatsApp",      es: "Chatear en WhatsApp",       pt: "Conversar no WhatsApp",      fr: "Discuter sur WhatsApp",       de: "Per WhatsApp chatten",        no: "Chat på WhatsApp" },
  chatSub:    { en: "Fastest response — available 7 days a week", es: "Respuesta más rápida — disponible los 7 días de la semana", pt: "Resposta mais rápida — disponível 7 dias por semana", fr: "Réponse la plus rapide — disponible 7 jours sur 7", de: "Schnellste Antwort — 7 Tage die Woche verfügbar", no: "Raskest svar — tilgjengelig 7 dager i uken" },
  openWA:     { en: "Open WhatsApp Chat",    es: "Abrir Chat de WhatsApp",    pt: "Abrir Chat no WhatsApp",     fr: "Ouvrir le Chat WhatsApp",     de: "WhatsApp-Chat öffnen",        no: "Åpne WhatsApp-chat" },
  certified:  { en: "Certified by the Brazilian Ministry of Tourism", es: "Certificada por el Ministerio de Turismo de Brasil", pt: "Certificada pelo Ministério do Turismo do Brasil", fr: "Certifiée par le Ministère du Tourisme du Brésil", de: "Zertifiziert vom brasilianischen Ministerium für Tourismus", no: "Sertifisert av det brasilianske turismedepartementet" },
  sendMsg:    { en: "Send Us a Message",     es: "Enviarnos un Mensaje",      pt: "Enviar uma Mensagem",        fr: "Nous Envoyer un Message",     de: "Nachricht senden",            no: "Send oss en melding" },
  fullName:   { en: "Full Name",             es: "Nombre Completo",           pt: "Nome Completo",              fr: "Nom Complet",                 de: "Vollständiger Name",          no: "Fullt navn" },
  namePh:     { en: "Your name",             es: "Tu nombre",                 pt: "Seu nome",                   fr: "Votre nom",                   de: "Ihr Name",                    no: "Ditt navn" },
  emailAddr:  { en: "Email Address",         es: "Dirección de Correo",       pt: "Endereço de E-mail",         fr: "Adresse E-mail",              de: "E-Mail-Adresse",              no: "E-postadresse" },
  phoneLbl:   { en: "Phone / WhatsApp (optional)", es: "Teléfono / WhatsApp (opcional)", pt: "Telefone / WhatsApp (opcional)", fr: "Téléphone / WhatsApp (facultatif)", de: "Telefon / WhatsApp (optional)", no: "Telefon / WhatsApp (valgfritt)" },
  msgLabel:   { en: "Your Message",          es: "Tu Mensaje",                pt: "Sua Mensagem",               fr: "Votre Message",               de: "Ihre Nachricht",              no: "Din melding" },
  msgPh:      { en: "Tell us about your travel plans, dates, group size, or any questions...", es: "Cuéntanos sobre tus planes de viaje, fechas, tamaño del grupo o cualquier pregunta...", pt: "Conte-nos sobre seus planos de viagem, datas, tamanho do grupo ou qualquer dúvida...", fr: "Parlez-nous de vos projets de voyage, dates, taille du groupe ou toute question...", de: "Erzählen Sie uns von Ihren Reiseplänen, Daten, Gruppengröße oder Fragen...", no: "Fortell oss om reiseplanene dine, datoer, gruppestørrelse eller spørsmål..." },
  sendBtn:    { en: "Send Message",          es: "Enviar Mensaje",            pt: "Enviar Mensagem",            fr: "Envoyer le Message",          de: "Nachricht senden",            no: "Send melding" },
  responseNote:{ en: "We respond within 24 hours, usually much sooner", es: "Respondemos en 24 horas, generalmente mucho antes", pt: "Respondemos em 24 horas, geralmente muito antes", fr: "Nous répondons dans les 24 heures, généralement bien avant", de: "Wir antworten innerhalb von 24 Stunden, meist viel früher", no: "Vi svarer innen 24 timer, vanligvis mye raskere" },
  toastTitle: { en: "Message sent!",         es: "¡Mensaje enviado!",         pt: "Mensagem enviada!",          fr: "Message envoyé !",            de: "Nachricht gesendet!",         no: "Melding sendt!" },
  toastDesc:  { en: "We'll get back to you within 24 hours.", es: "Te responderemos en 24 horas.", pt: "Responderemos em 24 horas.", fr: "Nous vous répondrons dans les 24 heures.", de: "Wir melden uns innerhalb von 24 Stunden.", no: "Vi svarer deg innen 24 timer." },
} as const;

export default function ContactPage() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: tx("toastTitle"), description: tx("toastDesc") });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-rio.png')] bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="eyebrow text-[#FFB600] mb-4">{tx("eyebrow")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{tx("heading")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{tx("sub")}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">{tx("howToReach")}</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx("emailLabel")}</p>
                  <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-[#FFB600] transition-colors text-sm">{EMAIL}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx("phoneLabel")}</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FFB600] transition-colors text-sm">{WHATSAPP_DISPLAY}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx("basedIn")}</p>
                  <p className="text-muted-foreground text-sm">Rio de Janeiro, Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <MessageCircle className="text-green-600 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-1">{tx("chatTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{tx("chatSub")}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">{tx("openWA")}</Button>
            </a>
          </div>

          {/* Ministry badge */}
          <div className="flex items-start gap-3 p-4 bg-[#009743]/6 border border-[#009743]/20 rounded-xl">
            <Award className="w-5 h-5 text-[#009743] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#009743]">{tx("certified")}</p>
              <p className="text-xs text-[#009743]/70 mt-0.5">Registration n° 20.966.047.0001/11</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">{tx("sendMsg")}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">{tx("fullName")}</Label>
                  <Input id="name" placeholder={tx("namePh")} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{tx("emailAddr")}</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{tx("phoneLbl")}</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">{tx("msgLabel")}</Label>
                <Textarea id="message" placeholder={tx("msgPh")} rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 bg-[#FFB600] hover:bg-[#e6a400] text-black font-semibold text-base">
                {tx("sendBtn")}
              </Button>
              <p className="text-xs text-center text-muted-foreground">{tx("responseNote")}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
