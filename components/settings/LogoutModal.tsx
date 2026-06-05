'use client';

import { useState } from 'react';
import { clipBtn, clipCard } from './clipStyles';

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

export function LogoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
              <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#E05C7A" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7"/>
              <polygon points="40,12 66,26 66,54 40,68 14,54 14,26" fill="rgba(224,92,122,0.06)" stroke="#E05C7A" strokeWidth="0.8" opacity="0.4"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-[2rem]">⚠</span></div>
          </div>
        </div>

        <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC] mb-2">Sign Out of Hub?</div>
        <p className="text-[0.75rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-1">Your session as <span className="text-[#C8A96E]">Trailblazer_01</span> will be terminated.</p>
        <p className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-7">All unsaved changes will be lost. Your reports and data remain safe.</p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-[10px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:border-[#C8A96E] hover:text-[#C8A96E] transition-all duration-200 bg-transparent" style={clipBtn}>Cancel</button>
          <button onClick={handleLogout} disabled={loading} className="flex-1 py-[10px] text-white font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border-none transition-all duration-200 disabled:opacity-70" style={{ background: loading ? 'rgba(224,92,122,0.3)' : 'linear-gradient(135deg, #8B2040, #E05C7A)', ...clipBtn }}>{loading ? '◌ Signing out...' : '→ Sign Out'}</button>
        </div>
      </div>
    </Modal>
  );
}