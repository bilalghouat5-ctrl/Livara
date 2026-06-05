import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to read language from localStorage, default to 'ar' (Arabic is primary)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lacasa_lang') as Language;
    return (saved && ['ar', 'fr', 'en', 'kab'].includes(saved)) ? saved : 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lacasa_lang', lang);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    // Update the document direction and language code in HTML header
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const t = (key: string): string => {
    const langDict = translations[language] || translations['ar'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English, then Arabic
    const englishDict = translations['en'];
    if (englishDict && englishDict[key]) {
      return englishDict[key];
    }
    const arabicDict = translations['ar'];
    if (arabicDict && arabicDict[key]) {
      return arabicDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
