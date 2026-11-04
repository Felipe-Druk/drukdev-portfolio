/**************************************************************
 * LIGHTWEIGHT INTERNATIONALIZATION (i18n) BARREL & STATE
 * (js/config/i18n.js)
 **************************************************************/

import { loadItem, saveItem } from '../utils/safeStorage.js';
import { ES_TRANSLATIONS } from './i18n/es.js';
import { EN_TRANSLATIONS } from './i18n/en.js';

export const LANG_STORAGE_KEY = 'druk_lang';
export const SUPPORTED_LANGUAGES = ['es', 'en'];

export const TRANSLATIONS = {
    es: ES_TRANSLATIONS,
    en: EN_TRANSLATIONS
};

function detectInitialLanguage() {
    const savedLanguage = loadItem(LANG_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        return savedLanguage;
    }
    const browserLanguage = (navigator.language || 'es').toLowerCase();
    return browserLanguage.startsWith('es') ? 'es' : 'en';
}

let currentLanguage = detectInitialLanguage();

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setCurrentLanguage(language) {
    if (SUPPORTED_LANGUAGES.includes(language)) {
        currentLanguage = language;
        saveItem(LANG_STORAGE_KEY, language);
    }
    return currentLanguage;
}

export function getTranslationByKey(dotPath, language = currentLanguage) {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.es;
    return dotPath
        .split('.')
        .reduce((currentNode, keySegment) => (
            currentNode && currentNode[keySegment] !== undefined ? currentNode[keySegment] : null
        ), dictionary);
}
