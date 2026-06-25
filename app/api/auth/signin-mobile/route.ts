// app/api/auth/signin-mobile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// ========== Helper Functions ==========
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, key] = hashedPassword.split(':');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === key;
}

async function generateToken(userId: string, email: string): Promise<string> {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

// ========== CORS Headers ==========
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, Accept',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// ========== OPTIONS (Preflight) ==========
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// ========== POST ==========
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log('📱 Mobile Sign in attempt:', email);

    // Cek user
    const user = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      isVerified: users.isVerified,
      role: users.role,
      rank: users.rank,
      level: users.level,
      xp: users.xp,
      isBanned: users.isBanned,
      banReason: users.banReason,
      banExpiry: users.banExpiry,
    }).from(users).where(eq(users.email, email));

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Cek verifikasi
    if (!user[0].isVerified) {
      return NextResponse.json(
        { error: 'Email belum diverifikasi. Silakan verifikasi terlebih dahulu.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Cek ban
    if (user[0].isBanned === true) {
      if (user[0].banExpiry) {
        const expiry = new Date(user[0].banExpiry);
        if (new Date() > expiry) {
          await db.update(users)
            .set({ isBanned: false, banReason: null, banExpiry: null })
            .where(eq(users.id, user[0].id));
        } else {
          return NextResponse.json(
            { error: `Akun Anda sedang di-ban hingga ${new Date(user[0].banExpiry).toLocaleDateString('id-ID')}. Alasan: ${user[0].banReason || 'Melanggar aturan'}` },
            { status: 403, headers: CORS_HEADERS }
          );
        }
      } else {
        return NextResponse.json(
          { error: `Akun Anda telah di-ban permanen. Alasan: ${user[0].banReason || 'Melanggar aturan'}. Hubungi administrator.` },
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    // Verifikasi password
    const validPassword = await verifyPassword(password, user[0].password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user[0].id));

    // Generate token
    const jwtToken = await generateToken(user[0].id, user[0].email);

    // Buat response
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      role: user[0].role,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        rank: user[0].rank,
        level: user[0].level,
        role: user[0].role,
      }
    });

    // ✅ TAMBAHKAN CORS HEADERS
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Set cookie
    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    console.log('✅ Mobile login successful:', email);
    console.log('👤 User role:', user[0].role);

    return response;
  } catch (error) {
    console.error('❌ Mobile Signin error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}