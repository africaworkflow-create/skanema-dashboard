import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('skanema_token')?.value
  const { pathname } = request.nextUrl

  // Si on accède au dashboard sans token → redirect login
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si on est connecté et on va sur /login → redirect dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}