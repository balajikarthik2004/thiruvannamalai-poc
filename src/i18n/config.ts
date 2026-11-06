import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'ta', 'hi', 'kn', 'gu', 'mr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Only English is bundled with the app.
 *
 * The six translation catalogues are ~780 KB of JSON between them, and shipping
 * all of them put more than half a megabyte into the main chunk that almost no
 * devotee would ever read. The other five are fetched the moment they are
 * actually selected, and cached by i18next from then on.
 */
const LOADERS: Record<Exclude<SupportedLanguage, 'en'>, () => Promise<{ default: Record<string, string> }>> = {
  ta: () => import('../locales/ta/translation.json'),
  hi: () => import('../locales/hi/translation.json'),
  kn: () => import('../locales/kn/translation.json'),
  gu: () => import('../locales/gu/translation.json'),
  mr: () => import('../locales/mr/translation.json'),
};

const normalise = (lng: string | undefined): SupportedLanguage => {
  const base = (lng || 'en').split('-')[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: enTranslations } },
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    // "ta-IN" from the browser should resolve to our "ta" bundle.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    debug: false,
    detection: {
      // The switcher writes `omg-language`; check it before the browser locale
      // so a devotee's choice survives a reload.
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'omg-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // Keys are English sentences; an untranslated key should render the English
    // text rather than a blank node.
    returnEmptyString: false,
  });

/** Fetch and register a language bundle if it is not already loaded. */
export async function loadLanguage(lng: string): Promise<SupportedLanguage> {
  const code = normalise(lng);
  if (code === 'en' || i18n.hasResourceBundle(code, 'translation')) return code;
  try {
    const mod = await LOADERS[code]();
    i18n.addResourceBundle(code, 'translation', mod.default, true, true);
  } catch (err) {
    // A failed fetch should leave the devotee on English, not on a blank page.
    console.error(`Could not load the ${code} translations`, err);
    return 'en';
  }
  return code;
}

/** Load the bundle, then switch — so the UI never flashes untranslated keys. */
export async function changeLanguage(lng: string): Promise<void> {
  const code = await loadLanguage(lng);
  await i18n.changeLanguage(code);
}

/** Awaited once at start-up so a remembered non-English choice is ready. */
export const initialLanguageReady = loadLanguage(i18n.language).then((code) =>
  code === normalise(i18n.language) ? undefined : i18n.changeLanguage(code)
);

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') document.documentElement.lang = lng;
});

export default i18n;
