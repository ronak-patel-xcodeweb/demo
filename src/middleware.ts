import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ROUTE_PERMISSIONS = {
  Company: ['/dashboard', '/agent-requests',
    '/services'
  ],
  // Agent: ['/service-requests', '/agent-services'],
  Agent: ['/service-requests'],
  Admin: [
    '/registration-management',
    '/user-management',
    '/services',
    '/government-requests'
  ],
  GovernmentBody: [
    '/request-info',
    '/requested-services'
  ]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(pathname)

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (token && !isAuthPage) {
    const userRole = token.role as keyof typeof ROUTE_PERMISSIONS
    const allowedRoutes = ROUTE_PERMISSIONS[userRole] || []

    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))

    if (!isAllowed) {
      const defaultRoute = allowedRoutes[0] || '/dashboard'
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agent-requests/:path*',
    '/service-requests/:path*',
    '/agent-services/:path*',
    '/registration-management/:path*',
    '/user-management/:path*',
    '/services/:path*',
    '/request-info/:path*',
    '/requested-services/:path*',
    '/government-requests/:path*',
    '/login',
    '/signup',
  ]
}