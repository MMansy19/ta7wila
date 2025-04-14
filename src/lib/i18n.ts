import { Locale } from '@/i18n-config';
import { TranslationKeys } from '../../public/locales/types';

const translations = {
  en: () => import('../../public/locales/en/common.json').then((m) => m.default),
  ar: () => import('../../public/locales/ar/common.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<any>>;

export async function getTranslations(locale: Locale): Promise<TranslationKeys> {
  try {
    // Check if the locale exists in translations
    if (locale in translations) {
      const rawTranslations = await translations[locale]();
      
      // Add missing properties to match TranslationKeys type
      const enhancedTranslations = {
        ...rawTranslations,
        // Add missing sidebar.logs property if it doesn't exist
        sidebar: {
          ...(rawTranslations.sidebar || {}),
          logs: rawTranslations.sidebar?.logs || 'Logs',
        },
        // Add missing plans property if it doesn't exist
        plans: rawTranslations.plans || {},
        // Add missing transactionModal property if it doesn't exist
        transactionModal: rawTranslations.transactionModal || {},
      };
      
      return enhancedTranslations as TranslationKeys;
    } else {
      // Fallback to default locale if the requested locale doesn't exist
      console.warn(`Locale ${locale} not found, falling back to default locale`);
      const rawTranslations = await translations['ar']();
      
      // Add missing properties to match TranslationKeys type
      const enhancedTranslations = {
        ...rawTranslations,
        // Add missing sidebar.logs property if it doesn't exist
        sidebar: {
          ...(rawTranslations.sidebar || {}),
          logs: rawTranslations.sidebar?.logs || 'Logs',
        },
        // Add missing plans property if it doesn't exist
        plans: rawTranslations.plans || {},
        // Add missing transactionModal property if it doesn't exist
        transactionModal: rawTranslations.transactionModal || {},
      };
      
      return enhancedTranslations as TranslationKeys;
    }
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
    // Return empty translations object as fallback
    return {} as TranslationKeys;
  }
}