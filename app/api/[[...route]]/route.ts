import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from '@/lib/db/drizzle';
import { users, userProfiles, otpCodes, reports, adminActivities } from '../../../lib/db/drizzle/schema';
import { puzzles, userPuzzles } from '../../../lib/db/drizzle/schema/puzzles'; 
import { eq, and, desc, asc, sql } from 'drizzle-orm';
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
  
// =============================================
// SIGN IN (DENGAN PENGECEKAN BAN)
// =============================================

.post('/auth/signin', async ({ body, set }) => {
  try {
    const { email, password } = body as { email: string; password: string };

    console.log('📝 Sign in attempt:', email);

    // ✅ TAMBAHKAN PENGECEKAN BAN DI SINI (sebelum cek password)
    const userCheck = await db.select({
      id: users.id,
      isBanned: users.isBanned,
      banReason: users.banReason,
      banExpiry: users.banExpiry,
    }).from(users).where(eq(users.email, email));
    
    if (userCheck.length > 0) {
      const userData = userCheck[0];
      
      // Cek apakah user di-ban
      if (userData.isBanned === true) {
        let banMessage = 'Your account has been permanently banned.';
        
        // Cek jika ban sementara (ada expiry date)
        if (userData.banExpiry) {
          const expiry = new Date(userData.banExpiry);
          const now = new Date();
          
          if (now > expiry) {
            // Ban sudah expired, auto unban
            await db.update(users)
              .set({ 
                isBanned: false,
                banReason: null,
                banExpiry: null,
              })
              .where(eq(users.id, userData.id));
          } else {
            // Ban masih aktif
            const expiryDate = expiry.toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            });
            banMessage = `Akun Anda telah di-ban sementara hingga ${expiryDate}. Alasan: ${userData.banReason || 'Melanggar aturan'}`;
            set.status = 403;
            return { error: banMessage };
          }
        } else {
          // Permanent ban
          banMessage = `Akun Anda telah di-ban permanen. Alasan: ${userData.banReason || 'Melanggar aturan'}. Hubungi administrator untuk informasi lebih lanjut.`;
          set.status = 403;
          return { error: banMessage };
        }
      }
    }

    // Lanjutkan dengan pengecekan password seperti biasa
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

    // Cek ban lagi setelah password valid (untuk jaga-jaga)
    if (userCheck.length > 0 && userCheck[0].isBanned === true) {
      const userData = userCheck[0];
      if (userData.banExpiry) {
        const expiry = new Date(userData.banExpiry);
        if (new Date() > expiry) {
          // Auto unban jika expired
          await db.update(users)
            .set({ 
              isBanned: false,
              banReason: null,
              banExpiry: null,
            })
            .where(eq(users.id, userData.id));
        } else {
          set.status = 403;
          return { error: `Akun Anda sedang di-ban hingga ${new Date(userData.banExpiry).toLocaleDateString()}` };
        }
      } else {
        set.status = 403;
        return { error: 'Akun Anda telah di-ban permanen. Hubungi administrator.' };
      }
    }

    console.log('✅ Password valid, sending OTP to:', email);

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const id = randomUUID();

    await db.delete(otpCodes).where(eq(otpCodes.email, email));
    await db.insert(otpCodes).values({ id, email, code, expiresAt, isUsed: false });
    
    await sendOTPEmail(email, code, user[0].username, 'login');
    
    console.log('✅ OTP sent to:', email);

    const redirectUrl = user[0].role === 'admin' 
      ? '/HoyoAdmin/dashboard-admin' 
      : '/UserHoyo/dashboard';

    return {
      success: true,
      message: 'OTP sent to your email',
      requiresOTP: true,
      email: email,
      role: user[0].role,
      redirectUrl: redirectUrl,
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

// =============================================
// VERIFY LOGIN OTP (DENGAN PENGECEKAN BAN)
// =============================================

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

    // ✅ TAMBAHKAN PENGECEKAN BAN DI SINI
    if (user[0].isBanned === true) {
      let banMessage = 'Akun Anda telah di-ban permanen.';
      if (user[0].banExpiry) {
        const expiry = new Date(user[0].banExpiry);
        if (new Date() > expiry) {
          // Auto unban jika expired
          await db.update(users)
            .set({ 
              isBanned: false,
              banReason: null,
              banExpiry: null,
            })
            .where(eq(users.id, user[0].id));
        } else {
          set.status = 403;
          return { error: `Akun Anda sedang di-ban hingga ${new Date(user[0].banExpiry).toLocaleDateString()}. Alasan: ${user[0].banReason || 'Melanggar aturan'}` };
        }
      } else {
        set.status = 403;
        return { error: `Akun Anda telah di-ban permanen. Alasan: ${user[0].banReason || 'Melanggar aturan'}. Hubungi administrator.` };
      }
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
    console.log('👤 User role:', user[0].role);

    const redirectUrl = user[0].role === 'admin' 
      ? '/HoyoAdmin/dashboard-admin' 
      : '/UserHoyo/dashboard';

    return {
      success: true,
      verified: true,
      message: 'Verifikasi berhasil',
      role: user[0].role,
      redirectUrl: redirectUrl,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        rank: user[0].rank,
        level: user[0].level,
        role: user[0].role,
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
        role: users.role,
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
        role: user[0].role || 'user',
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
        passwordChangedAt: new Date(),
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

  // =============================================
  // POST /dashboard/reports
  // =============================================
  .post('/dashboard/reports', async ({ body, set }: { body: any; set: any }) => {
    console.log('📝 CREATE REPORT endpoint dipanggil!');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
      const { title, type, game, content, userId, version, tags, summary } = body;
      
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

      const userRecord = await db.select({
        username: users.username,
        initials: users.initials,
      }).from(users).where(eq(users.id, userId));

      const authorInitials = userRecord[0]?.initials || userRecord[0]?.username?.slice(0, 2).toUpperCase() || 'TB';
      
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
        authorInitials: authorInitials,
        status: 'draft',
        version: version || '1.0',
        summary: summary || title.slice(0, 100),
        rating: 0,
        votes: 0,
        views: 0,
        createdAt: now,
        updatedAt: now,
      });
      
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
  
  // =============================================
  // GET /dashboard/reports
  // =============================================
  .get('/dashboard/reports', async ({ query }) => {
    try {
      const { game = 'all', type = 'all', page = '1', limit = '20' } = query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      let whereClause: any = sql`${reports.status} IN ('draft', 'published', 'archived')`;
      if (game !== 'all') whereClause = and(whereClause, eq(reports.game, game as any));
      if (type !== 'all') whereClause = and(whereClause, eq(reports.type, type as any));
      
      const allReports = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        version: reports.version,
        userId: reports.userId,
        authorInitials: reports.authorInitials,
        votes: reports.votes,
        views: reports.views,
        createdAt: reports.createdAt,
        summary: reports.summary,
        status: reports.status,
      })
      .from(reports)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(reports.createdAt));
      
      const userIds = allReports.map(r => r.userId).filter(Boolean);
      let userMap: Record<string, string> = {};
      
      for (const uid of userIds) {
        if (uid && !userMap[uid]) {
          const user = await db.select({ username: users.username })
            .from(users)
            .where(eq(users.id, uid));
          if (user.length > 0) {
            userMap[uid] = user[0].username;
          }
        }
      }
      
      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(whereClause);
      
      const reportsData = allReports.map(r => ({
        id: r.id,
        title: r.title,
        type: r.type,
        game: r.game,
        authorName: userMap[r.userId as string] || 'Traveler',
        initials: r.authorInitials || 'TB',
        rating: 0,
        votes: r.votes || 0,
        date: formatRelativeDate(r.createdAt),
        version: r.version || '1.0',
        summary: r.summary,
        status: r.status,
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

  // =============================================
  // GET /dashboard/reports/:id
  // =============================================
  .get('/dashboard/reports/:id', async ({ params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      console.log('📖 Fetching report with ID:', id);
      
      const report = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        content: reports.content,
        status: reports.status,
        version: reports.version,
        userId: reports.userId,
        authorInitials: reports.authorInitials,
        votes: reports.votes,
        views: reports.views,
        rating: reports.rating,
        summary: reports.summary,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
      })
      .from(reports)
      .where(eq(reports.id, id));
      
      if (report.length === 0) {
        return { success: false, error: 'Report not found' };
      }
      
      const reportData = report[0];
      
      let username = 'Anonymous';
      if (reportData.userId) {
        const user = await db.select({ username: users.username })
          .from(users)
          .where(eq(users.id, reportData.userId));
        if (user.length > 0) username = user[0].username;
      }
      
      await db.update(reports)
        .set({ views: sql`${reports.views} + 1` })
        .where(eq(reports.id, id));
      
      console.log('✅ Report found:', reportData.title);
      console.log('👤 User ID:', reportData.userId, 'Username:', username);
      
      return {
        success: true,
        report: {
          id: reportData.id,
          title: reportData.title,
          type: reportData.type,
          game: reportData.game,
          content: reportData.content,
          status: reportData.status,
          version: reportData.version,
          userId: reportData.userId,
          authorName: username,
          authorInitials: reportData.authorInitials,
          username: username,
          createdAt: reportData.createdAt,
          updatedAt: reportData.updatedAt,
          views: (reportData.views || 0) + 1,
          votes: reportData.votes || 0,
          rating: reportData.rating || 0,
          summary: reportData.summary,
          tags: []
        }
      };
    } catch (error) {
      console.error('Error getting report:', error);
      return { success: false, error: 'Failed to get report' };
    }
  })
  
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

  // =============================================
  // DELETE /dashboard/reports/:id
  // =============================================
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
      
      const reportData = report[0];
      
      if (reportData.userId !== userId) {
        return { success: false, error: 'Unauthorized - You can only delete your own reports' };
      }
      
      await db.delete(reports).where(eq(reports.id, id));
      
      await db.update(users)
        .set({ totalReports: sql`${users.totalReports} - 1` })
        .where(eq(users.id, reportData.userId!));
      
      console.log('✅ Report deleted successfully by owner:', userId);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: false, error: 'Failed to delete report' };
    }
  })
  
  .get('/dashboard/top-reports', async () => {
    try {
      const topReports = await db.select({ 
        id: reports.id,
        title: reports.title, 
        score: reports.votes 
      })
        .from(reports)
        .where(eq(reports.status, 'published'))
        .orderBy(desc(reports.votes))
        .limit(5);
      
      const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];
      
      const data = topReports.map((item, index) => ({
        id: item.id,
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
  })

  // =============================================
  // ✅ ADMIN ENDPOINTS
  // =============================================
  .get('/admin/users', async ({ cookie: { token }, set }) => {
    try {
      console.log('🔐 Admin users endpoint dipanggil');
      
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, payload.userId));
        
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        level: users.level,
        rank: users.rank,
        totalReports: users.totalReports,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      }).from(users).orderBy(desc(users.createdAt));

      console.log(`✅ Found ${allUsers.length} users`);

      const usersWithDetails = await Promise.all(allUsers.map(async (userData) => {
        let recentReports: any[] = [];
        try {
          const userReports = await db.select({
            title: reports.title,
            type: reports.type,
            date: reports.createdAt,
            votes: reports.votes,
          })
            .from(reports)
            .where(eq(reports.userId, userData.id))
            .orderBy(desc(reports.createdAt))
            .limit(3);

          recentReports = userReports.map(r => ({
            title: r.title,
            type: r.type,
            date: formatRelativeDate(r.date),
            votes: r.votes || 0,
          }));
        } catch (err) {
          console.log(`No reports for user ${userData.id}`);
        }

        let status: 'active' | 'inactive' | 'banned' = 'active';
        if (userData.lastLogin) {
          const daysSince = Math.floor((Date.now() - new Date(userData.lastLogin).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince > 30) status = 'inactive';
        } else {
          status = 'inactive';
        }

        return {
          id: userData.id,
          username: userData.username || userData.email.split('@')[0],
          email: userData.email,
          role: userData.role,
          level: userData.level || 1,
          rank: userData.rank || 'Novice Omni-Voyager',
          totalReports: userData.totalReports || 0,
          joinedAt: formatRelativeDate(userData.createdAt),
          lastActive: userData.lastLogin ? formatRelativeDate(userData.lastLogin) : 'Never',
          status,
          complaints: [],
          recentReports: recentReports,
        };
      }));

      return { success: true, users: usersWithDetails };
    } catch (error) {
      console.error('❌ Error fetching admin users:', error);
      set.status = 500;
      return { 
        error: 'Failed to fetch users', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  })

  .get('/admin/users/:userId', async ({ params: { userId }, cookie: { token }, set }) => {
    try {
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, payload.userId));
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const userData = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        level: users.level,
        rank: users.rank,
        totalReports: users.totalReports,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.id, userId));

      if (userData.length === 0) {
        set.status = 404;
        return { error: 'User not found' };
      }

      const userInfo = userData[0];

      const userReports = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        date: reports.createdAt,
        votes: reports.votes,
      })
        .from(reports)
        .where(eq(reports.userId, userId))
        .orderBy(desc(reports.createdAt))
        .limit(10);

      return {
        success: true,
        user: {
          id: userInfo.id,
          username: userInfo.username || userInfo.email.split('@')[0],
          email: userInfo.email,
          level: userInfo.level || 1,
          rank: userInfo.rank || 'Novice Omni-Voyager',
          totalReports: userInfo.totalReports || 0,
          joinedAt: formatRelativeDate(userInfo.createdAt),
          lastActive: userInfo.lastLogin ? formatRelativeDate(userInfo.lastLogin) : 'Never',
          complaints: [],
          recentReports: userReports.map(r => ({
            id: r.id,
            title: r.title,
            type: r.type,
            game: r.game,
            date: formatRelativeDate(r.date),
            votes: r.votes || 0,
          })),
        }
      };
    } catch (error) {
      console.error('Error fetching user detail:', error);
      set.status = 500;
      return { error: 'Failed to fetch user detail' };
    }
  })

  // =============================================
  // ADMIN STATS ENDPOINT
  // =============================================
  .get('/admin/stats', async ({ cookie: { token }, set }) => {
    try {
      console.log('📊 Admin stats endpoint dipanggil');
      
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, payload.userId));
        
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeToday = await db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`${users.lastLogin} >= ${oneDayAgo}`);
      
      const totalReports = await db.select({ count: sql<number>`count(*)` }).from(reports);
      const pendingReports = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(eq(reports.status, 'pending'));
      
      const topContributors = await db.select({
          username: users.username,
          reportCount: users.totalReports,
        })
        .from(users)
        .where(sql`${users.totalReports} > 0`)
        .orderBy(desc(users.totalReports))
        .limit(5);

      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      const userRegistrationTrend = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const usersCount = await db.select({ count: sql<number>`count(*)` })
          .from(users)
          .where(and(sql`${users.createdAt} >= ${day}`, sql`${users.createdAt} < ${nextDay}`));
        userRegistrationTrend.push({ date: weekDays[i], users: Number(usersCount[0]?.count) || 0 });
      }

      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const reportsCount = await db.select({ count: sql<number>`count(*)` })
          .from(reports)
          .where(and(sql`${reports.createdAt} >= ${day}`, sql`${reports.createdAt} < ${nextDay}`));
        dailyActivity.push({ date: weekDays[i], reports: Number(reportsCount[0]?.count) || 0 });
      }

      const reportsByGame = await db.select({
          game: reports.game,
          count: sql<number>`count(*)`
        })
        .from(reports)
        .where(eq(reports.status, 'published'))
        .groupBy(reports.game);

      console.log('✅ Admin stats fetched successfully');
      
      return {
        success: true,
        stats: {
          totalUsers: Number(totalUsers[0]?.count) || 0,
          activeToday: Number(activeToday[0]?.count) || 0,
          totalReports: Number(totalReports[0]?.count) || 0,
          pendingReports: Number(pendingReports[0]?.count) || 0,
          totalComplaints: 0,
          bannedUsers: 0,
          topContributors: topContributors.map((u, index) => ({
            rank: index + 1,
            username: u.username || 'Anonymous',
            reportCount: u.reportCount || 0,
          })),
          userRegistrationTrend: userRegistrationTrend,
          dailyActivity: dailyActivity,
          reportsByGame: reportsByGame.map(g => ({
            game: g.game,
            count: Number(g.count) || 0,
          })),
        }
      };
    } catch (error) {
      console.error('❌ Error fetching admin stats:', error);
      set.status = 500;
      return { 
        error: 'Failed to fetch admin statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  })

 // =============================================
// POST /admin/reports/:id/review - Accept/Reject Report
// =============================================
.post('/admin/reports/:id/review', async ({ params, body, cookie: { token }, set }) => {
  try {
    const { id } = params;
    const { action, note } = body as { action: 'accept' | 'reject'; note?: string };
    
    console.log(`📝 Review report ${id} with action: ${action}`);
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role, username: users.username })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    // Cek apakah report ada
    const report = await db.select({
      id: reports.id,
      status: reports.status,
    })
    .from(reports)
    .where(eq(reports.id, id));
    
    if (report.length === 0) {
      set.status = 404;
      return { error: 'Report not found' };
    }

    // Update status report
    const newStatus = action === 'accept' ? 'published' : 'archived';
    
    await db.update(reports)
      .set({ 
        status: newStatus as any,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id));
    
    // ✅ Catat aktivitas admin - TANPA id (auto-increment), gunakan description
    const actionType = action === 'accept' ? 'REVIEW_ACCEPT' : 'REVIEW_REJECT';
    const title = action === 'accept' ? `Accepted report: ${report[0].id}` : `Rejected report: ${report[0].id}`;
    
    await db.insert(adminActivities).values({
      adminId: payload.userId,
      actionType: actionType,
      title: title,
      description: note || null,
      targetType: 'report',
      targetId: id,
      createdAt: new Date(),
    });
    
    console.log(`✅ Report ${id} ${action}ed by ${currentUser[0].username}`);
    
    return {
      success: true,
      message: `Report ${action}ed successfully`,
      status: newStatus
    };
  } catch (error) {
    console.error('❌ Error reviewing report:', error);
    set.status = 500;
    return { error: 'Failed to review report' };
  }
}, {
  body: t.Object({
    action: t.String(),
    note: t.Optional(t.String())
  })
})

// =============================================
// PUT /admin/profile/update - Update Admin Profile
// =============================================
.put('/admin/profile/update', async ({ body, cookie: { token }, set }) => {
  try {
    const { username, bio, location } = body as { username?: string; bio?: string; location?: string };
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    
    await db.update(users)
      .set(updateData)
      .where(eq(users.id, payload.userId));
    
    // ✅ Catat aktivitas admin - TANPA id (auto-increment)
    const title = `Updated profile: ${username ? `username changed` : 'profile info updated'}`;
    await db.insert(adminActivities).values({
      adminId: payload.userId,
      actionType: 'PROFILE_UPDATE',
      title: title,
      targetType: 'admin',
      targetId: payload.userId,
      createdAt: new Date(),
    });
    
    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    set.status = 500;
    return { error: 'Failed to update profile' };
  }
}, {
  body: t.Object({
    username: t.Optional(t.String()),
    bio: t.Optional(t.String()),
    location: t.Optional(t.String())
  })
})

// =============================================
// GET /admin/profile/activity - Get Admin Activities
// =============================================
.get('/admin/profile/activity', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    // Ambil aktivitas dari tabel admin_activities
    const activities = await db.select({
      id: adminActivities.id,
      title: adminActivities.title,
      actionType: adminActivities.actionType,
      targetType: adminActivities.targetType,
      targetId: adminActivities.targetId,
      createdAt: adminActivities.createdAt,
    })
    .from(adminActivities)
    .where(eq(adminActivities.adminId, payload.userId))
    .orderBy(desc(adminActivities.createdAt))
    .limit(10);

    const formattedActivities = activities.map(act => ({
      id: `ACT${String(act.id).slice(-6)}`,
      title: act.title,
      type: act.actionType === 'REVIEW_ACCEPT' ? 'Report Approval' : 
            act.actionType === 'REVIEW_REJECT' ? 'Report Rejection' : 
            'Profile Update',
      tag: act.actionType === 'REVIEW_ACCEPT' ? 'APPROVED' : 
            act.actionType === 'REVIEW_REJECT' ? 'REJECTED' : 
            'EDIT',
      tagColor: act.actionType === 'REVIEW_ACCEPT' ? '#4ECDC4' : 
                act.actionType === 'REVIEW_REJECT' ? '#E05C7A' : 
                '#C8A96E',
      votes: 0,
      time: formatRelativeDate(act.createdAt),
    }));

    return { success: true, activities: formattedActivities };
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return { success: true, activities: [] };
  }
})

// =============================================
// ✅ ENDPOINT: GET /admin/profile/activity-stats - Get Weekly Activity Heatmap for Last 12 Weeks
// =============================================
.get('/admin/profile/activity-stats', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    // Hitung tanggal mulai 12 minggu yang lalu (84 hari)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 84);
    startDate.setHours(0, 0, 0, 0);

    // Ambil semua aktivitas admin dalam 84 hari terakhir
    const activities = await db.select({
      createdAt: adminActivities.createdAt,
    })
    .from(adminActivities)
    .where(
      and(
        eq(adminActivities.adminId, payload.userId),
        sql`${adminActivities.createdAt} >= ${startDate}`
      )
    );
    
    // Buat heatmap array (84 items, 12 minggu x 7 hari)
    const heatmap: number[] = new Array(84).fill(0);
    
    // Kelompokkan aktivitas per hari
    const now = new Date();
    
    activities.forEach(activity => {
      let activityDate: Date;
      if (activity.createdAt instanceof Date) {
        activityDate = activity.createdAt;
      } else if (typeof activity.createdAt === 'string') {
        activityDate = new Date(activity.createdAt);
      } else if (activity.createdAt === null || activity.createdAt === undefined) {
        return;
      } else {
        activityDate = new Date(activity.createdAt as any);
      }
      
      if (isNaN(activityDate.getTime())) {
        return;
      }
      
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 84) {
        const index = 83 - daysDiff;
        heatmap[index] = Math.min(heatmap[index] + 1, 4);
      }
    });
    
    console.log(`📊 Activity heatmap generated: ${activities.length} activities in last 12 weeks`);
    
    return { success: true, heatmap };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return { success: true, heatmap: new Array(84).fill(0) };
  }
})

  // =============================================
  // MISSION & QUEST ENDPOINTS
  // =============================================
  
  // GET /mission-quest/main-quests
  .get('/mission-quest/main-quests', async ({ query }) => {
    console.log('🔥 MAIN QUESTS API DIPANGGIL!');
    try {
      const { game = 'all', search = '', page = '1', limit = '20' } = query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      let whereClause: any = sql`1=1`;
      if (game !== 'all') whereClause = sql`${whereClause} AND ${reports.game} = ${game}`;
      if (search) {
        whereClause = sql`${whereClause} AND ${reports.title} LIKE ${`%${search}%`}`;
      }

      const allQuests = await db.select({
        id: reports.id,
        title: reports.title,
        game: reports.game,
        version: reports.version,
        chapter: sql`'Chapter I'`.as('chapter'),
        arc: sql`'Main Arc'`.as('arc'),
        author: users.username,
        authorId: reports.userId,
        initials: reports.authorInitials,
        rating: reports.rating,
        votes: reports.votes,
        views: reports.views,
        createdAt: reports.createdAt,
        status: reports.status,
        tags: sql`'[]'`.as('tags'),
        summary: reports.summary,
      })
      .from(reports)
      .leftJoin(users, eq(users.id, reports.userId))
      .where(sql`${whereClause} AND ${reports.type} = 'guide'`)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(reports.votes));

      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(sql`${whereClause} AND ${reports.type} = 'guide'`);

      const formattedQuests = allQuests.map(q => ({
        id: q.id,
        title: q.title,
        game: q.game,
        version: q.version,
        chapter: q.chapter,
        arc: q.arc,
        author: q.author || 'Anonymous',
        initials: q.initials || 'TB',
        rating: q.rating || 0,
        votes: q.votes || 0,
        date: formatRelativeDate(q.createdAt),
        status: q.status === 'published' ? 'complete' : 'ongoing',
        tags: ['Guide', 'Walkthrough'],
        summary: q.summary || q.title,
      }));

      return {
        success: true,
        quests: formattedQuests,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil((total[0]?.count || 0) / limitNum),
          totalItems: total[0]?.count || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching main quests:', error);
      return { success: true, quests: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  })

  // GET /mission-quest/side-missions
  .get('/mission-quest/side-missions', async ({ query }) => {
    console.log('🔥 SIDE MISSIONS API DIPANGGIL!');
    try {
      const { game = 'all', type = 'all', search = '', page = '1', limit = '50' } = query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      let whereClause: any = sql`1=1`;
      if (game !== 'all') whereClause = sql`${whereClause} AND ${reports.game} = ${game}`;
      if (type !== 'all') whereClause = sql`${whereClause} AND ${reports.type} = ${type}`;
      if (search) {
        whereClause = sql`${whereClause} AND ${reports.title} LIKE ${`%${search}%`}`;
      }

      const allMissions = await db.select({
        id: reports.id,
        title: reports.title,
        game: reports.game,
        version: reports.version,
        type: reports.type,
        difficulty: sql`'normal'`.as('difficulty'),
        author: users.username,
        authorId: reports.userId,
        initials: reports.authorInitials,
        rating: reports.rating,
        votes: reports.votes,
        views: reports.views,
        createdAt: reports.createdAt,
        tags: sql`'[]'`.as('tags'),
        reward: sql`'Various Rewards'`.as('reward'),
        summary: reports.summary,
      })
      .from(reports)
      .leftJoin(users, eq(users.id, reports.userId))
      .where(sql`${whereClause} AND ${reports.type} IN ('event', 'puzzle', 'build')`)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(reports.votes));

      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(sql`${whereClause} AND ${reports.type} IN ('event', 'puzzle', 'build')`);

      const typeMap: Record<string, string> = {
        event: 'world',
        puzzle: 'exploration',
        build: 'companion',
      };

      const difficultyMap: Record<string, string> = {
        event: 'normal',
        puzzle: 'hard',
        build: 'easy',
      };

      const formattedMissions = allMissions.map(m => ({
        id: m.id,
        title: m.title,
        game: m.game,
        version: m.version,
        type: typeMap[m.type] || 'world',
        difficulty: difficultyMap[m.type] || 'normal',
        author: m.author || 'Anonymous',
        initials: m.initials || 'TB',
        rating: m.rating || 0,
        votes: m.votes || 0,
        date: formatRelativeDate(m.createdAt),
        tags: [m.type, 'Guide'],
        reward: m.reward,
        summary: m.summary || m.title,
      }));

      return {
        success: true,
        missions: formattedMissions,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil((total[0]?.count || 0) / limitNum),
          totalItems: total[0]?.count || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching side missions:', error);
      return { success: true, missions: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  })

  // GET /mission-quest/stats
  .get('/mission-quest/stats', async () => {
    console.log('🔥 MISSION STATS API DIPANGGIL!');
    try {
      const totalMain = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(eq(reports.type, 'guide'));
      
      const totalSide = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(sql`${reports.type} IN ('event', 'puzzle', 'build')`);
      
      const games = ['hsr', 'gi', 'zzz', 'hi3'];
      const gameStats = await Promise.all(games.map(async (game) => {
        const mainCount = await db.select({ count: sql<number>`count(*)` })
          .from(reports)
          .where(sql`${reports.game} = ${game} AND ${reports.type} = 'guide'`);
        
        const sideCount = await db.select({ count: sql<number>`count(*)` })
          .from(reports)
          .where(sql`${reports.game} = ${game} AND ${reports.type} IN ('event', 'puzzle', 'build')`);
        
        return { 
          game, 
          main: Number(mainCount[0]?.count) || 0, 
          side: Number(sideCount[0]?.count) || 0 
        };
      }));

      const totalMainCount = Number(totalMain[0]?.count) || 0;
      const totalSideCount = Number(totalSide[0]?.count) || 0;
      
      const gameCoverage = {
        hsr: { 
          main: totalMainCount > 0 ? Math.round((gameStats.find(g => g.game === 'hsr')?.main || 0) / totalMainCount * 100) : 48, 
          side: totalSideCount > 0 ? Math.round((gameStats.find(g => g.game === 'hsr')?.side || 0) / totalSideCount * 100) : 52
        },
        gi: { 
          main: totalMainCount > 0 ? Math.round((gameStats.find(g => g.game === 'gi')?.main || 0) / totalMainCount * 100) : 35, 
          side: totalSideCount > 0 ? Math.round((gameStats.find(g => g.game === 'gi')?.side || 0) / totalSideCount * 100) : 65
        },
        zzz: { 
          main: totalMainCount > 0 ? Math.round((gameStats.find(g => g.game === 'zzz')?.main || 0) / totalMainCount * 100) : 40, 
          side: totalSideCount > 0 ? Math.round((gameStats.find(g => g.game === 'zzz')?.side || 0) / totalSideCount * 100) : 60
        },
        hi3: { 
          main: totalMainCount > 0 ? Math.round((gameStats.find(g => g.game === 'hi3')?.main || 0) / totalMainCount * 100) : 55, 
          side: totalSideCount > 0 ? Math.round((gameStats.find(g => g.game === 'hi3')?.side || 0) / totalSideCount * 100) : 45
        },
      };

      return {
        success: true,
        stats: {
          totalMainQuests: totalMainCount,
          totalSideMissions: totalSideCount,
          byGame: gameStats,
          gameCoverage: gameCoverage,
        },
      };
    } catch (error) {
      console.error('Error fetching mission stats:', error);
      return { 
        success: true, 
        stats: { 
          totalMainQuests: 0, 
          totalSideMissions: 0, 
          byGame: [],
          gameCoverage: {
            hsr: { main: 48, side: 52 },
            gi: { main: 35, side: 65 },
            zzz: { main: 40, side: 60 },
            hi3: { main: 55, side: 45 },
          }
        } 
      };
    }
  })

  // POST /mission-quest/side-missions/:id/like
  .post('/mission-quest/side-missions/:id/like', async ({ params }) => {
    try {
      const { id } = params;
      await db.update(reports)
        .set({ votes: sql`${reports.votes} + 1` })
        .where(eq(reports.id, id));
      return { success: true };
    } catch (error) {
      console.error('Error liking mission:', error);
      return { success: false };
    }
  })
  
// =============================================
// USER PROFILE ENDPOINTS (Current User)
// =============================================

// GET /profile/me - Get current logged in user profile
.get('/profile/me', async ({ cookie: { token }, set }) => {
  try {
    console.log('🔍 GET /profile/me - Fetching current user profile');
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    console.log('✅ Token valid for user:', payload.userId);

    // Ambil data dari users table
    const user = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      rank: users.rank,
      level: users.level,
      xp: users.xp,
      initials: users.initials,
      totalReports: users.totalReports,
      role: users.role,
      createdAt: users.createdAt,
      lastLogin: users.lastLogin,
    }).from(users).where(eq(users.id, payload.userId));
    
    if (user.length === 0) {
      set.status = 404;
      return { error: 'User tidak ditemukan' };
    }

    // Ambil data profile dari userProfiles table
    let profile = await db.select({
      bio: userProfiles.bio,
      location: userProfiles.location,
      avatarColor: userProfiles.avatarColor,
      avatarPhoto: userProfiles.avatarPhoto,
      bannerId: userProfiles.bannerId,
      bannerPhoto: userProfiles.bannerPhoto,
      favGames: userProfiles.favGames,
    }).from(userProfiles).where(eq(userProfiles.userId, payload.userId));

    let profileData = profile[0] || {};

    // Get user's recent reports
    const userReports = await db.select({
      id: reports.id,
      title: reports.title,
      type: reports.type,
      game: reports.game,
      votes: reports.votes,
      views: reports.views,
      createdAt: reports.createdAt,
      status: reports.status,
    })
    .from(reports)
    .where(eq(reports.userId, payload.userId))
    .orderBy(desc(reports.createdAt))
    .limit(5);

    // Get user stats per game
    const gameStats = await db.select({
      game: reports.game,
      count: sql<number>`count(*)`,
      votes: sql<number>`sum(${reports.votes})`,
    })
    .from(reports)
    .where(eq(reports.userId, payload.userId))
    .groupBy(reports.game);

    const totalVotes = gameStats.reduce((sum, g) => sum + (Number(g.votes) || 0), 0);

    // Parse favGames if exists
    let favGamesArray: string[] = ['hsr', 'gi'];
    if (profileData.favGames) {
      try {
        favGamesArray = JSON.parse(profileData.favGames);
      } catch {
        favGamesArray = ['hsr', 'gi'];
      }
    }

    return {
      success: true,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
        rank: user[0].rank || 'Novice Omni-Voyager',
        level: user[0].level || 1,
        xp: user[0].xp || 0,
        initials: user[0].initials || user[0].username?.slice(0, 2).toUpperCase() || 'TB',
        totalReports: user[0].totalReports || 0,
        bio: profileData.bio || '',
        location: profileData.location || '',
        avatarColor: profileData.avatarColor || '#C8A96E',
        avatarPhoto: profileData.avatarPhoto || null,
        bannerId: profileData.bannerId || 'default',
        bannerPhoto: profileData.bannerPhoto || null,
        favGames: favGamesArray,
        createdAt: user[0].createdAt,
        lastLogin: user[0].lastLogin,
        totalVotes: totalVotes,
        gameStats: gameStats.map(g => ({
          game: g.game,
          count: Number(g.count) || 0,
          votes: Number(g.votes) || 0,
        })),
        recentReports: userReports.map(r => ({
          id: r.id,
          title: r.title,
          type: r.type,
          game: r.game,
          votes: r.votes || 0,
          date: formatRelativeDate(r.createdAt),
          status: r.status,
        })),
      }
    };
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    set.status = 500;
    return { error: 'Internal server error' };
  }
})

// PUT /profile/update - Update current user profile
.put('/profile/update', async ({ body, cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const { username, bio, location, avatarColor, avatarPhoto, bannerId, bannerPhoto, favGames } = body as {
      username?: string;
      bio?: string;
      location?: string;
      avatarColor?: string;
      avatarPhoto?: string | null;
      bannerId?: string;
      bannerPhoto?: string | null;
      favGames?: string[];
    };

    // Update users table
    const userUpdateData: any = {};
    if (username !== undefined) {
      userUpdateData.username = username;
      userUpdateData.initials = username.slice(0, 2).toUpperCase();
    }

    if (Object.keys(userUpdateData).length > 0) {
      await db.update(users)
        .set(userUpdateData)
        .where(eq(users.id, payload.userId));
    }

    // Check if profile exists in userProfiles
    const existingProfile = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, payload.userId));

    const profileUpdateData: any = {};
    if (username !== undefined) profileUpdateData.username = username;
    if (bio !== undefined) profileUpdateData.bio = bio;
    if (location !== undefined) profileUpdateData.location = location;
    if (avatarColor !== undefined) profileUpdateData.avatarColor = avatarColor;
    if (avatarPhoto !== undefined) profileUpdateData.avatarPhoto = avatarPhoto;
    if (bannerId !== undefined) profileUpdateData.bannerId = bannerId;
    if (bannerPhoto !== undefined) profileUpdateData.bannerPhoto = bannerPhoto;
    if (favGames !== undefined) profileUpdateData.favGames = JSON.stringify(favGames);
    profileUpdateData.updatedAt = new Date();

    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(userProfiles).values({
        id: randomUUID(),
        userId: payload.userId,
        username: username || `Traveler_${payload.userId.slice(0, 8)}`,
        bio: bio || '',
        location: location || '',
        avatarColor: avatarColor || '#C8A96E',
        avatarPhoto: avatarPhoto || null,
        bannerId: bannerId || 'default',
        bannerPhoto: bannerPhoto || null,
        favGames: favGames ? JSON.stringify(favGames) : JSON.stringify(['hsr', 'gi']),
        createdAt: new Date(),
      });
    } else if (Object.keys(profileUpdateData).length > 0) {
      // Update existing profile
      await db.update(userProfiles)
        .set(profileUpdateData)
        .where(eq(userProfiles.userId, payload.userId));
    }

    console.log(`✅ Profile updated for user: ${payload.userId}`);

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    set.status = 500;
    return { error: 'Failed to update profile' };
  }
}, {
  body: t.Object({
    username: t.Optional(t.String()),
    bio: t.Optional(t.String()),
    location: t.Optional(t.String()),
    avatarColor: t.Optional(t.String()),
    avatarPhoto: t.Optional(t.Nullable(t.String())),
    bannerId: t.Optional(t.String()),
    bannerPhoto: t.Optional(t.Nullable(t.String())),
    favGames: t.Optional(t.Array(t.String())),
  })
})

// POST /profile/banner - Update banner
.post('/profile/banner', async ({ body, cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const { bannerPhoto, bannerId } = body as { bannerPhoto?: string | null; bannerId?: string };

    // Check if profile exists
    const existingProfile = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, payload.userId));

    if (existingProfile.length === 0) {
      // Create profile first
      await db.insert(userProfiles).values({
        id: randomUUID(),
        userId: payload.userId,
        bannerPhoto: bannerPhoto || null,
        bannerId: bannerId || (bannerPhoto ? 'custom' : 'default'),
        createdAt: new Date(),
      });
    } else {
      const updateData: any = {};
      if (bannerPhoto !== undefined) {
        updateData.bannerPhoto = bannerPhoto;
        updateData.bannerId = bannerPhoto ? 'custom' : 'default';
      } else if (bannerId !== undefined) {
        updateData.bannerId = bannerId;
        if (bannerId !== 'custom') {
          updateData.bannerPhoto = null;
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        await db.update(userProfiles)
          .set(updateData)
          .where(eq(userProfiles.userId, payload.userId));
      }
    }

    return {
      success: true,
      message: 'Banner updated successfully',
    };
  } catch (error) {
    console.error('Error updating banner:', error);
    set.status = 500;
    return { error: 'Failed to update banner' };
  }
}, {
  body: t.Object({
    bannerPhoto: t.Optional(t.Nullable(t.String())),
    bannerId: t.Optional(t.String()),
  })
})

// PUT /user/profile - Update user profile
.put('/user/profile', async ({ body, cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const { username, bio, location, avatarColor, avatarPhoto, bannerId, bannerPhoto, favGames } = body as {
      username?: string;
      bio?: string;
      location?: string;
      avatarColor?: string;
      avatarPhoto?: string | null;
      bannerId?: string;
      bannerPhoto?: string | null;
      favGames?: string[];
    };

    // UPDATE users table
    const userUpdateData: any = {};
    if (username !== undefined) {
      // Cek apakah username sudah dipakai user lain
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, username));
      
      if (existingUser.length > 0 && existingUser[0].id !== payload.userId) {
        set.status = 400;
        return { error: 'Username already taken' };
      }
      userUpdateData.username = username;
      userUpdateData.initials = username.slice(0, 2).toUpperCase();
    }

    if (Object.keys(userUpdateData).length > 0) {
      await db.update(users)
        .set(userUpdateData)
        .where(eq(users.id, payload.userId));
    }

    // UPDATE or INSERT userProfiles table
    const existingProfile = await db.select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.userId, payload.userId));

    const profileUpdateData: any = {};
    if (username !== undefined) profileUpdateData.username = username;
    if (bio !== undefined) profileUpdateData.bio = bio;
    if (location !== undefined) profileUpdateData.location = location;
    if (avatarColor !== undefined) profileUpdateData.avatarColor = avatarColor;
    if (avatarPhoto !== undefined) profileUpdateData.avatarPhoto = avatarPhoto;
    if (bannerId !== undefined) profileUpdateData.bannerId = bannerId;
    if (bannerPhoto !== undefined) profileUpdateData.bannerPhoto = bannerPhoto;
    if (favGames !== undefined) profileUpdateData.favGames = JSON.stringify(favGames);
    profileUpdateData.updatedAt = new Date();

    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(userProfiles).values({
        id: randomUUID(),
        userId: payload.userId,
        username: username || null,
        bio: bio || null,
        location: location || null,
        avatarColor: avatarColor || '#C8A96E',
        avatarPhoto: avatarPhoto || null,
        bannerId: bannerId || 'default',
        bannerPhoto: bannerPhoto || null,
        favGames: favGames ? JSON.stringify(favGames) : JSON.stringify(['hsr', 'gi']),
        createdAt: new Date(),
      });
    } else if (Object.keys(profileUpdateData).length > 0) {
      // Update existing profile
      await db.update(userProfiles)
        .set(profileUpdateData)
        .where(eq(userProfiles.userId, payload.userId));
    }

    console.log(`✅ Profile updated: username=${username}, bio=${bio}, location=${location}`);

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    set.status = 500;
    return { error: 'Failed to update profile' };
  }
}, {
  body: t.Object({
    username: t.Optional(t.String()),
    bio: t.Optional(t.String()),
    location: t.Optional(t.String()),
    avatarColor: t.Optional(t.String()),
    avatarPhoto: t.Optional(t.Nullable(t.String())),
    bannerId: t.Optional(t.String()),
    bannerPhoto: t.Optional(t.Nullable(t.String())),
    favGames: t.Optional(t.Array(t.String())),
  })
})


// GET /user/recent-activity - Versi aman
.get('/user/recent-activity', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const userReports = await db.select({
      id: reports.id,
      title: reports.title,
      type: reports.type,
      game: reports.game,
      votes: reports.votes,
      createdAt: reports.createdAt,
      status: reports.status,
    })
    .from(reports)
    .where(eq(reports.userId, payload.userId))
    .orderBy(desc(reports.createdAt))
    .limit(10);

    const activities = userReports.map((r, index) => {
      let shortId = '';
      try {
        shortId = String(r.id).slice(0, 6);
      } catch {
        shortId = String(index + 1).padStart(3, '0');
      }
      
      // Determine the display type based on report type
      let displayType: string;
      switch (r.type) {
        case 'guide':
          displayType = 'Main Quest Guide';
          break;
        case 'event':
          displayType = 'Event Guide';
          break;
        case 'puzzle':
          displayType = 'Puzzle Solution';
          break;
        case 'build':
          displayType = 'Build Guide';
          break;
        case 'mission':
          displayType = 'Mission Guide';
          break;
        case 'analysis':
          displayType = 'Analysis Report';
          break;
        default:
          displayType = 'Report';
      }
      
      return {
        id: `REP${shortId}`,
        title: r.title || 'Untitled',
        type: displayType,
        tag: r.status === 'published' ? 'PUBLISHED' : 'DRAFT',
        tagColor: r.status === 'published' ? '#4ECDC4' : '#CBA96E',
        votes: r.votes || 0,
        time: formatRelativeDate(r.createdAt),
      };
    });

    return { success: true, activities };
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return { success: true, activities: [] };
  }
})


// GET /api/user/game-stats
.get('/user/game-stats', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const gameStats = await db.select({
      game: reports.game,
      count: sql<number>`count(*)`,
      votes: sql<number>`sum(${reports.votes})`,
    })
    .from(reports)
    .where(eq(reports.userId, payload.userId))
    .groupBy(reports.game);

    return {
      success: true,
      stats: gameStats.map(g => ({
        game: g.game,
        count: Number(g.count) || 0,
        votes: Number(g.votes) || 0,
      }))
    };
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return { success: true, stats: [] };
  }
})


  // =============================================
  // EVENT SEASONAL ENDPOINTS
  // =============================================

  // GET /events - Get all event reports
  .get('/events', async ({ query, set }: any) => {
    try {
      const { 
        game = 'all', 
        page = '1', 
        limit = '20',
        search = ''
      } = query;
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      let whereClause: any = sql`${reports.type} = 'event'`;
      
      if (game !== 'all') whereClause = and(whereClause, eq(reports.game, game));
      if (search) whereClause = and(whereClause, sql`${reports.title} LIKE ${`%${search}%`}`);
      
      const allEvents = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        version: reports.version,
        userId: reports.userId,
        authorInitials: reports.authorInitials,
        votes: reports.votes,
        views: reports.views,
        createdAt: reports.createdAt,
        summary: reports.summary,
        content: reports.content,
        status: reports.status,
      })
      .from(reports)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(reports.createdAt));
      
      const userIds = allEvents.map(r => r.userId).filter(Boolean);
      let userMap: Record<string, string> = {};
      
      for (const uid of userIds) {
        if (uid && !userMap[uid]) {
          const user = await db.select({ username: users.username })
            .from(users)
            .where(eq(users.id, uid));
          if (user.length > 0) {
            userMap[uid] = user[0].username;
          }
        }
      }
      
      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(whereClause);
      
      const formattedEvents = allEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        game: event.game,
        status: event.status || 'pending',
        category: 'limited',
        startDate: new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: 'N/A',
        rewards: [],
        description: event.summary || event.title,
        tag: event.type,
        featured: false,
        authorName: userMap[event.userId as string] || 'Traveler',
        authorInitials: event.authorInitials || 'TB',
        votes: event.votes || 0,
        views: event.views || 0,
        content: event.content,
        createdAt: event.createdAt,
      }));
      
      return {
        success: true,
        events: formattedEvents,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil((total[0]?.count || 0) / limitNum),
          totalItems: total[0]?.count || 0,
        }
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: true, events: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  })

  // GET /events/pending - Get pending event reports for admin approval
  .get('/events/pending', async ({ query, cookie: { token }, set }: any) => {
    try {
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, payload.userId));
        
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const { game = 'all', page = '1', limit = '20', search = '' } = query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      let whereClause: any = sql`${reports.status} = 'pending' AND ${reports.type} = 'event'`;
      
      if (game !== 'all') whereClause = and(whereClause, eq(reports.game, game));
      if (search) whereClause = and(whereClause, sql`${reports.title} LIKE ${`%${search}%`}`);
      
      const pendingEvents = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        version: reports.version,
        userId: reports.userId,
        authorInitials: reports.authorInitials,
        votes: reports.votes,
        views: reports.views,
        createdAt: reports.createdAt,
        summary: reports.summary,
        content: reports.content,
        status: reports.status,
      })
      .from(reports)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(reports.createdAt));
      
      const userIds = pendingEvents.map(r => r.userId).filter(Boolean);
      let userMap: Record<string, string> = {};
      
      for (const uid of userIds) {
        if (uid && !userMap[uid]) {
          const user = await db.select({ username: users.username })
            .from(users)
            .where(eq(users.id, uid));
          if (user.length > 0) {
            userMap[uid] = user[0].username;
          }
        }
      }
      
      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(whereClause);
      
      const formattedEvents = pendingEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        game: event.game,
        status: 'pending',
        category: 'limited',
        createdAt: event.createdAt,
        description: event.summary || event.title,
        tag: event.type,
        authorName: userMap[event.userId as string] || 'Traveler',
        authorInitials: event.authorInitials || 'TB',
        votes: event.votes || 0,
        views: event.views || 0,
        content: event.content,
      }));
      
      return {
        success: true,
        events: formattedEvents,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil((total[0]?.count || 0) / limitNum),
          totalItems: total[0]?.count || 0,
        }
      };
    } catch (error) {
      console.error('Error fetching pending events:', error);
      return { success: true, events: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  })

  // POST /events/:id/approve - Approve an event report
  .post('/events/:id/approve', async ({ params, cookie: { token }, set }: any) => {
    try {
      const { id } = params;
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role, username: users.username })
        .from(users)
        .where(eq(users.id, payload.userId));
        
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const report = await db.select({
        id: reports.id,
        status: reports.status,
        type: reports.type,
      })
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.type, 'event')));
      
      if (report.length === 0) {
        set.status = 404;
        return { error: 'Event report not found' };
      }

      if (report[0].status !== 'pending') {
        set.status = 400;
        return { error: 'Event report is not pending approval' };
      }

      await db.update(reports)
        .set({ 
          status: 'published',
          updatedAt: new Date(),
        })
        .where(eq(reports.id, id));
      
      // Catat aktivitas admin - TANPA id (auto-increment)
      await db.insert(adminActivities).values({
        adminId: payload.userId,
        actionType: 'EVENT_APPROVE',
        title: `Approved event report: ${id}`,
        targetType: 'report',
        targetId: id,
        createdAt: new Date(),
      });
      
      console.log(`✅ Event report ${id} approved by ${currentUser[0].username}`);
      
      return {
        success: true,
        message: 'Event report approved successfully',
        status: 'published'
      };
    } catch (error) {
      console.error('Error approving event:', error);
      set.status = 500;
      return { error: 'Failed to approve event' };
    }
  })

  // POST /events/:id/reject - Reject an event report
  .post('/events/:id/reject', async ({ params, body, cookie: { token }, set }: any) => {
    try {
      const { id } = params;
      const { note } = body as { note?: string };
      const tokenValue = token.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const currentUser = await db.select({ role: users.role, username: users.username })
        .from(users)
        .where(eq(users.id, payload.userId));
        
      if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden - Admin access required' };
      }

      const report = await db.select({
        id: reports.id,
        status: reports.status,
        type: reports.type,
      })
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.type, 'event')));
      
      if (report.length === 0) {
        set.status = 404;
        return { error: 'Event report not found' };
      }

      if (report[0].status !== 'pending') {
        set.status = 400;
        return { error: 'Event report is not pending approval' };
      }

      await db.update(reports)
        .set({ 
          status: 'archived',
          updatedAt: new Date(),
        })
        .where(eq(reports.id, id));
      
      // Catat aktivitas admin - TANPA id (auto-increment), gunakan description
      await db.insert(adminActivities).values({
        adminId: payload.userId,
        actionType: 'EVENT_REJECT',
        title: `Rejected event report: ${id}`,
        description: note || null,
        targetType: 'report',
        targetId: id,
        createdAt: new Date(),
      });
      
      console.log(`✅ Event report ${id} rejected by ${currentUser[0].username}`);
      
      return {
        success: true,
        message: 'Event report rejected successfully',
        status: 'archived'
      };
    } catch (error) {
      console.error('Error rejecting event:', error);
      set.status = 500;
      return { error: 'Failed to reject event' };
    }
  })

  // GET /events/stats - Get event statistics
  .get('/events/stats', async ({ set }: any) => {
    try {
      const total = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(and(eq(reports.status, 'published'), eq(reports.type, 'event')));
      
      const pending = await db.select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(and(eq(reports.status, 'pending'), eq(reports.type, 'event')));
      
      const byGame = await db.select({
        game: reports.game,
        count: sql<number>`count(*)`,
      })
      .from(reports)
      .where(and(eq(reports.status, 'published'), eq(reports.type, 'event')))
      .groupBy(reports.game);
      
      return {
        success: true,
        stats: {
          total: Number(total[0]?.count) || 0,
          pending: Number(pending[0]?.count) || 0,
          byGame: byGame.map((g: any) => ({
            game: g.game,
            count: Number(g.count) || 0,
          })),
        }
      };
    } catch (error) {
      console.error('Error fetching event stats:', error);
      return { success: true, stats: { total: 0, pending: 0, byGame: [] } };
    }
  })

  // GET /events/:id - Get single event report
  .get('/events/:id', async ({ params, set }: any) => {
    try {
      const { id } = params;
      
      const event = await db.select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        game: reports.game,
        content: reports.content,
        status: reports.status,
        version: reports.version,
        userId: reports.userId,
        authorInitials: reports.authorInitials,
        votes: reports.votes,
        views: reports.views,
        rating: reports.rating,
        summary: reports.summary,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
      })
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.type, 'event')))
      .limit(1);
      
      if (event.length === 0) {
        set.status = 404;
        return { error: 'Event not found' };
      }
      
      const eventData = event[0];
      
      let username = 'Anonymous';
      if (eventData.userId) {
        const user = await db.select({ username: users.username })
          .from(users)
          .where(eq(users.id, eventData.userId));
        if (user.length > 0) username = user[0].username;
      }
      
      return {
        success: true,
        event: {
          id: eventData.id,
          title: eventData.title,
          type: eventData.type,
          game: eventData.game,
          content: eventData.content,
          status: eventData.status,
          version: eventData.version,
          authorName: username,
          authorInitials: eventData.authorInitials,
          votes: eventData.votes || 0,
          views: eventData.views || 0,
          summary: eventData.summary,
          createdAt: eventData.createdAt,
          updatedAt: eventData.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      set.status = 500;
      return { error: 'Failed to fetch event' };
    }
  })

  // POST /events/:id/like - Like an event report
  .post('/events/:id/like', async ({ params }: any) => {
    try {
      const { id } = params;
      await db.update(reports)
        .set({ votes: sql`${reports.votes} + 1` })
        .where(and(eq(reports.id, id), eq(reports.type, 'event')));
      return { success: true };
    } catch (error) {
      console.error('Error liking event:', error);
      return { success: false };
    }
  })

  // GET /user/password-last-changed - Get last password change timestamp
  .get('/user/password-last-changed', async ({ cookie, set }: { cookie: { token?: { value?: string } }; set: any }) => {
    try {
      const tokenValue = cookie.token?.value;
      if (!tokenValue || typeof tokenValue !== 'string') {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const payload = await verifyToken(tokenValue);
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const user = await db.select({
        passwordChangedAt: users.passwordChangedAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId));

      if (user.length === 0) {
        set.status = 404;
        return { error: 'User not found' };
      }

      const lastChanged = user[0].passwordChangedAt || user[0].createdAt;
      
      return {
        success: true,
        lastChanged: lastChanged ? lastChanged.toISOString() : null,
      };
    } catch (error) {
      console.error('Error fetching password last changed:', error);
      set.status = 500;
      return { error: 'Failed to fetch data' };
    }
  })

 // =============================================
// ADMIN WARNING & BAN ENDPOINTS
// =============================================

// POST /admin/warn-user - Send warning to user
.post('/admin/warn-user', async ({ body, cookie: { token }, set }) => {
  try {
    const { userId, username, message } = body as { userId: string; username: string; message: string };
    
    console.log(`⚠️ Sending warning to user: ${username} (${userId})`);
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role, username: users.username })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    // Check if user exists
    const targetUser = await db.select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, userId));
    
    if (targetUser.length === 0) {
      set.status = 404;
      return { error: 'User not found' };
    }

    // Catat aktivitas admin
    await db.insert(adminActivities).values({
      adminId: payload.userId,
      actionType: 'WARN_USER',
      title: `Sent warning to ${username}`,
      description: message,
      targetType: 'user',
      targetId: userId,
      createdAt: new Date(),
    });
    
    console.log(`✅ Warning sent to ${username} by ${currentUser[0].username}`);
    
    return {
      success: true,
      message: `Warning sent to ${username}`,
    };
  } catch (error) {
    console.error('❌ Error sending warning:', error);
    set.status = 500;
    return { error: 'Failed to send warning' };
  }
}, {
  body: t.Object({
    userId: t.String(),
    username: t.String(),
    message: t.String(),
  })
})

// POST /admin/ban-user - Ban a user (DIPERBAIKI - tanpa raw SQL)
.post('/admin/ban-user', async ({ body, cookie: { token }, set }) => {
  try {
    const { userId, username, reason, duration } = body as { 
      userId: string; 
      username: string; 
      reason: string; 
      duration: '1day' | '7days' | '30days' | 'permanent';
    };
    
    console.log(`🔨 Banning user: ${username} (${userId}) - Duration: ${duration}`);
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role, username: users.username })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    // Check if user exists
    const targetUser = await db.select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, userId));
    
    if (targetUser.length === 0) {
      set.status = 404;
      return { error: 'User not found' };
    }

    // Calculate ban expiry date
    let banExpiry: Date | null = null;
    const now = new Date();
    if (duration === '1day') {
      banExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (duration === '7days') {
      banExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (duration === '30days') {
      banExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    // Update user with ban information menggunakan Drizzle biasa
    await db.update(users)
      .set({ 
        isBanned: true,
        banReason: reason,
        banExpiry: banExpiry,
      })
      .where(eq(users.id, userId));

    // Catat aktivitas admin
    await db.insert(adminActivities).values({
      adminId: payload.userId,
      actionType: 'BAN_USER',
      title: `Banned user: ${username}`,
      description: `${reason} (Duration: ${duration})`,
      targetType: 'user',
      targetId: userId,
      createdAt: new Date(),
    });
    
    console.log(`✅ User ${username} banned by ${currentUser[0].username}`);
    
    return {
      success: true,
      message: `${username} has been banned${duration !== 'permanent' ? ` for ${duration}` : ' permanently'}`,
      isBanned: true,
    };
  } catch (error) {
    console.error('❌ Error banning user:', error);
    set.status = 500;
    return { error: 'Failed to ban user: ' + (error instanceof Error ? error.message : 'Unknown error') };
  }
}, {
  body: t.Object({
    userId: t.String(),
    username: t.String(),
    reason: t.String(),
    duration: t.Union([
      t.Literal('1day'),
      t.Literal('7days'),
      t.Literal('30days'),
      t.Literal('permanent'),
    ]),
  })
})

// POST /admin/unban-user - Unban a user
.post('/admin/unban-user', async ({ body, cookie: { token }, set }) => {
  try {
    const { userId, username } = body as { userId: string; username: string };
    
    console.log(`🔓 Unbanning user: ${username} (${userId})`);
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role, username: users.username })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    // Update user - remove ban menggunakan Drizzle biasa
    await db.update(users)
      .set({ 
        isBanned: false,
        banReason: null,
        banExpiry: null,
      })
      .where(eq(users.id, userId));

    // Catat aktivitas admin
    await db.insert(adminActivities).values({
      adminId: payload.userId,
      actionType: 'UNBAN_USER',
      title: `Unbanned user: ${username}`,
      targetType: 'user',
      targetId: userId,
      createdAt: new Date(),
    });
    
    console.log(`✅ User ${username} unbanned by ${currentUser[0].username}`);
    
    return {
      success: true,
      message: `${username} has been unbanned`,
      isBanned: false,
    };
  } catch (error) {
    console.error('❌ Error unbanning user:', error);
    set.status = 500;
    return { error: 'Failed to unban user: ' + (error instanceof Error ? error.message : 'Unknown error') };
  }
}, {
  body: t.Object({
    userId: t.String(),
    username: t.String(),
  })
})

// GET /admin/check-ban-status/:userId - Check if user is banned
.get('/admin/check-ban-status/:userId', async ({ params: { userId }, cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    // Ambil data user menggunakan Drizzle biasa
    const targetUser = await db.select({
      isBanned: users.isBanned,
      banReason: users.banReason,
      banExpiry: users.banExpiry,
    })
    .from(users)
    .where(eq(users.id, userId));

    if (targetUser.length === 0) {
      set.status = 404;
      return { error: 'User not found' };
    }

    const userData = targetUser[0];
    let isBanned = userData.isBanned || false;
    let banExpiry = userData.banExpiry;
    
    // Check if temporary ban has expired
    if (isBanned && banExpiry) {
      const now = new Date();
      const expiry = new Date(banExpiry);
      if (now > expiry) {
        // Auto-unban expired ban
        await db.update(users)
          .set({ 
            isBanned: false,
            banReason: null,
            banExpiry: null,
          })
          .where(eq(users.id, userId));
        isBanned = false;
        banExpiry = null;
      }
    }

    return {
      success: true,
      isBanned: isBanned,
      banReason: userData.banReason || null,
      banExpiry: banExpiry ? new Date(banExpiry).toISOString() : null,
    };
  } catch (error) {
    console.error('Error checking ban status:', error);
    set.status = 500;
    return { error: 'Failed to check ban status' };
  }
})

// =============================================
// PUZZLE ENDPOINTS (TERHUBUNG DATABASE)
// =============================================

// GET /api/puzzles - Get all puzzles (unsolved only for current user)
.get('/puzzles', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    // Get all puzzles
    const allPuzzles = await db.select().from(puzzles).orderBy(asc(puzzles.orderIndex));
    
    // Get solved puzzle IDs for this user
    const solvedPuzzles = await db.select({ puzzleId: userPuzzles.puzzleId })
      .from(userPuzzles)
      .where(and(
        eq(userPuzzles.userId, payload.userId),
        eq(userPuzzles.status, 'solved')
      ));
    
    const solvedIds = new Set(solvedPuzzles.map(sp => sp.puzzleId));
    
    // Filter out solved puzzles
    const availablePuzzles = allPuzzles.filter(p => !solvedIds.has(p.id));
    
    // Parse options for each puzzle
    const puzzlesWithOptions = availablePuzzles.map(p => ({
      ...p,
      options: p.options ? JSON.parse(p.options) : undefined,
    }));
    
    return { success: true, puzzles: puzzlesWithOptions };
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    set.status = 500;
    return { error: 'Failed to fetch puzzles' };
  }
})

// GET /api/puzzles/all - Get all puzzles (including solved) - for admin
.get('/puzzles/all', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const currentUser = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId));
      
    if (currentUser.length === 0 || currentUser[0].role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden - Admin access required' };
    }

    const allPuzzles = await db.select().from(puzzles).orderBy(asc(puzzles.orderIndex));
    
    const puzzlesWithOptions = allPuzzles.map(p => ({
      ...p,
      options: p.options ? JSON.parse(p.options) : undefined,
    }));
    
    return { success: true, puzzles: puzzlesWithOptions };
  } catch (error) {
    console.error('Error fetching all puzzles:', error);
    set.status = 500;
    return { error: 'Failed to fetch puzzles' };
  }
})

// POST /api/puzzles/solve - Record puzzle solve
.post('/puzzles/solve', async ({ body, cookie: { token }, set }) => {
  try {
    const { puzzleId, points } = body as { puzzleId: number; points: number };
    
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    // Check if already solved
    const existing = await db.select()
      .from(userPuzzles)
      .where(and(
        eq(userPuzzles.userId, payload.userId),
        eq(userPuzzles.puzzleId, puzzleId)
      ));
    
    if (existing.length > 0) {
      return { success: true, message: 'Already solved' };
    }

    // Record solve
    await db.insert(userPuzzles).values({
      userId: payload.userId,
      puzzleId: puzzleId,
      status: 'solved',
      solvedAt: new Date(),
    });
    
    // Update puzzle solvedBy count
    await db.execute(sql`
      UPDATE puzzles 
      SET solved_by = solved_by + 1 
      WHERE id = ${puzzleId}
    `);
    
    // Update user XP
    await db.update(users)
      .set({ xp: sql`${users.xp} + ${points}` })
      .where(eq(users.id, payload.userId));
    
    console.log(`✅ User ${payload.userId} solved puzzle ${puzzleId} for ${points} points`);
    
    return { success: true, message: 'Puzzle solve recorded' };
  } catch (error) {
    console.error('Error recording puzzle solve:', error);
    set.status = 500;
    return { error: 'Failed to record puzzle solve' };
  }
}, {
  body: t.Object({
    puzzleId: t.Number(),
    points: t.Number(),
  })
})

// GET /api/puzzles/leaderboard - Get puzzle leaderboard
.get('/puzzles/leaderboard', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    // Get leaderboard from userPuzzles aggregated
    const leaderboardResult = await db.execute(sql`
      SELECT 
        u.username,
        COUNT(up.puzzle_id) as solved_count,
        SUM(p.points) as total_points
      FROM user_puzzles up
      JOIN users u ON u.id = up.user_id
      JOIN puzzles p ON p.id = up.puzzle_id
      WHERE up.status = 'solved'
      GROUP BY u.id, u.username
      ORDER BY total_points DESC
      LIMIT 10
    `);
    
    const rows = leaderboardResult as any;
    const formattedLeaderboard = rows.map((row: any, index: number) => ({
      rank: index + 1,
      name: row.username,
      pts: row.total_points,
      solved: row.solved_count,
      badge: index < 3 ? '◆' : '',
    }));
    
    return { success: true, leaderboard: formattedLeaderboard };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return empty array if error
    return { success: true, leaderboard: [] };
  }
})

// GET /api/puzzles/stats - Get user puzzle stats
.get('/puzzles/stats', async ({ cookie: { token }, set }) => {
  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(tokenValue);
    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const solvedCount = await db.select({ count: sql<number>`count(*)` })
      .from(userPuzzles)
      .where(and(
        eq(userPuzzles.userId, payload.userId),
        eq(userPuzzles.status, 'solved')
      ));
    
    const totalPointsResult = await db.execute(sql`
      SELECT SUM(p.points) as total
      FROM user_puzzles up
      JOIN puzzles p ON p.id = up.puzzle_id
      WHERE up.user_id = ${payload.userId} AND up.status = 'solved'
    `);
    
    const totalPuzzles = await db.select({ count: sql<number>`count(*)` })
      .from(puzzles);
    
    const pointsRows = totalPointsResult as any;
    
    return {
      success: true,
      stats: {
        solved: solvedCount[0]?.count || 0,
        total: totalPuzzles[0]?.count || 0,
        points: pointsRows[0]?.total || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching puzzle stats:', error);
    return { success: true, stats: { solved: 0, total: 0, points: 0 } };
  }
})

// =============================================
// EXPORT UNTUK NEXT.JS
// =============================================
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;