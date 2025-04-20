import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from './i18n-config'

let locales = ['en', 'ar']
let defaultLocale = i18nConfig.defaultLocale

export async function middleware(request: NextRequest) {
  console.log("middleware is running")
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const userLocale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale

 
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  
  if (token &&  (pathname.includes("/login"))) {
    return NextResponse.redirect(new URL(`/${userLocale}/dashboard`, request.url))
  }

  if (token && (pathname.includes("/forgetpassword"))  ) {
    return NextResponse.redirect(new URL(`/${userLocale}/dashboard`, request.url))
  }

  if (pathname.includes("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/${userLocale}/login`, request.url))
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const response = await fetch(`${apiUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
      
        const response = NextResponse.redirect(new URL(`/${userLocale}/login`, request.url))
        response.cookies.delete("token")
        return response
      }
    } catch (error) {
     
      const response = NextResponse.redirect(new URL(`/${userLocale}/login`, request.url))
      response.cookies.delete("token")
      return response
    }
  }
  




 
  const pathLocale = i18nConfig.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale in path, redirect to the user's preferred locale
  if (!pathLocale) {
    // Use the user's preferred locale from cookie or default to 'ar'
    const response = NextResponse.redirect(new URL(`/${userLocale}${pathname}`, request.url))
    response.cookies.set('NEXT_LOCALE', userLocale)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|static).*)',
    '/dashboard/:path*',
    '/login/:path*',
    '/forgetpassword/:path*',
  ]
}






