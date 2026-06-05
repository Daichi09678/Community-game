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
import { EventCard } from './EventCard';
import { FeaturedBanner } from './FeaturedBanner';
import { RightWidgets } from './RightWidgets';
import { clipHex, clipHexSm, clipBtn } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type EventStatus = 'live' | 'upcoming' | 'ended';
type CategoryFilter = 'all' | 'limited' | 'permanent' | 'collab' | 'seasonal';
type GameFilter = 'all' | GameKey;

interface HoyoEvent {
  id: number;
  title: string;
  game: GameKey;
  status: EventStatus;
  category: 'limited' | 'permanent' | 'collab' | 'seasonal';
  startDate: string;
  endDate: string;
  daysLeft: number;
  rewards: string[];
  description: string;
  tag: string;
  version: string;
  featured?: boolean;
}

const eventsData: HoyoEvent[] = [
  {
    id: 1,
    title: 'Clouded Sanctuary',
    game: 'hsr',
    status: 'live',
    category: 'limited',
    startDate: 'Jun 5',
    endDate: 'Jun 23',
    daysLeft: 14,
    rewards: ['×60 Stellar Jade', '×1 5★ Light Cone', '×80,000 Credits'],
    description: 'Traverse the collapsed Archive and uncover the truth buried beneath the crystalline ruins of Penacony.',
    tag: 'Story Event',
    version: '3.2',
    featured: true,
  },
  {
    id: 2,
    title: 'Vibro-Crystal Research',
    game: 'hsr',
    status: 'live',
    category: 'permanent',
    startDate: 'Jun 5',
    endDate: 'Jun 25',
    daysLeft: 16,
    rewards: ['×40 Stellar Jade', '×1 4★ Relic Set'],
    description: 'Equip Vibro-Crystals to unlock new abilities and complete challenges across multiple stages.',
    tag: 'Combat',
    version: '3.2',
  },
  {
    id: 3,
    title: 'Natlan Archon Quest: Embers of Cabrakan',
    game: 'gi',
    status: 'live',
    category: 'limited',
    startDate: 'Jun 5',
    endDate: 'Jul 1',
    daysLeft: 22,
    rewards: ['×420 Primogems', '×1 Crown of Insight', '×200,000 Mora'],
    description: 'Dive deeper into the mysteries of the land of warfare. Aid the People of Tepus in their eternal trial of flame.',
    tag: 'Archon Quest',
    version: '5.3',
    featured: true,
  },
  {
    id: 4,
    title: 'HoloFest: Neon Carnival',
    game: 'zzz',
    status: 'live',
    category: 'seasonal',
    startDate: 'Jun 4',
    endDate: 'Jun 24',
    daysLeft: 15,
    rewards: ['×60 Polychrome', '×1 W-Engine Selector', '×40 Master Tapes'],
    description: 'New Eridu\'s biggest holographic festival has arrived. Compete in rhythm battles and collect exclusive carnival rewards.',
    tag: 'Seasonal',
    version: '1.4',
    featured: true,
  },
  {
    id: 5,
    title: 'Elysian Realm: Season 14',
    game: 'hi3',
    status: 'live',
    category: 'permanent',
    startDate: 'Jun 1',
    endDate: 'Jun 30',
    daysLeft: 21,
    rewards: ['×288 Crystals', '×1 ELF Shard', '×4,000 Coins'],
    description: 'Enter the realm of imagination. New Remembrance Sigils and enemy compositions challenge even veteran Captains.',
    tag: 'Roguelike',
    version: '7.4',
  },
  {
    id: 6,
    title: 'Memokeeper\'s Expedition',
    game: 'hsr',
    status: 'upcoming',
    category: 'limited',
    startDate: 'Jun 26',
    endDate: 'Jul 14',
    daysLeft: 35,
    rewards: ['×80 Stellar Jade', '×1 5★ Character Select', '×100,000 Credits'],
    description: 'A brand new story chapter unfolds as Trailblazers follow Misha and the Memokeeper across frozen Belobog ruins.',
    tag: 'Story Event',
    version: '3.3',
  },
  {
    id: 7,
    title: 'Midsummer Island Adventure',
    game: 'gi',
    status: 'upcoming',
    category: 'seasonal',
    startDate: 'Jun 28',
    endDate: 'Jul 19',
    daysLeft: 37,
    rewards: ['×420 Primogems', '×1 4★ Weapon', '×6 Hero\'s Wit'],
    description: 'Golden Apple Archipelago returns for a limited time. Explore rearranged islands with new puzzles and summer lore.',
    tag: 'Summer Event',
    version: '5.4',
  },
  {
    id: 8,
    title: 'Hollow Deep: Infiltration',
    game: 'zzz',
    status: 'upcoming',
    category: 'collab',
    startDate: 'Jul 2',
    endDate: 'Jul 22',
    daysLeft: 41,
    rewards: ['×80 Polychrome', '×1 Collab Bangboo', '×10 Investigation Point'],
    description: 'A cross-franchise infiltration arc. New Hollow configurations and exclusive collaboration cosmetics await.',
    tag: 'Collab',
    version: '1.5',
  },
  {
    id: 9,
    title: 'Superstring Dimension',
    game: 'hi3',
    status: 'ended',
    category: 'limited',
    startDate: 'May 1',
    endDate: 'May 31',
    daysLeft: 0,
    rewards: ['×120 Crystals', '×1 S-Rank Stigmata'],
    description: 'Battle in the superstring realm against manifestations of ancient Honkai will.',
    tag: 'Combat',
    version: '7.3',
  },
  {
    id: 10,
    title: 'Penacony Theater Week',
    game: 'hsr',
    status: 'ended',
    category: 'seasonal',
    startDate: 'May 10',
    endDate: 'May 28',
    daysLeft: 0,
    rewards: ['×60 Stellar Jade', '×1 4★ Light Cone'],
    description: 'A theatrical event set in the dream-world of Penacony, with stage-play mechanics and narrative choices.',
    tag: 'Seasonal',
    version: '3.1',
  },
];

const gameLabels: Record<GameFilter, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

export function EventSeasonalClient() {
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('live');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = eventsData.filter(e => {
    const g = gameFilter === 'all' || e.game === gameFilter;
    const s = statusFilter === 'all' || e.status === statusFilter;
    const c = categoryFilter === 'all' || e.category === categoryFilter;
    return g && s && c;
  });

  const featuredEvents = filteredEvents.filter(e => e.featured && e.status === 'live');

  const gamePillClass = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const colors: Record<string, string> = {
      all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
    };
    const c = colors[g];
    const isActive = gameFilter === g;
    const style = { clipPath: (clipHex as any).clipPath, borderColor: isActive ? c : 'transparent', color: isActive ? c : '#5A5248', background: isActive ? `${c}14` : 'rgba(255,255,255,0.03)' };
    return { className: base, style };
  };

  if (loading) {
    return <LoadingAnimation message="LOADING EVENTS..." />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG Gradients */}
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
          <NavItem active={true}><CalendarIcon />Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon />Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>
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
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}
        >
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Event Seasonal — {gameLabels[gameFilter]}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Track live, upcoming, and concluded events across all Hoyoverse games</div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div
              className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-56 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search events..." className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
            </div>
            {/* View toggle */}
            <div className="flex border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipHexSm}>
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className="px-3 py-[7px] text-[0.7rem] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all duration-200 border-none"
                  style={{
                    background: viewMode === v ? 'rgba(200,169,110,0.1)' : 'transparent',
                    color: viewMode === v ? '#C8A96E' : '#5A5248',
                  }}
                >
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Game Pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => {
              const pill = gamePillClass(g);
              return (
                <span
                  key={g}
                  className={pill.className}
                  style={pill.style}
                  onClick={() => setGameFilter(g)}
                >
                  {gameLabels[g]}
                </span>
              );
            })}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Status filter */}
            <div className="flex gap-[5px]">
              {(['all', 'live', 'upcoming', 'ended'] as const).map(s => (
                <button
                  key={s}
                  style={clipHexSm}
                  onClick={() => setStatusFilter(s)}
                  className={`px-[12px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer
                    ${statusFilter === s
                      ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)] hover:text-[#9A8F78]'
                    }`}
                >
                  {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-[rgba(200,169,110,0.15)]" />

            {/* Category filter */}
            <div className="flex gap-[5px]">
              {(['all', 'limited', 'permanent', 'collab', 'seasonal'] as const).map(c => (
                <button
                  key={c}
                  style={clipHexSm}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-[10px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer
                    ${categoryFilter === c
                      ? 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.5)] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:text-[#9A8F78]'
                    }`}
                >
                  {c === 'all' ? 'All Types' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
              {filteredEvents.length} events
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              {/* Featured banners (only when status=live or all) */}
              {featuredEvents.length > 0 && (statusFilter === 'live' || statusFilter === 'all') && (
                <div className="mb-6">
                  <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] mb-3">
                    ◆ Featured This Patch
                  </div>
                  {featuredEvents.map(ev => (
                    <FeaturedBanner key={ev.id} event={ev} />
                  ))}
                </div>
              )}

              {/* Non-featured events */}
              {(() => {
                const rest = filteredEvents.filter(e => !e.featured || e.status !== 'live' || statusFilter === 'ended');
                if (rest.length === 0 && featuredEvents.length === 0) {
                  return (
                    <div className="text-center py-16 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                      No events found for this filter.
                    </div>
                  );
                }
                if (rest.length === 0) return null;
                return (
                  <div>
                    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] mb-3">
                      ◆ All Events
                    </div>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4 max-[780px]:grid-cols-1' : 'flex flex-col gap-4'}>
                      {rest.map(ev => (
                        <EventCard key={ev.id} event={ev} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <RightWidgets events={eventsData} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
      `}</style>
    </div>
  );
}