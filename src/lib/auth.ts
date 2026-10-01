import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'free-fire-super-secret-jwt-key-2026';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('ff_token')?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        wallet: true,
      },
    });

    if (!user || user.isSuspended) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      ffPlayerName: user.ffPlayerName,
      ffUid: user.ffUid,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      wallet: user.wallet,
    };
  } catch (err) {
    return null;
  }
}

export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'TOURNAMENT_MANAGER', 'MODERATOR'];

export function hasAdminAccess(role?: string) {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
}
