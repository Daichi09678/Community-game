'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const OTP_LENGTH = 6;

type Step = 1 | 2 | 3;

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [focusField, setFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // New password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ---------- Password strength ----------
  const passwordStrength = () => {
    if (!newPassword) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    if (score <= 1) return { score, label: 'Weak',   color: '#E85050' };
    if (score <= 3) return { score, label: 'Fair',   color: '#C8A96E' };
    return              { score, label: 'Strong', color: '#4ECDC4' };
  };

  const pwStrength = passwordStrength();
  const passwordsMatch    = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const otpFilled = otp.every(d => d !== '');

  // ---------- STEP 1: Send OTP ----------
  const handleSendOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ✅ Tambahkan validasi email sebelum kirim
  if (!email || !email.includes('@') || !email.includes('.')) {
    setEmailError('Masukkan email yang valid');
    return;
  }
  
  setLoading(true);
  setEmailError('');
  
  try {
    // ✅ Cek email terdaftar dulu
    const checkRes = await fetch('/api/auth/check-email-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const checkResult = await checkRes.json();
    
    if (checkResult.error) {
      setEmailError(checkResult.error);
      setLoading(false);
      return;
    }
    
    // Kirim OTP
    const res = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }), // ✅ trim email
    });
    
    const result = await res.json();
    
    if (result.error) {
      setEmailError(result.error);
      return;
    }
    
    if (result.devOTP) console.log('Dev OTP:', result.devOTP);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setOtpVerified(false);
    setResendCooldown(60);
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
    
  } catch (error) {
    console.error('Error:', error);
    setEmailError('Gagal mengirim kode. Coba lagi nanti.');
  } finally {
    setLoading(false);
  }
};

  // ---------- OTP Handlers ----------
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp]; next[index] = digit;
    setOtp(next); setOtpError('');
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (otp[index]) { const n=[...otp];n[index]='';setOtp(n); }
      else if (index > 0) { otpRefs.current[index-1]?.focus(); const n=[...otp];n[index-1]='';setOtp(n); }
    } else if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index-1]?.focus();
    else if (e.key === 'ArrowRight' && index < OTP_LENGTH-1) otpRefs.current[index+1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d,i)=>{next[i]=d;});
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH-1)]?.focus();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    try {
      const res = await fetch('/api/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (result.error) { alert(result.error); }
      else {
        if (result.devOTP) console.log('New OTP:', result.devOTP);
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError(''); setResendCooldown(60);
        otpRefs.current[0]?.focus();
      }
    } catch { alert('Failed to resend'); }
    finally { setResendLoading(false); }
  };

  // ---------- STEP 3: Reset Password (OTP + New Password langsung) ----------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { 
      setOtpError('Please enter all 6 digits.'); 
      return; 
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forget-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code, 
          newPassword 
        }),
      });
      const result = await res.json();
      
      if (result.error) { 
        setOtpError(result.error); 
      } else if (result.success) {
        setResetSuccess(true);
        // Redirect ke dashboard setelah 2 detik
        setTimeout(() => {
          router.push('/UserHoyo/dashboard');
        }, 2000);
      }
    } catch { 
      setOtpError('Reset failed. Please try again.'); 
    } finally { 
      setLoading(false); 
    }
  };

  // ---------- UI Helpers ----------
  const borderColor = (field: string) =>
    focusField === field ? 'rgba(200,169,110,.55)' : 'rgba(200,169,110,.15)';
  const shadowColor = (field: string) =>
    focusField === field ? '0 0 0 2px rgba(200,169,110,.1)' : 'none';

  const steps = ['Locate', 'Verify', 'Reforge'];

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
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}

        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .slide-in{animation:slideIn .35s ease both}

        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{animation:spin .8s linear infinite;display:inline-block}

        @keyframes scaleIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
        .scale-in{animation:scaleIn .4s cubic-bezier(.34,1.56,.64,1) both}

        @keyframes checkPop{0%{transform:scale(0) rotate(-10deg);opacity:0}70%{transform:scale(1.2) rotate(3deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        .check-pop{animation:checkPop .5s cubic-bezier(.34,1.56,.64,1) both}

        @keyframes floatGlow{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(-6px);opacity:1}}
        .float-glow{animation:floatGlow 3.5s ease-in-out infinite}

        @keyframes successPulse{0%{box-shadow:0 0 0 0 rgba(78,205,196,.4)}70%{box-shadow:0 0 0 16px rgba(78,205,196,0)}100%{box-shadow:0 0 0 0 rgba(78,205,196,0)}}
        .success-pulse{animation:successPulse 1.5s ease-out 2}

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

        .eye-btn{
          background:none;border:none;cursor:pointer;padding:.5rem .75rem;
          color:#4A4540;transition:color .2s;display:flex;align-items:center;
        }
        .eye-btn:hover{color:#C8A96E}

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
        .otp-input:focus{background:rgba(200,169,110,.1);border-color:rgba(200,169,110,.55);box-shadow:0 0 0 2px rgba(200,169,110,.1)}
        .otp-input.filled{border-color:rgba(200,169,110,.4)}
        .otp-input.error{border-color:rgba(232,80,80,.5);background:rgba(232,80,80,.06)}
        .otp-input.success{border-color:rgba(78,205,196,.5);background:rgba(78,205,196,.06)}

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

        .divider{display:flex;align-items:center;gap:.75rem;margin:1.4rem 0}
        .divider::before,.divider::after{content:'';flex:1;height:.5px;background:rgba(200,169,110,.1)}

        .nav-logo{transition:opacity .2s}
        .nav-logo:hover{opacity:.8}
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
            <span style={{color:'#4A4540',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginRight:'.25rem'}}>Remembered it?</span>
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

          {/* Left info panel */}
          <div className="fade-up d1" style={{width:'100%',maxWidth:260,display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            <div>
              <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'#4ECDC4',marginBottom:'.5rem'}}>Account Recovery</div>
              <h2 className="fc" style={{fontSize:'1.05rem',fontWeight:700,lineHeight:1.35,color:'#E5DCC8'}}>Lost in the<br/><span className="tg">Astral Express?</span></h2>
              <p style={{fontSize:'.75rem',color:'#4A4540',lineHeight:1.7,marginTop:'.65rem'}}>
                Don't worry, Trailblazer. We'll send a verification cipher to your Astral ID to restore access to your account.
              </p>
            </div>

            {/* Steps info */}
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {[
                {n:'01', c:'#C8A96E', t:'Locate Astral ID', d:'Enter your registered email address'},
                {n:'02', c:'#4ECDC4', t:'Verify Cipher', d:'Enter the 6-digit code we send you'},
                {n:'03', c:'#A855F7', t:'Reforge Password', d:'Set your new secret passphrase'},
              ].map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'.65rem',padding:'.75rem .85rem',background:step-1===i?'rgba(200,169,110,.07)':'rgba(200,169,110,.03)',border:`.5px solid ${step-1===i?'rgba(200,169,110,.25)':'rgba(200,169,110,.08)'}`,clipPath:'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',transition:'background .3s,border-color .3s'}}>
                  <div className="fm" style={{fontSize:'.55rem',fontWeight:700,color:step-1===i?s.c:'#3A3530',minWidth:18,paddingTop:2,transition:'color .3s'}}>{s.n}</div>
                  <div>
                    <div className="fc" style={{fontSize:'.7rem',fontWeight:600,color:step-1===i?'#E5DCC8':'#3A3530',marginBottom:'.1rem',transition:'color .3s'}}>{s.t}</div>
                    <div style={{fontSize:'.68rem',color:step-1===i?'#4A4540':'#2A2520',lineHeight:1.5,transition:'color .3s'}}>{s.d}</div>
                  </div>
                  {step > i+1 && (
                    <div style={{marginLeft:'auto',flexShrink:0}}>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round">
                        <polyline points="2,7 5.5,10.5 12,3"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Warning note */}
            <div style={{padding:'.75rem',background:'rgba(232,80,80,.04)',border:'.5px solid rgba(232,80,80,.12)',clipPath:'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',display:'flex',gap:'.6rem',alignItems:'flex-start'}}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#E85050" strokeWidth="1.3" style={{flexShrink:0,marginTop:2}}>
                <path d="M8 1L15 14H1L8 1z" strokeLinejoin="round"/>
                <line x1="8" y1="6" x2="8" y2="9" strokeLinecap="round"/>
                <circle cx="8" cy="11.5" r=".5" fill="#E85050"/>
              </svg>
              <p style={{fontSize:'.68rem',color:'#6A4040',lineHeight:1.6}}>
                If you don't receive the email, check your spam folder or contact support.
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="fade-up d2" style={{width:'100%',maxWidth:420,position:'relative'}}>
            <div style={{position:'absolute',inset:-1,background:'transparent',border:'.5px solid rgba(200,169,110,.1)',clipPath:'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',pointerEvents:'none',zIndex:0}}/>
            <div style={{position:'absolute',top:-30,left:'50%',transform:'translateX(-50%)',width:300,height:80,background:'radial-gradient(ellipse,rgba(200,169,110,.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

            <div style={{position:'relative',zIndex:1,background:'#0B1121',clipPath:'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',border:'.5px solid rgba(200,169,110,.18)',overflow:'hidden',padding:'2.25rem 2.25rem 2rem'}}>
              <div className="scanlines"/>

              <div style={{position:'relative',zIndex:1}}>

                {/* Header */}
                <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'1rem'}}>
                    <div className="float-glow" style={{width:52,height:52,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(200,169,110,.08)',border:'.5px solid rgba(200,169,110,.2)',clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="1.4">
                        <rect x="3" y="11" width="18" height="11" rx="1.5"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1.5" fill="rgba(200,169,110,0.4)"/>
                        <line x1="12" y1="17.5" x2="12" y2="19" stroke="#C8A96E" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{clipPath:'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',display:'inline-flex',alignItems:'center',gap:8,padding:'.3rem 1rem',border:'.5px solid rgba(200,169,110,.25)',background:'rgba(200,169,110,.05)',color:'#C8A96E',fontSize:'.62rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:'.8rem'}}>
                    <span className="blink" style={{width:4,height:4,background:'#C8A96E',borderRadius:'50%',display:'inline-block'}}/>
                    Cipher Restoration Protocol
                  </div>
                  <h1 className="fc tg" style={{fontSize:'1.45rem',fontWeight:700,lineHeight:1.15,marginBottom:'.35rem'}}>Forgot Password</h1>
                  <p style={{fontSize:'.8rem',color:'#4A4540',lineHeight:1.6}}>Restore access to your Astral account</p>
                </div>

                {/* Step indicator */}
                <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:'1.75rem'}}>
                  {steps.map((s,i) => {
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

                {/* ── STEP 1 — Locate Email ── */}
                {step === 1 && (
                  <form key="step1" className="slide-in" onSubmit={handleSendOTP}>
                    <div style={{marginBottom:'1.5rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">Astral ID</span> &nbsp;/&nbsp; Registered Email
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${borderColor('email')}`,boxShadow:shadowColor('email'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='email'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="2" y="5" width="16" height="12" rx="1.5"/><path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                        </svg>
                        <input className="field-input" type="email" placeholder="trailblazer@galaxy.io" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} required/>
                        {email.includes('@') && email.includes('.') && (
                          <div style={{padding:'0 .75rem',flexShrink:0}}>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"><polyline points="2,7 5.5,10.5 12,3"/></svg>
                          </div>
                        )}
                      </div>
                      {emailError && (
                        <p style={{fontSize:'.65rem',color:'#E85050',marginTop:'.35rem',letterSpacing:'.04em'}}>⚠ {emailError}</p>
                      )}
                      <p style={{fontSize:'.65rem',color:'#4A4540',marginTop:'.35rem',letterSpacing:'.04em'}}>A 6-digit cipher will be dispatched to this address.</p>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? (
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                            <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                          </svg>
                          Dispatching…
                        </span>
                      ) : (
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          Send Recovery Code
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                        </span>
                      )}
                    </button>

                    <div className="divider">
                      <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#3A3530'}}>or</span>
                    </div>

                    <div style={{textAlign:'center'}}>
                      <span style={{fontSize:'.78rem',color:'#4A4540',fontWeight:600}}>Back to </span>
                      <Link href="/Sign-in" style={{fontSize:'.78rem',color:'#C8A96E',fontWeight:700,textDecoration:'none',letterSpacing:'.04em',transition:'color .2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                        onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                      >Sign In →</Link>
                    </div>
                  </form>
                )}

                {/* ── STEP 2 — Verify OTP ── */}
                {step === 2 && !resetSuccess && (
                  <form key="step2" className="slide-in" onSubmit={(e) => e.preventDefault()}>
                    {/* Info box */}
                    <div style={{padding:'1rem',background:'rgba(78,205,196,.04)',border:'.5px solid rgba(78,205,196,.18)',clipPath:'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',marginBottom:'1.5rem',display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                      <div style={{flexShrink:0,marginTop:2}}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#4ECDC4" strokeWidth="1.4">
                          <rect x="2" y="5" width="16" height="12" rx="1.5"/><path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#4ECDC4',marginBottom:'.3rem'}}>Transmission Sent</div>
                        <p style={{fontSize:'.75rem',color:'#6A6058',lineHeight:1.6}}>
                          Recovery cipher dispatched to{' '}
                          <span style={{color:'#C8A96E',fontWeight:700}}>{email}</span>
                        </p>
                      </div>
                    </div>

                    {/* OTP inputs */}
                    <div style={{marginBottom:'1rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.75rem'}}>
                        <span className="fc">Cipher Code</span> &nbsp;/&nbsp; 6-Digit Key
                      </label>

                      <div style={{display:'flex',gap:'.5rem',justifyContent:'center'}}>
                        {otp.map((digit,i) => (
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

                      {otpError && (
                        <p style={{fontSize:'.68rem',color:'#E85050',marginTop:'.6rem',textAlign:'center',letterSpacing:'.04em'}}>⚠ {otpError}</p>
                      )}
                    </div>

                    {/* Resend */}
                    <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                      <span style={{fontSize:'.72rem',color:'#4A4540',fontWeight:600}}>Didn't receive it? </span>
                      {resendCooldown > 0 ? (
                        <span className="fm" style={{fontSize:'.68rem',color:'#3A3530'}}>Resend in {resendCooldown}s</span>
                      ) : (
                        <button type="button" onClick={handleResend} disabled={resendLoading}
                          style={{background:'none',border:'none',cursor:'pointer',fontSize:'.72rem',fontWeight:700,color:resendLoading?'#4A4540':'#C8A96E',fontFamily:'Rajdhani,sans-serif',letterSpacing:'.04em',transition:'color .2s',padding:0}}
                          onMouseEnter={e=>{if(!resendLoading) e.currentTarget.style.color='#EDD28A'}}
                          onMouseLeave={e=>{e.currentTarget.style.color=resendLoading?'#4A4540':'#C8A96E'}}
                        >{resendLoading ? 'Sending…' : 'Resend Code →'}</button>
                      )}
                    </div>

                    <div style={{display:'flex',gap:'.65rem'}}>
                      <button type="button" className="back-btn" onClick={() => setStep(1)}>← Back</button>
                      <button 
                        type="button" 
                        className="submit-btn" 
                        disabled={!otpFilled} 
                        style={{flex:1}}
                        onClick={() => setStep(3)}
                      >
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          Continue
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                        </span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP 3 — Reforge Password ── */}
                {step === 3 && !resetSuccess && (
                  <form key="step3" className="slide-in" onSubmit={handleResetPassword}>

                    <div style={{marginBottom:'1rem'}}>
                      <label style={{display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.4rem'}}>
                        <span className="fc">New Cipher</span> &nbsp;/&nbsp; New Password
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${borderColor('newpass')}`,boxShadow:shadowColor('newpass'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='newpass'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="4" y="9" width="12" height="9" rx="1"/><path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill={focusField==='newpass'?'#C8A96E':'#4A4540'}/>
                        </svg>
                        <input className="field-input" type={showNewPass?'text':'password'} placeholder="Min. 8 characters" value={newPassword} onChange={e=>setNewPassword(e.target.value)} onFocus={()=>setFocus('newpass')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} minLength={8} required/>
                        <button type="button" className="eye-btn" onClick={()=>setShowNewPass(!showNewPass)}>
                          {showNewPass
                            ? <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/></svg>
                          }
                        </button>
                      </div>

                      {newPassword.length > 0 && (
                        <div style={{marginTop:'.55rem'}}>
                          <div style={{display:'flex',gap:3,marginBottom:'.3rem'}}>
                            {[1,2,3,4,5].map(i=>(
                              <div key={i} style={{flex:1,height:2,background:i<=pwStrength.score?pwStrength.color:'rgba(200,169,110,.1)',transition:'background .3s',clipPath:'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)'}}/>
                            ))}
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                              {[['8+ chars',newPassword.length>=8],['Uppercase',/[A-Z]/.test(newPassword)],['Number',/[0-9]/.test(newPassword)],['Symbol',/[^A-Za-z0-9]/.test(newPassword)]].map(([l,ok])=>(
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
                        <span className="fc">Confirm</span> &nbsp;/&nbsp; Repeat New Password
                      </label>
                      <div style={{clipPath:'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',border:`.5px solid ${passwordsMismatch?'rgba(232,80,80,.45)':passwordsMatch?'rgba(78,205,196,.45)':borderColor('confpass')}`,boxShadow:shadowColor('confpass'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                        <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={passwordsMismatch?'#E85050':passwordsMatch?'#4ECDC4':focusField==='confpass'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                          <rect x="4" y="9" width="12" height="9" rx="1"/><path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill={passwordsMismatch?'#E85050':passwordsMatch?'#4ECDC4':focusField==='confpass'?'#C8A96E':'#4A4540'}/>
                        </svg>
                        <input className="field-input" type={showConfPass?'text':'password'} placeholder="Repeat your new password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} onFocus={()=>setFocus('confpass')} onBlur={()=>setFocus(null)} style={{paddingLeft:'.6rem'}} required/>
                        <button type="button" className="eye-btn" onClick={()=>setShowConfPass(!showConfPass)}>
                          {showConfPass
                            ? <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5"/></svg>
                          }
                        </button>
                      </div>
                      {passwordsMismatch && <p style={{fontSize:'.65rem',color:'#E85050',marginTop:'.35rem',letterSpacing:'.04em'}}>Passwords do not match.</p>}
                      {passwordsMatch   && <p style={{fontSize:'.65rem',color:'#4ECDC4',marginTop:'.35rem',letterSpacing:'.04em'}}>Passwords match.</p>}
                    </div>

                    <div style={{display:'flex',gap:'.65rem'}}>
                      <button type="button" className="back-btn" onClick={()=>setStep(2)}>← Back</button>
                      <button type="submit" className="submit-btn" disabled={!passwordsMatch||loading} style={{flex:1}}>
                        {loading ? (
                          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                            <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                              <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                            </svg>
                            Reforging…
                          </span>
                        ) : (
                          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                            Reforge Password
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── SUCCESS STATE ── */}
                {resetSuccess && (
                  <div className="slide-in" style={{textAlign:'center',padding:'1rem 0'}}>
                    <div style={{display:'flex',justifyContent:'center',marginBottom:'1.25rem'}}>
                      <div className="success-pulse" style={{width:60,height:60,borderRadius:'50%',background:'rgba(78,205,196,.12)',border:'.5px solid rgba(78,205,196,.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg className="check-pop" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="#4ECDC4" strokeWidth="2.2" strokeLinecap="round">
                          <polyline points="4,14 10,20 24,8"/>
                        </svg>
                      </div>
                    </div>

                    <div style={{clipPath:'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',display:'inline-flex',alignItems:'center',gap:8,padding:'.3rem 1rem',border:'.5px solid rgba(78,205,196,.35)',background:'rgba(78,205,196,.07)',color:'#4ECDC4',fontSize:'.62rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:'1rem'}}>
                      <span style={{width:4,height:4,background:'#4ECDC4',borderRadius:'50%',display:'inline-block'}}/>
                      Redirecting to Dashboard...
                    </div>

                    <h2 className="fc" style={{fontSize:'1.2rem',fontWeight:700,color:'#E5DCC8',marginBottom:'.5rem',lineHeight:1.3}}>
                      Password <span className="tg">Restored</span>
                    </h2>
                    <p style={{fontSize:'.8rem',color:'#4A4540',lineHeight:1.7,marginBottom:'1.75rem'}}>
                      Your account has been secured with a new cipher. Redirecting you to your dashboard...
                    </p>

                    <div className="fm" style={{fontSize:'.68rem',color:'#4A4540'}}>
                      <span className="spinner" style={{width:12,height:12,marginRight:8}}>◌</span>
                      Please wait a moment...
                    </div>
                  </div>
                )}

                {/* Sign in link (non-success steps) */}
                {!resetSuccess && step !== 3 && (
                  <div style={{textAlign:'center',paddingTop:'1.25rem',marginTop:'1.25rem',borderTop:'.5px solid rgba(200,169,110,.08)'}}>
                    <span style={{fontSize:'.78rem',color:'#4A4540',fontWeight:600}}>Remembered your password? </span>
                    <Link href="/Sign-in" style={{fontSize:'.78rem',color:'#C8A96E',fontWeight:700,textDecoration:'none',letterSpacing:'.04em',transition:'color .2s'}}
                      onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                      onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                    >Sign in →</Link>
                  </div>
                )}

              </div>
            </div>

            {/* Corner accents */}
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

        {/* FOOTER */}
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