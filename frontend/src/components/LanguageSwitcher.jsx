import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/language-switcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'EN', fullLabel: 'English' },
    { code: 'he', label: 'עברית', fullLabel: 'Hebrew' },
    { code: 'ru', label: 'Русский', fullLabel: 'Russian' }
  ];

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-button ${language === lang.code ? 'active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          title={lang.fullLabel}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
