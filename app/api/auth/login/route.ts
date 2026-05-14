import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars';

const DEMO_CREDENTIALS: Record<string, { email: string; password: string; name: string; id: string; extra?: object }> = {
  admin:    { email: 'admin@nthoppa.com',    password: 'admin123',    name: 'System Administrator', id: 'admin-001' },
  agent:    { email: 'agent@nthoppa.com',    password: 'agent123',    name: 'John Motsumi',          id: 'agent-001',    extra: { territory: 'Gaborone Central' } },
  client:   { email: 'client@nthoppa.com',   password: 'client123',   name: 'Josephine Morolong',    id: 'client-001' },
  hr:       { email: 'hr@nthoppa.com',       password: 'hr123',       name: 'Thabo Molefe',          id: 'hr-001' },
  merchant: { email: 'merchant@nthoppa.com', password: 'merchant123', name: 'Kgabo General Store',   id: 'merchant-001' },
};

const REDIRECT_MAP: Record<string, string> = {
  admin:    '/admin/dashboard',
  agent:    '/dashboard/main',
  client:   '/client/dashboard',
  hr:       '/hr/dashboard',
  merchant: '/merchant/dashboard',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password and role are required' }, { status: 400 });
    }

    const demo = DEMO_CREDENTIALS[role];
    if (!demo) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (email !== demo.email || password !== demo.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = { id: demo.id, email: demo.email, role, name: demo.name, ...(demo.extra || {}) };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    const redirectUrl = REDIRECT_MAP[role] || '/';

    const response = NextResponse.json({ success: true, redirectUrl, user: tokenPayload, token });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    response.cookies.set('nthoppa_token', token, cookieOptions);
    response.cookies.set('user_role', role, cookieOptions);
    if (role === 'admin') response.cookies.set('admin_session', token, cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
