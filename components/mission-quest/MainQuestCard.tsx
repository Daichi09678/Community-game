'use client';

import { GameBadge } from './GameBadge';
import { clipBadge, clipCard } from './clipStyles';

const renderStars = (r: number) => '★'.repeat(r) + '☆'.repeat(5 - r);

interface MainQuest {
  id: string;
  title: string;
  game: string;
  version: string;
  chapter: string;
  arc: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  status: string;
  tags: string[];
  summary: string;
}

export function MainQuestCard({ quest }: { quest: MainQuest }) {
  return (
    <div
      className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden group
        transition-all duration-300 hover:border-[rgba(200,169,110,0.35)] hover:bg-[#0F1728]"
      style={clipCard}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C8A96E] to-[rgba(200,169,110,0.1)]" />

      {/* Status indicator top-right */}
      <div className="absolute top-0 right-0">
        <div className={`px-3 py-1 text-[0.58rem] font-bold tracking-[0.15em] uppercase font-['Space_Mono',monospace]
          ${quest.status === 'complete'
            ? 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border-l border-b border-[rgba(78,205,196,0.25)]'
            : 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border-l border-b border-[rgba(200,169,110,0.25)]'}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)' }}
        >
          {quest.status === 'complete' ? '✓ Complete' : '◎ Ongoing'}
        </div>
      </div>

      {/* Arc label */}
      <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">
        {quest.arc} · {quest.chapter}
      </div>

      {/* Title */}
      <h3 className="font-['Cinzel',serif] text-[0.95rem] font-semibold text-[#E8E0CC] mb-2 leading-snug
        group-hover:text-[#C8A96E] transition-colors duration-200 pr-20 cursor-pointer">
        {quest.title}
      </h3>

      {/* Summary */}
      <p className="text-[0.78rem] text-[#5A5248] leading-relaxed mb-4 line-clamp-2">
        {quest.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {quest.tags.map((tag, i) => (
          <span key={i} className="text-[0.62rem] font-semibold px-[8px] py-[2px] text-[#9A8F78] bg-[rgba(255,255,255,0.03)] border border-[rgba(200,169,110,0.1)]" style={clipBadge}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GameBadge game={quest.game} />
          <span className="text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248]">v{quest.version}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Author */}
          <div className="flex items-center gap-[6px]">
            <div className="w-[22px] h-[22px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.55rem] text-[#C8A96E] font-bold shrink-0">
              {quest.initials}
            </div>
            <span className="text-[0.72rem] text-[#9A8F78]">{quest.author}</span>
          </div>
          {/* Stars */}
          <span className="text-[#C8A96E] text-[0.65rem] tracking-[1px]">{renderStars(quest.rating)}</span>
          {/* Votes */}
          <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">↑ {quest.votes}</span>
          {/* Date */}
          <span className="text-[#5A5248] text-[0.7rem] font-['Space_Mono',monospace]">{quest.date}</span>
        </div>
      </div>
    </div>
  );
}