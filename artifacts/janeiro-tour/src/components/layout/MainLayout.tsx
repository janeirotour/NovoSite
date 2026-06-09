import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { MobileBottomNav } from "./MobileBottomNav";

export function MainLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}
