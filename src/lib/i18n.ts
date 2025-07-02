import { Locale } from '@/i18n-config';
import { TranslationKeys } from '../../public/locales/types';

const translations = {
  en: () => import('../../public/locales/en/common.json').then((m) => m.default),
  ar: () => import('../../public/locales/ar/common.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<any>>;

export async function getTranslations(locale: Locale): Promise<TranslationKeys> {
  try {
    if (locale in translations) {
      const rawTranslations = await translations[locale]();
      
      const enhancedTranslations = {
        ...rawTranslations,
        sidebar: {
          ...(rawTranslations.sidebar || {}),
          logs: rawTranslations.sidebar?.logs || 'Logs',
        },
        plans: rawTranslations.plans || {},
        transactionModal: rawTranslations.transactionModal || {},
      };
      
      return enhancedTranslations as TranslationKeys;
    } else {
      console.warn(`Locale ${locale} not found, falling back to default locale`);
      const rawTranslations = await translations['ar']();
      
      const enhancedTranslations = {
        ...rawTranslations,
        sidebar: {
          ...(rawTranslations.sidebar || {}),
          logs: rawTranslations.sidebar?.logs || 'Logs',
        },
        plans: rawTranslations.plans || {},
        transactionModal: rawTranslations.transactionModal || {},
      };
      
      return enhancedTranslations as TranslationKeys;
    }
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
    return {} as TranslationKeys;
  }
}