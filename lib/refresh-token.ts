import { signToken, verifyToken } from './jwt';

export interface RefreshTokenPayload {
  id: string;
  refreshVersion: number;
}

export function generateRefreshToken(userId: string, version: number): string {
  return signToken({ id: userId, refreshVersion: version }, '30d');
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return verifyToken<RefreshTokenPayload>(token);
}

// Store refresh token versions in memory (in production, use Redis or database)
const refreshTokenVersions: Map<string, number> = new Map();

export function getRefreshTokenVersion(userId: string): number {
  return refreshTokenVersions.get(userId) || 0;
}

export function incrementRefreshTokenVersion(userId: string): void {
  const current = getRefreshTokenVersion(userId);
  refreshTokenVersions.set(userId, current + 1);
}

export function revokeAllUserTokens(userId: string): void {
  incrementRefreshTokenVersion(userId);
}