import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from '@/lib/db/drizzle';
import { users, otpCodes } from '@/lib/db/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { sendOTPEmail, generateOTP } from '@/lib/auth/email';
import { generateToken, verifyToken } from '@/lib/auth/jwt';
import { randomUUID } from 'crypto';

const app = new Elysia({ prefix: '/api' })
  .use(cors({ origin: true, credentials: true }))
  
  // ========== SEND OTP ==========
  .post('/otp/send', async ({ body, set }) => {
    try {
      const { email } = body;
      console.log('📧 SEND OTP - Menerima email:', email);

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0 && existing[0].isVerified) {
        set.status = 400;
        return { error: 'Email already registered' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      console.log('✅ OTP tersimpan di database');

      await sendOTPEmail(email, code);
      console.log('✅ Email OTP terkirim ke:', email);

      return { message: 'OTP sent', devOTP: code };
    } catch (error) {
      console.error('❌ ERROR di /otp/send:', error);
      set.status = 500;
      return { error: error instanceof Error ? error.message : 'Internal server error' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  // ========== RESEND OTP ==========
  .post('/otp/resend', async ({ body, set }) => {
    try {
      const { email } = body;
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });

      await sendOTPEmail(email, code);
      console.log('✅ RESEND: Email OTP terkirim ke:', email);

      return { message: 'OTP resent', devOTP: code };
    } catch (error) {
      console.error('❌ RESEND error:', error);
      set.status = 500;
      return { error: 'Failed to resend OTP' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  // ========== VERIFY OTP ==========
  .post('/otp/verify', async ({ body, set }) => {
    try {
      const { email, code } = body;
      console.log('🔐 Verifikasi OTP untuk:', email, 'kode:', code);

      const valid = await db.select()
        .from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, email),
            eq(otpCodes.code, code),
            eq(otpCodes.isUsed, false)
          )
        );

      if (valid.length === 0) {
        set.status = 400;
        return { error: 'Kode OTP tidak valid' };
      }

      const otp = valid[0];
      if (new Date() > new Date(otp.expiresAt)) {
        set.status = 400;
        return { error: 'Kode OTP sudah kadaluarsa' };
      }

      await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, otp.id));
      console.log('✅ OTP berhasil diverifikasi');

      return { verified: true };
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      set.status = 500;
      return { error: 'Verification failed' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      code: t.String({ minLength: 6, maxLength: 6 })
    })
  })
  
  // ========== SIGN UP ==========
  .post('/auth/signup', async ({ body, set }) => {
    try {
      const { username, email, password } = body;

      console.log('📝 Signup attempt:', { username, email });

      if (username.length < 3) {
        set.status = 400;
        return { error: 'Username minimal 3 karakter' };
      }
      if (password.length < 8) {
        set.status = 400;
        return { error: 'Password minimal 8 karakter' };
      }

      const verifiedOtp = await db.select()
        .from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, email),
            eq(otpCodes.isUsed, true)
          )
        );

      if (verifiedOtp.length === 0) {
        set.status = 400;
        return { error: 'Email belum diverifikasi. Verifikasi dulu dengan kode OTP.' };
      }

      const existingEmail = await db.select().from(users).where(eq(users.email, email));
      if (existingEmail.length > 0) {
        set.status = 400;
        return { error: 'Email sudah terdaftar' };
      }

      const existingUsername = await db.select().from(users).where(eq(users.username, username));
      if (existingUsername.length > 0) {
        set.status = 400;
        return { error: 'Username sudah dipakai' };
      }

      const hashedPassword = await hashPassword(password);
      const userId = randomUUID();

      await db.insert(users).values({
        id: userId,
        username,
        email,
        password: hashedPassword,
        isVerified: true,
        role: 'user',
        rank: 'Novice Omni-Voyager',
        level: 1,
        xp: 0,
      });

      await db.delete(otpCodes).where(eq(otpCodes.email, email));

      console.log('✅ User created successfully:', userId);

      return {
        message: 'Akun berhasil dibuat',
        user: { id: userId, username, email, rank: 'Novice Omni-Voyager', level: 1 }
      };
    } catch (error) {
      console.error('❌ Signup error:', error);
      set.status = 500;
      return { error: error instanceof Error ? error.message : 'Internal server error' };
    }
  }, {
    body: t.Object({
      username: t.String({ minLength: 3 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 })
    })
  })
  
  // ========== SIGN IN ==========
  .post('/auth/signin', async ({ body, set, cookie: { token } }) => {
    try {
      const { email, password } = body;

      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        set.status = 401;
        return { error: 'Email atau password salah' };
      }

      const validPassword = await verifyPassword(password, user[0].password);
      if (!validPassword) {
        set.status = 401;
        return { error: 'Email atau password salah' };
      }

      const jwtToken = await generateToken(user[0].id, user[0].email);
      token.set({
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      console.log('✅ User signed in:', user[0].email);

      return {
        message: 'Login berhasil',
        user: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          rank: user[0].rank,
          level: user[0].level,
        }
      };
    } catch (error) {
      console.error('❌ Signin error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    })
  })
  
  // ========== GET CURRENT USER ==========
  .get('/auth/me', async ({ cookie: { token }, set }) => {
    try {
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Tidak terotentikasi' };
      }
      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Token tidak valid' };
      }
      const user = await db.select().from(users).where(eq(users.id, payload.userId));
      if (user.length === 0) {
        set.status = 404;
        return { error: 'User tidak ditemukan' };
      }
      return {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        rank: user[0].rank,
        level: user[0].level,
        xp: user[0].xp,
      };
    } catch (error) {
      console.error('❌ Get user error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  })
  
  // ========== SIGN OUT ==========
  .post('/auth/signout', ({ cookie: { token } }) => {
    token.remove();
    return { message: 'Logout berhasil' };
  })
  
  // Health check
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }));

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;