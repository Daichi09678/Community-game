'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

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
  timeLimit?: number; // seconds
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const puzzlesData: Puzzle[] = [
  {
    id: 1,
    title: 'The Clockwork Paradox',
    game: 'hsr',
    difficulty: 'medium',
    type: 'riddle',
    question:
      'I have hands but cannot clap. I speak but have no tongue. In Penacony I rule the night, yet vanish with the sun. What am I?',
    answer: 'clock',
    hint: 'Look at the architecture of the Grand Hotel.',
    lore: 'Clocks in Penacony are said to contain fragments of the Trailblaze Dream.',
    points: 150,
    solvedBy: 3241,
  },
  {
    id: 2,
    title: 'Seven Nations Cipher',
    game: 'gi',
    difficulty: 'hard',
    type: 'cipher',
    question:
      'Decode: MNQSDI → LIYUE. Using the same Caesar shift, decode: XTKX',
    options: ['WAVE', 'WIND', 'VEIL', 'VALE'],
    answer: 'WIND',
    hint: 'Each letter shifts by the same constant value.',
    lore: 'The Seven Archons sealed their secrets in layered cipher texts within the Irminsul.',
    points: 300,
    solvedBy: 872,
  },
  {
    id: 3,
    title: 'Hollow Frequency',
    game: 'zzz',
    difficulty: 'easy',
    type: 'lore-quiz',
    question:
      'In New Eridu, what is the name of the broadcast system that Phaethon uses to receive missions and communicate with clients?',
    options: ['HolloCast', 'InterKnot', 'NetSphere', 'DataWave'],
    answer: 'InterKnot',
    hint: 'It is also where memes about Bangboo go viral.',
    lore:
      'InterKnot is the city-wide network that survived the Hollow expansion, serving as New Eridu\'s digital backbone.',
    points: 80,
    solvedBy: 7654,
  },
  {
    id: 4,
    title: 'Honkai Sequence',
    game: 'hi3',
    difficulty: 'hard',
    type: 'sequence',
    question:
      'Complete the Honkai Beast evolution sequence:\nMauvewolf → Jotun → ??? → Herrscher of Corruption',
    options: ['Nexus', 'Benares', 'Parvati', 'Vishnu'],
    answer: 'Benares',
    hint: 'She was once the closest companion of the second Herrscher.',
    lore:
      'Benares, the Crimson Dragon, is the divine beast who accompanied Fu Hua across centuries of history.',
    points: 320,
    solvedBy: 541,
  },
  {
    id: 5,
    title: 'The Shape of Reason',
    game: 'hsr',
    difficulty: 'easy',
    type: 'lore-quiz',
    question:
      'Which Path does Himeko walk, granting her mastery over the element of Fire?',
    options: ['The Hunt', 'Erudition', 'Destruction', 'Nihility'],
    answer: 'Erudition',
    hint: 'She was a scholar before becoming a crew member of the Astral Express.',
    lore:
      'The Path of Erudition is associated with the Nous, the Aeon of intellect and knowledge.',
    points: 80,
    solvedBy: 9102,
  },
  {
    id: 6,
    title: 'Dandelion Riddle',
    game: 'gi',
    difficulty: 'medium',
    type: 'riddle',
    question:
      'I bloom without soil, I carry hopes to the sky. Mondstadt calls me sacred — even the Anemo Archon cannot keep me from flying. What am I?',
    answer: 'dandelion seed',
    hint: 'Jean uses me in her healing arts.',
    lore:
      'Dandelion Seeds are collected near Mondstadt\'s gates and are sacred to the goddess Barbatos.',
    points: 150,
    solvedBy: 4890,
  },
  {
    id: 7,
    title: 'Agent Code Cipher',
    game: 'zzz',
    difficulty: 'medium',
    type: 'cipher',
    question:
      'Agent codenames follow the pattern: Nicole = N-1, Billy = B-2, Corin = C-3. What is the codename index of "Soldier 11"?',
    options: ['S-11', 'S-01', 'S-2', 'None — she uses her title'],
    answer: 'S-11',
    hint: 'The pattern uses the first letter and the number in the name.',
    lore:
      'Victoria Housekeeping agents are assigned codenames upon joining, concealing their true identities from faction rivals.',
    points: 180,
    solvedBy: 2103,
  },
  {
    id: 8,
    title: 'The Thirteen Moons',
    game: 'hi3',
    difficulty: 'easy',
    type: 'lore-quiz',
    question:
      'Which organization does Bronya lead as Supreme Commander after the events in Siberia?',
    options: ['Anti-Entropy', 'Schicksal', 'World Serpent', 'Azure Waters'],
    answer: 'Anti-Entropy',
    hint: 'Founded in opposition to Schicksal\'s monopoly on Honkai research.',
    lore:
      'Anti-Entropy was founded by Einstein and Tesla as a counterforce to Schicksal\'s authoritarian research doctrines.',
    points: 80,
    solvedBy: 6231,
  },
];

// ─── META ─────────────────────────────────────────────────────────────────────

const gameMeta: Record<GameKey, { label: string; color: string; bg: string; border: string }> = {
  hsr: { label: 'Star Rail',  color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)',   border: 'rgba(78,205,196,0.3)'  },
  gi:  { label: 'Genshin',    color: '#6DD18A', bg: 'rgba(109,209,138,0.1)', border: 'rgba(109,209,138,0.3)' },
  zzz: { label: 'Zenless',    color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)'  },
  hi3: { label: 'Honkai 3rd', color: '#E05C7A', bg: 'rgba(224,92,122,0.1)', border: 'rgba(224,92,122,0.3)'  },
};

const diffMeta: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Easy',   color: '#6DD18A', bg: 'rgba(109,209,138,0.1)' },
  medium: { label: 'Medium', color: '#C8A96E', bg: 'rgba(200,169,110,0.1)' },
  hard:   { label: 'Hard',   color: '#E05C7A', bg: 'rgba(224,92,122,0.1)' },
};

const typeMeta: Record<PuzzleType, { label: string; icon: string }> = {
  riddle:    { label: 'Riddle',    icon: '◈' },
  cipher:    { label: 'Cipher',    icon: '⟐' },
  'lore-quiz': { label: 'Lore Quiz', icon: '◎' },
  sequence:  { label: 'Sequence',  icon: '⋯' },
};

// ─── CLIP-PATHS ───────────────────────────────────────────────────────────────

const clipCard   = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' } as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────

function GameBadge({ game }: { game: GameKey }) {
  const g = gameMeta[game];
  return (
    <span className="inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase"
      style={{ ...clipBadge, background: g.bg, color: g.color, border: `1px solid ${g.border}` }}>
      {g.label}
    </span>
  );
}

function DiffBadge({ diff }: { diff: Difficulty }) {
  const d = diffMeta[diff];
  return (
    <span className="inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase"
      style={{ ...clipBadge, background: d.bg, color: d.color, border: `1px solid ${d.color}44` }}>
      {d.label}
    </span>
  );
}

function TypeBadge({ type }: { type: PuzzleType }) {
  const t = typeMeta[type];
  return (
    <span className="inline-flex items-center gap-1 px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase"
      style={{ ...clipBadge, background: 'rgba(200,169,110,0.07)', color: '#9A8F78', border: '1px solid rgba(200,169,110,0.2)' }}>
      <span>{t.icon}</span>{t.label}
    </span>
  );
}

// ─── PUZZLE MODAL ─────────────────────────────────────────────────────────────

function PuzzleModal({
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

        {/* Top accent */}
        <div className="h-[2px]" style={{ background: gm.color }} />

        {/* Timer bar */}
        {puzzle.timeLimit && revealed !== 'result' && (
          <div className="h-[3px] bg-[rgba(255,255,255,0.04)]">
            <div className="h-full transition-all duration-1000" style={{ width: `${timePct}%`, background: timeColor }} />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
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

          {/* Timer display */}
          {puzzle.timeLimit && revealed !== 'result' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[0.65rem] text-[#5A5248] uppercase tracking-[0.1em]">Time</span>
              <span className="font-['Space_Mono',monospace] text-[0.88rem] font-bold" style={{ color: timeColor }}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Question */}
          <div className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)] p-4 mb-5"
            style={clipCard}>
            <div className="text-[0.62rem] uppercase tracking-[0.18em] text-[#5A5248] mb-2 font-bold">◆ Puzzle</div>
            <p className="text-[0.88rem] text-[#C8A96E] leading-[1.7] font-['Rajdhani',sans-serif] whitespace-pre-line">
              {puzzle.question}
            </p>
          </div>

          {/* Options / Input */}
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

              {/* Hint toggle */}
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

              {/* Submit */}
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

          {/* Result */}
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

              {/* Lore reveal */}
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

// ─── PUZZLE CARD ──────────────────────────────────────────────────────────────

function PuzzleCard({
  puzzle,
  status,
  onOpen,
}: {
  puzzle: Puzzle;
  status: PuzzleStatus;
  onOpen: () => void;
}) {
  const gm = gameMeta[puzzle.game];
  const dm = diffMeta[puzzle.difficulty];
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
      {/* Top accent */}
      <div className="h-[2px]" style={{ background: isSolved ? '#6DD18A' : isFailed ? '#E05C7A55' : gm.color, opacity: 0.7 }} />

      <div className="p-5">
        {/* Solved overlay icon */}
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
              <span className="font-['Space_Mono',monospace] text-[0.85rem] font-bold" style={{ color: dm.color }}>
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

// ─── LEADERBOARD WIDGET ───────────────────────────────────────────────────────

const leaderboard = [
  { rank: 1, name: 'AeonWalker_X', pts: 4820, solved: 16, badge: '◆' },
  { rank: 2, name: 'Stelle_Dream', pts: 4200, solved: 14, badge: '◆' },
  { rank: 3, name: 'HerrsRaiden',  pts: 3950, solved: 13, badge: '◆' },
  { rank: 4, name: 'PhaetonXX',    pts: 3400, solved: 11, badge: '' },
  { rank: 5, name: 'Trailblazer_01', pts: 2680, solved: 9, badge: '' },
];

const rankColors = ['#C8A96E', '#9A8F78', '#8B6A4E'];

function LeaderboardWidget() {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
        Top Solvers
      </div>
      {leaderboard.map((u, i) => (
        <div key={i} className={`flex items-center gap-3 py-[9px] ${i < leaderboard.length - 1 ? 'border-b border-[rgba(200,169,110,0.06)]' : ''}`}>
          <span className="font-['Space_Mono',monospace] text-[0.72rem] w-5 text-center font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.rank}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[0.8rem] text-[#9A8F78] truncate flex items-center gap-1">
              {u.badge && <span style={{ color: rankColors[i] }}>{u.badge}</span>}
              {u.name}
              {u.name === 'Trailblazer_01' && (
                <span className="text-[0.6rem] px-1 py-[1px] ml-1"
                  style={{ ...clipBadge, background: 'rgba(78,205,196,0.12)', color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.3)' }}>
                  You
                </span>
              )}
            </div>
            <div className="text-[0.65rem] text-[#5A5248] mt-[1px]">{u.solved} puzzles</div>
          </div>
          <span className="font-['Space_Mono',monospace] text-[0.78rem] font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.pts.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── STATS WIDGET ─────────────────────────────────────────────────────────────

function StatsWidget({ solvedIds }: { solvedIds: number[] }) {
  const total = puzzlesData.length;
  const solved = solvedIds.length;
  const totalPts = puzzlesData.filter(p => solvedIds.includes(p.id)).reduce((s, p) => s + p.points, 0);

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#4ECDC4] inline-block" />
        Your Progress
      </div>

      {/* Progress ring sim via bar */}
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
          { label: 'Rank',         value: '#5',                      color: '#A855F7' },
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

// ─── DIFFICULTY BREAKDOWN WIDGET ──────────────────────────────────────────────

function DiffWidget() {
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

// ─── NAV COMPONENTS ───────────────────────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">{children}</div>;
}
function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
      {children}
    </span>
  );
}
function NavItem({ children, href, active }: { children: React.ReactNode; href?: string; active: boolean }) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const style: React.CSSProperties = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' };
  return (
    <a href={href ?? '#'} className={cls} style={style}>
      {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
      {children}
    </a>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const GridIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>;
const HexIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>;
const HexDotIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>;
const DiamondIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PersonIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>;

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type GameFilter = 'all' | GameKey;

export default function PuzzlePage() {
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PuzzleType | 'all'>('all');
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [statuses, setStatuses] = useState<Record<number, PuzzleStatus>>({});

  const gameLabels: Record<GameFilter, string> = {
    all: 'All Games', hsr: 'Honkai: Star Rail',
    gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
  };

  const filtered = puzzlesData.filter(p => {
    const g = gameFilter === 'all' || p.game === gameFilter;
    const d = diffFilter === 'all' || p.difficulty === diffFilter;
    const t = typeFilter === 'all' || p.type === typeFilter;
    return g && d && t;
  });

  const solvedIds = Object.entries(statuses).filter(([, s]) => s === 'solved').map(([id]) => Number(id));

  const handleSolve = (id: number, correct: boolean) => {
    setStatuses(prev => ({ ...prev, [id]: correct ? 'solved' : 'failed' }));
  };

  const gamePillStyle = (g: GameFilter) => {
    const colors: Record<string, string> = { all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A' };
    const c = colors[g];
    const isActive = gameFilter === g;
    return {
      style: {
        clipPath: (clipHex as any).clipPath,
        background: isActive ? `${c}14` : 'rgba(255,255,255,0.03)',
        color: isActive ? c : '#5A5248',
        borderColor: isActive ? c : 'transparent',
      } as React.CSSProperties,
    };
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>

      {/* BG Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 75% 15%, rgba(200,169,110,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(109,209,138,0.04) 0%, transparent 50%)
          `,
        }} />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="#" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </a>
        </div>
        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon />Dashboard</NavItem>
          <NavItem href="/" active={false}><HexIcon />All Reports<NavBadge>1.2K</NavBadge></NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon />Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon />Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem active={true}><DiamondIcon />Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon />Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon />Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profie" active={false}><PersonIcon />My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon />Settings</NavItem>
        </nav>
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">TB</div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">Trailblazer_01</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">

        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Puzzle &amp; Riddles — {gameLabels[gameFilter]}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              Test your lore knowledge across all Hoyoverse titles
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-52 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search puzzles..."
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">

          {/* Hero banner */}
          <div className="relative overflow-hidden border border-[rgba(200,169,110,0.2)] p-6 mb-6"
            style={{ ...clipCard, background: '#0C1220' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 50% 80% at 95% 50%, rgba(200,169,110,0.06) 0%, transparent 70%)' }} />
            <div className="absolute top-0 right-0 px-3 py-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase font-['Space_Mono',monospace]"
              style={{ background: 'rgba(200,169,110,0.1)', color: '#C8A96E', borderLeft: '1px solid rgba(200,169,110,0.3)', borderBottom: '1px solid rgba(200,169,110,0.3)' }}>
              Season IV
            </div>
            <div className="relative flex items-center gap-6">
              <div className="shrink-0 w-14 h-14 flex items-center justify-center"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)' }}>
                <span className="font-['Cinzel',serif] text-[1.2rem] text-[#C8A96E]">◈</span>
              </div>
              <div>
                <h1 className="font-['Cinzel',serif] text-[1.15rem] font-bold text-[#E8E0CC] mb-1">
                  Hoyoverse Puzzle Vault
                </h1>
                <p className="text-[0.82rem] text-[#6A6058] max-w-xl leading-[1.5]">
                  Riddles, ciphers, lore quizzes, and sequence challenges drawn from the worlds of Star Rail, Genshin, Zenless, and Honkai. Earn points, climb the leaderboard, and unlock hidden lore fragments.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  {[
                    { label: 'Puzzles', value: puzzlesData.length, color: '#4ECDC4' },
                    { label: 'Your Points', value: solvedIds.reduce((s, id) => s + (puzzlesData.find(p => p.id === id)?.points ?? 0), 0), color: '#C8A96E' },
                    { label: 'Completed', value: solvedIds.length, color: '#6DD18A' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                      <span className="font-['Space_Mono',monospace] text-[1.1rem] font-bold" style={{ color: s.color }}>{s.value}</span>
                      <span className="text-[0.65rem] text-[#5A5248] uppercase tracking-[0.08em]">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Game pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => {
              const { style } = gamePillStyle(g);
              return (
                <span key={g} onClick={() => setGameFilter(g)}
                  className="px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border"
                  style={style}>
                  {gameLabels[g]}
                </span>
              );
            })}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex gap-[5px]">
              {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                <button key={d} style={clipHexSm} onClick={() => setDiffFilter(d)}
                  className={`px-[12px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer
                    ${diffFilter === d
                      ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)] hover:text-[#9A8F78]'
                    }`}>
                  {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-[rgba(200,169,110,0.15)]" />

            <div className="flex gap-[5px]">
              {(['all', 'riddle', 'cipher', 'lore-quiz', 'sequence'] as const).map(t => (
                <button key={t} style={clipHexSm} onClick={() => setTypeFilter(t)}
                  className={`px-[10px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer
                    ${typeFilter === t
                      ? 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.5)] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:text-[#9A8F78]'
                    }`}>
                  {t === 'all' ? 'All Types' : typeMeta[t as PuzzleType]?.label ?? t}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
              {filtered.length} puzzles
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] mb-3">◆ All Puzzles</div>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                  No puzzles found for this filter.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-[780px]:grid-cols-1">
                  {filtered.map(p => (
                    <PuzzleCard
                      key={p.id}
                      puzzle={p}
                      status={statuses[p.id] ?? 'unsolved'}
                      onOpen={() => setActivePuzzle(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div>
              <StatsWidget solvedIds={solvedIds} />
              <LeaderboardWidget />
              <DiffWidget />

              {/* Type legend */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-[14px] bg-[#A855F7] inline-block" />
                  Puzzle Types
                </div>
                {(Object.entries(typeMeta) as [PuzzleType, { label: string; icon: string }][]).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-3 py-[8px] border-b border-[rgba(200,169,110,0.06)] last:border-b-0">
                    <span className="text-[#C8A96E] w-5 text-center">{val.icon}</span>
                    <div className="flex-1">
                      <div className="text-[0.8rem] text-[#9A8F78]">{val.label}</div>
                      <div className="text-[0.65rem] text-[#5A5248] mt-[1px]">
                        {puzzlesData.filter(p => p.type === key).length} puzzles
                      </div>
                    </div>
                    <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248]">
                      {puzzlesData.filter(p => p.type === key).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {activePuzzle && (
        <PuzzleModal
          puzzle={activePuzzle}
          onClose={() => setActivePuzzle(null)}
          onSolve={handleSolve}
        />
      )}

      {/* Fonts & utils */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>
    </div>
  );
}