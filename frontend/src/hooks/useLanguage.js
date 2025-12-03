import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  const { language, setLanguage, translations } = context;

  // Translation function with support for interpolation
  const t = (key, variables = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key itself if translation not found (fallback)
        return `[${key}]`;
      }
    }

    // Handle interpolation for variables like {current}, {total}, {price}
    if (typeof value === 'string' && variables) {
      Object.keys(variables).forEach((varKey) => {
        const regex = new RegExp(`\\{${varKey}\\}`, 'g');
        value = value.replace(regex, variables[varKey]);
      });
    }

    return value || `[${key}]`;
  };

  // Get text direction based on language
  const getDirection = () => {
    return language === 'he' ? 'rtl' : 'ltr';
  };

  // Get lang attribute for HTML
  const getLang = () => {
    return language === 'en' ? 'en' : language === 'he' ? 'he' : 'ru';
  };

  return {
    language,
    setLanguage,
    t,
    getDirection,
    getLang,
    dir: getDirection(),
    lang: getLang()
  };
};
