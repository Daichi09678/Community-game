import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) console.error('❌ SMTP Error:', error);
  else console.log('✅ SMTP ready');
});

// Email template untuk OTP verifikasi
  export function getVerificationEmailHtml(otpCode: string, name?: string): string {
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Verifikasi Email - Triablazer</title>
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
    <p>Gunakan kode berikut untuk memverifikasi email Anda:</p>
    <div class="code">${otpCode}</div>
    <p>Kode ini berlaku selama <strong>10 menit</strong>.</p>
    <p>Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
    <div class="footer">© 2025 Triablazer · All rights reserved</div>
  </div>
  </body>
  </html>`;
  }

// Email template untuk reset password
export function getResetPasswordEmailHtml(resetLink: string, name?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Password - Triablazer</title>
  <style>
    body { font-family: 'Rajdhani', sans-serif; background: #050810; color: #E5DCC8; margin: 0; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #0B1121; border: 0.5px solid rgba(200,169,110,0.18); padding: 2rem; border-radius: 12px; }
    .button { display: inline-block; background: linear-gradient(135deg, #7A5A24, #C8A96E); color: #060911; text-decoration: none; padding: 12px 24px; margin: 20px 0; font-weight: bold; letter-spacing: 1px; clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%); }
    .footer { margin-top: 1.5rem; font-size: 0.7rem; color: #4A4540; text-align: center; }
  </style>
</head>
<body>
<div class="container">
  <h2 style="color:#C8A96E;">✦ Triablazer ✦</h2>
  <p>Halo${name ? `, ${name}` : ' Traveler'}!</p>
  <p>Kami menerima permintaan untuk mereset password Anda. Klik tombol di bawah untuk membuat password baru:</p>
  <div style="text-align: center;">
    <a href="${resetLink}" class="button">Reset Password</a>
  </div>
  <p>Link ini akan berlaku selama <strong>1 jam</strong>.</p>
  <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
  <div class="footer">© 2025 Triablazer · All rights reserved</div>
</div>
</body>
</html>`;
}

export async function sendOTPEmail(email: string, code: string, name?: string) {
  const html = getVerificationEmailHtml(code, name);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Kode Verifikasi - Hoyoverse Hub',
    html,
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}