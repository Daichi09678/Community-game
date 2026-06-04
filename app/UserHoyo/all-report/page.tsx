'use client';

import { useState, useEffect } from 'react';
import {
  ReportsTable,
  RightWidgets,
  NavGroupLabel,
  NavBadge,
  NavItem,
  GridIcon,
  HexIcon,
  HexDotIcon,
  CalendarIcon,
  DiamondIcon,
  UsersIcon,
  StarIcon,
  PersonIcon,
  InfoIcon,
  clipHex,
  clipBtn,
} from '@/components/all-report';

// ─── DATA ────────────────────────────────────────────────────────────────────

const reportsData = [
  { title: "Deep Dive: 'Where the Stairway Leads' Quest Analysis", type: "mission", game: "hsr", author: "AstreaN_7",     initials: "AN", rating: 5, votes: 248, date: "2h ago", version: "3.2" },
  { title: "Natlan Archon Quest Act II — Full Story Recap",         type: "mission", game: "gi",  author: "VoidHunter_X",  initials: "VH", rating: 4, votes: 186, date: "5h ago", version: "5.3" },
  { title: "Complete Simulated Universe World 10 Guide",            type: "puzzle",  game: "hsr", author: "QuantumGale",   initials: "QG", rating: 5, votes: 412, date: "1h ago", version: "3.1" },
  { title: "HoloFest Event — All Stages & Reward Breakdown",        type: "event",   game: "zzz", author: "Mei_Stellaron", initials: "MS", rating: 5, votes: 334, date: "2h ago", version: "1.4" },
  { title: "Honkai Impact 3rd: Elysian Realm Full Clear Tips",      type: "puzzle",  game: "hi3", author: "TrailBossKai",  initials: "TK", rating: 3, votes: 92,  date: "1h ago", version: "7.4" },
  { title: "Genshin: Hidden Achievement Guide — Liyue Region",      type: "puzzle",  game: "gi",  author: "SilverWolf_Fan",initials: "SW", rating: 4, votes: 178, date: "3h ago", version: "5.2" },
  { title: "Robin Companion Quest — Character Analysis",            type: "mission", game: "hsr", author: "Cocolia_Arc",   initials: "CA", rating: 5, votes: 521, date: "4h ago", version: "3.1" },
  { title: "ZZZ: Hollow Zero District 6 — Fastest Clear Path",      type: "puzzle",  game: "zzz", author: "ImaginaryRift", initials: "IR", rating: 4, votes: 67,  date: "6h ago", version: "1.3" },
  { title: "'Clouded Sanctuary' Event — Full Content Review",       type: "event",   game: "hsr", author: "QuantumGale",   initials: "QG", rating: 4, votes: 143, date: "8h ago", version: "3.2" },
  { title: "Genshin Impact: Chasca Hangout Quest — All Endings",    type: "mission", game: "gi",  author: "AstreaN_7",     initials: "AN", rating: 5, votes: 298, date: "1h ago", version: "5.3" },
];

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type TypeFilter = 'all' | 'mission' | 'event' | 'puzzle';

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

export default function AllReportPage() {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TypeFilter>('all');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');

  useEffect(() => {
    // Simulasi fetch data dari API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Sama dengan delay dashboard

    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reportsData.filter(r => {
    const matchGame = gameFilter === 'all' || r.game === gameFilter;
    const matchType = filterType === 'all' || r.type === filterType;
    return matchGame && matchType;
  });

  const gamePillClass = (g: GameFilter): string => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const activeMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi:  'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hoverMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi:  'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${gameFilter === g ? activeMap[g] : hoverMap[g]}`;
  };

  // Loading screen yang sama dengan dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 relative">
            <svg width="80" height="80" viewBox="0 0 28 28" className="mx-auto">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2">
                <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </polygon>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-48 bg-[rgba(200,169,110,0.1)] rounded-full mx-auto animate-pulse" />
            <div className="h-2 w-32 bg-[rgba(200,169,110,0.05)] rounded-full mx-auto animate-pulse delay-150" />
          </div>
          <p className="mt-6 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
            LOADING REPORTS LIBRARY...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{
        background: '#050810',
        color: '#E8E0CC',
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Background gradients */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside
        className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden"
      >
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="#" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="8"    x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="17.5" x2="14" y2="20"   stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="8"  y1="14"   x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="17.5" y1="14" x2="20"   y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </a>
        </div>

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}>
            <GridIcon />
            Dashboard
          </NavItem>
          <NavItem href="/UserHoyo/all-report" active={true}>
            <HexIcon />
            All Reports
            <NavBadge>1.2K</NavBadge>
          </NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}>
            <HexDotIcon />
            Mission &amp; Quest
            <NavBadge>482</NavBadge>
          </NavItem>
          <NavItem href="/UserHoyo/event" active={false}>
            <CalendarIcon />
            Event Seasonal
            <NavBadge variant="new">New</NavBadge>
          </NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}>
            <DiamondIcon />
            Puzzle &amp; Riddles
            <NavBadge>324</NavBadge>
          </NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}>
            <UsersIcon />
            Discussion
          </NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}>
            <StarIcon />
            Leaderboard
          </NavItem>
          <NavItem href="/UserHoyo/profile" active={false}>
            <PersonIcon />
            My Profile
          </NavItem>
          <NavItem href="/UserHoyo/settings" active={false}>
            <InfoIcon />
            Settings
          </NavItem>
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">
              TB
            </div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">Trailblazer_01</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}
        >
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Reports — {gameLabels[gameFilter]}
              {filterType !== 'all' && ` / ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Browse community guides, analysis, and walkthroughs</div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div
              className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search reports, quests, events..."
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]"
              />
            </div>
            <button
              className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
              style={{
                background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)',
                ...clipBtn,
              }}
            >
              + Write Report
            </button>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span
                key={g}
                style={clipHex}
                className={gamePillClass(g)}
                onClick={() => setGameFilter(g)}
              >
                {gameLabels[g]}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <ReportsTable
              filteredReports={filteredReports}
              filterType={filterType}
              setFilterType={setFilterType}
            />
            <RightWidgets />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}