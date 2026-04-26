import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export function validateJwtSecret(): void {
  if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is not defined in environment variables');
  }
  
  if (typeof JWT_SECRET === 'string' && JWT_SECRET.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters long');
  }
  
  if (JWT_SECRET === 'nthoppa-super-secret-jwt-key-2026-minimum-32-chars') {
    console.warn('⚠️ WARNING: Using default JWT_SECRET. Generate a secure random secret for production!');
  }
}

export function signToken(payload: object, expiresIn: string | number = '7d'): string {
  validateJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken<T>(token: string): T {
  validateJwtSecret();
  return jwt.verify(token, JWT_SECRET) as T;
}