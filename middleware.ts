import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware:', pathname);

  // Public routes
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/admin';
  const isPublicApi = pathname.startsWith('/api/auth/') || 
                      pathname.startsWith('/api/subscribe') || 
                      pathname.startsWith('/api/waitlist') ||
                      pathname.startsWith('/api/ussd');
  
  if (isPublicRoute || isPublicApi) {
    return NextResponse.next();
  }

  // Static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/partners/')) {
    return NextResponse.next();
  }

  // Get cookies
  const token = request.cookies.get('nthoppa_token')?.value;
  const adminSession = request.cookies.get('admin_session')?.value;
  
  const hasToken = !!token;
  const hasAdmin = !!adminSession;

  // API routes protection
  if (pathname.startsWith('/api/')) {
    if (!hasToken && !hasAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin routes - require admin session
  if (pathname.startsWith('/admin/')) {
    if (!hasAdmin && !hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Agent dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Client portal
  if (pathname.startsWith('/client')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // HR portal
  if (pathname.startsWith('/hr')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Merchant portal
  if (pathname.startsWith('/merchant')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/client/:path*',
    '/hr/:path*',
    '/merchant/:path*',
    '/api/:path*',
  ],
};