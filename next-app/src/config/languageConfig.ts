/**
 * Language Configuration
 * Defines supported languages with their properties
 */

export const SUPPORTED_LANGUAGES: Record<string, Record<string, string>> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    speechRecognitionCode: 'en-US',
    dir: 'ltr'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechRecognitionCode: 'es-ES',
    dir: 'ltr'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechRecognitionCode: 'fr-FR',
    dir: 'ltr'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechRecognitionCode: 'de-DE',
    dir: 'ltr'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speechRecognitionCode: 'hi-IN',
    dir: 'ltr'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    speechRecognitionCode: 'zh-CN',
    dir: 'ltr'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechRecognitionCode: 'ja-JP',
    dir: 'ltr'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    speechRecognitionCode: 'pt-PT',
    dir: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechRecognitionCode: 'ar-SA',
    dir: 'rtl'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechRecognitionCode: 'ru-RU',
    dir: 'ltr'
  }
};

/**
 * Language-specific filler words
 * Each language has its own common filler words
 */
export const FILLER_WORDS_BY_LANGUAGE: Record<string, string[]> = {
  en: [
    'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well',
    'actually', 'basically', 'literally', 'right', 'okay', 'ok',
    'i mean', 'sort of', 'kind of', 'you see', 'i guess'
  ],
  es: [
    'eh', 'este', 'pues', 'bueno', 'o sea', 'como', 'entonces',
    'mmm', 'vaya', 'verdad', 'sabes', 'tío', 'tía', 'vale',
    'a ver', 'digamos', 'claro', 'mira'
  ],
  fr: [
    'euh', 'ben', 'alors', 'donc', 'en fait', 'quoi', 'hein',
    'voilà', 'bon', 'tu vois', 'tu sais', 'genre', 'enfin',
    'comment dire', 'disons', 'bref'
  ],
  de: [
    'ähm', 'äh', 'also', 'halt', 'irgendwie', 'sozusagen', 'quasi',
    'ne', 'oder', 'ja', 'naja', 'eigentlich', 'praktisch',
    'gewissermaßen', 'na ja', 'eben'
  ],
  hi: [
    'उम्म', 'अहम', 'तो', 'यानी', 'मतलब', 'वो', 'जैसे',
    'बस', 'अच्छा', 'हाँ', 'ठीक', 'क्या कहते हैं',
    'आप जानते हैं', 'देखो', 'सुनो'
  ],
  zh: [
    '嗯', '啊', '呃', '那个', '这个', '就是', '然后',
    '其实', '基本上', '大概', '可能', '应该', '对吧',
    '怎么说', '你知道'
  ],
  ja: [
    'えっと', 'あの', 'その', 'ええ', 'まあ', 'なんか',
    'というか', 'だから', 'つまり', 'ね', 'よね', 'さあ',
    '何と言うか', '要するに'
  ],
  pt: [
    'hum', 'é', 'então', 'tipo', 'assim', 'né', 'pois',
    'bem', 'pronto', 'quer dizer', 'sabes', 'vês', 'olha',
    'portanto', 'enfim', 'digamos'
  ],
  ar: [
    'يعني', 'بس', 'طيب', 'أه', 'إي', 'يا', 'والله',
    'تعرف', 'شوف', 'أصلاً', 'خلاص', 'ماشي', 'آه',
    'إم', 'تمام'
  ],
  ru: [
    'э', 'ээ', 'ну', 'вот', 'так', 'типа', 'как бы',
    'собственно', 'в общем', 'короче', 'знаешь', 'понимаешь',
    'ладно', 'ясно', 'значит', 'в принципе'
  ]
};

/**
 * Get filler words for a specific language
 * @param {string} languageCode - ISO language code
 * @returns {Array} Array of filler words
 */
export const getFillerWords = (languageCode: string) => {
  return FILLER_WORDS_BY_LANGUAGE[languageCode] || FILLER_WORDS_BY_LANGUAGE.en;
};

/**
 * Get language config by code
 * @param {string} languageCode - ISO language code
 * @returns {Object} Language configuration
 */
export const getLanguageConfig = (languageCode: string) => {
  return SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES.en;
};

/**
 * Get all supported language codes
 * @returns {Array} Array of language codes
 */
export const getAllLanguageCodes = () => {
  return Object.keys(SUPPORTED_LANGUAGES);
};

/**
 * Get speech recognition language code
 * @param {string} languageCode - ISO language code
 * @returns {string} Speech recognition language code
 */
export const getSpeechRecognitionLang = (languageCode: string) => {
  const config = getLanguageConfig(languageCode);
  return config.speechRecognitionCode;
};

/**
 * Check if language is RTL (Right-to-Left)
 * @param {string} languageCode - ISO language code
 * @returns {boolean} True if RTL language
 */
export const isRTL = (languageCode: string) => {
  const config = getLanguageConfig(languageCode);
  return config.dir === 'rtl';
};

