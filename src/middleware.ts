import { NextRequest, NextResponse } from 'next/server'

const ADMIN_LOGIN = '/admin/login'
const PROTECTED_PREFIX = '/admin'
const TOKEN_KEY = 'admin_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value

  const isAdminLogin = pathname === ADMIN_LOGIN
  const isProtected = pathname.startsWith(PROTECTED_PREFIX) && !isAdminLogin

  if (isProtected && !token) {
    const loginUrl = new URL(ADMIN_LOGIN, request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminLogin && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
