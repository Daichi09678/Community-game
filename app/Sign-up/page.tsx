'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CLIP = {
  hero:    'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
  navpill: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
  card:    'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',
  input:   'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
  tag:     'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)',
  eyebrow: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
  badge:   'polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)',
};

type Step = 1 | 2 | 3 | 4;
const OTP_LENGTH = 6;

export default function SignUp() {
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [focusField, setFocus] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null); // Untuk tracking session verifikasi
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ---------- API calls (FIXED ENDPOINTS) ----------
  const api = {
    sendOTP: async (email: string) => {
      console.log('📤 Sending OTP to:', email);
      const res = await fetch('/api/otp/send-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log('📥 Send OTP response:', data);
      return data;
    },
    resendOTP: async (email: string) => {
      console.log('📤 Resending OTP to:', email);
      const res = await fetch('/api/otp/resend-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log('📥 Resend OTP response:', data);
      return data;
    },
    verifyOTP: async (email: string, code: string) => {
      console.log('🔐 Verifying OTP for:', email, 'Code:', code);
      const res = await fetch('/api/otp/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      console.log('📥 Verify OTP response:', data);
      return data;
    },
  };

  // ---------- Password strength ----------
  const passwordStrength = (): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: 'Weak',   color: '#E85050' };
    if (score <= 3) return { score, label: 'Fair',   color: '#C8A96E' };
    return              { score, label: 'Strong', color: '#4ECDC4' };
  };

  const pwStrength = passwordStrength();
  const passwordsMatch    = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  // ---------- Handlers ----------
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validasi username dan email
      if (username.length < 3) {
        alert('Username minimal 3 karakter');
        return;
      }
      if (!email.includes('@')) {
        alert('Email tidak valid');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validasi password
      if (password.length < 8) {
        alert('Password minimal 8 karakter');
        return;
      }
      if (password !== confirm) {
        alert('Password tidak cocok');
        return;
      }
      
      setLoading(true);
      try {
        const result = await api.sendOTP(email);
        if (result.error) {
          alert(result.error);
          return;
        }
        if (result.devOTP) {
          console.log('⚠️ Dev OTP:', result.devOTP);
          // Optional: auto-fill OTP for development
          if (process.env.NODE_ENV === 'development') {
            const devOtpDigits = result.devOTP.split('');
            setOtp(devOtpDigits.concat(Array(OTP_LENGTH - devOtpDigits.length).fill('')));
          }
        }
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError('');
        setOtpVerified(false);
        setResendCooldown(60);
        setStep(3);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } catch (err) {
        console.error('Send OTP error:', err);
        alert('Gagal mengirim kode OTP. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError('');
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        const next = [...otp];
        next[index - 1] = '';
        setOtp(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setOtpError('Masukkan 6 digit kode lengkap.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.verifyOTP(email, code);
      if (result.error) {
        setOtpError(result.error);
      } else if (result.success || result.verified) {
        setOtpVerified(true);
        // Tunggu sebentar sebelum pindah ke step berikutnya
        setTimeout(() => setStep(4), 800);
      } else {
        setOtpError('Verifikasi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setOtpError('Gagal memverifikasi kode. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    try {
      const result = await api.resendOTP(email);
      if (result.error) {
        alert(result.error);
      } else {
        if (result.devOTP) {
          console.log('⚠️ New Dev OTP:', result.devOTP);
          if (process.env.NODE_ENV === 'development') {
            const devOtpDigits = result.devOTP.split('');
            setOtp(devOtpDigits.concat(Array(OTP_LENGTH - devOtpDigits.length).fill('')));
          }
        }
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError('');
        setResendCooldown(60);
        otpRefs.current[0]?.focus();
        alert('Kode OTP baru telah dikirim ke email Anda');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      alert('Gagal mengirim ulang kode OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Anda harus menyetujui Terms of Service');
      return;
    }
    
    setLoading(true);
    try {
      const otpCode = otp.join('');
      
      // Pastikan OTP sudah diverifikasi
      if (!otpVerified) {
        alert('Silakan verifikasi OTP terlebih dahulu');
        setLoading(false);
        return;
      }

      console.log('📝 Submitting signup with:', { username, email, password: '***', otpCode });

      const signUpResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, otpCode }),
      });

      const signUpResult = await signUpResponse.json();

      if (!signUpResponse.ok || signUpResult.error) {
        alert(signUpResult.error || 'Registrasi gagal');
        return;
      }

      console.log('✅ Signup success:', signUpResult);

      // Redirect ke dashboard
      window.location.href = '/UserHoyo/dashboard';

    } catch (err) {
      console.error('Sign up error detail:', err);
      alert('Registrasi gagal: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const borderColor = (field: string) =>
    focusField === field ? 'rgba(200,169,110,.55)' : 'rgba(200,169,110,.15)';
  const shadowColor = (field: string) =>
    focusField === field ? '0 0 0 2px rgba(200,169,110,.1)' : 'none';

  const steps = ['Identity', 'Cipher', 'Verify', 'Manifest'];
  const otpFilled = otp.every(d => d !== '');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#050810;color:#E5DCC8;font-family:'Rajdhani',sans-serif;overflow-x:hidden;min-height:100vh}

        body::before{
          content:'';position:fixed;inset:0;
          background:
            radial-gradient(1px 1px at 8% 12%,rgba(200,169,110,.7) 0%,transparent 100%),
            radial-gradient(1px 1px at 22% 45%,rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 38% 8%,rgba(200,169,110,.5) 0%,transparent 100%),
            radial-gradient(1px 1px at 55% 70%,rgba(255,255,255,.3) 0%,transparent 100%),
            radial-gradient(1px 1px at 70% 25%,rgba(78,205,196,.4) 0%,transparent 100%),
            radial-gradient(1px 1px at 82% 55%,rgba(255,255,255,.25) 0%,transparent 100%),
            radial-gradient(1px 1px at 92% 18%,rgba(200,169,110,.6) 0%,transparent 100%),
            radial-gradient(1px 1px at 15% 80%,rgba(255,255,255,.2) 0%,transparent 100%),
            radial-gradient(1px 1px at 48% 92%,rgba(168,85,247,.3) 0%,transparent 100%),
            radial-gradient(ellipse 70% 50% at 80% 10%,rgba(123,79,166,.08) 0%,transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 85%,rgba(78,205,196,.05) 0%,transparent 60%);
          pointer-events:none;z-index:0;
        }
        body::after{
          content:'';position:fixed;
          top:50%;left:50%;transform:translate(-50%,-50%);
          width:600px;height:400px;
          background:radial-gradient(ellipse,rgba(200,169,110,.04) 0%,transparent 70%);
          pointer-events:none;z-index:0;
        }

        .fc{font-family:'Cinzel',serif}
        .fm{font-family:'Space Mono',monospace}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .blink{animation:blink 2.4s ease-in-out infinite}

        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.19s}
        .d4{animation-delay:.26s}.d5{animation-delay:.33s}.d6{animation-delay:.40s}

        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .slide-in{animation:slideIn .35s ease both}

        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{animation:spin .8s linear infinite;display:inline-block}

        @keyframes scaleIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
        .scale-in{animation:scaleIn .4s cubic-bezier(.34,1.56,.64,1) both}

        .field-input{
          width:100%;background:rgba(200,169,110,.04);
          color:#E5DCC8;font-family:'Rajdhani',sans-serif;
          font-size:.9rem;font-weight:600;letter-spacing:.04em;
          border:none;outline:none;padding:.75rem 1rem;
          transition:background .2s;
        }
        .field-input::placeholder{color:#4A4540}
        .field-input:focus{background:rgba(200,169,110,.07)}

        .submit-btn{
          width:100%;padding:.85rem;
          background:linear-gradient(135deg,#7A5A24,#C8A96E);
          border:none;color:#060911;
          font-family:'Rajdhani',sans-serif;font-size:.9rem;font-weight:700;
          letter-spacing:.14em;text-transform:uppercase;cursor:pointer;
          transition:opacity .2s,transform .15s;
          clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
        }
        .submit-btn:hover{opacity:.88;transform:translateY(-1px)}
        .submit-btn:active{opacity:1;transform:scale(.98)}
        .submit-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}

        .back-btn{
          background:none;border:.5px solid rgba(200,169,110,.2);
          color:#6A6058;font-family:'Rajdhani',sans-serif;
          font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
          cursor:pointer;padding:.5rem 1rem;
          clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);
          transition:border-color .2s,color .2s,transform .15s;
        }
        .back-btn:hover{border-color:rgba(200,169,110,.4);color:#C8A96E}
        .back-btn:active{transform:scale(.97)}

        .social-btn{
          display:flex;align-items:center;justify-content:center;gap:.6rem;
          width:100%;padding:.7rem 1rem;background:rgba(200,169,110,.05);
          border:.5px solid rgba(200,169,110,.14);color:#8A8070;
          font-family:'Rajdhani',sans-serif;font-size:.8rem;font-weight:700;
          letter-spacing:.1em;text-transform:uppercase;cursor:pointer;
          transition:background .2s,border-color .2s,color .2s,transform .15s;
          clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);
        }
        .social-btn:hover{background:rgba(200,169,110,.1);border-color:rgba(200,169,110,.3);color:#C8A96E}
        .social-btn:active{transform:scale(.97)}

        .eye-btn{
          background:none;border:none;cursor:pointer;padding:.5rem .75rem;
          color:#4A4540;transition:color .2s;display:flex;align-items:center;
        }
        .eye-btn:hover{color:#C8A96E}

        .cb-box{
          width:16px;height:16px;flex-shrink:0;
          background:rgba(200,169,110,.06);
          border:.5px solid rgba(200,169,110,.25);
          display:flex;align-items:center;justify-content:center;
          transition:background .2s,border-color .2s;
          clip-path:polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%);
          cursor:pointer;
        }
        .cb-box.checked{background:rgba(200,169,110,.2);border-color:rgba(200,169,110,.6)}

        .divider{display:flex;align-items:center;gap:.75rem;margin:1.4rem 0}
        .divider::before,.divider::after{content:'';flex:1;height:.5px;background:rgba(200,169,110,.1)}

        .scanlines{
          position:absolute;inset:0;pointer-events:none;z-index:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px);
        }

        .tg{background:linear-gradient(90deg,#7A5A24 0%,#EDD28A 45%,#C8A96E 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        .step-node{
          width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-family:'Space Mono',monospace;font-size:.6rem;font-weight:700;
          transition:background .3s,border-color .3s,color .3s;
        }
        .step-node.done{background:rgba(200,169,110,.2);border:.5px solid #C8A96E;color:#C8A96E}
        .step-node.active{background:linear-gradient(135deg,#7A5A24,#C8A96E);border:none;color:#060911}
        .step-node.pending{background:rgba(200,169,110,.04);border:.5px solid rgba(200,169,110,.15);color:#4A4540}
        .step-line{flex:1;height:.5px;transition:background .3s}

        .otp-input{
          width:44px;height:54px;text-align:center;
          background:rgba(200,169,110,.05);
          color:#E5DCC8;font-family:'Space Mono',monospace;
          font-size:1.3rem;font-weight:700;
          border:.5px solid rgba(200,169,110,.18);
          outline:none;
          clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
          transition:background .2s,border-color .2s,box-shadow .2s;
          caret-color:#C8A96E;
        }
        .otp-input:focus{
          background:rgba(200,169,110,.1);
          border-color:rgba(200,169,110,.55);
          box-shadow:0 0 0 2px rgba(200,169,110,.1);
        }
        .otp-input.filled{border-color:rgba(200,169,110,.4)}
        .otp-input.error{border-color:rgba(232,80,80,.5);background:rgba(232,80,80,.06)}
        .otp-input.success{border-color:rgba(78,205,196,.5);background:rgba(78,205,196,.06)}

        .perk-item{
          display:flex;align-items:flex-start;gap:.65rem;
          padding:.75rem .85rem;
          background:rgba(200,169,110,.03);
          border:.5px solid rgba(200,169,110,.1);
          clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);
          transition:background .2s,border-color .2s;
        }
        .perk-item:hover{background:rgba(200,169,110,.07);border-color:rgba(200,169,110,.22)}

        .nav-logo{transition:opacity .2s}
        .nav-logo:hover{opacity:.8}

        @keyframes checkPop{0%{transform:scale(0) rotate(-10deg);opacity:0}70%{transform:scale(1.2) rotate(3deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        .check-pop{animation:checkPop .5s cubic-bezier(.34,1.56,.64,1) both}
      `}</style>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column'}}>

        {/* NAV */}
        <nav style={{position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.9rem 2.5rem',background:'rgba(5,8,16,.92)',backdropFilter:'blur(20px)',borderBottom:'.5px solid rgba(200,169,110,.13)'}}>
          <Link href="/" className="nav-logo" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <svg width="26" height="26" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.2" fill="rgba(200,169,110,0.25)" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="14" y1="8" x2="14" y2="10.8" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="14" y1="17.2" x2="14" y2="20" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="8" y1="14" x2="10.8" y2="14" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="17.2" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth=".8"/>
            </svg>
            <span className="fc" style={{fontSize:'.95rem',fontWeight:700,color:'#C8A96E'}}>Hoyoverse Hub</span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
            <span style={{color:'#4A4540',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginRight:'.25rem'}}>Have an account?</span>
            <Link href="/Sign-in">
              <button style={{clipPath:'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',padding:'.45rem 1.1rem',background:'rgba(200,169,110,.08)',border:'.5px solid rgba(200,169,110,.13)',color:'#C8A96E',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',fontFamily:'Rajdhani,sans-serif',transition:'background .2s,border-color .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(200,169,110,.16)';e.currentTarget.style.borderColor='rgba(200,169,110,.35)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(200,169,110,.08)';e.currentTarget.style.borderColor='rgba(200,169,110,.13)'}}
              >Sign In</button>
            </Link>
          </div>
        </nav>

        {/* MAIN */}
        <main style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem',gap:'2.5rem',flexWrap:'wrap'}}>

          {/* Left perk panel */}
          <div className="fade-up d1" style={{width:'100%',maxWidth:280,display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <div>
              <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'#4ECDC4',marginBottom:'.5rem'}}>Why join?</div>
              <h2 className="fc" style={{fontSize:'1.1rem',fontWeight:700,lineHeight:1.3,color:'#E5DCC8'}}>Across the<br/><span className="tg">Sea of Quanta</span></h2>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {[
                {icon:<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#C8A96E" strokeWidth="1.4"><polygon points="10,1 18,5 18,15 10,19 2,15 2,5"/><circle cx="10" cy="10" r="2.5"/></svg>, c:'#C8A96E', t:'Mission Reports', d:'Access 12,480+ curated quest guides'},
                {icon:<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#4ECDC4" strokeWidth="1.4"><rect x="1" y="3" width="18" height="14" rx="1.5"/><line x1="1" y1="8" x2="19" y2="8"/><line x1="7" y1="12.5" x2="13" y2="12.5"/></svg>, c:'#4ECDC4', t:'Event Walkthroughs', d:'Never miss seasonal rewards again'},
                {icon:<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#A855F7" strokeWidth="1.4"><polygon points="10,1 12.5,7 19,7 14,11 16,17.5 10,13.5 4,17.5 6,11 1,7 7.5,7"/></svg>, c:'#A855F7', t:'Earn XP & Ranks', d:'Ascend the Multiverse Leaderboard'},
                {icon:<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#C8A96E" strokeWidth="1.4"><circle cx="7" cy="7" r="3.5"/><circle cx="14" cy="11" r="3"/><path d="M1 18C1 14.5 4 13 7 13" strokeLinecap="round"/><path d="M10.5 17C10.5 14.5 12 14 14 14" strokeLinecap="round"/></svg>, c:'#C8A96E', t:'31K+ Interdimensional Travelers', d:'Join the most active HoyoVerse community'},
              ].map((p,i)=>(
                <div key={i} className="perk-item">
                  <div style={{width:26,height:26,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:`rgba(${p.c==='#C8A96E'?'200,169,110':p.c==='#4ECDC4'?'78,205,196':'168,85,247'},.1)`,clipPath:'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)'}}>{p.icon}</div>
                  <div>
                    <div className="fc" style={{fontSize:'.72rem',fontWeight:600,color:'#E5DCC8',marginBottom:'.1rem'}}>{p.t}</div>
                    <div style={{fontSize:'.7rem',color:'#4A4540',lineHeight:1.5}}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial mini */}
            <div style={{padding:'1rem',background:'rgba(200,169,110,.04)',border:'.5px solid rgba(200,169,110,.1)',clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
              <div style={{fontSize:'.65rem',color:'#C8A96E',letterSpacing:2,marginBottom:'.5rem'}}>★★★★★</div>
              <p style={{fontSize:'.72rem',lineHeight:1.65,color:'#6A6058',fontStyle:'italic',marginBottom:'.65rem'}}>"Joining was the best decision I made this patch. The community here is incredible."</p>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="fc" style={{width:22,height:22,borderRadius:'50%',border:'.5px solid #7A5A24',background:'rgba(200,169,110,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.52rem',color:'#C8A96E',fontWeight:700}}>MS</div>
                <div>
                  <div style={{fontSize:'.72rem',fontWeight:600,color:'#E5DCC8'}}>MirrorSky_9</div>
                  <div className="fm" style={{fontSize:'.58rem',color:'#4A4540'}}>LV.62 · 27 reports</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="fade-up d2" style={{width:'100%',maxWidth:440,position:'relative'}}>
            <div style={{position:'absolute',inset:-1,background:'transparent',border:'.5px solid rgba(200,169,110,.1)',clipPath:'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',pointerEvents:'none',zIndex:0}}/>
            <div style={{position:'absolute',top:-30,left:'50%',transform:'translateX(-50%)',width:320,height:80,background:'radial-gradient(ellipse,rgba(200,169,110,.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

            <div style={{position:'relative',zIndex:1,background:'#0B1121',clipPath:'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',border:'.5px solid rgba(200,169,110,.18)',overflow:'hidden',padding:'2.25rem 2.25rem 2rem'}}>
              <div className="scanlines"/>

              <div style={{position:'relative',zIndex:1}}>

                {/* Header */}
                <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'1rem'}}>
                    <div style={{width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(200,169,110,.08)',border:'.5px solid rgba(200,169,110,.2)',clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="1.4">
                        <polygon points="12,2 22,7 22,17 12,22 2,17 2,7"/>
                        <circle cx="12" cy="12" r="3"/>
                        <line x1="12" y1="7" x2="12" y2="9" strokeLinecap="round"/>
                        <line x1="12" y1="15" x2="12" y2="17" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{clipPath:'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',display:'inline-flex',alignItems:'center',gap:8,padding:'.3rem 1rem',border:'.5px solid rgba(200,169,110,.25)',background:'rgba(200,169,110,.05)',color:'#C8A96E',fontSize:'.62rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:'.8rem'}}>
                    <span className="blink" style={{width:4,height:4,background:'#C8A96E',borderRadius:'50%',display:'inline-block'}}/>
                    New HoYo-Explorer Registration
                  </div>
                  <h1 className="fc tg" style={{fontSize:'1.5rem',fontWeight:700,lineHeight:1.15,marginBottom:'.35rem'}}>Create Account</h1>
                  <p style={{fontSize:'.8rem',color:'#4A4540',lineHeight:1.6}}>Your journey begins here, Player</p>
                </div>

                {/* Step indicator */}
                <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:'1.75rem'}}>
                  {steps.map((s,i)=>{
                    const n = i + 1;
                    const isDone   = step > n;
                    const isActive = step === n;
                    return (
                      <div key={s} style={{display:'flex',alignItems:'center',flex:i<steps.length-1?1:'none'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <div className={`step-node ${isDone?'done':isActive?'active':'pending'}`}>
                            {isDone ? (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round">
                                <polyline points="2,6 5,9 10,3"/>
                              </svg>
                            ) : (
                              <span className="fm">{String(n).padStart(2,'0')}</span>
                            )}
                          </div>
                          <span style={{fontSize:'.55rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:isDone?'#C8A96E':isActive?'#C8A96E':'#3A3530'}}>{s}</span>
                        </div>
                        {i < steps.length-1 && (
                          <div className="step-line" style={{background:step>n?'rgba(200,169,110,.4)':'rgba(200,169,110,.1)',marginBottom:'1.1rem',marginLeft:4,marginRight:4}}/>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* STEP 1 — Identity */}
                {step === 1 && (
                  <form key="step1" className="slide-in" onSubmit={handleNext}>
                    <div style={{marginBottom:'1rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">Callsign</span> &nbsp;/&nbsp; Username
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${borderColor('username')}`,boxShadow:shadowColor('username'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='username'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <circle cx="10" cy="7" r="4"/><path d="M2 18c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round"/>
                        </svg>
                        <input className="field-input" type="text" placeholder="e.g. StarRailHunter_7" value={username} onChange={e=>setUsername(e.target.value)} onFocus={()=>setFocus('username')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} minLength={3} required/>
                        {username.length >= 3 && (
                          <div style={{padding:'0 .75rem',flexShrink:0}}>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"><polyline points="2,7 5.5,10.5 12,3"/></svg>
                          </div>
                        )}
                      </div>
                      <p style={{fontSize:'.65rem',color:'#4A4540',marginTop:'.35rem',letterSpacing:'.04em'}}>Min. 3 characters. This will be your public identity.</p>
                    </div>

                    <div style={{marginBottom:'1.5rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">Astral ID</span> &nbsp;/&nbsp; Email
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${borderColor('email')}`,boxShadow:shadowColor('email'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='email'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="2" y="5" width="16" height="12" rx="1.5"/><path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                        </svg>
                        <input className="field-input" type="email" placeholder="trailblazer@galaxy.io" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} required/>
                      </div>
                    </div>

                    <button type="submit" className="submit-btn">
                      <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                        Continue
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </span>
                    </button>

                    <div className="divider">
                      <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#3A3530'}}>or register with</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.65rem'}}>
                      <button type="button" className="social-btn">
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                          <path d="M18.17 10.2c0-.65-.06-1.27-.16-1.87H10v3.54h4.59a3.93 3.93 0 01-1.7 2.58v2.14h2.75c1.61-1.48 2.53-3.66 2.53-6.4z" fill="#4285F4"/>
                          <path d="M10 18.5c2.3 0 4.22-.76 5.63-2.06l-2.75-2.14c-.76.51-1.73.81-2.88.81-2.21 0-4.09-1.5-4.76-3.5H2.4v2.21A8.5 8.5 0 0010 18.5z" fill="#34A853"/>
                          <path d="M5.24 11.61A5.1 5.1 0 015.24 8.4V6.19H2.4A8.5 8.5 0 002.4 13.8l2.84-2.19z" fill="#FBBC05"/>
                          <path d="M10 4.5c1.24 0 2.36.43 3.24 1.27l2.43-2.43A8.5 8.5 0 002.4 6.19l2.84 2.21C5.91 6 7.79 4.5 10 4.5z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>
                      <button type="button" className="social-btn">
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="#5865F2">
                          <path d="M16.93 4.26A16.34 16.34 0 0012.8 3c-.18.32-.4.76-.54 1.1a15.08 15.08 0 00-4.52 0A11.67 11.67 0 007.2 3 16.3 16.3 0 003.07 4.26C.44 8.33-.27 12.3.08 16.22a16.5 16.5 0 005.04 2.55c.41-.55.77-1.14 1.08-1.76a10.7 10.7 0 01-1.7-.82l.41-.32a11.76 11.76 0 0010.18 0c.13.11.27.22.41.32-.54.32-1.11.6-1.7.82.31.62.67 1.21 1.08 1.76a16.43 16.43 0 005.04-2.55c.41-4.53-.7-8.46-2.99-11.96zM6.68 13.77c-.97 0-1.77-.9-1.77-2s.78-2 1.77-2 1.79.9 1.77 2c.02 1.1-.78 2-1.77 2zm6.64 0c-.97 0-1.77-.9-1.77-2s.78-2 1.77-2 1.79.9 1.77 2c0 1.1-.78 2-1.77 2z"/>
                        </svg>
                        Discord
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2 — Cipher / Password */}
                {step === 2 && (
                  <form key="step2" className="slide-in" onSubmit={handleNext}>
                    <div style={{marginBottom:'1rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">Cipher</span> &nbsp;/&nbsp; Password
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${borderColor('password')}`,boxShadow:shadowColor('password'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='password'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="4" y="9" width="12" height="9" rx="1"/><path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill={focusField==='password'?'#C8A96E':'#4A4540'}/>
                        </svg>
                        <input className="field-input" type={showPass?'text':'password'} placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocus('password')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} minLength={8} required/>
                        <button type="button" className="eye-btn" onClick={()=>setShowPass(!showPass)}>
                          {showPass
                            ? <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/></svg>
                          }
                        </button>
                      </div>

                      {password.length > 0 && (
                        <div style={{marginTop:'.55rem'}}>
                          <div style={{display:'flex',gap:3,marginBottom:'.3rem'}}>
                            {[1,2,3,4,5].map(i=>(
                              <div key={i} style={{flex:1,height:2,background:i<=pwStrength.score?pwStrength.color:'rgba(200,169,110,.1)',transition:'background .3s',clipPath:'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)'}}/>
                            ))}
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                              {[['8+ chars',password.length>=8],['Uppercase',/[A-Z]/.test(password)],['Number',/[0-9]/.test(password)],['Symbol',/[^A-Za-z0-9]/.test(password)]].map(([l,ok])=>(
                                <span key={l as string} style={{clipPath:'polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)',padding:'1px 6px',fontSize:'.57rem',fontWeight:700,letterSpacing:'.06em',background:ok?'rgba(78,205,196,.12)':'rgba(200,169,110,.06)',color:ok?'#4ECDC4':'#3A3530',border:`.5px solid ${ok?'rgba(78,205,196,.3)':'rgba(200,169,110,.1)'}`}}>{l as string}</span>
                              ))}
                            </div>
                            <span style={{fontSize:'.65rem',fontWeight:700,color:pwStrength.color,letterSpacing:'.06em'}}>{pwStrength.label}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{marginBottom:'1.5rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">Confirm</span> &nbsp;/&nbsp; Repeat Password
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${passwordsMismatch?'rgba(232,80,80,.45)':passwordsMatch?'rgba(78,205,196,.45)':borderColor('confirm')}`,boxShadow:shadowColor('confirm'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={passwordsMismatch?'#E85050':passwordsMatch?'#4ECDC4':focusField==='confirm'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="4" y="9" width="12" height="9" rx="1"/><path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill={passwordsMismatch?'#E85050':passwordsMatch?'#4ECDC4':focusField==='confirm'?'#C8A96E':'#4A4540'}/>
                        </svg>
                        <input className="field-input" type={showConf?'text':'password'} placeholder="Repeat your password" value={confirm} onChange={e=>setConfirm(e.target.value)} onFocus={()=>setFocus('confirm')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} required/>
                        <button type="button" className="eye-btn" onClick={()=>setShowConf(!showConf)}>
                          {showConf
                            ? <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/></svg>
                          }
                        </button>
                      </div>
                      {passwordsMismatch && <p style={{fontSize:'.65rem',color:'#E85050',marginTop:'.35rem',letterSpacing:'.04em'}}>Passwords do not match.</p>}
                      {passwordsMatch   && <p style={{fontSize:'.65rem',color:'#4ECDC4',marginTop:'.35rem',letterSpacing:'.04em'}}>Passwords match.</p>}
                    </div>

                    <div style={{display:'flex',gap:'.65rem'}}>
                      <button type="button" className="back-btn" onClick={()=>setStep(1)}>← Back</button>
                      <button type="submit" className="submit-btn" disabled={!passwordsMatch} style={{flex:1}}>
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          {loading ? (
                            <>
                              <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                                <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                              </svg>
                              Sending OTP…
                            </>
                          ) : (
                            <>
                              Continue
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3 — Verify OTP */}
                {step === 3 && (
                  <form key="step3" className="slide-in" onSubmit={handleVerifyOtp}>
                    <div style={{padding:'1rem',background:'rgba(78,205,196,.04)',border:'.5px solid rgba(78,205,196,.18)',clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',marginBottom:'1.5rem',display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                      <div style={{flexShrink:0,marginTop:2}}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#4ECDC4" strokeWidth="1.4">
                          <rect x="2" y="5" width="16" height="12" rx="1.5"/><path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#4ECDC4',marginBottom:'.3rem'}}>Transmission Sent</div>
                        <p style={{fontSize:'.75rem',color:'#6A6058',lineHeight:1.6}}>
                          A 6-digit verification code was sent to{' '}
                          <span style={{color:'#C8A96E',fontWeight:700}}>{email}</span>.
                          Enter it below to confirm your Astral ID.
                        </p>
                      </div>
                    </div>

                    <div style={{marginBottom:'1rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.75rem'}}>
                        <span className="fc">Auth Code</span> &nbsp;/&nbsp; 6-Digit Cipher
                      </label>

                      {otpVerified ? (
                        <div className="scale-in" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.75rem',padding:'1rem',background:'rgba(78,205,196,.08)',border:'.5px solid rgba(78,205,196,.35)',clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)'}}>
                          <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(78,205,196,.15)',border:'.5px solid rgba(78,205,196,.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <svg className="check-pop" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round">
                              <polyline points="2,8 6,12 14,4"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{fontSize:'.75rem',fontWeight:700,color:'#4ECDC4',letterSpacing:'.06em'}}>Identity Verified</div>
                            <div style={{fontSize:'.68rem',color:'#4A4540'}}>Proceeding to manifest…</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{display:'flex',gap:'.5rem',justifyContent:'center'}}>
                          {otp.map((digit, i) => (
                            <input
                              key={i}
                              ref={el => { otpRefs.current[i] = el; }}
                              className={`otp-input${digit?' filled':''}${otpError?' error':''}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={e => handleOtpChange(i, e.target.value)}
                              onKeyDown={e => handleOtpKeyDown(i, e)}
                              onPaste={i === 0 ? handleOtpPaste : undefined}
                              autoComplete="one-time-code"
                            />
                          ))}
                        </div>
                      )}

                      {otpError && (
                        <p style={{fontSize:'.68rem',color:'#E85050',marginTop:'.6rem',textAlign:'center',letterSpacing:'.04em'}}>
                          ⚠ {otpError}
                        </p>
                      )}
                    </div>

                    {!otpVerified && (
                      <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                        <span style={{fontSize:'.72rem',color:'#4A4540',fontWeight:600}}>Didn't receive it? </span>
                        {resendCooldown > 0 ? (
                          <span className="fm" style={{fontSize:'.68rem',color:'#3A3530'}}>
                            Resend in {resendCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendLoading}
                            style={{background:'none',border:'none',cursor:'pointer',fontSize:'.72rem',fontWeight:700,color:resendLoading?'#4A4540':'#C8A96E',fontFamily:'Rajdhani,sans-serif',letterSpacing:'.04em',transition:'color .2s',padding:0}}
                            onMouseEnter={e=>{if(!resendLoading) e.currentTarget.style.color='#EDD28A'}}
                            onMouseLeave={e=>{e.currentTarget.style.color=resendLoading?'#4A4540':'#C8A96E'}}
                          >
                            {resendLoading ? 'Sending…' : 'Resend Code →'}
                          </button>
                        )}
                      </div>
                    )}

                    {!otpVerified && (
                      <div style={{display:'flex',gap:'.65rem'}}>
                        <button type="button" className="back-btn" onClick={()=>setStep(2)}>← Back</button>
                        <button type="submit" className="submit-btn" disabled={!otpFilled||loading} style={{flex:1}}>
                          {loading ? (
                            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                              <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                                <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                              </svg>
                              Verifying…
                            </span>
                          ) : (
                            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                              Verify Code
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {/* STEP 4 — Manifest / Confirm */}
                {step === 4 && (
                  <form key="step4" className="slide-in" onSubmit={handleSubmit}>
                    <div style={{background:'rgba(200,169,110,.04)',border:'.5px solid rgba(200,169,110,.12)',clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',padding:'1rem',marginBottom:'1.25rem'}}>
                      <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#4A4540',marginBottom:'.7rem'}}>Registration Manifest</div>
                      {[
                        ['Callsign', username],
                        ['Astral ID', email],
                        ['Cipher', '••••••••'],
                        ['Identity', <span style={{color:'#4ECDC4',display:'flex',alignItems:'center',gap:4}}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"><polyline points="1.5,6 5,9.5 10.5,2.5"/></svg>
                          Verified
                        </span>],
                      ].map(([l,v])=>(
                        <div key={l as string} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.35rem 0',borderBottom:'.5px solid rgba(200,169,110,.07)'}}>
                          <span style={{fontSize:'.72rem',color:'#4A4540',fontWeight:600,letterSpacing:'.08em'}}>{l}</span>
                          <span style={{fontSize:'.78rem',color:'#C8A96E',fontWeight:700,letterSpacing:'.04em'}}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.85rem',background:'rgba(168,85,247,.06)',border:'.5px solid rgba(168,85,247,.2)',clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',marginBottom:'1.25rem'}}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.4">
                        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
                      </svg>
                      <div>
                        <div style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'#A855F7',marginBottom:'.15rem'}}>Starting Rank</div>
                        <div className="fc" style={{fontSize:'.85rem',fontWeight:700,color:'#E5DCC8'}}>Novice Omni-Voyager &nbsp;<span style={{color:'#A855F7'}}>LV.1</span></div>
                      </div>
                      <div style={{marginLeft:'auto',clipPath:'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)',padding:'.2rem .7rem',background:'rgba(168,85,247,.1)',border:'.5px solid rgba(168,85,247,.3)',color:'#A855F7',fontSize:'.6rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase'}}>+50 XP</div>
                    </div>

                    <label style={{display:'flex',alignItems:'flex-start',gap:'.65rem',cursor:'pointer',marginBottom:'1.5rem'}} onClick={()=>setAgreed(!agreed)}>
                      <div className={`cb-box${agreed?' checked':''}`} style={{marginTop:2}}>
                        {agreed && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round">
                            <polyline points="1.5,5 4,7.5 8.5,2"/>
                          </svg>
                        )}
                      </div>
                      <span style={{fontSize:'.75rem',lineHeight:1.6,color:'#6A6058',fontWeight:600}}>
                        I agree to the{' '}
                        <a href="#" onClick={e=>e.stopPropagation()} style={{color:'#C8A96E',textDecoration:'none',transition:'color .2s'}}
                          onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                          onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                        >Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" onClick={e=>e.stopPropagation()} style={{color:'#C8A96E',textDecoration:'none',transition:'color .2s'}}
                          onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                          onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                        >Community Guidelines</a>
                      </span>
                    </label>

                    <div style={{display:'flex',gap:'.65rem'}}>
                      <button type="button" className="back-btn" onClick={()=>setStep(3)}>← Back</button>
                      <button type="submit" className="submit-btn" disabled={!agreed||loading} style={{flex:1}}>
                        {loading ? (
                          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                            <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                              <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                            </svg>
                            Registering…
                          </span>
                        ) : (
                          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                            Begin the Journey
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div style={{textAlign:'center',paddingTop:'1.25rem',marginTop:'1.25rem',borderTop:'.5px solid rgba(200,169,110,.08)'}}>
                  <span style={{fontSize:'.78rem',color:'#4A4540',fontWeight:600}}>Already a Trailblazer? </span>
                  <Link href="/Sign-in" style={{fontSize:'.78rem',color:'#C8A96E',fontWeight:700,textDecoration:'none',letterSpacing:'.04em',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                  >Sign in →</Link>
                </div>

              </div>
            </div>

            {(['tl','tr','bl','br'] as const).map(pos=>(
              <div key={pos} style={{
                position:'absolute',width:14,height:14,
                top:pos.includes('t')?0:'auto',
                bottom:pos.includes('b')?0:'auto',
                left:pos.includes('l')?0:'auto',
                right:pos.includes('r')?0:'auto',
                borderTop:pos.includes('t')?'1.5px solid #C8A96E':'none',
                borderBottom:pos.includes('b')?'1.5px solid #C8A96E':'none',
                borderLeft:pos.includes('l')?'1.5px solid #C8A96E':'none',
                borderRight:pos.includes('r')?'1.5px solid #C8A96E':'none',
                pointerEvents:'none',
              }}/>
            ))}
          </div>
        </main>

        <footer style={{position:'relative',zIndex:1,borderTop:'.5px solid rgba(200,169,110,.1)',padding:'1.25rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
          <div className="fc" style={{fontSize:'.8rem',fontWeight:700,color:'#3A3530'}}>Trailblazer Hub</div>
          <div style={{display:'flex',gap:'1.5rem'}}>
            {['Privacy','Terms','Guidelines'].map(l=>(
              <a key={l} href="#" style={{color:'#3A3530',textDecoration:'none',fontSize:'.65rem',fontWeight:600,letterSpacing:'.08em',transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color='#C8A96E')}
                onMouseLeave={e=>(e.currentTarget.style.color='#3A3530')}
              >{l}</a>
            ))}
          </div>
          <div className="fm" style={{fontSize:'.6rem',color:'#3A3530'}}>© 2025 · v3.2</div>
        </footer>

      </div>
    </>
  );
}