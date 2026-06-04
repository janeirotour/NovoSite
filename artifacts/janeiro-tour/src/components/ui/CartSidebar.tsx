import { useCart } from "@/contexts/CartContext";
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updatePax, clearCart, totalPrice, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ tourSlug: i.tourSlug, pax: i.pax, title: i.title })),
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
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            <h2 className="text-lg font-bold">
              Your Cart {totalItems > 0 && <span className="text-primary">({totalItems})</span>}
            </h2>
          </div>
          <button onClick={closeCart} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add a tour to get started</p>
            </div>
            <Button variant="outline" onClick={closeCart} className="mt-2">Browse Tours</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.tourSlug} className="bg-card border rounded-xl overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</p>
                      <p className="text-primary font-bold text-sm mt-1">
                        ${item.priceFrom} <span className="text-xs font-normal text-muted-foreground">/ person</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.tourSlug)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="px-3 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>Travelers:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updatePax(item.tourSlug, item.pax - 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                        disabled={item.pax <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.pax}</span>
                      <button
                        onClick={() => updatePax(item.tourSlug, item.pax + 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-primary w-16 text-right">
                      ${(item.priceFrom * item.pax).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Subtotal</span>
                <span className="font-bold text-lg">${totalPrice.toFixed(0)} USD</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Final price includes all taxes and fees. Prices are per person.
              </p>

              <Separator />

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 gap-2"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-xs text-muted-foreground hover:text-destructive text-center transition-colors"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
