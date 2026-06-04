'use client';

import { useState, useEffect } from 'react';
import { clipBadge, clipWidget } from '@/components/common/clipStyles';

const topItemsData = [
  { title: "Robin Companion Quest — Character Analysis", score: "521 votes" },
  { title: "Simulated Universe World 10 — Full Guide",   score: "412 votes" },
  { title: "HoloFest Event — All Stages & Rewards",      score: "334 votes" },
  { title: "Chasca Hangout Quest — All Endings",         score: "298 votes" },
  { title: "Where the Stairway Leads — Review",          score: "248 votes" },
];

const tagsData = [
  { label: 'Natlan',            variant: 'default', game: 'gi'  },
  { label: 'Robin',             variant: 'gold',    game: 'hsr' },
  { label: 'HSR 3.2',           variant: 'cyan',    game: 'hsr' },
  { label: 'Simulated Universe',variant: 'purple',  game: 'hsr' },
  { label: 'Liyue Lore',        variant: 'default', game: 'gi'  },
  { label: 'Acheron',           variant: 'default', game: 'hsr' },
  { label: 'Hollow Zero',       variant: 'purple',  game: 'zzz' },
  { label: 'Elysian Realm',     variant: 'cyan',    game: 'hi3' },
  { label: 'Zenless 1.4',       variant: 'default', game: 'zzz' },
  { label: 'Hidden Achievement',variant: 'default', game: 'gi'  },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const vals = [24, 38, 31, 52, 44, 67, 48];
const maxVal = Math.max(...vals);

const rankStyles = [
  'text-[#C8A96E]',  // #1 gold
  'text-[#C8A96E]',  // #2 gold
  'text-[#9AA0AA]',  // #3 silver
  'text-[#9AA0AA]',  // #4 silver
  'text-[#CD7F32]',  // #5 bronze
];

const tagVariantClass: Record<string, string> = {
  default: 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.2)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)]',
  gold:    'bg-[rgba(200,169,110,0.12)] border-[rgba(200,169,110,0.3)] text-[#F0D080] hover:bg-[rgba(200,169,110,0.2)]',
  cyan:    'bg-[rgba(78,205,196,0.08)] border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.15)]',
  purple:  'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]',
};

const gameCoverage = [
  { label: 'Honkai: Star Rail', pct: 42, fill: 'bg-[#4ECDC4]' },
  { label: 'Genshin Impact',    pct: 35, fill: 'bg-[#6DD18A]' },
  { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
  { label: 'Honkai Impact 3rd', pct: 8,  fill: 'bg-[#E05C7A]' },
];

export function RightWidgets() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {/* Top Reports */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Top Reports
        </div>
        {topItemsData.map((item, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.82rem] text-[#9A8F78] cursor-pointer transition-colors duration-200 hover:text-[#E8E0CC] leading-[1.3]">
              {item.title}
            </span>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{item.score}</span>
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Trending Tags
        </div>
        <div className="-mt-1">
          {tagsData.map((tag, i) => (
            <span
              key={i}
              style={clipBadge}
              className={`inline-block px-[10px] py-[3px] border text-[0.7rem] font-semibold m-[3px] cursor-pointer transition-all duration-200 ${tagVariantClass[tag.variant]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Activity This Week
        </div>
        <div className="flex items-end gap-[6px] h-16">
          {days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                style={{
                  width: '100%',
                  background: i === 5 ? '#C8A96E' : 'rgba(200,169,110,0.25)',
                  borderTop: `0.5px solid ${i === 5 ? '#C8A96E' : 'rgba(200,169,110,0.4)'}`,
                  height: mounted ? `${Math.round((vals[i] / maxVal) * 52) + 8}px` : '30px',
                  transition: 'height 0.3s',
                }}
              />
              <span className="text-[0.6rem] text-[#5A5248]">{day}</span>
            </div>
          ))}
        </div>
        <div className="text-right mt-2 text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
          304 total reports this week
        </div>
      </div>

      {/* Game Coverage */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Game Coverage
        </div>
        {gameCoverage.map((g, i) => (
          <div key={i} className="mb-[10px]">
            <div className="flex justify-between mb-1">
              <span className="text-[0.75rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className={`h-full ${g.fill} transition-all duration-[600ms] ease-in-out`} style={{ width: mounted ? `${g.pct}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}