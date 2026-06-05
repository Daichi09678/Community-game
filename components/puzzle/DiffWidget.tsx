import { clipWidget } from './clipStyles';
import { diffMeta } from './DiffBadge';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Puzzle {
  difficulty: Difficulty;
}

export function DiffWidget({ puzzlesData }: { puzzlesData: Puzzle[] }) {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#E05C7A] inline-block" />
        By Difficulty
      </div>
      {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
        const count = puzzlesData.filter(p => p.difficulty === d).length;
        const pct = Math.round((count / puzzlesData.length) * 100);
        const dm = diffMeta[d];
        return (
          <div key={d} className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-[0.75rem] text-[#9A8F78] capitalize">{d}</span>
              <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248]">{count}</span>
            </div>
            <div className="h-[3px] bg-[rgba(255,255,255,0.04)]">
              <div className="h-full" style={{ width: `${pct}%`, background: dm.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}