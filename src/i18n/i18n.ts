import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import zhTranslation from '../locales/zh.json';

i18n
  .use(LanguageDetector)  // Add language detector before initReactI18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    // When using language detector, we remove the explicit 'lng' setting
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Keys used to store language in localStorage/cookie
      lookupLocalStorage: 'i18nextLng',
      // Cache language detection results
      caches: ['localStorage'],
      // Optional HTML attribute with language (defaults to 'language')
      htmlTag: document.documentElement
    },
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
