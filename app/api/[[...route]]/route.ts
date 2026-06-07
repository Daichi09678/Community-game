import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from '@/lib/db/drizzle';
import { users, otpCodes, reports } from '@/lib/db/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
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

// ========== Email Configuration ==========
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

function getOTPEmailHtml(otpCode: string, name?: string, type: string = 'login'): string {
  const title = type === 'registration' ? 'Verifikasi Registrasi' : 'Verifikasi Login';
  const message = type === 'registration' 
    ? 'Gunakan kode verifikasi berikut untuk menyelesaikan pendaftaran akun Anda:'
    : 'Gunakan kode verifikasi berikut untuk menyelesaikan login Anda:';
  
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title} - Triablazer</title>
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
  <p>${message}</p>
  <div class="code">${otpCode}</div>
  <p>Kode ini berlaku selama <strong>10 menit</strong>.</p>
  <p>Jika Anda tidak mencoba ${type === 'registration' ? 'mendaftar' : 'login'}, abaikan email ini.</p>
  <div class="footer">© 2025 Triablazer · All rights reserved</div>
</div>
</body>
</html>`;
}

async function sendOTPEmail(email: string, code: string, name?: string, type: string = 'login') {
  const html = getOTPEmailHtml(code, name, type);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: type === 'registration' ? 'Kode Verifikasi Registrasi - Triablazer' : 'Kode Verifikasi Login - Triablazer',
    html,
  });
}

// ========== Helper untuk Format Tanggal ==========

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatRelativeDate(date: Date | null | undefined | string): string {
  if (!date) return 'Just now';
  let dateObj: Date;
  if (date instanceof Date) dateObj = date;
  else dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Just now';
  const diffHours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return `${Math.floor(diffHours / 24)}d ago`;
}

function formatDateTime(date: Date | null | undefined | string): string {
  if (!date) return 'N/A';
  let dateObj: Date;
  if (date instanceof Date) dateObj = date;
  else dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return dateObj.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ========== ELYSIA APP ==========
const app = new Elysia({ prefix: '/api' })
  .use(cors({ origin: true, credentials: true }))
  
  // =============================================
  // HEALTH CHECK
  // =============================================
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  
  // =============================================
  // OTP ENDPOINTS FOR REGISTRATION
  // =============================================
  
  .post('/otp/send-registration', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      console.log('📧 SEND OTP REGISTRATION - Email:', email);

      if (!email || !email.includes('@')) {
        set.status = 400;
        return { error: 'Email tidak valid' };
      }

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        set.status = 400;
        return { error: 'Email sudah terdaftar. Silakan login.' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      
      console.log('✅ OTP Registration tersimpan:', code);
      await sendOTPEmail(email, code, undefined, 'registration');
      console.log('✅ Email OTP Registrasi terkirim ke:', email);

      return { 
        success: true,
        message: 'OTP sent for registration', 
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined 
      };
    } catch (error) {
      console.error('❌ /otp/send-registration error:', error);
      set.status = 500;
      return { error: error instanceof Error ? error.message : 'Internal server error' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  .post('/otp/verify-registration', async ({ body, set }) => {
    try {
      const { email, code } = body as { email: string; code: string };
      
      console.log('🔐 Verifikasi OTP Registrasi untuk:', email, 'Code:', code);

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
      console.log('✅ OTP Registrasi berhasil diverifikasi');

      return { success: true, verified: true };
    } catch (error) {
      console.error('❌ /otp/verify-registration error:', error);
      set.status = 500;
      return { error: 'Verification failed' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      code: t.String({ minLength: 6, maxLength: 6 })
    })
  })
  
  .post('/otp/resend-registration', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      console.log('📧 RESEND OTP REGISTRATION - Email:', email);

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        set.status = 400;
        return { error: 'Email sudah terdaftar. Silakan login.' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      await sendOTPEmail(email, code, undefined, 'registration');

      console.log('✅ OTP Registration resent to:', email);

      return {
        success: true,
        message: 'OTP resent for registration',
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined
      };
    } catch (error) {
      console.error('❌ /otp/resend-registration error:', error);
      set.status = 500;
      return { error: 'Failed to resend OTP' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  // =============================================
  // OTP ENDPOINTS FOR FORGET PASSWORD
  // =============================================
  
  .post('/otp/send', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
      console.log('📧 SEND OTP FORGET PASSWORD - Email:', email);

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
        return { error: 'Email belum diverifikasi.' };
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      
      console.log('✅ OTP Forget Password tersimpan:', code);
      await sendOTPEmail(email, code, existing[0].username, 'login');
      console.log('✅ Email OTP terkirim ke:', email);

      return { 
        success: true,
        message: 'OTP sent', 
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined 
      };
    } catch (error) {
      console.error('❌ /otp/send error:', error);
      set.status = 500;
      return { error: error instanceof Error ? error.message : 'Internal server error' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  .post('/otp/resend', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
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
      await sendOTPEmail(email, code, existing[0].username, 'login');

      return { 
        success: true,
        message: 'OTP resent', 
        devOTP: process.env.NODE_ENV === 'development' ? code : undefined 
      };
    } catch (error) {
      console.error('❌ /otp/resend error:', error);
      set.status = 500;
      return { error: 'Failed to resend OTP' };
    }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })
  
  .post('/otp/verify', async ({ body, set }) => {
    try {
      const { email, code } = body as { email: string; code: string };
      
      console.log('🔐 Verifikasi OTP Forget Password untuk:', email);

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
      console.log('✅ OTP Forget Password berhasil diverifikasi');

      return { success: true, verified: true };
    } catch (error) {
      console.error('❌ /otp/verify error:', error);
      set.status = 500;
      return { error: 'Verification failed' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      code: t.String({ minLength: 6, maxLength: 6 })
    })
  })
  
  // =============================================
  // AUTH ENDPOINTS
  // =============================================
  
  .post('/auth/signup', async ({ body, set, cookie: { token } }) => {
    try {
      const { username, email, password, otpCode } = body as { 
        username: string; 
        email: string; 
        password: string;
        otpCode: string;
      };

      console.log('📝 Signup attempt:', { username, email });

      if (username.length < 3) {
        set.status = 400;
        return { error: 'Username minimal 3 karakter' };
      }
      if (password.length < 8) {
        set.status = 400;
        return { error: 'Password minimal 8 karakter' };
      }
      if (!otpCode || otpCode.length !== 6) {
        set.status = 400;
        return { error: 'Kode OTP diperlukan' };
      }

      const validOtp = await db.select()
        .from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, email),
            eq(otpCodes.isUsed, true)
          )
        );

      if (validOtp.length === 0) {
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
        totalReports: 0,
        initials: username.slice(0, 2).toUpperCase(),
        lastLogin: new Date(),
      });

      await db.delete(otpCodes).where(eq(otpCodes.email, email));

      console.log('✅ User created successfully:', userId);

      const jwtToken = await generateToken(userId, email);
      token.set({
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return {
        success: true,
        message: 'Akun berhasil dibuat',
        user: { 
          id: userId, 
          username, 
          email, 
          rank: 'Novice Omni-Voyager', 
          level: 1 
        }
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
      password: t.String({ minLength: 8 }),
      otpCode: t.String({ minLength: 6, maxLength: 6 })
    })
  })
  
  .post('/auth/signin', async ({ body, set }) => {
    try {
      const { email, password } = body as { email: string; password: string };

      console.log('📝 Sign in attempt:', email);

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
      }).from(users).where(eq(users.email, email));
      
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

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const id = randomUUID();

      await db.delete(otpCodes).where(eq(otpCodes.email, email));
      await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
      
      await sendOTPEmail(email, code, user[0].username, 'login');
      
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

      await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, otp.id));
      
      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        set.status = 404;
        return { error: 'User tidak ditemukan' };
      }

      await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user[0].id));

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

  .post('/auth/resend-login-otp', async ({ body, set }) => {
    try {
      const { email } = body as { email: string };
      
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
      await sendOTPEmail(email, code, user[0].username, 'login');

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
      const user = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        rank: users.rank,
        level: users.level,
        xp: users.xp,
        initials: users.initials,
        totalReports: users.totalReports,
      }).from(users).where(eq(users.id, payload.userId));
      
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
        initials: user[0].initials,
        totalReports: user[0].totalReports || 0,
      };
    } catch (error) {
      console.error('❌ Get user error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  })
  
  .post('/auth/signout', ({ cookie: { token } }) => {
    token.remove();
    return { message: 'Logout berhasil' };
  })

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
        return { error: 'Email belum diverifikasi.' };
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
            eq(otpCodes.isUsed, true)
          )
        );

      if (valid.length === 0) {
        set.status = 400;
        return { error: 'Kode OTP tidak valid atau belum diverifikasi' };
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
        .set({ 
          password: hashedPassword,
          lastLogin: new Date()
        })
        .where(eq(users.id, user[0].id));

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
      
      const formattedUsers = allUsers.map(user => ({
        ...user,
        createdAt: formatDateTime(user.createdAt)
      }));
      
      return {
        total: allUsers.length,
        users: formattedUsers
      };
    } catch (error) {
      console.error('❌ Get all emails error:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  })
  
  // =============================================
  // DASHBOARD ENDPOINTS
  // =============================================
  
  .get('/dashboard/stats', async () => {
    try {
      const totalReports = await db.select({ count: sql<number>`count(*)` }).from(reports);
      const activeEvents = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.type, 'event'));
      const puzzlesSolved = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.type, 'puzzle'));
      const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
      
      const stats = [
        { label: 'Total Reports', value: formatNumber(totalReports[0]?.count || 0), change: '↑ +0 this week', accent: '#C8A96E' },
        { label: 'Active Events', value: activeEvents[0]?.count || 0, change: 'Across all games', accent: '#4ECDC4' },
        { label: 'Puzzles Solved', value: formatNumber(puzzlesSolved[0]?.count || 0), change: '↑ +0 today', accent: '#A855F7' },
        { label: 'Active Travelers', value: formatNumber(totalUsers[0]?.count || 0), change: 'No users online', accent: '#C84040' },
      ];
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: true, data: [
        { label: 'Total Reports', value: '0', change: 'No reports yet', accent: '#C8A96E' },
        { label: 'Active Events', value: '0', change: 'No events yet', accent: '#4ECDC4' },
        { label: 'Puzzles Solved', value: '0', change: 'No puzzles yet', accent: '#A855F7' },
        { label: 'Active Travelers', value: '0', change: 'No users yet', accent: '#C84040' },
      ] };
    }
  })

  // 🔥 CREATE REPORT - TAMBAHKAN INI
  .post('/dashboard/reports', async ({ body, set }: { body: any; set: any }) => {
    console.log('📝 CREATE REPORT endpoint dipanggil!');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
      const { title, type, game, content, userId, severity, version, tags, summary } = body;
      
      console.log('Extracted data:', { title, type, game, userId, contentLength: content?.length });
      
      if (!title || !type || !game || !content || !userId) {
        console.log('Missing required fields');
        set.status = 400;
        return { 
          success: false, 
          error: 'Missing required fields',
          received: { 
            title: !!title, 
            type: !!type, 
            game: !!game, 
            content: !!content, 
            userId: !!userId 
          }
        };
      }
      
      if (title.trim().length < 5) {
        set.status = 400;
        return { success: false, error: 'Title must be at least 5 characters' };
      }
      
      if (content.trim().length < 20) {
        set.status = 400;
        return { success: false, error: 'Content must be at least 20 characters' };
      }
      
      const reportId = randomUUID();
      const now = new Date();
      
      console.log('Creating report with ID:', reportId);
      
      await db.insert(reports).values({
        id: reportId,
        title: title.trim(),
        type: type,
        game: game,
        content: content,
        userId: userId,
        severity: severity || 'medium',
        status: 'published',
        version: version || '1.0',
        summary: summary || title.slice(0, 100),
        rating: 0,
        votes: 0,
        views: 0,
        createdAt: now,
        updatedAt: now,
      } as any);
      
      await db.update(users)
        .set({ totalReports: sql`${users.totalReports} + 1` })
        .where(eq(users.id, userId));
      
      console.log('✅ Report created successfully!');
      
      return { success: true, reportId };
    } catch (error) {
      console.error('❌ Error creating report:', error);
      set.status = 500;
      return { 
        success: false, 
        error: 'Failed to create report: ' + (error instanceof Error ? error.message : 'Unknown error') 
      };
    }
  })
  
  .get('/dashboard/reports', async ({ query }) => {
    try {
      const { game = 'all', type = 'all', page = '1', limit = '20' } = query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      let whereClause: any = eq(reports.status, 'published');
      if (game !== 'all') whereClause = and(whereClause, eq(reports.game, game as any));
      if (type !== 'all') whereClause = and(whereClause, eq(reports.type, type as any));
      
      const allReports = await db.select().from(reports).where(whereClause).limit(limitNum).offset(offset).orderBy(desc(reports.createdAt));
      const total = await db.select({ count: sql<number>`count(*)` }).from(reports).where(whereClause);
      
      const reportsData = allReports.map(r => ({
        id: r.id,
        title: r.title,
        type: r.type,
        game: r.game,
        author: 'Traveler',
        initials: (r as any).authorInitials || 'TB',
        rating: r.rating,
        votes: r.votes,
        date: formatRelativeDate(r.createdAt),
        version: r.version,
        thumbnail: (r as any).thumbnail,
        summary: (r as any).summary
      }));
      
      return {
        success: true,
        reports: reportsData,
        pagination: { 
          currentPage: pageNum, 
          totalPages: Math.ceil((total[0]?.count || 0) / limitNum), 
          totalItems: total[0]?.count || 0 
        }
      };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { success: true, reports: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  })
  
  // 🔥 GET SINGLE REPORT - UNTUK DETAIL REPORT
  .get('/dashboard/reports/:id', async ({ params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      console.log('📖 Fetching report with ID:', id);
      
      const report = await db.select().from(reports).where(eq(reports.id, id));
      
      if (report.length === 0) {
        return { success: false, error: 'Report not found' };
      }
      
      const reportData = report[0] as any;
      
      // Get user info
      const user = await db.select({ username: users.username }).from(users).where(eq(users.id, reportData.userId));
      
      // Increment views
      await db.update(reports)
        .set({ views: sql`${reports.views} + 1` })
        .where(eq(reports.id, id));
      
      console.log('✅ Report found:', reportData.title);
      
      return {
        success: true,
        report: {
          id: reportData.id,
          title: reportData.title,
          type: reportData.type,
          game: reportData.game,
          content: reportData.content,
          severity: reportData.severity,
          status: reportData.status,
          version: reportData.version,
          userId: reportData.userId,
          username: user[0]?.username || 'Anonymous',
          createdAt: reportData.createdAt,
          updatedAt: reportData.updatedAt,
          views: (reportData.views || 0) + 1,
          votes: reportData.votes || 0,
          thumbnail: reportData.thumbnail,
          summary: reportData.summary,
          tags: []
        }
      };
    } catch (error) {
      console.error('Error getting report:', error);
      return { success: false, error: 'Failed to get report' };
    }
  })
  
  // VIEW REPORT (increment views)
  .post('/dashboard/reports/:id/view', async ({ params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      await db.update(reports)
        .set({ views: sql`${reports.views} + 1` })
        .where(eq(reports.id, id));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  })
  
  // LIKE REPORT
  .post('/dashboard/reports/:id/like', async ({ params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      await db.update(reports)
        .set({ votes: sql`${reports.votes} + 1` })
        .where(eq(reports.id, id));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  })
  
  // DELETE REPORT
  .delete('/dashboard/reports/:id', async ({ params, body }: { params: { id: string }; body: any }) => {
    try {
      const { id } = params;
      const { userId } = body as { userId: string };
      
      if (!userId) {
        return { success: false, error: 'Unauthorized' };
      }
      
      const report = await db.select().from(reports).where(eq(reports.id, id));
      if (report.length === 0) {
        return { success: false, error: 'Report not found' };
      }
      
      const reportData = report[0] as any;
      if (reportData.userId !== userId) {
        return { success: false, error: 'Unauthorized' };
      }
      
      await db.delete(reports).where(eq(reports.id, id));
      
      await db.update(users)
        .set({ totalReports: sql`${users.totalReports} - 1` })
        .where(eq(users.id, userId));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete report' };
    }
  })
  
  .get('/dashboard/top-reports', async () => {
    try {
      const topReports = await db.select({ title: reports.title, score: reports.votes })
        .from(reports)
        .where(eq(reports.status, 'published'))
        .orderBy(desc(reports.votes))
        .limit(5);
      
      const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];
      
      const data = topReports.map((item, index) => ({
        title: item.title,
        score: item.score || 0,
        rankStyle: rankStyles[index]
      }));
      
      return { success: true, data };
    } catch (error) {
      return { success: true, data: [] };
    }
  })
  
  .get('/dashboard/trending-tags', async () => {
    return { success: true, data: [
      { label: '#Exploration', variant: 'gold', count: 234 },
      { label: '#Lore', variant: 'cyan', count: 189 },
      { label: '#Build', variant: 'default', count: 156 },
      { label: '#FarmRoute', variant: 'default', count: 142 },
      { label: '#Achievement', variant: 'gold', count: 128 },
      { label: '#Secret', variant: 'purple', count: 97 },
    ] };
  })
  
  .get('/dashboard/activity', async () => {
    return { success: true, data: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      vals: [42, 38, 45, 52, 48, 67, 58],
      maxVal: 67
    } };
  })
  
  .get('/dashboard/game-coverage', async () => {
    try {
      const coverageData = await db.select({ game: reports.game, count: sql<number>`count(*)` })
        .from(reports)
        .where(eq(reports.status, 'published'))
        .groupBy(reports.game);
      
      const total = coverageData.reduce((sum, g) => sum + (Number(g.count) || 0), 0);
      
      const gameLabels: Record<string, string> = {
        hsr: 'Honkai: Star Rail',
        gi: 'Genshin Impact',
        zzz: 'Zenless Zone Zero',
        hi3: 'Honkai Impact 3rd'
      };
      
      const gameColors: Record<string, string> = {
        hsr: 'bg-[#4ECDC4]',
        gi: 'bg-[#6DD18A]',
        zzz: 'bg-[#A855F7]',
        hi3: 'bg-[#E05C7A]'
      };
      
      if (coverageData.length === 0 || total === 0) {
        return { success: true, data: [
          { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
          { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
          { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
          { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
        ] };
      }
      
      const data = coverageData.map(g => ({
        label: gameLabels[g.game] || g.game,
        pct: Math.round((Number(g.count) / total) * 100),
        fill: gameColors[g.game] || 'bg-[#C8A96E]'
      }));
      
      return { success: true, data };
    } catch (error) {
      return { success: true, data: [
        { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
        { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
        { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
        { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
      ] };
    }
  })
  
  // GET USER PROFILE
  .get('/profile/:userId', async ({ params: { userId }, set }) => {
    try {
      const user = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        rank: users.rank,
        level: users.level,
        xp: users.xp,
        initials: users.initials,
        createdAt: users.createdAt,
        lastLogin: users.lastLogin,
      }).from(users).where(eq(users.id, userId));
      
      if (user.length === 0) {
        set.status = 404;
        return { error: 'User tidak ditemukan' };
      }
    
      return {
        success: true,
        user: {
          ...user[0],
          createdAt: formatDateTime(user[0].createdAt),
          lastLogin: formatDateTime(user[0].lastLogin),
          memberSince: formatRelativeDate(user[0].createdAt)
        }
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      set.status = 500;
      return { error: 'Internal server error' };
    }
  });

// =============================================
// EXPORT UNTUK NEXT.JS
// =============================================
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;