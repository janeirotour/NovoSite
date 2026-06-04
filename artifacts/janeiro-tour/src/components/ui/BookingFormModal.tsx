import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { X, Loader2, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  country: string;
  hotelAddress: string;
  pickupLocation: string;
  dropoffLocation: string;
  flightNumber: string;
  language: string;
  notes: string;
}

const LANGUAGES = ["English", "Portuguese", "Spanish", "French", "Italian", "German"];

const INPUT_CLASS =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors";

export function BookingFormModal({ isOpen, onClose }: BookingFormModalProps) {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    country: "",
    hotelAddress: "",
    pickupLocation: "",
    dropoffLocation: "",
    flightNumber: "",
    language: "English",
    notes: "",
  });

  if (!isOpen) return null;

  const toursSubtotal = items.reduce((sum, i) => sum + i.priceFrom * i.pax, 0);
  const extrasTotal = items.reduce(
    (sum, i) => sum + (i.selectedExtras?.reduce((s, e) => s + e.price, 0) ?? 0),
    0
  );
  const grandTotal = toursSubtotal + extrasTotal;

  const handleChange = (key: keyof CustomerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Full name is required."); return; }
    if (!form.email.trim()) { setError("Email address is required."); return; }
    if (!form.phone.trim()) { setError("Phone / WhatsApp is required."); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            tourSlug: item.tourSlug,
            pax: item.pax,
            title: item.title,
            selectedExtras: item.selectedExtras ?? [],
            preferredDate: item.preferredDate,
            preferredTime: item.preferredTime,
          })),
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            country: form.country.trim() || undefined,
            hotelAddress: form.hotelAddress.trim() || undefined,
            pickupLocation: form.pickupLocation.trim() || undefined,
            dropoffLocation: form.dropoffLocation.trim() || undefined,
            flightNumber: form.flightNumber.trim() || undefined,
            language: form.language || "English",
            notes: form.notes.trim() || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed. Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="w-full max-w-5xl bg-background rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b bg-card">
          <div>
            <h2 className="text-xl font-bold">Complete Your Booking</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Enter your details to proceed to payment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6 border-r">
            <div>
              <h3 className="font-semibold text-base mb-4">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone / WhatsApp <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 555 000 0000"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="United States"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-4">
                Logistics{" "}
                <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Hotel Name / Address</label>
                  <input
                    type="text"
                    value={form.hotelAddress}
                    onChange={(e) => handleChange("hotelAddress", e.target.value)}
                    placeholder="e.g. Copacabana Palace, Av. Atlântica 1702"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={form.pickupLocation}
                    onChange={(e) => handleChange("pickupLocation", e.target.value)}
                    placeholder="Hotel lobby / address"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drop-off Location</label>
                  <input
                    type="text"
                    value={form.dropoffLocation}
                    onChange={(e) => handleChange("dropoffLocation", e.target.value)}
                    placeholder="Hotel / airport"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Flight Number</label>
                  <input
                    type="text"
                    value={form.flightNumber}
                    onChange={(e) => handleChange("flightNumber", e.target.value)}
                    placeholder="AA 1234"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className={INPUT_CLASS}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Special Requests / Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Dietary requirements, accessibility needs, special occasions…"
                    rows={3}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Confirm &amp; Pay — ${grandTotal.toFixed(0)} USD
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secured by Stripe. You will be redirected to complete your payment.
            </p>
          </form>

          <div className="p-6 bg-muted/30">
            <h3 className="font-semibold text-base mb-4">Booking Summary</h3>

            <div className="space-y-4">
              {items.map((item) => {
                const itemExtrasTotal =
                  item.selectedExtras?.reduce((s, e) => s + e.price, 0) ?? 0;
                const itemTotal = item.priceFrom * item.pax + itemExtrasTotal;
                return (
                  <div key={item.tourSlug} className="bg-card border rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.pax} traveler{item.pax > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {(item.preferredDate || item.preferredTime) && (
                      <p className="text-xs text-muted-foreground">
                        📅 {item.preferredDate || "Date TBD"}
                        {item.preferredTime ? ` · ${item.preferredTime}` : ""}
                      </p>
                    )}

                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Extras:</p>
                        {item.selectedExtras.map((e) => (
                          <div key={e.id} className="flex justify-between text-xs py-0.5">
                            <span className="text-muted-foreground">+ {e.name}</span>
                            <span className="text-green-600 font-medium">
                              +${e.price.toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t">
                      <span className="text-xs text-muted-foreground">Item total</span>
                      <span className="font-bold text-green-600 text-sm">
                        ${itemTotal.toFixed(0)} USD
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tours subtotal</span>
                <span>${toursSubtotal.toFixed(0)} USD</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extras</span>
                  <span className="text-green-600 font-medium">+${extrasTotal.toFixed(0)} USD</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-xl text-green-600">
                  ${grandTotal.toFixed(0)} USD
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-green-50 rounded-lg border border-green-200 dark:bg-green-950/30 dark:border-green-900">
              <div className="flex items-start gap-2 text-xs text-green-800 dark:text-green-300">
                <Check size={13} className="mt-0.5 flex-shrink-0" />
                <span>
                  Free cancellation available on most tours. Your preferred date &amp; time will be
                  confirmed by our team after payment.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
