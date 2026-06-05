'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameBadge, gameMeta } from './GameBadge';
import { DiffBadge } from './DiffBadge';
import { TypeBadge } from './TypeBadge';
import { clipCard, clipBtn, clipHex } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type Difficulty = 'easy' | 'medium' | 'hard';
type PuzzleType = 'riddle' | 'cipher' | 'lore-quiz' | 'sequence';

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

export function PuzzleModal({
  puzzle,
  onClose,
  onSolve,
}: {
  puzzle: Puzzle;
  onClose: () => void;
  onSolve: (id: number, correct: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<'none' | 'hint' | 'result'>('none');
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit ?? 0);
  const [showLore, setShowLore] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const gm = gameMeta[puzzle.game];

  useEffect(() => {
    if (!puzzle.timeLimit || revealed === 'result') return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, revealed]);

  const handleSubmit = useCallback((timedOut = false) => {
    const ans = puzzle.options
      ? selected
      : input.trim().toLowerCase();
    const isCorrect = !timedOut && ans?.toLowerCase() === puzzle.answer.toLowerCase();
    setCorrect(isCorrect ?? false);
    setRevealed('result');
    setShowLore(true);
    onSolve(puzzle.id, isCorrect ?? false);
  }, [input, selected, puzzle, onSolve]);

  const handleHintClick = () => {
    setRevealed('hint');
    setHintUsed(true);
  };

  const timePct = puzzle.timeLimit ? (timeLeft / puzzle.timeLimit) * 100 : 100;
  const timeColor = timePct > 50 ? '#4ECDC4' : timePct > 25 ? '#C8A96E' : '#E05C7A';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,8,16,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[560px] bg-[#0C1220] border relative"
        style={{ ...clipCard, borderColor: gm.color + '44', maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="h-[2px]" style={{ background: gm.color }} />

        {puzzle.timeLimit && revealed !== 'result' && (
          <div className="h-[3px] bg-[rgba(255,255,255,0.04)]">
            <div className="h-full transition-all duration-1000" style={{ width: `${timePct}%`, background: timeColor }} />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <TypeBadge type={puzzle.type} />
                <DiffBadge diff={puzzle.difficulty} />
                <GameBadge game={puzzle.game} />
              </div>
              <h2 className="font-['Cinzel',serif] text-[1.05rem] font-bold text-[#E8E0CC]">
                {puzzle.title}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <div className="font-['Space_Mono',monospace] text-[1.3rem] font-bold" style={{ color: gm.color }}>
                {puzzle.points}
              </div>
              <div className="text-[0.6rem] text-[#5A5248] uppercase tracking-[0.1em]">pts</div>
            </div>
          </div>

          {puzzle.timeLimit && revealed !== 'result' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[0.65rem] text-[#5A5248] uppercase tracking-[0.1em]">Time</span>
              <span className="font-['Space_Mono',monospace] text-[0.88rem] font-bold" style={{ color: timeColor }}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)] p-4 mb-5" style={clipCard}>
            <div className="text-[0.62rem] uppercase tracking-[0.18em] text-[#5A5248] mb-2 font-bold">◆ Puzzle</div>
            <p className="text-[0.88rem] text-[#C8A96E] leading-[1.7] font-['Rajdhani',sans-serif] whitespace-pre-line">
              {puzzle.question}
            </p>
          </div>

          {revealed !== 'result' && (
            <>
              {puzzle.options ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {puzzle.options.map(opt => (
                    <button key={opt}
                      onClick={() => setSelected(opt)}
                      className="p-3 text-[0.82rem] font-semibold text-left transition-all duration-200 cursor-pointer border"
                      style={{
                        ...clipHex,
                        background: selected === opt ? `${gm.color}18` : 'rgba(255,255,255,0.02)',
                        borderColor: selected === opt ? gm.color + '66' : 'rgba(200,169,110,0.15)',
                        color: selected === opt ? gm.color : '#9A8F78',
                      }}>
                      <span className="font-['Space_Mono',monospace] text-[0.65rem] mr-2 opacity-50">▸</span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.15em] text-[#5A5248] mb-2 font-bold">Your Answer</div>
                  <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.2)] px-4 py-3 focus-within:border-[#C8A96E] transition-colors"
                    style={clipBtn}>
                    <span style={{ color: gm.color }}>▸</span>
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      placeholder="Type your answer..."
                      className="flex-1 bg-transparent outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.9rem] placeholder-[#3A3028]"
                    />
                  </div>
                </div>
              )}

              {revealed === 'none' && (
                <button onClick={handleHintClick}
                  className="text-[0.72rem] text-[#5A5248] hover:text-[#9A8F78] transition-colors mb-4 flex items-center gap-1 cursor-pointer bg-transparent border-none">
                  <span>⟐</span> Reveal hint <span className="text-[#3A3028]">(-20 pts)</span>
                </button>
              )}
              {revealed === 'hint' && (
                <div className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.12)] px-4 py-3 mb-4 text-[0.8rem] text-[#9A8F78]"
                  style={clipHex}>
                  <span className="text-[#C8A96E] font-bold mr-2">Hint:</span>{puzzle.hint}
                </div>
              )}

              <button
                onClick={() => handleSubmit()}
                disabled={puzzle.options ? !selected : !input.trim()}
                className="w-full py-[10px] text-[0.82rem] font-bold tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border"
                style={{
                  ...clipHex,
                  background: `linear-gradient(135deg, ${gm.color}22, ${gm.color}11)`,
                  color: gm.color,
                  borderColor: gm.color + '44',
                }}>
                Submit Answer →
              </button>
            </>
          )}

          {revealed === 'result' && (
            <div>
              <div
                className="p-4 mb-4 border text-center"
                style={{
                  ...clipCard,
                  background: correct ? 'rgba(109,209,138,0.08)' : 'rgba(224,92,122,0.08)',
                  borderColor: correct ? 'rgba(109,209,138,0.35)' : 'rgba(224,92,122,0.35)',
                }}>
                <div className="text-[1.5rem] mb-1">{correct ? '◆' : '✕'}</div>
                <div className="font-['Cinzel',serif] text-[0.95rem] font-bold mb-1"
                  style={{ color: correct ? '#6DD18A' : '#E05C7A' }}>
                  {correct ? 'Correct!' : 'Incorrect'}
                </div>
                <div className="text-[0.78rem] text-[#9A8F78]">
                  {correct
                    ? `+${puzzle.points - (hintUsed ? 20 : 0)} points earned`
                    : `Answer: ${puzzle.answer}`}
                </div>
              </div>

              {showLore && (
                <div className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)] p-4 mb-4"
                  style={clipCard}>
                  <div className="text-[0.6rem] uppercase tracking-[0.18em] text-[#5A5248] mb-2 font-bold flex items-center gap-2">
                    <span className="w-[3px] h-[10px] inline-block" style={{ background: gm.color }} />
                    Lore Fragment
                  </div>
                  <p className="text-[0.8rem] text-[#6A6058] leading-[1.6] italic">
                    "{puzzle.lore}"
                  </p>
                </div>
              )}

              <button onClick={onClose}
                className="w-full py-[9px] text-[0.78rem] font-bold tracking-[0.1em] uppercase border transition-all duration-200 cursor-pointer"
                style={{ ...clipHex, background: 'rgba(200,169,110,0.05)', borderColor: 'rgba(200,169,110,0.2)', color: '#9A8F78' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}