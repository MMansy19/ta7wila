import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from './i18n-config'

let locales = ['en', 'ar']
let defaultLocale = 'ar'

export async function middleware(request: NextRequest) {
  console.log("middleware is running")
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

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

  // Check if the path contains dashboard (with or without locale prefix)
  console.log(pathname)
  if (pathname.includes("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Validate token by making a request to fetch user profile
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const response = await fetch(`${apiUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // If the response is not ok, the token is invalid
      if (!response.ok) {
        // Clear cookies and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("token")
        return response
      }
    } catch (error) {
      // If there's an error, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      return response
    }
  }

  // Always apply the default language 'ar' to all routes
  // Check if the path already has a locale
  const pathLocale = i18nConfig.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale in path, redirect to the default locale 'ar'
  if (!pathLocale) {
    // Set the default locale cookie to 'ar'
    const response = NextResponse.redirect(new URL(`/ar${pathname}`, request.url))
    response.cookies.set('NEXT_LOCALE', 'ar')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next/static|_next/image|favicon.ico|api|static).*)',
    // Include dashboard paths
    '/dashboard/:path*'
  ]
}