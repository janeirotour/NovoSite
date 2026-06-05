import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'de';

const VALID: Language[] = ['en', 'es', 'pt', 'fr', 'de'];

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jt_lang');
      if (stored && VALID.includes(stored as Language)) {
        return stored as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('jt_lang', lang);
  }, [lang]);

  const t = <T extends Record<string, any>>(
    obj: T | undefined | null,
    baseKey: string,
    fallback = ''
  ): string => {
    if (!obj) return fallback;
    
    if (lang === 'en') return obj[baseKey] || fallback;
    
    const langKey = `${baseKey}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    
    return obj[langKey as keyof T] || obj[baseKey] || fallback;
  };

  return { lang, setLang, t };
}
