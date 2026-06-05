import { clipWidget, clipBadge } from './clipStyles';

interface Puzzle {
  id: number;
  points: number;
}

export function StatsWidget({ solvedIds, puzzlesData }: { solvedIds: number[]; puzzlesData: Puzzle[] }) {
  const total = puzzlesData.length;
  const solved = solvedIds.length;
  const totalPts = puzzlesData.filter(p => solvedIds.includes(p.id)).reduce((s, p) => s + p.points, 0);

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#4ECDC4] inline-block" />
        Your Progress
      </div>

      <div className="relative h-[6px] bg-[rgba(255,255,255,0.04)] mb-3 overflow-hidden">
        <div className="h-full transition-all duration-700"
          style={{ width: `${(solved / total) * 100}%`, background: 'linear-gradient(90deg, #4ECDC4, #C8A96E)' }} />
      </div>
      <div className="text-[0.72rem] text-[#5A5248] mb-4 font-['Space_Mono',monospace]">
        {solved}/{total} puzzles solved
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Points', value: totalPts.toLocaleString(), color: '#C8A96E' },
          { label: 'Solved',       value: solved,                     color: '#6DD18A' },
          { label: 'Remaining',    value: total - solved,             color: '#4ECDC4' },
          { label: 'Rank',         value: '#5',                       color: '#A855F7' },
        ].map((s, i) => (
          <div key={i} className="p-3"
            style={{ ...clipBadge, background: `${s.color}0D`, border: `1px solid ${s.color}22` }}>
            <div className="font-['Space_Mono',monospace] text-[1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[0.6rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}