import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "es" | "pt" | "fr" | "de" | "no";

const VALID: Language[] = ["en", "es", "pt", "fr", "de", "no"];

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("jt_lang");
      if (stored && VALID.includes(stored as Language)) {
        return stored as Language;
      }
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("jt_lang", lang);
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguageContext must be used inside LanguageProvider");
  return ctx;
}
