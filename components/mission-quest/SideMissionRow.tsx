'use client';

import { GameBadge } from './GameBadge';
import { clipBadge } from './clipStyles';

const difficultyMap: Record<string, { label: string; className: string }> = {
  easy:   { label: 'Easy',   className: 'text-[#6DD18A] border-[rgba(109,209,138,0.4)] bg-[rgba(109,209,138,0.08)]' },
  normal: { label: 'Normal', className: 'text-[#C8A96E] border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.08)]' },
  hard:   { label: 'Hard',   className: 'text-[#E05C7A] border-[rgba(224,92,122,0.4)]  bg-[rgba(224,92,122,0.08)]'  },
};

const sideTypeMap: Record<string, { label: string; className: string }> = {
  companion:   { label: 'Companion',   className: 'text-[#C8A96E] border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.1)]' },
  world:       { label: 'World',       className: 'text-[#4ECDC4] border-[rgba(78,205,196,0.3)]  bg-[rgba(78,205,196,0.1)]'  },
  exploration: { label: 'Exploration', className: 'text-[#A855F7] border-[rgba(168,85,247,0.3)]  bg-[rgba(168,85,247,0.1)]'  },
};

interface SideMission {
  id: string;
  title: string;
  game: string;
  version: string;
  type: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  difficulty: string;
  tags: string[];
  reward: string;
  summary: string;
}

export function SideMissionRow({ mission }: { mission: SideMission }) {
  const diff = difficultyMap[mission.difficulty];
  const typeInfo = sideTypeMap[mission.type];

  return (
    <div
      className="flex items-start gap-4 p-4 border-b border-[rgba(200,169,110,0.07)]
        transition-all duration-200 hover:bg-[rgba(200,169,110,0.03)] group cursor-pointer"
    >
      {/* ID pill */}
      <div className="shrink-0 mt-[2px]">
        <div className="font-['Space_Mono',monospace] text-[0.58rem] text-[#5A5248] bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.1)] px-2 py-1 text-center" style={clipBadge}>
          {mission.id}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-['Rajdhani',sans-serif] text-[0.9rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-200 truncate">
            {mission.title}
          </span>
        </div>
        <p className="text-[0.73rem] text-[#5A5248] leading-relaxed mb-2 line-clamp-1">{mission.summary}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {mission.tags.map((tag, i) => (
            <span key={i} className="text-[0.6rem] px-[7px] py-[1px] text-[#9A8F78] border border-[rgba(200,169,110,0.1)] bg-[rgba(255,255,255,0.02)]" style={clipBadge}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Meta column */}
      <div className="shrink-0 flex flex-col items-end gap-[6px]">
        <div className="flex items-center gap-2">
          <GameBadge game={mission.game} />
          <span className={`text-[0.6rem] font-bold px-[8px] py-[2px] border ${typeInfo.className}`} style={clipBadge}>
            {typeInfo.label}
          </span>
          <span className={`text-[0.6rem] font-bold px-[8px] py-[2px] border ${diff.className}`} style={clipBadge}>
            {diff.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#C8A96E]">🎁 {mission.reward}</span>
          <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">↑ {mission.votes}</span>
          <span className="text-[#5A5248] text-[0.65rem] font-['Space_Mono',monospace]">{mission.date}</span>
        </div>
      </div>
    </div>
  );
}