import { useLanguageContext, type Language } from "@/contexts/LanguageContext";

export type { Language };

export function useLanguage() {
  const { lang, setLang } = useLanguageContext();

  const t = <T extends Record<string, any>>(
    obj: T | undefined | null,
    baseKey: string,
    fallback = ""
  ): string => {
    if (!obj) return fallback;

    if (lang === "en") return obj[baseKey] || fallback;

    const langKey = `${baseKey}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;

    return obj[langKey as keyof T] || obj[baseKey] || fallback;
  };

  return { lang, setLang, t };
}
