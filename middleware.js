import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('skanema_token')?.value
  const { pathname } = request.nextUrl

  // Protection dashboard
  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si connecté → pas besoin d'aller sur login
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}