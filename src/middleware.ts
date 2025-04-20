import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from './i18n-config'

const locales = ['en', 'ar']
const defaultLocale = i18nConfig.defaultLocale

async function validateToken(token: string, apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const userLocale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check dashboard routes
  if (pathname.includes("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/${userLocale}/login`, request.url))
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!
    const isValidToken = await validateToken(token, apiUrl)
    
    if (!isValidToken) {
      const response = NextResponse.redirect(new URL(`/${userLocale}/login`, request.url))
      response.cookies.delete("token")
      return response
    }
    return NextResponse.next()
  }

  // Check locale and redirect if needed
  const pathLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathLocale) {
    const response = NextResponse.redirect(new URL(`/${userLocale}${pathname}`, request.url))
    response.cookies.set('NEXT_LOCALE', userLocale)
    return response
  }

  // Check login/forgetpassword routes
  const isAuthRoute = [`/${pathLocale}/login`, `/${pathLocale}/forgetpassword`].includes(pathname)
  if (isAuthRoute && token) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!
    const isValidToken = await validateToken(token, apiUrl)

    if (isValidToken) {
      return NextResponse.redirect(new URL(`/${pathLocale}/dashboard`, request.url))
    }

    const response = NextResponse.next()
    response.cookies.delete("token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|static).*)',
    '/dashboard/:path*',
  ]
}