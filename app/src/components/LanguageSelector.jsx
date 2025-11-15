import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES } from '../config/languageConfig';
import '../styles/LanguageSelector.css';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage = SUPPORTED_LANGUAGES[i18n.language] || SUPPORTED_LANGUAGES.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Update document direction for RTL languages
    const lang = SUPPORTED_LANGUAGES[langCode];
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = langCode;
    }
  };

  const languageOptions = Object.values(SUPPORTED_LANGUAGES);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <motion.button
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('language.select')}
        title={t('language.select')}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="language-dropdown-header">
              {t('language.select')}
            </div>
            <div className="language-options">
              {languageOptions.map((lang) => (
                <motion.button
                  key={lang.code}
                  className={`language-option ${
                    i18n.language === lang.code ? 'active' : ''
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="language-option-flag">{lang.flag}</span>
                  <div className="language-option-text">
                    <span className="language-option-native">{lang.nativeName}</span>
                    <span className="language-option-name">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <span className="language-option-check">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

