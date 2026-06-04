import { useState } from "react";
import { X, Loader2, CreditCard, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSlug: string;
  packageTitle: string;
  pax: number;
  arrivalDate: string;
  grandTotal: number;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors";

export function PackageBookingModal({
  isOpen,
  onClose,
  packageSlug,
  packageTitle,
  pax,
  arrivalDate,
  grandTotal,
}: PackageBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  });

  if (!isOpen) return null;

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
      const res = await fetch("/api/stripe/package-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug,
          pax,
          arrivalDate: arrivalDate || undefined,
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            country: form.country.trim() || undefined,
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

  const formattedDate = arrivalDate
    ? new Date(arrivalDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not selected";

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-card">
          <div>
            <h2 className="text-xl font-bold">Complete Your Booking</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Enter your details to proceed to secure payment
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

        <div className="p-6 space-y-6">
          {/* Booking summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 dark:bg-green-950/30 dark:border-green-900">
            <p className="font-semibold text-sm text-green-800 dark:text-green-200">{packageTitle}</p>
            <div className="flex flex-wrap gap-4 text-xs text-green-700 dark:text-green-300">
              <span className="flex items-center gap-1.5">
                <Users size={12} />
                {pax} traveler{pax !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} />
                {formattedDate}
              </span>
            </div>
            <p className="text-base font-bold text-green-800 dark:text-green-200">
              Total: ${grandTotal.toFixed(0)} USD
              <span className="text-xs font-normal ml-2 text-green-600">(5% bundle discount applied)</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="font-semibold text-sm mb-3">Your Details</h3>
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Special Requests / Notes
                    <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Hotel name, dietary requirements, special occasions…"
                    rows={3}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>
              </div>
            </div>

            <Separator />

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
              Secured by Stripe · Your preferred arrival date will be confirmed by our team after payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
