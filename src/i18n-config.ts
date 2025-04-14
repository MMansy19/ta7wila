export const i18nConfig = {
    locales: ['en', 'ar'] as const,
    defaultLocale: 'ar',
  
    // Whether to automatically handle locale-based routing
    localeDetection: true,
  };
  
 
export type Locale = (typeof i18nConfig.locales)[number];