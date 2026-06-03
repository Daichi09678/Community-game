'use client';
import { useState } from 'react';
import Link from 'next/link';

const CLIP = {
  hero:    'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
  navpill: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
  card:    'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)',
  input:   'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
  tag:     'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)',
  eyebrow: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
};

export default function SignIn() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focusField, setFocus]  = useState<string|null>(null);
  const [loading, setLoading]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // API call untuk sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Penting untuk menerima cookie
        body: JSON.stringify({ 
          email, 
          password, 
          rememberMe 
        }),
      });

      const result = await response.json();

      if (result.error) {
        alert(result.error);
      } else {
        // Login berhasil, redirect ke dashboard
        window.location.href = '/UserHoyo/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const borderColor = (field: string) =>
    focusField === field ? 'rgba(200,169,110,.55)' : 'rgba(200,169,110,.15)';
  const shadowColor = (field: string) =>
    focusField === field ? '0 0 0 2px rgba(200,169,110,.1)' : 'none';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#050810;color:#E5DCC8;font-family:'Rajdhani',sans-serif;overflow-x:hidden;min-height:100vh}

        /* Starfield */
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

        /* Ambient glow behind card */
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

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .55s ease both}
        .fade-up-1{animation-delay:.05s}
        .fade-up-2{animation-delay:.12s}
        .fade-up-3{animation-delay:.19s}
        .fade-up-4{animation-delay:.26s}
        .fade-up-5{animation-delay:.33s}
        .fade-up-6{animation-delay:.40s}

        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{animation:spin .8s linear infinite;display:inline-block}

        /* Input base */
        .field-input{
          width:100%;background:rgba(200,169,110,.04);
          color:#E5DCC8;font-family:'Rajdhani',sans-serif;
          font-size:.9rem;font-weight:600;letter-spacing:.04em;
          border:none;outline:none;padding:.75rem 1rem;
          transition:background .2s;
        }
        .field-input::placeholder{color:#4A4540}
        .field-input:focus{background:rgba(200,169,110,.07)}

        /* Checkbox custom */
        .cb-wrap{display:flex;align-items:center;gap:.6rem;cursor:pointer;user-select:none}
        .cb-box{
          width:16px;height:16px;flex-shrink:0;
          background:rgba(200,169,110,.06);
          border:.5px solid rgba(200,169,110,.25);
          display:flex;align-items:center;justify-content:center;
          transition:background .2s,border-color .2s;
          clip-path:polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%);
        }
        .cb-box.checked{background:rgba(200,169,110,.2);border-color:rgba(200,169,110,.6)}

        /* Divider */
        .divider{display:flex;align-items:center;gap:.75rem;margin:1.5rem 0}
        .divider::before,.divider::after{content:'';flex:1;height:.5px;background:rgba(200,169,110,.1)}

        /* Social btn */
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

        /* Submit btn */
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
        .submit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}

        /* Nav link */
        .nav-link{
          position:relative;color:#8A8070;text-decoration:none;
          font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
          transition:color .2s;padding-bottom:2px;
        }
        .nav-link::after{
          content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
          background:#C8A96E;transform:scaleX(0);transform-origin:left;transition:transform .25s ease;
        }
        .nav-link:hover{color:#E5DCC8}
        .nav-link:hover::after{transform:scaleX(1)}

        /* Corner accents */
        .corner-tl,.corner-tr,.corner-bl,.corner-br{
          position:absolute;width:14px;height:14px;pointer-events:none;
        }
        .corner-tl{top:-1px;left:-1px;border-top:1.5px solid #C8A96E;border-left:1.5px solid #C8A96E}
        .corner-tr{top:-1px;right:-1px;border-top:1.5px solid #C8A96E;border-right:1.5px solid #C8A96E}
        .corner-bl{bottom:-1px;left:-1px;border-bottom:1.5px solid #C8A96E;border-left:1.5px solid #C8A96E}
        .corner-br{bottom:-1px;right:-1px;border-bottom:1.5px solid #C8A96E;border-right:1.5px solid #C8A96E}

        /* Scanline overlay on card */
        .scanlines{
          position:absolute;inset:0;pointer-events:none;z-index:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px);
        }

        /* Eye icon btn */
        .eye-btn{
          background:none;border:none;cursor:pointer;padding:.5rem .75rem;
          color:#4A4540;transition:color .2s;display:flex;align-items:center;
        }
        .eye-btn:hover{color:#C8A96E}

        .tg{background:linear-gradient(90deg,#7A5A24 0%,#EDD28A 45%,#C8A96E 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      `}</style>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column'}}>

        {/* NAV */}
        <nav style={{position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.9rem 2.5rem',background:'rgba(5,8,16,.92)',backdropFilter:'blur(20px)',borderBottom:'.5px solid rgba(200,169,110,.13)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',opacity:1,transition:'opacity .2s'}}
            onMouseEnter={e=>(e.currentTarget.style.opacity='.8')}
            onMouseLeave={e=>(e.currentTarget.style.opacity='1')}
          >
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
          <div style={{display:'flex',gap:'.6rem'}}>
            <span style={{color:'#4A4540',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',alignSelf:'center',marginRight:'.25rem'}}>No account?</span>
            <Link href="/Sign-up">
              <button className="fr" style={{clipPath:CLIP.navpill,padding:'.45rem 1.3rem',background:'linear-gradient(135deg,#7A5A24,#C8A96E)',border:'none',color:'#060911',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',transition:'opacity .2s',fontFamily:'Rajdhani,sans-serif'}}
                onMouseEnter={e=>(e.currentTarget.style.opacity='.85')}
                onMouseLeave={e=>(e.currentTarget.style.opacity='1')}
              >Sign Up</button>
            </Link>
          </div>
        </nav>

        {/* MAIN */}
        <main style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem'}}>

          {/* Card */}
          <div className="fade-up" style={{width:'100%',maxWidth:440,position:'relative'}}>

            {/* Glow ring behind card */}
            <div style={{position:'absolute',inset:-1,background:'transparent',border:'.5px solid rgba(200,169,110,.1)',clipPath:CLIP.card,pointerEvents:'none',zIndex:0}}/>
            <div style={{position:'absolute',top:-30,left:'50%',transform:'translateX(-50%)',width:320,height:80,background:'radial-gradient(ellipse,rgba(200,169,110,.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

            <div style={{position:'relative',zIndex:1,background:'#0B1121',clipPath:CLIP.card,border:'.5px solid rgba(200,169,110,.18)',overflow:'hidden',padding:'2.5rem 2.25rem 2.25rem'}}>

              {/* Scanlines */}
              <div className="scanlines"/>

              {/* Content above scanlines */}
              <div style={{position:'relative',zIndex:1}}>

                {/* Header */}
                <div className="fade-up fade-up-1" style={{textAlign:'center',marginBottom:'2rem'}}>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'1.1rem'}}>
                    <div style={{width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(200,169,110,.08)',border:'.5px solid rgba(200,169,110,.2)',clipPath:'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)'}}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="1.4">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{clipPath:CLIP.eyebrow,display:'inline-flex',alignItems:'center',gap:8,padding:'.3rem 1rem',border:'.5px solid rgba(78,205,196,.25)',background:'rgba(78,205,196,.05)',color:'#4ECDC4',fontSize:'.62rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:'.85rem'}}>
                    <span className="blink" style={{width:4,height:4,background:'#4ECDC4',borderRadius:'50%',display:'inline-block'}}/>
                    Secure Access Portal
                  </div>
                  <h1 className="fc tg" style={{fontSize:'1.55rem',fontWeight:700,lineHeight:1.15,marginBottom:'.4rem'}}>Welcome Back</h1>
                  <p style={{fontSize:'.82rem',color:'#4A4540',lineHeight:1.6}}>Sign in to your Trailblazer account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                  {/* Email */}
                  <div className="fade-up fade-up-2" style={{marginBottom:'1rem'}}>
                    <label style={{display:'block',fontSize:'.65rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058',marginBottom:'.45rem'}}>
                      <span className="fc">Astral ID</span> &nbsp;/&nbsp; Email
                    </label>
                    <div style={{clipPath:CLIP.input,border:`.5px solid ${borderColor('email')}`,boxShadow:shadowColor('email'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                      <svg style={{margin:'0 0 0 .85rem',flexShrink:0,transition:'stroke .2s'}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='email'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                        <rect x="2" y="5" width="16" height="12" rx="1.5"/>
                        <path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                      </svg>
                      <input
                        className="field-input"
                        type="email"
                        placeholder="trailblazer@galaxy.io"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        onFocus={()=>setFocus('email')}
                        onBlur={()=>setFocus(null)}
                        style={{paddingLeft:'.6rem'}}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="fade-up fade-up-3" style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.45rem'}}>
                      <label style={{display:'block',fontSize:'.65rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#6A6058'}}>
                        <span className="fc">Cipher</span> &nbsp;/&nbsp; Password
                      </label>
                      <a href="/forget-password" style={{fontSize:'.65rem',color:'#C8A96E',textDecoration:'none',letterSpacing:'.06em',fontWeight:600,opacity:.75,transition:'opacity .2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.opacity='1')}
                        onMouseLeave={e=>(e.currentTarget.style.opacity='.75')}
                      >Forget password?</a>
                    </div>
                    <div style={{clipPath:CLIP.input,border:`.5px solid ${borderColor('password')}`,boxShadow:shadowColor('password'),background:'rgba(200,169,110,.04)',transition:'border-color .2s,box-shadow .2s',display:'flex',alignItems:'center'}}>
                      <svg style={{margin:'0 0 0 .85rem',flexShrink:0}} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={focusField==='password'?'#C8A96E':'#4A4540'} strokeWidth="1.4">
                        <rect x="4" y="9" width="12" height="9" rx="1"/>
                        <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/>
                        <circle cx="10" cy="14" r="1.2" fill={focusField==='password'?'#C8A96E':'#4A4540'}/>
                      </svg>
                      <input
                        className="field-input"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        onFocus={()=>setFocus('password')}
                        onBlur={()=>setFocus(null)}
                        style={{paddingLeft:'.6rem'}}
                        required
                      />
                      <button type="button" className="eye-btn" onClick={()=>setShowPass(!showPass)} aria-label={showPass?'Hide password':'Show password'}>
                        {showPass ? (
                          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/>
                            <circle cx="10" cy="10" r="2.5"/>
                            <line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" strokeLinecap="round"/>
                            <circle cx="10" cy="10" r="2.5"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="fade-up fade-up-4" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.6rem'}}>
                    <label className="cb-wrap" onClick={()=>setRememberMe(!rememberMe)}>
                      <div className={`cb-box${rememberMe?' checked':''}`}>
                        {rememberMe && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round">
                            <polyline points="1.5,5 4,7.5 8.5,2"/>
                          </svg>
                        )}
                      </div>
                      <span style={{fontSize:'.75rem',fontWeight:600,color:'#6A6058',letterSpacing:'.04em'}}>Remember this terminal</span>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="fade-up fade-up-4">
                    <button type="submit" className="submit-btn" disabled={loading} style={{width:'100%',padding:'.85rem'}}>
                      {loading ? (
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          <svg className="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#060911" strokeWidth="2">
                            <path d="M7 1a6 6 0 016 6" strokeLinecap="round"/>
                          </svg>
                          Authenticating…
                        </span>
                      ) : (
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          Ready To Journey
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#060911" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 8h10M9 4l4 4-4 4"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="fade-up fade-up-5 divider">
                  <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#3A3530'}}>or continue with</span>
                </div>

                {/* Social logins */}
            <div className="fade-up fade-up-5" style={{marginBottom:'1.75rem'}}>
          <button className="social-btn">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
          <path d="M18.17 10.2c0-.65-.06-1.27-.16-1.87H10v3.54h4.59a3.93 3.93 0 01-1.7 2.58v2.14h2.75c1.61-1.48 2.53-3.66 2.53-6.4z" fill="#4285F4"/>
          <path d="M10 18.5c2.3 0 4.22-.76 5.63-2.06l-2.75-2.14c-.76.51-1.73.81-2.88.81-2.21 0-4.09-1.5-4.76-3.5H2.4v2.21A8.5 8.5 0 0010 18.5z" fill="#34A853"/>
        <path d="M5.24 11.61A5.1 5.1 0 015.24 8.4V6.19H2.4A8.5 8.5 0 002.4 13.8l2.84-2.19z" fill="#FBBC05"/>
          <path d="M10 4.5c1.24 0 2.36.43 3.24 1.27l2.43-2.43A8.5 8.5 0 002.4 6.19l2.84 2.21C5.91 6 7.79 4.5 10 4.5z" fill="#EA4335"/>
          </svg>
            Google
        </button>
            </div>

                {/* Sign up link */}
                <div className="fade-up fade-up-6" style={{textAlign:'center',paddingTop:'1.25rem',borderTop:'.5px solid rgba(200,169,110,.08)'}}>
                  <span style={{fontSize:'.78rem',color:'#4A4540',fontWeight:600}}>New to the Express? </span>
                  <Link href="/Sign-up" style={{fontSize:'.78rem',color:'#C8A96E',fontWeight:700,textDecoration:'none',letterSpacing:'.04em',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                  >Create an account →</Link>
                </div>

              </div>{/* end zIndex wrapper */}
            </div>{/* end card */}

            {/* Corner accents outside the clip-path card */}
            <div className="corner-tl" style={{position:'absolute',top:0,left:0}}/>
            <div className="corner-tr" style={{position:'absolute',top:0,right:0}}/>
            <div className="corner-bl" style={{position:'absolute',bottom:0,left:0}}/>
            <div className="corner-br" style={{position:'absolute',bottom:0,right:0}}/>

          </div>{/* end card wrapper */}
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