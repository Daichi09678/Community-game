import nodemailer from 'nodemailer';

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

export async function sendOTPEmail(email: string, code: string, name?: string, type: string = 'login') {
  const html = getOTPEmailHtml(code, name, type);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: type === 'registration' ? 'Kode Verifikasi Registrasi - Triablazer' : 'Kode Verifikasi Login - Triablazer',
    html,
  });
}