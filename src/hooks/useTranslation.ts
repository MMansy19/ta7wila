import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TranslationKeys } from '../../public/locales/types';

const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build';
const translationCache = new Map<string, TranslationKeys>();

function getBuildTimeTranslations(locale: string): TranslationKeys {
  const cacheKey = `build-${locale}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    const normalizedLocale = ['en', 'ar'].includes(locale) ? locale : 'ar';
    const translations = normalizedLocale === 'ar' 
      ? require('../../public/locales/ar/common.json')
      : require('../../public/locales/en/common.json');
    
    const result = translations as TranslationKeys;
    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Could not load build-time translations, using fallback');
    const fallback = createFallbackTranslations();
    translationCache.set(cacheKey, fallback);
    return fallback;
  }
}

function createFallbackTranslations(): TranslationKeys {
  const fallback: any = {};
  const commonKeys = [
    'title', 'welcome', 'navigation', 'hero', 'services', 'features', 'footer',
    'auth', 'dashboard', 'sidebar', 'header', 'transactions', 'users', 'vendors',
    'paymentVerification', 'subscription', 'storeUpdate', 'storeDetails', 
    'storepayment', 'stores', 'plans', 'transactionModal', 'price', 'logs',
    'pagination', 'table', 'invoice', 'checkout', 'settings', 'employees',
    'devPart', 'downloadApp'
  ];
  
  commonKeys.forEach(key => {
    fallback[key] = createNestedFallback(key);
  });
  
  return fallback as TranslationKeys;
}

function createNestedFallback(basePath: string): any {
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') {
        const path = `${basePath}.${prop}`;
        return prop.length < 20 ? path : createNestedFallback(path);
      }
      return prop;
    }
  });
}

export function getTranslationsForLocale(locale: string): TranslationKeys {
  const normalizedLocale = ['en', 'ar'].includes(locale) ? locale : 'ar';
  const cacheKey = `runtime-${normalizedLocale}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  if (isBuildTime) {
    return getBuildTimeTranslations(normalizedLocale);
  }
  
  try {
    const translations = normalizedLocale === 'ar' 
      ? require('../../public/locales/ar/common.json')
      : require('../../public/locales/en/common.json');
    
    const result = translations as TranslationKeys;
    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Could not load translations for locale ${normalizedLocale}, using fallback`);
    return getBuildTimeTranslations(normalizedLocale);
  }
}

function getLocaleFromPathname(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean);
  const langFromPath = pathSegments[0];
  return ['en', 'ar'].includes(langFromPath) ? langFromPath : 'ar';
}

function getLocaleFromCookie(): string | null {
  if (typeof document !== 'undefined') {
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    const cookieLocale = cookieMatch ? cookieMatch[1] : null;
    return cookieLocale && ['en', 'ar'].includes(cookieLocale) ? cookieLocale : null;
  }
  return null;
}

function getOppositeLanguage(currentLang: string): string {
  return currentLang === 'en' ? 'ar' : 'en';
}

export function useLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>('ar');
  
  // Move useLocale to the top level of the hook
  let nextIntlLocale: string | null = null;
  try {
    nextIntlLocale = useLocale();
  } catch (error) {
    // useLocale not available, will use fallback
  }
  
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      // First try to get locale from path, then from cookie, then default
      let detectedLocale = getLocaleFromPathname(pathname);
      if (detectedLocale === 'ar') { // Only use cookie if path doesn't have a locale
        const cookieLocale = getLocaleFromCookie();
        if (cookieLocale) {
          detectedLocale = cookieLocale;
        }
      }
      setCurrentLocale(detectedLocale);
    }
  }, [pathname]);
  
  const getCurrentLanguage = (): string => {
    if (isHydrated && nextIntlLocale) {
      return nextIntlLocale;
    }
    if (isHydrated) {
      return currentLocale;
    }
    return getLocaleFromPathname(pathname);
  };

  const switchLocale = (newLocale?: string) => {
    const currentLang = getCurrentLanguage();
    const targetLocale = newLocale || getOppositeLanguage(currentLang);
    
    if (!['en', 'ar'].includes(targetLocale)) {
      console.warn(`Invalid locale: ${targetLocale}, defaulting to 'ar'`);
      return;
    }
    
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLang}`)) {
      newPath = pathname.replace(`/${currentLang}`, `/${targetLocale}`);
    } else {
      newPath = `/${targetLocale}${pathname}`;
    }
    
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    
    router.push(newPath);
  };

  const getTranslationsForCurrentLocale = (): TranslationKeys => {
    const currentLang = getCurrentLanguage();
    return getTranslationsForLocale(currentLang);
  };

  return {
    getCurrentLanguage,
    switchLocale,
    currentLanguage: getCurrentLanguage(),
    getTranslationsForCurrentLocale,
    isHydrated
  };
}

export function useTranslation(): TranslationKeys {
  const [hydrationComplete, setHydrationComplete] = useState(false);
  const [locale, setLocale] = useState<string>('ar');
  
  useEffect(() => {
    setHydrationComplete(true);
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      let detectedLocale = getLocaleFromPathname(pathname);
      
      // If path doesn't have a locale, try to get from cookie
      if (detectedLocale === 'ar') {
        const cookieLocale = getLocaleFromCookie();
        if (cookieLocale) {
          detectedLocale = cookieLocale;
        }
      }
      setLocale(detectedLocale);
    }
  }, []);
  
  const effectiveLocale = hydrationComplete ? locale : 'ar';
  return getBuildTimeTranslations(effectiveLocale);
}