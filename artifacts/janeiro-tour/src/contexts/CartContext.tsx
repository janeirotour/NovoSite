import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
  tourSlug: string;
  title: string;
  imageUrl: string;
  priceFrom: number;
  currency: string;
  pax: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "pax"> & { pax?: number }) => void;
  removeItem: (tourSlug: string) => void;
  updatePax: (tourSlug: string, pax: number) => void;
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

  const addItem = (incoming: Omit<CartItem, "pax"> & { pax?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.tourSlug === incoming.tourSlug);
      if (existing) {
        return prev.map((i) =>
          i.tourSlug === incoming.tourSlug
            ? { ...i, pax: i.pax + (incoming.pax ?? 1) }
            : i
        );
      }
      return [...prev, { ...incoming, pax: incoming.pax ?? 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (tourSlug: string) => {
    setItems((prev) => prev.filter((i) => i.tourSlug !== tourSlug));
  };

  const updatePax = (tourSlug: string, pax: number) => {
    if (pax < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.tourSlug === tourSlug ? { ...i, pax } : i))
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, i) => sum + i.pax, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.priceFrom * i.pax, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updatePax, clearCart, isOpen, openCart, closeCart, totalItems, totalPrice }}
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
