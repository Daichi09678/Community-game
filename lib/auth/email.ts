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

export function getVerificationEmailHtml(otpCode: string, name?: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verifikasi Email</title>
<style>
  body { font-family: 'Rajdhani', sans-serif; background: #050810; color: #E5DCC8; margin: 0; padding: 20px; }
  .container { max-width: 500px; margin: 0 auto; background: #0B1121; border: 0.5px solid rgba(200,169,110,0.18); padding: 2rem; border-radius: 12px; }
  .code { font-size: 2rem; font-weight: 700; letter-spacing: 8px; color: #C8A96E; text-align: center; padding: 1rem; background: rgba(200,169,110,0.05); margin: 1.5rem 0; }
</style>
</head>
<body>
<div class="container">
  <h2 style="color:#C8A96E;">Hoyoverse Hub</h2>
  <p>Halo${name ? `, ${name}` : ''}!</p>
  <p>Gunakan kode berikut untuk memverifikasi email Anda:</p>
  <div class="code">${otpCode}</div>
  <p>Kode ini berlaku selama 10 menit.</p>
  <p>Jika Anda tidak membuat akun, abaikan email ini.</p>
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