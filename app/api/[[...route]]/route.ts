import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from '@/lib/db/drizzle';
import { users, otpCodes } from '@/lib/db/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// ========== Helper Functions ==========

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, key] = hashedPassword.split(':');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === key;
}

export async function generateToken(userId: string, email: string): Promise<string> {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ========== Email Configuration (SMTP Gmail) ==========
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) console.error('❌ SMTP Error:', error);
  else console.log('✅ SMTP ready to send emails');
});

function getOTPEmailHtml(otpCode: string, name?: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verifikasi Login - Triablazer</title>
<style>
  body { font-family: 'Rajdhani', sans-serif; background: #050810; color: #E5DCC8; margin: 0; padding: 20px; }
  .container { max-width: 500px; margin: 0 auto; background: #0B1121; border: 0.5px solid rgba(200,169,110,0.18); padding: 2rem; border-radius: 12px; }
  .code { font-size: 2rem; font-weight: 700; letter-spacing: 8px; color: #C8A96E; text-align: center; padding: 1rem; background: rgba(200,169,110,0.05); margin: 1.5rem 0; }
  .footer { margin-top: 1.5rem; font-size: 0.7rem; color: #4A4540; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <h2 style="color:#C8A96E;">✦ Triablazer ✦</h2>
  <p>Halo${name ? `, ${name}` : ' Traveler'}!</p>
  <p>Gunakan kode verifikasi berikut untuk menyelesaikan login Anda:</p>
  <div class="code">${otpCode}</div>
  <p>Kode ini berlaku selama <strong>10 menit</strong>.</p>
  <p>Jika Anda tidak mencoba login, abaikan email ini.</p>
  <div class="footer">© 2025 Triablazer · All rights reserved</div>
</div>
</body>
</html>`;
}

async function sendOTPEmail(email: string, code: string, name?: string) {
  const html = getOTPEmailHtml(code, name);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Kode Verifikasi Login - Triablazer',
    html,
  });
}

// ========== ELYSIA APP ==========
const app = new Elysia({ prefix: '/api' })
  .use(cors({ origin: true, credentials: true }))
  
  // ========== SEND OTP (Forget Password) ==========
  .post('/otp/send', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      console.log('📧 SEND OTP - Menerima email:', email);

      if (!email || !email.includes('@')) {
        set.status = 400;
        return { error: 'Email tidak valid' };
      }

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length === 0) {
        set.status = 404;
        return { error: 'Email tidak terdaftar' };
      }

      if (!existing[0].isVerified) {
        set.status = 400;
        return { error: 'Email belum diverifikasi. Silakan registrasi terlebih dahulu.' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      
      console.log('✅ OTP tersimpan di database:', code);
      await sendOTPEmail(email, code, existing[0].username);
      console.log('✅ Email OTP terkirim ke:', email);

      return { 
        message: 'OTP sent', 
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined 
      };
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
      const { email } = body as { email: string };
      
      console.log('📧 RESEND OTP - Email:', email);

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length === 0) {
        set.status = 404;
        return { error: 'Email tidak terdaftar' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });

      await sendOTPEmail(email, code, existing[0].username);
      console.log('✅ RESEND: Email OTP terkirim ke:', email);

      return { 
        message: 'OTP resent', 
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined 
      };
    } catch (error) {
      console.error('❌ RESEND error:', error);
      set.status = 500;
      return { error: 'Failed to resend OTP' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  // ========== VERIFY OTP (Forget Password) ==========
  .post('/otp/verify', async ({ body, set }) => {
    try {
      const { email, code } = body as { email: string; code: string };
      
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
  
  // ========== SIGN IN (Step 1 - Check credentials & send OTP) ==========
  .post('/auth/signin', async ({ body, set }) => {
    try {
      const { email, password } = body as { email: string; password: string };

      console.log('📝 Sign in attempt:', email);

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

      console.log('✅ Password valid, sending OTP to:', email);

      // Generate and send OTP
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      
      await sendOTPEmail(email, code, user[0].username);
      
      console.log('✅ OTP sent to:', email);

      return {
        success: true,
        message: 'OTP sent to your email',
        requiresOTP: true,
        email: email,
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined
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

  // ========== VERIFY LOGIN OTP (Step 2 - Verify OTP & create session) ==========
  .post('/auth/verify-login-otp', async ({ body, set, cookie: { token } }) => {
    try {
      const { email, code } = body as { email: string; code: string };
      
      console.log('🔐 Verifying login OTP for:', email);

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

      // Mark OTP as used
      await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, otp.id));
      
      // Get user data
      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        set.status = 404;
        return { error: 'User tidak ditemukan' };
      }

      // Generate session token
      const jwtToken = await generateToken(user[0].id, user[0].email);
      token.set({
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      console.log('✅ Login OTP verified successfully for:', email);

      return {
        success: true,
        verified: true,
        message: 'Verifikasi berhasil',
        user: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          rank: user[0].rank,
          level: user[0].level,
        }
      };
    } catch (error) {
      console.error('❌ Verify login OTP error:', error);
      set.status = 500;
      return { error: 'Verification failed' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      code: t.String({ minLength: 6, maxLength: 6 })
    })
  })

  // ========== RESEND LOGIN OTP ==========
  .post('/auth/resend-login-otp', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      console.log('📧 Resending login OTP to:', email);

      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        set.status = 404;
        return { error: 'Email tidak terdaftar' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });

      await sendOTPEmail(email, code, user[0].username);
      console.log('✅ Login OTP resent to:', email);

      return {
        success: true,
        message: 'OTP resent successfully',
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined
      };
    } catch (error) {
      console.error('❌ Resend login OTP error:', error);
      set.status = 500;
      return { error: 'Failed to resend OTP' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  // ========== SIGN UP ==========
  .post('/auth/signup', async ({ body, set }) => {
    try {
      const { username, email, password } = body as { username: string; email: string; password: string };

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

  // ========== CHECK EMAIL FOR RESET ==========
  .post('/auth/check-email-reset', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      const user = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        isVerified: users.isVerified
      }).from(users).where(eq(users.email, email));
      
      if (user.length === 0) {
        set.status = 404;
        return { error: 'Email tidak terdaftar' };
      }
      
      if (!user[0].isVerified) {
        set.status = 400;
        return { error: 'Email belum diverifikasi. Silakan registrasi terlebih dahulu.' };
      }
      
      return {
        exists: true,
        email: user[0].email,
        username: user[0].username
      };
    } catch (error) {
      console.error('❌ Check email reset error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })

  // ========== FORGET RESET (OTP + Reset Password + Auto Login) ==========
  .post('/auth/forget-reset', async ({ body, set, cookie: { token } }) => {
    try {
      const { email, code, newPassword } = body as { email: string; code: string; newPassword: string };
      
      console.log('🔄 FORGET RESET - Email:', email);
      
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

      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        set.status = 404;
        return { error: 'User tidak ditemukan' };
      }

      if (newPassword.length < 8) {
        set.status = 400;
        return { error: 'Password minimal 8 karakter' };
      }

      const hashedPassword = await hashPassword(newPassword);
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user[0].id));

      await db.update(otpCodes)
        .set({ isUsed: true })
        .where(eq(otpCodes.id, otp.id));

      await db.delete(otpCodes).where(eq(otpCodes.email, email));

      const jwtToken = await generateToken(user[0].id, user[0].email);
      token.set({
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      console.log(`✅ Password reset via OTP untuk user: ${user[0].email}`);

      return {
        success: true,
        message: 'Password berhasil direset',
        user: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          rank: user[0].rank,
          level: user[0].level,
        }
      };
    } catch (error) {
      console.error('❌ Forget reset error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      code: t.String({ minLength: 6, maxLength: 6 }),
      newPassword: t.String({ minLength: 8 })
    })
  })
  
  // ========== GET ALL REGISTERED EMAILS (Admin only) ==========
  .get('/auth/emails', async ({ cookie: { token }, set }) => {
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
      
      const currentUser = await db.select().from(users).where(eq(users.id, payload.userId));
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Akses ditolak. Hanya admin.' };
      }
      
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isVerified: users.isVerified,
        level: users.level,
        rank: users.rank,
        createdAt: users.createdAt,
      }).from(users).orderBy(desc(users.createdAt));
      
      return {
        total: allUsers.length,
        users: allUsers
      };
    } catch (error) {
      console.error('❌ Get all emails error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  })
  
  // Health check
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }));

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;