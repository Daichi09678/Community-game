import { clipWidget, clipBtn } from './clipStyles';

const weeklyTopData = [
  { name: "QuantumGale",    initials: "QG", game: "hsr", weeklyReports: 28, weeklyVotes: 1240 },
  { name: "AstreaN_7",      initials: "AN", game: "hsr", weeklyReports: 24, weeklyVotes: 980  },
  { name: "VoidHunter_X",   initials: "VH", game: "gi",  weeklyReports: 21, weeklyVotes: 870  },
];

const badgeDescMap: Record<string, { label: string; desc: string }> = {
  "🏆": { label: "Champion",   desc: "Rank #1 All-Time" },
  "⭐": { label: "Star Author", desc: "100+ reports di top voted" },
  "🔥": { label: "On Fire",    desc: "Streak 10+ hari berturut" },
  "💎": { label: "Diamond",    desc: "10K+ total votes diterima" },
};

const gameAccentMap: Record<string, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function RightWidgets({ accentColor }: { accentColor: string }) {
  return (
    <div>
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5 relative overflow-hidden" style={clipWidget}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
        <WidgetTitle>Peringkat Kamu</WidgetTitle>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold">
            TB
          </div>
          <div>
            <div className="text-[0.88rem] font-bold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Trailblazer_01</div>
            <div className="text-[0.67rem] text-[#5A5248]">Memo Scout · LV.60</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Global Rank', val: '#48',   color: '#C8A96E' },
            { label: 'Reports',     val: '48',    color: '#4ECDC4' },
            { label: 'Total Votes', val: '1,842', color: '#A855F7' },
            { label: 'Streak',      val: '7 hari', color: '#E05C7A' },
          ].map((s, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.08)] p-3" style={clipWidget}>
              <div className="text-[0.58rem] uppercase tracking-[0.12em] text-[#5A5248] mb-1">{s.label}</div>
              <div className="font-['Space_Mono',monospace] text-[0.9rem] font-bold" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[0.7rem] text-[#5A5248] mb-1 flex justify-between">
          <span>Progress ke Rank #45</span>
          <span className="text-[#C8A96E]">68%</span>
        </div>
        <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden mb-3">
          <div className="h-full bg-[#C8A96E] transition-[width] duration-500" style={{ width: '68%' }} />
        </div>
        <button className="w-full py-[9px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 border-none text-[#050810]"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
          Lihat Profil Kamu
        </button>
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Bintang Minggu Ini</WidgetTitle>
        {weeklyTopData.map((u, i) => {
          const gc = gameAccentMap[u.game] ?? '#C8A96E';
          const medals = ['🥇', '🥈', '🥉'];
          return (
            <div key={i} className="flex items-center gap-3 py-[8px] border-b border-[rgba(200,169,110,0.06)] last:border-0">
              <span className="text-[0.9rem]">{medals[i]}</span>
              <div className="w-8 h-8 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.58rem] font-bold shrink-0"
                style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                {u.initials}
              </div>
              <div className="flex-1">
                <div className="text-[0.78rem] text-[#E8E0CC] font-semibold">{u.name}</div>
                <div className="text-[0.62rem] text-[#5A5248]">{u.weeklyReports} reports · {u.weeklyVotes.toLocaleString()} votes</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Legenda Badge</WidgetTitle>
        <div className="space-y-[10px]">
          {Object.entries(badgeDescMap).map(([emoji, info]) => (
            <div key={emoji} className="flex items-center gap-3">
              <span className="text-[1rem] w-6 text-center shrink-0">{emoji}</span>
              <div>
                <div className="text-[0.78rem] font-bold text-[#E8E0CC]">{info.label}</div>
                <div className="text-[0.65rem] text-[#5A5248]">{info.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <WidgetTitle>Distribusi Game</WidgetTitle>
        {[
          { label: 'Honkai: Star Rail', pct: 42, color: '#4ECDC4' },
          { label: 'Genshin Impact',    pct: 33, color: '#6DD18A' },
          { label: 'Zenless Zone Zero', pct: 17, color: '#A855F7' },
          { label: 'Honkai Impact 3rd', pct: 8,  color: '#E05C7A' },
        ].map((g, i) => (
          <div key={i} className="mb-[10px]">
            <div className="flex justify-between mb-1">
              <span className="text-[0.72rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.68rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className="h-full transition-[width] duration-700" style={{ width: `${g.pct}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}