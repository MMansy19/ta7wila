import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames, localePrefix } from './i18n-config'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value;
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;

  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const pathnameHasValidLocale = locales.some(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get preferred locale (saved locale or default)
  const preferredLocale = (savedLocale && locales.includes(savedLocale as any)) ? savedLocale : defaultLocale;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  if (!pathnameHasValidLocale) {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    
    // For dashboard routes, use preferred locale (saved or default)
    if (segments[0] === 'dashboard' || pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
    }
    
    if (firstSegment?.length === 2) {
      const restOfPath = segments.slice(1).join('/');
      const redirectPath = restOfPath ? `/${preferredLocale}/${restOfPath}` : `/${preferredLocale}`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
  }

  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || preferredLocale;

  // Save the current locale to cookies if it's different from saved one
  const response = NextResponse.next();
  if (currentLocale !== savedLocale) {
    response.cookies.set('NEXT_LOCALE', currentLocale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax'
    });
  }

  if (pathname.includes('/dashboard') && !token) {
    const redirectResponse = NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
    if (currentLocale !== savedLocale) {
      redirectResponse.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax'
      });
    }
    return redirectResponse;
  }

  // Allow public access to public-payment pages
  if (pathname.includes('/public-payment')) {
    const response = NextResponse.next();
    if (currentLocale !== savedLocale) {
      response.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax'
      });
    }
    return response;
  }

  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
  const isValidPath = Object.keys(pathnames).some(validPath => {
    if (validPath === '/') return pathWithoutLocale === '/';
    return pathWithoutLocale.startsWith(validPath);
  });

  if (!isValidPath && pathWithoutLocale !== '/' && !pathWithoutLocale.startsWith('/dashboard') && !pathWithoutLocale.startsWith('/public-payment')) {
    const redirectResponse = NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    if (currentLocale !== savedLocale) {
      redirectResponse.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax'
      });
    }
    return redirectResponse;
  }

  // Apply the intl middleware and preserve cookies
  const intlResponse = intlMiddleware(request);
  if (currentLocale !== savedLocale && intlResponse) {
    intlResponse.cookies.set('NEXT_LOCALE', currentLocale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax'
    });
  }

  return intlResponse || response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/', '/dashboard/:path*', '/public-payment/:path*']
}