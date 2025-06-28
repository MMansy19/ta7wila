import { Pathnames, LocalePrefix } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    ar: '/dashboard'
  },
  '/login': {
    en: '/login', 
    ar: '/login'
  },
  '/forgetpassword': {
    en: '/forgetpassword',
    ar: '/forgetpassword'
  }
} satisfies Pathnames<typeof locales>;

export const localePrefix: LocalePrefix<typeof locales> = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;

// Legacy export for backward compatibility
export const i18nConfig = {
  locales,
  defaultLocale,
  localeDetection: true,
};