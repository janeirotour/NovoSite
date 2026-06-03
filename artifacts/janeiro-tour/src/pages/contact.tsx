import { useState } from "react";
import { useGetSettings } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { data: settings } = useGetSettings();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-neutral-900 py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Janeiro Tour</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Our team of Brazil travel experts is ready to help you plan the perfect experience
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">How to Reach Us</h2>
            <div className="space-y-5">
              {settings?.contactEmail && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <a href={`mailto:${settings.contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <a href={`tel:${settings.contactPhone}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Based In</p>
                    <p className="text-muted-foreground">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
            <MessageCircle className="text-accent mb-3" size={28} />
            <h3 className="font-bold text-lg mb-1">Chat on WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">Fastest response — available 7 days a week</p>
            <a href={settings?.contactWhatsapp ?? "https://wa.me/+5521972633333"} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Open WhatsApp Chat
              </Button>
            </a>
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
              <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base">
                Send Message
              </Button>
              <p className="text-xs text-center text-muted-foreground">We respond within 24 hours, usually much sooner</p>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
