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
import { LeaderboardRow } from './LeaderboardRow';
import { Podium } from './Podium';
import { RightWidgets } from './RightWidgets';
import { clipHex, clipHexSm, clipBtn, clipWidget } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type SortMode = 'votes' | 'reports' | 'streak' | 'level';
type PeriodMode = 'alltime' | 'monthly' | 'weekly';

interface User {
  rank: number;
  name: string;
  initials: string;
  level: number;
  game: string;
  reports: number;
  votes: number;
  badges: string[];
  streak: number;
  title: string;
  change: number;
}

// Export untuk digunakan di file lain
export const gameAccentMap: Record<string, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

const leaderboardData: User[] = [
  { rank: 1,  name: "Cocolia_Arc",    initials: "CA", level: 85, game: "hsr", reports: 312, votes: 14820, badges: ["🏆", "⭐", "🔥"], streak: 47, title: "Stellaron Hunter",   change: 0  },
  { rank: 2,  name: "QuantumGale",    initials: "QG", level: 78, game: "hsr", reports: 289, votes: 12340, badges: ["⭐", "🔥"],       streak: 31, title: "Trailblaze Elite", change: 1  },
  { rank: 3,  name: "SilverWolf_Fan", initials: "SW", level: 74, game: "gi",  reports: 241, votes: 10980, badges: ["⭐", "💎"],       streak: 28, title: "Archon Scribe",    change: -1 },
  { rank: 4,  name: "VoidHunter_X",   initials: "VH", level: 71, game: "gi",  reports: 198, votes: 9210,  badges: ["🔥"],            streak: 19, title: "Lore Keeper",      change: 2  },
  { rank: 5,  name: "AstreaN_7",      initials: "AN", level: 68, game: "hsr", reports: 187, votes: 8760,  badges: ["💎"],            streak: 14, title: "Memo Scout",       change: 0  },
  { rank: 6,  name: "ImaginaryRift",  initials: "IR", level: 65, game: "zzz", reports: 164, votes: 7430,  badges: ["🔥"],            streak: 22, title: "Hollow Diver",     change: 3  },
  { rank: 7,  name: "Mei_Stellaron",  initials: "MS", level: 62, game: "zzz", reports: 152, votes: 6890,  badges: [],                streak: 11, title: "Event Chaser",     change: -2 },
  { rank: 8,  name: "TrailBossKai",   initials: "TK", level: 59, game: "hi3", reports: 143, votes: 6210,  badges: ["💎"],            streak: 8,  title: "Valkyrie Scholar", change: 1  },
  { rank: 9,  name: "NovaSerpent",    initials: "NS", level: 57, game: "gi",  reports: 131, votes: 5670,  badges: [],                streak: 5,  title: "World Wanderer",   change: -1 },
  { rank: 10, name: "ElyseaCore",     initials: "EC", level: 54, game: "hi3", reports: 118, votes: 4920,  badges: [],                streak: 3,  title: "Battle Historian", change: 4  },
  { rank: 11, name: "PrismaticArc",   initials: "PA", level: 52, game: "hsr", reports: 109, votes: 4410,  badges: [],                streak: 7,  title: "Memo Scout",       change: 0  },
  { rank: 12, name: "ZephyrBlade",    initials: "ZB", level: 50, game: "zzz", reports: 97,  votes: 3870,  badges: [],                streak: 2,  title: "Hollow Diver",     change: -3 },
];

export function LeaderboardClient() {
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('votes');
  const [periodMode, setPeriodMode] = useState<PeriodMode>('alltime');
  const [showPodium, setShowPodium] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const accentColor = gameAccentMap[activeGame];

  const filteredData = leaderboardData
    .filter(u => activeGame === 'all' || u.game === activeGame)
    .sort((a, b) => {
      if (sortMode === 'votes') return b.votes - a.votes;
      if (sortMode === 'reports') return b.reports - a.reports;
      if (sortMode === 'streak') return b.streak - a.streak;
      return b.level - a.level;
    })
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = filteredData.slice(0, 3);

  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const aMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi: 'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi: 'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${activeGame === g ? aMap[g] : hMap[g]}`;
  };

  if (loading) {
    return <LoadingAnimation message="LOADING LEADERBOARD..." />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%),
          radial-gradient(ellipse 30% 30% at 50% 50%, rgba(200,169,110,0.02) 0%, transparent 60%)`,
      }} />

      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
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
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports<NavBadge>1.2K</NavBadge></NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={true}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">TB</div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">Trailblazer_01</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · Rank #48</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Leaderboard</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">{gameLabels[activeGame]} · Season aktif</div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipBtn}>
              {(['alltime', 'monthly', 'weekly'] as const).map((p, i) => (
                <button key={p} onClick={() => setPeriodMode(p)}
                  className={`px-[14px] py-[7px] text-[0.72rem] font-bold tracking-[0.08em] uppercase cursor-pointer border-none transition-all duration-200 font-['Rajdhani',sans-serif]
                    ${periodMode === p ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'bg-transparent text-[#5A5248] hover:text-[#9A8F78]'}`}>
                  {p === 'alltime' ? 'All Time' : p === 'monthly' ? 'Bulan Ini' : 'Minggu Ini'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPodium(p => !p)}
              className="px-[16px] py-[8px] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-[rgba(200,169,110,0.3)] text-[#C8A96E] bg-transparent hover:bg-[rgba(200,169,110,0.08)]"
              style={clipBtn}>
              {showPodium ? '⬆ Sembunyikan Podium' : '⬇ Tampilkan Podium'}
            </button>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="grid grid-cols-4 gap-4 mb-8 max-[1100px]:grid-cols-2">
            {[
              { label: 'Total Traveler',  value: '31.6K', change: '↑ +420 bulan ini',    accent: '#C8A96E' },
              { label: 'Top Contributor', value: 'Cocolia_Arc', change: '14.8K total votes', accent: '#4ECDC4' },
              { label: 'Streak Terpanjang', value: '47 hari', change: 'oleh Cocolia_Arc',   accent: '#A855F7' },
              { label: 'Report Terbanyak', value: '312',    change: 'Cocolia_Arc · HSR',    accent: '#E05C7A' },
            ].map((card, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: card.accent }} />
                <div className="text-[0.64rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-[6px]">{card.label}</div>
                <div className="font-['Space_Mono',monospace] text-[1.3rem] font-bold leading-tight" style={{ color: card.accent }}>{card.value}</div>
                <div className="text-[0.68rem] text-[#4ECDC4] mt-1">{card.change}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setActiveGame(g)}>
                {gameLabels[g]}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              {showPodium && top3.length >= 3 && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] mb-5 relative overflow-hidden" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #C8A96E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <div className="relative">
                    <div className="text-center pt-5 pb-1">
                      <span className="font-['Cinzel',serif] text-[0.72rem] tracking-[0.2em] uppercase text-[#5A5248]">
                        ── Hall of Fame ──
                      </span>
                    </div>
                    <Podium top3={top3} accentColor={accentColor} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="font-['Cinzel',serif] text-[0.88rem] font-semibold text-[#E8E0CC]">
                  Semua Peringkat <span className="text-[#5A5248] font-['Space_Mono',monospace] text-[0.72rem] ml-2">({filteredData.length} players)</span>
                </div>
                <div className="flex gap-[5px]">
                  {([
                    { key: 'votes',   label: '↑ Votes'   },
                    { key: 'reports', label: '📄 Reports' },
                    { key: 'streak',  label: '🔥 Streak'  },
                    { key: 'level',   label: '⚡ Level'   },
                  ] as const).map(s => (
                    <button key={s.key} style={clipHexSm}
                      onClick={() => setSortMode(s.key as SortMode)}
                      className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.06em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                        ${sortMode === s.key
                          ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                          : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)] hover:text-[#9A8F78]'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipWidget}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Rank', '±', 'Player', 'Game', 'Level', 'Reports', 'Votes', 'Streak'].map(h => (
                        <th key={h} className="px-4 py-[10px] text-left text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-10 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                          Tidak ada data untuk filter ini.
                        </td>
                      </tr>
                    ) : filteredData.map((u) => (
                      <LeaderboardRow
                        key={u.name}
                        user={u}
                        sortMode={sortMode}
                        accentColor={accentColor}
                        isMe={u.name === 'AstreaN_7'}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] p-4 flex items-center justify-between" style={clipWidget}>
                <div className="flex items-center gap-3">
                  <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#5A5248]">Posisi kamu saat ini:</span>
                  <span className="font-['Cinzel',serif] text-[0.88rem] font-bold text-[#C8A96E]">#48 Global</span>
                  <span className="text-[0.72rem] text-[#6DD18A]">▲ 3 dari minggu lalu</span>
                </div>
                <button className="px-[14px] py-[6px] font-['Rajdhani',sans-serif] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#C8A96E] bg-transparent hover:bg-[rgba(200,169,110,0.08)] transition-all duration-200"
                  style={clipHexSm}>
                  Lihat posisi saya →
                </button>
              </div>
            </div>

            <RightWidgets accentColor={accentColor} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}