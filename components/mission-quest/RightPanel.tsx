'use client';

import { GameBadge } from './GameBadge';
import { clipBadge, clipWidget, clipHexSm } from './clipStyles';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function RightPanel({ gameFilter }: { gameFilter: GameFilter }) {
  const questStats = [
    { label: 'Main Quests',  value: '482',  color: '#C8A96E' },
    { label: 'Side Missions',value: '1.2K', color: '#4ECDC4' },
    { label: 'Completed',    value: '89%',  color: '#6DD18A' },
    { label: 'This Week',    value: '+38',  color: '#A855F7' },
  ];

  const hotQuests = [
    { title: "Robin Companion Quest",         votes: 521, game: 'hsr' },
    { title: "Chasca All Endings Guide",      votes: 298, game: 'gi'  },
    { title: "Hollow Zero District 6",        votes: 267, game: 'zzz' },
    { title: "Amphoreus Prologue Analysis",   votes: 187, game: 'hsr' },
    { title: "Xianzhou Monster Hunt Chain",   votes: 221, game: 'hsr' },
  ];

  const rankStyles = ['text-[#C8A96E]','text-[#C8A96E]','text-[#9AA0AA]','text-[#9AA0AA]','text-[#CD7F32]'];

  return (
    <div>
      {/* Quest Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Quest Stats</WidgetTitle>
        <div className="grid grid-cols-2 gap-3">
          {questStats.map((s, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.08)] p-3" style={clipBadge}>
              <div className="font-['Space_Mono',monospace] text-[1.2rem] font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[0.62rem] text-[#5A5248] tracking-[0.1em] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Quests */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Quests</WidgetTitle>
        {hotQuests.map((q, i) => (
          <div key={i} className="flex items-center gap-[10px] py-[9px] border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.8rem] text-[#9A8F78] cursor-pointer hover:text-[#E8E0CC] transition-colors duration-200 leading-[1.3]">{q.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              <GameBadge game={q.game} />
              <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑{q.votes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Game Progress */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Quest Coverage</WidgetTitle>
        {[
          { label: 'Honkai: Star Rail', main: 48, side: 52, barColor: '#4ECDC4' },
          { label: 'Genshin Impact',    main: 35, side: 65, barColor: '#6DD18A' },
          { label: 'Zenless Zone Zero', main: 40, side: 60, barColor: '#A855F7' },
          { label: 'Honkai Impact 3rd', main: 55, side: 45, barColor: '#E05C7A' },
        ].map((g, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex justify-between mb-[5px]">
              <span className="text-[0.73rem] text-[#9A8F78]">{g.label}</span>
              <div className="flex gap-3 text-[0.62rem] font-['Space_Mono',monospace]">
                <span className="text-[#C8A96E]">MQ {g.main}%</span>
                <span className="text-[#5A5248]">SM {g.side}%</span>
              </div>
            </div>
            <div className="h-[3px] bg-[rgba(255,255,255,0.05)] overflow-hidden mb-1">
              <div className="h-full transition-all duration-[600ms] ease-in-out" style={{ width: `${g.main}%`, background: g.barColor }} />
            </div>
            <div className="h-[2px] bg-[rgba(255,255,255,0.03)] overflow-hidden">
              <div className="h-full transition-all duration-[600ms] ease-in-out bg-[rgba(200,169,110,0.3)]" style={{ width: `${g.side}%` }} />
            </div>
          </div>
        ))}
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-[3px] bg-[#4ECDC4]" />
            <span className="text-[0.58rem] text-[#5A5248]">Main Quest</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-[2px] bg-[rgba(200,169,110,0.3)]" />
            <span className="text-[0.58rem] text-[#5A5248]">Side Mission</span>
          </div>
        </div>
      </div>

      {/* Write CTA */}
      <div
        className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 relative overflow-hidden"
        style={clipWidget}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #C8A96E, transparent 60%)' }} />
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-2">
          Share Your Guide
        </div>
        <p className="text-[0.72rem] text-[#5A5248] leading-relaxed mb-4">
          Help fellow Trailblazers and Travelers — write a quest report and earn community votes.
        </p>
        <button
          className="w-full py-[8px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer hover:brightness-110 transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipHexSm }}
        >
          + Write Quest Report
        </button>
      </div>
    </div>
  );
}