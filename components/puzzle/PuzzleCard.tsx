'use client';

import { GameBadge, gameMeta } from './GameBadge';
import { DiffBadge } from './DiffBadge';
import { TypeBadge } from './TypeBadge';
import { clipCard, clipBadge } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type Difficulty = 'easy' | 'medium' | 'hard';
type PuzzleType = 'riddle' | 'cipher' | 'lore-quiz' | 'sequence';
type PuzzleStatus = 'unsolved' | 'solved' | 'failed';

interface Puzzle {
  id: number;
  title: string;
  game: GameKey;
  difficulty: Difficulty;
  type: PuzzleType;
  question: string;
  options?: string[];
  answer: string;
  hint: string;
  lore: string;
  points: number;
  solvedBy: number;
  timeLimit?: number;
}

export function PuzzleCard({
  puzzle,
  status,
  onOpen,
}: {
  puzzle: Puzzle;
  status: PuzzleStatus;
  onOpen: () => void;
}) {
  const gm = gameMeta[puzzle.game];
  const isSolved = status === 'solved';
  const isFailed = status === 'failed';

  return (
    <div
      onClick={!isSolved ? onOpen : undefined}
      className={`relative bg-[#0C1220] border transition-all duration-300 group ${!isSolved ? 'cursor-pointer hover:border-opacity-70' : 'opacity-60 cursor-default'}`}
      style={{
        ...clipCard,
        borderColor: isSolved ? 'rgba(109,209,138,0.3)' : isFailed ? 'rgba(224,92,122,0.25)' : 'rgba(200,169,110,0.15)',
      }}>
      <div className="h-[2px]" style={{ background: isSolved ? '#6DD18A' : isFailed ? '#E05C7A55' : gm.color, opacity: 0.7 }} />

      <div className="p-5">
        {isSolved && (
          <div className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
            style={{ ...clipBadge, background: 'rgba(109,209,138,0.15)', border: '1px solid rgba(109,209,138,0.4)' }}>
            <span className="text-[#6DD18A] text-[0.75rem] font-bold">✓</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <TypeBadge type={puzzle.type} />
          <DiffBadge diff={puzzle.difficulty} />
          <GameBadge game={puzzle.game} />
        </div>

        <h3 className="font-['Cinzel',serif] text-[0.9rem] font-semibold text-[#E8E0CC] mb-2 leading-tight group-hover:text-[#C8A96E] transition-colors duration-200">
          {puzzle.title}
        </h3>

        <p className="text-[0.8rem] text-[#5A5248] leading-[1.5] mb-4 line-clamp-2">
          {puzzle.question}
        </p>

        <div className="h-px bg-[rgba(200,169,110,0.06)] mb-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <span className="font-['Space_Mono',monospace] text-[0.85rem] font-bold" style={{ color: '#C8A96E' }}>
                {puzzle.points}
              </span>
              <span className="text-[0.62rem] text-[#5A5248] ml-1 uppercase tracking-[0.08em]">pts</span>
            </div>
            <div className="w-px h-3 bg-[rgba(200,169,110,0.15)]" />
            <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace]">
              {puzzle.solvedBy.toLocaleString()} solved
            </span>
          </div>

          {!isSolved && (
            <div className="text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-colors duration-200"
              style={{ color: gm.color }}>
              Attempt →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}