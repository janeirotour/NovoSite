import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { BookingFormModal } from "@/components/ui/BookingFormModal";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updatePax, clearCart, totalPrice, totalItems } =
    useCart();
  const { formatPrice, currency } = useCurrency();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const extrasTotal = items.reduce(
    (sum, i) => sum + (i.selectedExtras?.reduce((s, e) => s + e.price, 0) ?? 0),
    0
  );
  const grandTotal = totalPrice;

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
              Your Cart{" "}
              {totalItems > 0 && (
                <span className="text-primary">({totalItems})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
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
              <p className="text-sm text-muted-foreground mt-1">
                Add a tour to get started
              </p>
            </div>
            <Button variant="outline" onClick={closeCart} className="mt-2">
              Browse Tours
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => {
                const itemExtrasTotal =
                  item.selectedExtras?.reduce((s, e) => s + e.price, 0) ?? 0;
                return (
                  <div
                    key={item.tourSlug}
                    className="bg-card border rounded-xl overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-green-600 font-bold text-sm mt-1">
                          {formatPrice(item.priceFrom)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            / person
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.tourSlug)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {(item.preferredDate || item.preferredTime) && (
                      <div className="px-3 pb-1 text-xs text-muted-foreground">
                        📅{" "}
                        {item.preferredDate || "Date TBD"}
                        {item.preferredTime ? ` · ${item.preferredTime}` : ""}
                      </div>
                    )}

                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="px-3 pb-2">
                        {item.selectedExtras.map((e) => (
                          <div
                            key={e.id}
                            className="flex justify-between text-xs py-0.5"
                          >
                            <span className="text-muted-foreground">+ {e.name}</span>
                            <span className="text-green-600 font-medium">
                              +{formatPrice(e.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="px-3 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Travelers:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updatePax(item.tourSlug, item.pax - 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                          disabled={item.pax <= 1}
                          aria-label="Decrease travelers"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {item.pax}
                        </span>
                        <button
                          onClick={() => updatePax(item.tourSlug, item.pax + 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Increase travelers"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-green-600 w-16 text-right">
                        {formatPrice(item.priceFrom * item.pax + itemExtrasTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t p-5 space-y-4">
              <div className="space-y-1.5">
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extras</span>
                    <span className="text-green-600 font-medium">
                      +{formatPrice(extrasTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {currency === "USD"
                  ? "Final price includes all taxes and fees. Prices are per person."
                  : `Prices shown in ${currency} for convenience. Final payment processed in USD.`}
              </p>

              <Separator />

              <Button
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => setShowBookingForm(true)}
              >
                Proceed to Checkout
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

      <BookingFormModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
      />
    </>
  );
}
