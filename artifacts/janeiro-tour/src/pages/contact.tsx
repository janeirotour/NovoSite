import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_URL = "https://wa.me/5521965297618";
const WHATSAPP_DISPLAY = "+55 21 96529-7618";
const EMAIL = "contato@janeirotour.com";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-rio.png')] bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#FFB600] font-semibold uppercase tracking-widest text-xs mb-4">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Janeiro Tour &amp; Travel
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Our team of Brazil travel experts is ready to help you plan the perfect experience.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">How to Reach Us</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-[#FFB600] transition-colors text-sm">
                    {EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Phone / WhatsApp</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FFB600] transition-colors text-sm">
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#FFB600]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Based In</p>
                  <p className="text-muted-foreground text-sm">Rio de Janeiro, Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <MessageCircle className="text-green-600 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-1">Chat on WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">Fastest response — available 7 days a week</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                Open WhatsApp Chat
              </Button>
            </a>
          </div>

          {/* Ministry of Tourism badge */}
          <div className="flex items-start gap-3 p-4 bg-[#009743]/6 border border-[#009743]/20 rounded-xl">
            <Award className="w-5 h-5 text-[#009743] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#009743]">Certified by the Brazilian Ministry of Tourism</p>
              <p className="text-xs text-[#009743]/70 mt-0.5">Registration n° 20.966.047.0001/11</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone / WhatsApp (optional)</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your travel plans, dates, group size, or any questions..."
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 bg-[#FFB600] hover:bg-[#e6a400] text-black font-semibold text-base">
                Send Message
              </Button>
              <p className="text-xs text-center text-muted-foreground">We respond within 24 hours, usually much sooner</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
