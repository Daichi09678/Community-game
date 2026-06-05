'use client';

import { useState, useRef } from 'react';
import { clipBtn, clipBadge, clipCard } from './clipStyles';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(5,8,16,0.85)] backdrop-blur-[6px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#0C1220] border border-[rgba(200,169,110,0.2)]" style={clipCard}>
        {children}
      </div>
    </div>
  );
}

export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const pwStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = pwStrength(newPw);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#E05C7A', '#C8A96E', '#4ECDC4', '#6DD18A'][strength];

  const handleFormSubmit = () => {
    setError('');
    if (!currentPw) return setError('Enter your current password.');
    if (newPw.length < 8) return setError('New password must be at least 8 characters.');
    if (newPw !== confirmPw) return setError('Passwords do not match.');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('verify'); }, 1000);
  };

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) inputRefs[i + 1].current?.focus();
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputRefs[i - 1].current?.focus();
  };

  const handleVerify = () => {
    if (code.join('').length < 6) return setError('Enter the full 6-digit code.');
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('success'); }, 1200);
  };

  const resetAndClose = () => {
    setStep('form'); setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setCode(['', '', '', '', '', '']); setError(''); setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={resetAndClose}>
      <div className="px-6 py-5 border-b border-[rgba(200,169,110,0.15)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step === 'verify' && (
            <button onClick={() => { setError(''); setStep('form'); }} className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.85rem] mr-1 bg-transparent border-none cursor-pointer">←</button>
          )}
          <div>
            <div className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC]">
              {step === 'form' ? 'Change Password' : step === 'verify' ? 'Verify Identity' : 'Password Updated'}
            </div>
            <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">
              {step === 'form' ? 'Step 1 of 2 · New credentials' : step === 'verify' ? 'Step 2 of 2 · Email verification' : 'Security updated'}
            </div>
          </div>
        </div>
        <button onClick={resetAndClose} className="text-[#5A5248] hover:text-[#E05C7A] transition-colors text-[1.1rem] leading-none bg-transparent border-none cursor-pointer">✕</button>
      </div>

      <div className="p-6">
        {step === 'form' && (
          <div className="space-y-4">
            <div className="flex gap-1 mb-5">
              <div className="h-[2px] flex-1 bg-[#C8A96E]" style={{ clipPath: 'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)' }} />
              <div className="h-[2px] flex-1 bg-[rgba(200,169,110,0.2)]" style={{ clipPath: 'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)' }} />
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Current Password</div>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password"
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all" style={clipBadge} />
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">New Password</div>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters"
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all" style={clipBadge} />
              {newPw && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-[3px] flex-1 transition-all duration-300" style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.06)', clipPath: 'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)' }} />
                    ))}
                  </div>
                  <div className="text-[0.6rem] font-['Space_Mono',monospace]" style={{ color: strengthColor }}>{strengthLabel}</div>
                </div>
              )}
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Confirm New Password</div>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter new password"
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all" style={clipBadge} />
              {confirmPw && newPw && (
                <div className={`text-[0.6rem] font-['Space_Mono',monospace] mt-1 ${confirmPw === newPw ? 'text-[#6DD18A]' : 'text-[#E05C7A]'}`}>
                  {confirmPw === newPw ? '✓ Passwords match' : '✗ Does not match'}
                </div>
              )}
            </div>

            {error && <div className="text-[0.68rem] text-[#E05C7A] font-['Space_Mono',monospace] py-2 px-3 bg-[rgba(224,92,122,0.06)] border border-[rgba(224,92,122,0.2)]" style={clipBadge}>{error}</div>}

            <div className="flex gap-3 pt-1">
              <button onClick={resetAndClose} className="flex-1 py-[10px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:border-[#C8A96E] hover:text-[#C8A96E] transition-all duration-200 bg-transparent" style={clipBtn}>Cancel</button>
              <button onClick={handleFormSubmit} disabled={loading} className="flex-1 py-[10px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border-none transition-all duration-200 disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}>{loading ? '◌ Checking...' : 'Continue →'}</button>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div>
            <div className="flex gap-1 mb-5">
              <div className="h-[2px] flex-1 bg-[#C8A96E]" style={{ clipPath: 'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)' }} />
              <div className="h-[2px] flex-1 bg-[#C8A96E]" style={{ clipPath: 'polygon(2px 0,100% 0,calc(100% - 2px) 100%,0 100%)' }} />
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 flex items-center justify-center border border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.06)]" style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}>
                  <span className="text-[1.6rem]">📧</span>
                </div>
              </div>
              <div className="font-['Rajdhani',sans-serif] text-[0.88rem] font-bold text-[#E8E0CC] mb-1">Check your email</div>
              <div className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed">A 6-digit code was sent to<br /><span className="text-[#C8A96E]">trailblazer@cosmoexpress.net</span></div>
            </div>

            <div className="flex gap-2 justify-center mb-4">
              {code.map((digit, i) => (
                <input key={i} ref={inputRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)} onKeyDown={e => handleCodeKey(i, e)}
                  className="w-10 h-12 text-center text-[1.1rem] font-bold font-['Space_Mono',monospace] text-[#C8A96E] outline-none transition-all duration-200"
                  style={{ background: digit ? 'rgba(200,169,110,0.08)' : 'rgba(200,169,110,0.03)', border: `1px solid ${digit ? 'rgba(200,169,110,0.5)' : 'rgba(200,169,110,0.15)'}`, clipPath: 'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)' }} />
              ))}
            </div>

            <div className="text-center mb-5">
              <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">Didn&apos;t receive it? <span className="text-[#C8A96E] cursor-pointer hover:text-[#F0D080]">Resend code</span></span>
            </div>

            {error && <div className="text-[0.68rem] text-[#E05C7A] font-['Space_Mono',monospace] py-2 px-3 bg-[rgba(224,92,122,0.06)] border border-[rgba(224,92,122,0.2)] mb-4" style={clipBadge}>{error}</div>}

            <button onClick={handleVerify} disabled={code.join('').length < 6 || loading}
              className="w-full py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}>
              {loading ? '◌ Verifying...' : '✓ Confirm Password Change'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-2">
            <div className="flex justify-center mb-5">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
                  <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#6DD18A" strokeWidth="1.5" opacity="0.7"/>
                  <polygon points="40,12 66,26 66,54 40,68 14,54 14,26" fill="rgba(109,209,138,0.06)" stroke="#6DD18A" strokeWidth="0.8" opacity="0.4"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[2rem]">✓</div>
              </div>
            </div>
            <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#6DD18A] mb-2">Password Changed</div>
            <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-1">Your password has been updated successfully.</p>
            <p className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-7">All other active sessions have been signed out for security.</p>
            <button onClick={resetAndClose} className="px-8 py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer" style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}>Close</button>
          </div>
        )}
      </div>
    </Modal>
  );
}