'use client';

import { useState } from 'react';

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

const topItemsData = [
  { title: "Robin Companion Quest — Character Analysis", score: "521 votes" },
  { title: "Simulated Universe World 10 — Full Guide",   score: "412 votes" },
  { title: "HoloFest Event — All Stages & Rewards",      score: "334 votes" },
  { title: "Chasca Hangout Quest — All Endings",         score: "298 votes" },
  { title: "Where the Stairway Leads — Review",          score: "248 votes" },
];

const tagsData = [
  { label: 'Natlan',            variant: 'default', game: 'gi'  },
  { label: 'Robin',             variant: 'gold',    game: 'hsr' },
  { label: 'HSR 3.2',           variant: 'cyan',    game: 'hsr' },
  { label: 'Simulated Universe',variant: 'purple',  game: 'hsr' },
  { label: 'Liyue Lore',        variant: 'default', game: 'gi'  },
  { label: 'Acheron',           variant: 'default', game: 'hsr' },
  { label: 'Hollow Zero',       variant: 'purple',  game: 'zzz' },
  { label: 'Elysian Realm',     variant: 'cyan',    game: 'hi3' },
  { label: 'Zenless 1.4',       variant: 'default', game: 'zzz' },
  { label: 'Hidden Achievement',variant: 'default', game: 'gi'  },
];

const days   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const vals   = [24, 38, 31, 52, 44, 67, 48];
const maxVal = Math.max(...vals);

const rankStyles = [
  'text-[#C8A96E]',  // #1 gold
  'text-[#C8A96E]',  // #2 gold
  'text-[#9AA0AA]',  // #3 silver
  'text-[#9AA0AA]',  // #4 silver
  'text-[#CD7F32]',  // #5 bronze
];

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
};

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type TypeFilter = 'all' | 'mission' | 'event' | 'puzzle';

// clip-path polygon helpers as inline styles
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`}
      style={clipBadge}
    >
      {g.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    mission: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
    event:   'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
    puzzle:  'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
  };
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span
      className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${map[type] ?? ''}`}
      style={clipBadge}
    >
      {label}
    </span>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ReportsTable({
  filteredReports,
  filterType,
  setFilterType,
}: {
  filteredReports: typeof reportsData;
  filterType: TypeFilter;
  setFilterType: (f: TypeFilter) => void;
}) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-['Cinzel'] text-[0.95rem] font-semibold text-[#E8E0CC]">Reports Library</div>
        <div className="text-[#5A5248] text-[0.75rem] font-['Space_Mono',monospace]">{filteredReports.length} reports found</div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-[6px] mb-5">
        {(['all', 'mission', 'event', 'puzzle'] as const).map(f => (
          <button
            key={f}
            style={clipHexSm}
            onClick={() => setFilterType(f)}
            className={`px-[14px] py-[6px] text-[0.78rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
              ${filterType === f
                ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#9A8F78] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'
              }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-[#0C1220] border border-[rgba(200,169,110,0.15)]">
        <thead>
          <tr>
            {['Report Title', 'Game', 'Type', 'Author', 'Rating', 'Votes', 'Date'].map(h => (
              <th
                key={h}
                className="px-4 py-[10px] text-left text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReports.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-8 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                No reports found for this filter.
              </td>
            </tr>
          ) : filteredReports.map((report, idx) => (
            <tr key={idx} className="group hover:[&>td]:bg-[rgba(200,169,110,0.03)]">
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <span className="font-semibold text-[#E8E0CC] cursor-pointer transition-colors duration-200 hover:text-[#C8A96E]">
                  {report.title}
                </span>
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <GameBadge game={report.game} />
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <TypeBadge type={report.type} />
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <div className="flex items-center gap-2">
                  <div
                    className="w-[26px] h-[26px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] text-[#C8A96E] font-bold shrink-0"
                  >
                    {report.initials}
                  </div>
                  <span className="text-[0.82rem] text-[#9A8F78]">{report.author}</span>
                </div>
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <span className="text-[0.75rem] text-[#C8A96E] tracking-[1px]">{renderStars(report.rating)}</span>
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                <span className="font-['Space_Mono',monospace] text-[0.78rem] text-[#4ECDC4]">↑ {report.votes}</span>
              </td>
              <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle text-[#5A5248] text-[0.78rem] font-['Space_Mono',monospace]">
                {report.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightWidgets() {
  const tagVariantClass: Record<string, string> = {
    default: 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.2)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)]',
    gold:    'bg-[rgba(200,169,110,0.12)] border-[rgba(200,169,110,0.3)] text-[#F0D080] hover:bg-[rgba(200,169,110,0.2)]',
    cyan:    'bg-[rgba(78,205,196,0.08)] border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.15)]',
    purple:  'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]',
  };

  const gameCoverage = [
    { label: 'Honkai: Star Rail', pct: 42, fill: 'bg-[#4ECDC4]' },
    { label: 'Genshin Impact',    pct: 35, fill: 'bg-[#6DD18A]' },
    { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
    { label: 'Honkai Impact 3rd', pct: 8,  fill: 'bg-[#E05C7A]' },
  ];

  return (
    <div>
      {/* Top Reports */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Top Reports
        </div>
        {topItemsData.map((item, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.82rem] text-[#9A8F78] cursor-pointer transition-colors duration-200 hover:text-[#E8E0CC] leading-[1.3]">
              {item.title}
            </span>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{item.score}</span>
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Trending Tags
        </div>
        <div className="-mt-1">
          {tagsData.map((tag, i) => (
            <span
              key={i}
              style={clipBadge}
              className={`inline-block px-[10px] py-[3px] border text-[0.7rem] font-semibold m-[3px] cursor-pointer transition-all duration-200 ${tagVariantClass[tag.variant]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Activity This Week
        </div>
        <div className="flex items-end gap-[6px] h-16">
          {days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                style={{
                  width: '100%',
                  background: i === 5 ? '#C8A96E' : 'rgba(200,169,110,0.25)',
                  borderTop: `0.5px solid ${i === 5 ? '#C8A96E' : 'rgba(200,169,110,0.4)'}`,
                  height: `${Math.round((vals[i] / maxVal) * 52) + 8}px`,
                  transition: 'height 0.3s',
                }}
              />
              <span className="text-[0.6rem] text-[#5A5248]">{day}</span>
            </div>
          ))}
        </div>
        <div className="text-right mt-2 text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
          304 total reports this week
        </div>
      </div>

      {/* Game Coverage */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Game Coverage
        </div>
        {gameCoverage.map((g, i) => (
          <div key={i} className="mb-[10px]">
            <div className="flex justify-between mb-1">
              <span className="text-[0.75rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className={`h-full ${g.fill} transition-all duration-[600ms] ease-in-out`} style={{ width: `${g.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AllReportPage() {
  const [filterType, setFilterType] = useState<TypeFilter>('all');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');

  const handleCategoryFilter = (type: TypeFilter) => setFilterType(type);

  const filteredReports = reportsData.filter(r => {
    const matchGame = gameFilter === 'all' || r.game === gameFilter;
    const matchType = filterType === 'all' || r.type === filterType;
    return matchGame && matchType;
  });

  const gameLabels: Record<string, string> = {
    all: 'All Games', hsr: 'Honkai: Star Rail',
    gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
  };

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
        {/* Header */}
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

        {/* Nav */}
        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>

          <NavItem href="/UserHoyo/dashboard" active={false}>
            <GridIcon />
            Dashboard
          </NavItem>

          <NavItem href="/" active={true}>
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

          <NavItem href= "/UserHoyo/discussion" active= {false}>
            <UsersIcon />
            Discussion
          </NavItem>

          <NavItem href= "/UserHoyo/leaderboard" active= {false}>
            <StarIcon />
            Leaderboard
          </NavItem>

         <NavItem href= "/UserHoyo/profie" active= {false}>
            <PersonIcon />
            My Profile
          </NavItem>

          <NavItem href= "/UserHoyo/settings" active= {false}>
            <InfoIcon />
            Settings
          </NavItem>
        </nav>

        {/* Footer */}
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
        {/* Topbar */}
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
            {/* Search */}
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
            {/* Button */}
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

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Game Pills */}
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

          {/* Content Grid */}
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

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}

// ─── SMALL REUSABLE NAV COMPONENTS ───────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span
      className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
        ${variant === 'new'
          ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]'
          : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'
        }`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

function NavItem({
  children,
  href,
  active,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  active: boolean;
  onClick?: () => void;
}) {
  const cls = `
    flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em]
    transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    ${active
      ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
      : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'
    }
  `;
  const style: React.CSSProperties = {
    clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
  };

  const inner = (
    <>
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />
      )}
      {children}
    </>
  );

  if (href) {
    return <a href={href} className={cls} style={style}>{inner}</a>;
  }
  return <div className={cls} style={style} onClick={onClick}>{inner}</div>;
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
  </svg>
);
const HexIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const HexDotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8"  y1="5"  x2="11" y2="8"  stroke="currentColor" strokeWidth="0.8"/>
    <line x1="11" y1="8"  x2="8"  y2="11" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="8"  y1="11" x2="5"  y2="8"  stroke="currentColor" strokeWidth="0.8"/>
    <line x1="5"  y1="8"  x2="8"  y2="5"  stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="0.7" fill="currentColor"/>
  </svg>
);