import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

export default function CheckoutSuccessPage() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ customerEmail?: string; amountTotal?: number; currency?: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    setSessionId(sid);

    if (sid) {
      fetch(`/api/stripe/checkout/session?session_id=${sid}`)
        .then((r) => r.json())
        .then((data) => setOrderInfo(data))
        .catch(() => {});
    }
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your payment was successful. We're excited to show you the real Rio de Janeiro.
            </p>
          </div>

          {orderInfo?.customerEmail && (
            <div className="bg-muted rounded-xl p-4 text-sm">
              <p className="text-muted-foreground">Confirmation sent to</p>
              <p className="font-semibold">{orderInfo.customerEmail}</p>
            </div>
          )}

          {orderInfo?.amountTotal != null && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Total paid</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: (orderInfo.currency ?? "usd").toUpperCase() }).format(orderInfo.amountTotal / 100)}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Our team will contact you within 24 hours to confirm details and arrange your experience.
            </p>

            <a href="https://wa.me/5521972633333" target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle size={16} />
                Contact Us on WhatsApp
              </Button>
            </a>

            <Button variant="outline" className="w-full gap-2" onClick={() => setLocation("/tours")}>
              Explore More Tours
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
