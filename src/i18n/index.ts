import { getRequestConfig } from 'next-intl/server';
import { locales } from '../i18n-config';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = 'ar'; // fallback to default locale
  }

  return {
    locale,
    messages: (await import(`../../public/locales/${locale}/common.json`)).default,
    timeZone: 'Asia/Dubai',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 5,
        },
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction',
        },
      },
    },
  };
});