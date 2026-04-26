import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('nthoppa_token')?.value 
               || request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
      territory?: string;
    };

    return NextResponse.json({
      authenticated: true,
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      territory: decoded.territory || null,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}