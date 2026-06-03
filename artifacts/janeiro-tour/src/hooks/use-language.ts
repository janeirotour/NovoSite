import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'pt';

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jt_lang');
      if (stored === 'en' || stored === 'es' || stored === 'pt') {
        return stored;
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
    
    const capitalizedKey = baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
    const langKey = `${baseKey}${lang.charAt(0).toUpperCase() + lang.slice(1)}`; // baseKeyEs or baseKeyPt
    
    // Fallback to English if translation is missing
    return obj[langKey as keyof T] || obj[baseKey] || fallback;
  };

  return { lang, setLang, t };
}
