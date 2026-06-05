export function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(200,169,110,0.12)" stroke="#C8A96E" strokeWidth="1.2"/>
        <polygon points="20,7 34,14 34,26 20,33 6,26 6,14" fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.4)" strokeWidth="0.6"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#F0D080]">1</span>
    </div>
  );
  if (rank === 2) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(180,190,200,0.08)" stroke="#9AA0AA" strokeWidth="1.2"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#C0C8D0]">2</span>
    </div>
  );
  if (rank === 3) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(205,127,50,0.08)" stroke="#CD7F32" strokeWidth="1.2"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#CD7F32]">3</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center w-10 h-10 shrink-0">
      <span className="font-['Space_Mono',monospace] text-[0.82rem] text-[#5A5248]">#{rank}</span>
    </div>
  );
}