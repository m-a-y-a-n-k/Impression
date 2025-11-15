import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import hiTranslations from './locales/hi.json';
import zhTranslations from './locales/zh.json';
import jaTranslations from './locales/ja.json';
import ptTranslations from './locales/pt.json';
import arTranslations from './locales/ar.json';
import ruTranslations from './locales/ru.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  hi: { translation: hiTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  pt: { translation: ptTranslations },
  ar: { translation: arTranslations },
  ru: { translation: ruTranslations },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'impression-language',
    },
  });

export default i18n;

