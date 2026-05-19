'use client';

import { clipBtn } from '@/components/utils/styles';
import { GameFilter, gameLabels } from '@/components/utils/constants';

interface TopbarProps {
  activeGame: GameFilter;  // ← Tambahkan ini
}

export function Topbar({ activeGame }: TopbarProps) {  // ← Terima props
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
      <div>
        <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Dashboard</div>
        <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
          {gameLabels[activeGame]} · Last updated: 3 hours ago
        </div>
      </div>
      <div className="flex gap-[10px] items-center">
        <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]" style={clipBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search reports, quests, events..." className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
        </div>
        <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
          + Write Report
        </button>
      </div>
    </div>
  );
}