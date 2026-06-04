import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface SelectedExtra {
  id: number;
  name: string;
  price: number;
  currency: string;
}

export interface CartItem {
  tourSlug: string;
  title: string;
  imageUrl: string;
  priceFrom: number;
  currency: string;
  pax: number;
  selectedExtras: SelectedExtra[];
  preferredDate?: string;
  preferredTime?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "selectedExtras"> & { selectedExtras?: SelectedExtra[] }) => void;
  removeItem: (tourSlug: string) => void;
  updatePax: (tourSlug: string, pax: number) => void;
  updateExtras: (tourSlug: string, extras: SelectedExtra[]) => void;
  updateDateTime: (tourSlug: string, preferredDate?: string, preferredTime?: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "janeiro_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (incoming: Omit<CartItem, "selectedExtras"> & { selectedExtras?: SelectedExtra[] }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.tourSlug === incoming.tourSlug);
      if (existing) {
        return prev.map((i) =>
          i.tourSlug === incoming.tourSlug
            ? {
                ...i,
                pax: incoming.pax,
                selectedExtras: incoming.selectedExtras ?? i.selectedExtras,
                preferredDate: incoming.preferredDate ?? i.preferredDate,
                preferredTime: incoming.preferredTime ?? i.preferredTime,
              }
            : i
        );
      }
      return [...prev, { ...incoming, selectedExtras: incoming.selectedExtras ?? [] }];
    });
    setIsOpen(true);
  };

  const removeItem = (tourSlug: string) => {
    setItems((prev) => prev.filter((i) => i.tourSlug !== tourSlug));
  };

  const updatePax = (tourSlug: string, pax: number) => {
    if (pax < 1) return;
    setItems((prev) => prev.map((i) => (i.tourSlug === tourSlug ? { ...i, pax } : i)));
  };

  const updateExtras = (tourSlug: string, extras: SelectedExtra[]) => {
    setItems((prev) => prev.map((i) => (i.tourSlug === tourSlug ? { ...i, selectedExtras: extras } : i)));
  };

  const updateDateTime = (tourSlug: string, preferredDate?: string, preferredTime?: string) => {
    setItems((prev) => prev.map((i) => (i.tourSlug === tourSlug ? { ...i, preferredDate, preferredTime } : i)));
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, i) => sum + i.pax, 0);
  const totalPrice = items.reduce((sum, i) => {
    const extrasTotal = i.selectedExtras?.reduce((s, e) => s + e.price, 0) ?? 0;
    return sum + i.priceFrom * i.pax + extrasTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updatePax,
        updateExtras,
        updateDateTime,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
