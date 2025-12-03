import React, { createContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';
import ruTranslations from '../locales/ru.json';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load translations object based on language
  const getTranslations = (lang) => {
    switch (lang) {
      case 'he':
        return { en: enTranslations, he: heTranslations, ru: ruTranslations };
      case 'ru':
        return { en: enTranslations, he: heTranslations, ru: ruTranslations };
      default:
        return { en: enTranslations, he: heTranslations, ru: ruTranslations };
    }
  };

  // All translations loaded
  const translations = getTranslations(language);

  // Update HTML attributes when language changes
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Set lang attribute
    htmlElement.lang = language === 'en' ? 'en' : language === 'he' ? 'he' : 'ru';

    // Set dir attribute for text direction
    htmlElement.dir = language === 'he' ? 'rtl' : 'ltr';

    // Add language class to body for CSS specificity
    document.body.className = `lang-${language}`;
  }, [language]);

  // Handle language change
  const handleSetLanguage = (newLanguage) => {
    if (['en', 'he', 'ru'].includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        translations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
