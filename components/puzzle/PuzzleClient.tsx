'use client';

import { useState, useEffect } from 'react';
import {
  NavGroupLabel,
  NavBadge,
  NavItem,
} from './NavItem';
import {
  GridIcon,
  HexIcon,
  HexDotIcon,
  CalendarIcon,
  DiamondIcon,
  UsersIcon,
  StarIcon,
  PersonIcon,
  InfoIcon,
} from './Icons';
import { PuzzleCard } from './PuzzleCard';
import { PuzzleModal } from './PuzzleModal';
import { LeaderboardWidget } from './LeaderboardWidget';
import { StatsWidget } from './StatsWidget';
import { DiffWidget } from './DiffWidget';
import { typeMeta } from './TypeBadge';
import { clipCard, clipHex, clipHexSm, clipBtn, clipWidget } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type Difficulty = 'easy' | 'medium' | 'hard';
type PuzzleType = 'riddle' | 'cipher' | 'lore-quiz' | 'sequence';
type GameFilter = 'all' | GameKey;
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

const puzzlesData: Puzzle[] = [
  {
    id: 1,
    title: 'The Clockwork Paradox',
    game: 'hsr',
    difficulty: 'medium',
    type: 'riddle',
    question: 'I have hands but cannot clap. I speak but have no tongue. In Penacony I rule the night, yet vanish with the sun. What am I?',
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
    question: 'Decode: MNQSDI → LIYUE. Using the same Caesar shift, decode: XTKX',
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
    question: 'In New Eridu, what is the name of the broadcast system that Phaethon uses to receive missions and communicate with clients?',
    options: ['HolloCast', 'InterKnot', 'NetSphere', 'DataWave'],
    answer: 'InterKnot',
    hint: 'It is also where memes about Bangboo go viral.',
    lore: 'InterKnot is the city-wide network that survived the Hollow expansion, serving as New Eridu\'s digital backbone.',
    points: 80,
    solvedBy: 7654,
  },
  {
    id: 4,
    title: 'Honkai Sequence',
    game: 'hi3',
    difficulty: 'hard',
    type: 'sequence',
    question: 'Complete the Honkai Beast evolution sequence:\nMauvewolf → Jotun → ??? → Herrscher of Corruption',
    options: ['Nexus', 'Benares', 'Parvati', 'Vishnu'],
    answer: 'Benares',
    hint: 'She was once the closest companion of the second Herrscher.',
    lore: 'Benares, the Crimson Dragon, is the divine beast who accompanied Fu Hua across centuries of history.',
    points: 320,
    solvedBy: 541,
  },
  {
    id: 5,
    title: 'The Shape of Reason',
    game: 'hsr',
    difficulty: 'easy',
    type: 'lore-quiz',
    question: 'Which Path does Himeko walk, granting her mastery over the element of Fire?',
    options: ['The Hunt', 'Erudition', 'Destruction', 'Nihility'],
    answer: 'Erudition',
    hint: 'She was a scholar before becoming a crew member of the Astral Express.',
    lore: 'The Path of Erudition is associated with the Nous, the Aeon of intellect and knowledge.',
    points: 80,
    solvedBy: 9102,
  },
  {
    id: 6,
    title: 'Dandelion Riddle',
    game: 'gi',
    difficulty: 'medium',
    type: 'riddle',
    question: 'I bloom without soil, I carry hopes to the sky. Mondstadt calls me sacred — even the Anemo Archon cannot keep me from flying. What am I?',
    answer: 'dandelion seed',
    hint: 'Jean uses me in her healing arts.',
    lore: 'Dandelion Seeds are collected near Mondstadt\'s gates and are sacred to the goddess Barbatos.',
    points: 150,
    solvedBy: 4890,
  },
  {
    id: 7,
    title: 'Agent Code Cipher',
    game: 'zzz',
    difficulty: 'medium',
    type: 'cipher',
    question: 'Agent codenames follow the pattern: Nicole = N-1, Billy = B-2, Corin = C-3. What is the codename index of "Soldier 11"?',
    options: ['S-11', 'S-01', 'S-2', 'None — she uses her title'],
    answer: 'S-11',
    hint: 'The pattern uses the first letter and the number in the name.',
    lore: 'Victoria Housekeeping agents are assigned codenames upon joining, concealing their true identities from faction rivals.',
    points: 180,
    solvedBy: 2103,
  },
  {
    id: 8,
    title: 'The Thirteen Moons',
    game: 'hi3',
    difficulty: 'easy',
    type: 'lore-quiz',
    question: 'Which organization does Bronya lead as Supreme Commander after the events in Siberia?',
    options: ['Anti-Entropy', 'Schicksal', 'World Serpent', 'Azure Waters'],
    answer: 'Anti-Entropy',
    hint: 'Founded in opposition to Schicksal\'s monopoly on Honkai research.',
    lore: 'Anti-Entropy was founded by Einstein and Tesla as a counterforce to Schicksal\'s authoritarian research doctrines.',
    points: 80,
    solvedBy: 6231,
  },
];

const gameLabels: Record<GameFilter, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

export function PuzzleClient() {
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PuzzleType | 'all'>('all');
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [statuses, setStatuses] = useState<Record<number, PuzzleStatus>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

 
  if (loading) {
    return <LoadingAnimation message="LOADING PUZZLES & RIDDLES..." />;
  }


  return (
    <div className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>

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
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon />All Reports<NavBadge>1.2K</NavBadge></NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon />Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon />Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem active={true}><DiamondIcon />Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon />Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon />Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon />My Profile</NavItem>
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
              <StatsWidget solvedIds={solvedIds} puzzlesData={puzzlesData} />
              <LeaderboardWidget />
              <DiffWidget puzzlesData={puzzlesData} />

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>
    </div>
  );
}