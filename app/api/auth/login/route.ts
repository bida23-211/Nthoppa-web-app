import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/middleware/validation';
import { loginSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars';

const DEMO_CREDENTIALS = {
  admin:    { email: 'admin@nthoppa.com',    password: 'admin123',    name: 'System Administrator',  id: 'admin-001',    role: 'admin',    extra: {} },
  agent:    { email: 'agent@nthoppa.com',    password: 'agent123',    name: 'John Motsumi',           id: 'agent-001',    role: 'agent',    extra: { territory: 'Gaborone Central' } },
  client:   { email: 'client@nthoppa.com',   password: 'client123',   name: 'Josephine Morolong',     id: 'client-001',   role: 'client',   extra: {} },
  hr:       { email: 'hr@nthoppa.com',       password: 'hr123',       name: 'Thabo Molefe',           id: 'hr-001',       role: 'hr',       extra: {} },
  merchant: { email: 'merchant@nthoppa.com', password: 'merchant123', name: 'Kgabo General Store',    id: 'merchant-001', role: 'merchant', extra: {} },
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

const getRedirectUrl = (role: string): string => {
  switch (role) {
    case 'admin':    return '/admin/dashboard';
    case 'agent':    return '/dashboard/main';
    case 'client':   return '/client/dashboard';
    case 'hr':       return '/hr/dashboard';
    case 'merchant': return '/merchant/dashboard';
    default:         return '/';
  }
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { data: validated, error: validationError } = await validateBody(loginSchema)(request);
    if (validationError) return validationError;

    const { email, password, role } = validated;

    const rateLimitError = await checkRateLimit(request, email);
    if (rateLimitError) return rateLimitError;

    console.log('Login attempt:', { email, role });

    // Find matching demo credential
    const demo = Object.values(DEMO_CREDENTIALS).find(d => d.role === role);

    if (!demo) {
      return NextResponse.json({ error: `Unknown role: ${role}` }, { status: 400 });
    }

    if (email !== demo.email || password !== demo.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const redirectUrl = getRedirectUrl(role);
    const tokenPayload = { id: demo.id, email: demo.email, role: demo.role, name: demo.name, ...demo.extra };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: tokenPayload,
      token,
      elapsedMs: Date.now() - startTime,
    });

    response.cookies.set('nthoppa_token', token, COOKIE_OPTIONS);
    response.cookies.set('user_role', role, COOKIE_OPTIONS);

    if (role === 'admin') {
      response.cookies.set('admin_session', token, COOKIE_OPTIONS);
    }

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
