import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware:', pathname);

  // Public routes - no authentication required
  const isPublicRoute = pathname === '/' || pathname === '/login';
  const isPublicApi = pathname.startsWith('/api/auth/') || 
                      pathname.startsWith('/api/subscribe') || 
                      pathname.startsWith('/api/waitlist') ||
                      pathname.startsWith('/api/ussd') ||
                      pathname === '/api/auth/login';
  
  if (isPublicRoute || isPublicApi) {
    return NextResponse.next();
  }

  // Static assets - always allow
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') || 
      pathname.startsWith('/partners/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get authentication token
  const token = request.cookies.get('nthoppa_token')?.value;
  const adminSession = request.cookies.get('admin_session')?.value;
  
  const hasToken = !!token;
  const hasAdmin = !!adminSession;

  // API routes protection - require authentication
  if (pathname.startsWith('/api/')) {
    if (!hasToken && !hasAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Helper function to decode token (Edge compatible)
  const getTokenPayload = (tokenValue: string) => {
    try {
      return decodeToken(tokenValue);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  };

  // Redirect helper based on role - accepts URL object
  const redirectToRoleDashboard = (role: string, requestUrl: URL) => {
    let redirectPath = '/';
    switch (role) {
      case 'admin': redirectPath = '/admin/dashboard'; break;
      case 'agent': redirectPath = '/dashboard/main'; break;
      case 'client': redirectPath = '/client/dashboard'; break;
      case 'hr': redirectPath = '/hr/dashboard'; break;
      case 'merchant': redirectPath = '/merchant/dashboard'; break;
      default: redirectPath = '/login';
    }
    return NextResponse.redirect(new URL(redirectPath, requestUrl));
  };

  // Admin routes - require admin session or valid token with admin role
  if (pathname.startsWith('/admin/')) {
    // Check admin session first
    if (hasAdmin) {
      return NextResponse.next();
    }
    
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = getTokenPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (payload.role !== 'admin') {
      return redirectToRoleDashboard(payload.role, request.nextUrl);
    }
    return NextResponse.next();
  }

  // Agent dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = getTokenPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (payload.role !== 'agent') {
      return redirectToRoleDashboard(payload.role, request.nextUrl);
    }
    return NextResponse.next();
  }

  // Client portal routes
  if (pathname.startsWith('/client')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = getTokenPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (payload.role !== 'client') {
      return redirectToRoleDashboard(payload.role, request.nextUrl);
    }
    return NextResponse.next();
  }

  // HR portal routes
  if (pathname.startsWith('/hr')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = getTokenPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (payload.role !== 'hr') {
      return redirectToRoleDashboard(payload.role, request.nextUrl);
    }
    return NextResponse.next();
  }

  // Merchant portal routes
  if (pathname.startsWith('/merchant')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = getTokenPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (payload.role !== 'merchant') {
      return redirectToRoleDashboard(payload.role, request.nextUrl);
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