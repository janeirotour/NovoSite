import { useLocation } from "wouter";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutCancelPage() {
  const [, setLocation] = useLocation();
  const { openCart } = useCart();

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              No worries — your cart is still saved. You can go back and complete your booking whenever you're ready.
            </p>
          </div>

          <div className="space-y-3">
            <Button className="w-full gap-2" onClick={() => { openCart(); setLocation("/"); }}>
              <ShoppingCart size={16} />
              Return to Cart
            </Button>

            <Button variant="outline" className="w-full gap-2" onClick={() => setLocation("/tours")}>
              <ArrowLeft size={16} />
              Browse Tours
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
