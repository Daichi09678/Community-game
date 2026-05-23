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
    // ... kode signup (sudah ada) ...
  })
  
  // ========== SIGN IN ==========
  .post('/auth/signin', async ({ body, set, cookie: { token } }) => {
    // ... kode signin (sudah ada) ...
  })
  
  // ========== GET CURRENT USER ==========
  .get('/auth/me', async ({ cookie: { token }, set }) => {
    // ... kode get user (sudah ada) ...
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