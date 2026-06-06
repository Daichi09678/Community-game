'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── THEME CONSTANTS ────────────────────────────────────────────────────────
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' };
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' };
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' };
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' };

// ─── DATA ───────────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'all', label: 'Semua Game' },
  { id: 'hsr', label: 'Star Rail' },
  { id: 'gi',  label: 'Genshin' },
  { id: 'zzz', label: 'Zenless' },
  { id: 'hi3', label: 'Honkai 3rd' },
];

const GAME_COLORS: Record<string, string> = {
  hsr: '#4ECDC4',
  gi:  '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

const GAME_LABELS: Record<string, string> = {
  hsr: 'Star Rail',
  gi:  'Genshin',
  zzz: 'Zenless',
  hi3: 'Honkai 3rd',
};

interface Tag {
  id: number;
  name: string;
  game: string;
  posts: number;
  trend: number;
  hot: boolean;
  new: boolean;
  category: string;
}

const ALL_TAGS: Tag[] = [
  // ── HSR
  { id: 1,  name: 'HSR 3.2',         game: 'hsr', posts: 3842, trend: +24.1, hot: true,  new: false, category: 'Patch' },
  { id: 2,  name: 'Robin',           game: 'hsr', posts: 2914, trend: +18.5, hot: true,  new: false, category: 'Character' },
  { id: 3,  name: 'Penacony',        game: 'hsr', posts: 2106, trend: +12.3, hot: false, new: false, category: 'World' },
  { id: 4,  name: 'The Watchmaker',  game: 'hsr', posts: 1733, trend: +31.7, hot: true,  new: true,  category: 'Story' },
  { id: 5,  name: 'Acheron',         game: 'hsr', posts: 1589, trend: +9.2,  hot: false, new: false, category: 'Character' },
  { id: 6,  name: 'Ruan Mei',        game: 'hsr', posts: 1347, trend: +5.6,  hot: false, new: false, category: 'Character' },
  { id: 7,  name: 'Dream World',     game: 'hsr', posts: 980,  trend: +41.0, hot: true,  new: true,  category: 'Story' },
  { id: 8,  name: 'Pure Fiction',    game: 'hsr', posts: 874,  trend: -3.1,  hot: false, new: false, category: 'Mode' },
  { id: 9,  name: 'Moc 12',         game: 'hsr', posts: 712,  trend: +2.4,  hot: false, new: false, category: 'Mode' },
  { id: 10, name: 'Sunday',          game: 'hsr', posts: 639,  trend: +58.2, hot: true,  new: true,  category: 'Character' },
  // ── GI
  { id: 11, name: 'Natlan 4.8',      game: 'gi',  posts: 4120, trend: +29.3, hot: true,  new: false, category: 'Patch' },
  { id: 12, name: 'Xilonen',         game: 'gi',  posts: 3011, trend: +22.8, hot: true,  new: false, category: 'Character' },
  { id: 13, name: 'Mavuika',         game: 'gi',  posts: 2688, trend: +17.4, hot: true,  new: false, category: 'Character' },
  { id: 14, name: 'Archon Quest',    game: 'gi',  posts: 1900, trend: +8.1,  hot: false, new: false, category: 'Story' },
  { id: 15, name: 'Ley Line',        game: 'gi',  posts: 730,  trend: -1.2,  hot: false, new: false, category: 'Mode' },
  { id: 16, name: 'Chasca',          game: 'gi',  posts: 1102, trend: +44.6, hot: true,  new: true,  category: 'Character' },
  // ── ZZZ
  { id: 17, name: 'ZZZ 1.5',         game: 'zzz', posts: 2430, trend: +33.2, hot: true,  new: false, category: 'Patch' },
  { id: 18, name: 'Jane Doe',        game: 'zzz', posts: 1876, trend: +19.7, hot: true,  new: false, category: 'Character' },
  { id: 19, name: 'Hollow Zero',     game: 'zzz', posts: 1543, trend: +7.4,  hot: false, new: false, category: 'Mode' },
  { id: 20, name: 'New Eridu',       game: 'zzz', posts: 1210, trend: +11.5, hot: false, new: false, category: 'World' },
  { id: 21, name: 'Burnice',         game: 'zzz', posts: 988,  trend: +52.1, hot: true,  new: true,  category: 'Character' },
  // ── HI3
  { id: 22, name: 'HI3 7.5',         game: 'hi3', posts: 1780, trend: +14.2, hot: false, new: false, category: 'Patch' },
  { id: 23, name: 'Fischl',          game: 'hi3', posts: 1320, trend: +6.9,  hot: false, new: false, category: 'Character' },
  { id: 24, name: 'Abyss',           game: 'hi3', posts: 940,  trend: -4.7,  hot: false, new: false, category: 'Mode' },
  { id: 25, name: 'Hua',             game: 'hi3', posts: 830,  trend: +37.8, hot: true,  new: true,  category: 'Character' },
];

const CATEGORIES = ['Semua', 'Character', 'Story', 'Patch', 'Mode', 'World'];

const SORT_OPTIONS = [
  { id: 'posts',  label: 'Most Posts' },
  { id: 'trend',  label: 'Trending' },
  { id: 'name',   label: 'A–Z' },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function GameBadge({ game }: { game: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    hsr: { label: 'Star Rail',  cls: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
    gi:  { label: 'Genshin',    cls: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
    zzz: { label: 'Zenless',    cls: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
    hi3: { label: 'Honkai 3rd', cls: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
  };
  const g = map[game] || map.hsr;
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase ${g.cls}`}
      style={clipBadge}
    >
      {g.label}
    </span>
  );
}

function SectionHeader({ icon, title, accent = '#C8A96E', subtitle }: { icon: React.ReactNode; title: string; accent?: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="flex items-center justify-center w-8 h-8 border"
        style={{ borderColor: `${accent}40`, background: `${accent}12`, clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)', color: accent }}
      >
        {icon}
      </div>
      <div>
        <h2 className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC] tracking-[0.06em]">{title}</h2>
        {subtitle && <p className="text-[0.68rem] text-[#5A5248] tracking-[0.06em] uppercase mt-[1px]">{subtitle}</p>}
      </div>
      <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
    </div>
  );
}

// ─── TAG CARD ───────────────────────────────────────────────────────────────
function TagCard({ tag, rank, compact = false }: { tag: Tag; rank: number; compact?: boolean }) {
  const [following, setFollowing] = useState(false);
  const color = GAME_COLORS[tag.game] || '#C8A96E';
  const isRising = tag.trend > 0;
  const absT = Math.abs(tag.trend).toFixed(1);

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 bg-[#0C1220] border border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.3)] transition-all duration-200 cursor-pointer group"
        style={clipHex}
      >
        <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] w-5 shrink-0">#{rank}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.85rem] font-bold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors font-['Rajdhani',sans-serif]">
              {tag.name}
            </span>
            {tag.hot && (
              <span className="text-[0.55rem] font-bold tracking-[0.1em] uppercase px-[6px] py-[2px]"
                style={{ background: 'rgba(200,169,110,0.1)', color: '#C8A96E', ...clipBadge }}>🔥 Hot</span>
            )}
            {tag.new && (
              <span className="text-[0.55rem] font-bold tracking-[0.1em] uppercase px-[6px] py-[2px]"
                style={{ background: 'rgba(78,205,196,0.1)', color: '#4ECDC4', ...clipBadge }}>New</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-[2px]">
            <GameBadge game={tag.game} />
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{tag.posts.toLocaleString()} posts</span>
          </div>
        </div>
        <div className={`font-['Space_Mono',monospace] text-[0.72rem] font-bold ${isRising ? 'text-[#4ECDC4]' : 'text-[#E05C7A]'}`}>
          {isRising ? '↑' : '↓'} {absT}%
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] hover:border-[rgba(200,169,110,0.3)] transition-all duration-300 p-5 relative overflow-hidden group cursor-pointer"
      style={clipWidget}
    >
      <div
        className="absolute bottom-2 right-4 font-['Cinzel',serif] font-bold select-none pointer-events-none"
        style={{ fontSize: '4rem', color: `${color}08`, lineHeight: 1 }}
      >
        {rank.toString().padStart(2, '0')}
      </div>

      <div className="absolute top-0 left-0 w-[2px] h-full" style={{ background: `linear-gradient(180deg, ${color}, transparent)` }} />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {tag.hot && (
                <span className="text-[0.55rem] font-bold tracking-[0.1em] uppercase px-[6px] py-[2px]"
                  style={{ background: 'rgba(200,169,110,0.12)', color: '#C8A96E', ...clipBadge }}>🔥 Hot</span>
              )}
              {tag.new && (
                <span className="text-[0.55rem] font-bold tracking-[0.1em] uppercase px-[6px] py-[2px]"
                  style={{ background: 'rgba(78,205,196,0.1)', color: '#4ECDC4', ...clipBadge }}>New</span>
              )}
              <span className="text-[0.62rem] px-[6px] py-[2px] border"
                style={{ color: `${color}CC`, borderColor: `${color}30`, background: `${color}0A`, ...clipBadge }}>
                {tag.category}
              </span>
            </div>
            <h3 className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors leading-tight">
              #{tag.name}
            </h3>
          </div>
          <div
            className="flex flex-col items-center px-3 py-2 shrink-0"
            style={{
              background: isRising ? 'rgba(78,205,196,0.06)' : 'rgba(224,92,122,0.06)',
              border: `1px solid ${isRising ? 'rgba(78,205,196,0.15)' : 'rgba(224,92,122,0.15)'}`,
              ...clipHexSm,
            }}
          >
            <span className="text-[1.1rem] leading-none">{isRising ? '↑' : '↓'}</span>
            <span className={`font-['Space_Mono',monospace] text-[0.65rem] font-bold ${isRising ? 'text-[#4ECDC4]' : 'text-[#E05C7A]'}`}>
              {absT}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <GameBadge game={tag.game} />
          <div className="flex items-center gap-1">
            <span className="font-['Space_Mono',monospace] text-[0.78rem] text-[#C8A96E] font-bold">{tag.posts.toLocaleString()}</span>
            <span className="text-[0.68rem] text-[#5A5248]">posts</span>
          </div>
        </div>

        <div className="h-[3px] bg-[rgba(255,255,255,0.04)] mb-4 overflow-hidden" style={clipHexSm}>
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${Math.min((tag.posts / 4200) * 100, 100)}%`,
              background: `linear-gradient(90deg, ${color}60, ${color})`,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 px-3 py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase border transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif]"
            style={{
              ...clipHexSm,
              borderColor: following ? `${color}60` : 'rgba(200,169,110,0.2)',
              color: following ? color : '#9A8F78',
              background: following ? `${color}10` : 'transparent',
            }}
            onClick={(e) => { e.stopPropagation(); setFollowing(f => !f); }}
          >
            {following ? '✓ Following' : '+ Follow'}
          </button>
          <a
            href={`/tags/${tag.name.toLowerCase().replace(/ /g, '-')}`}
            className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] hover:text-[#C8A96E] transition-colors font-['Space_Mono',monospace]"
          >
            Lihat semua →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── TOP TAGS BANNER ────────────────────────────────────────────────────────
function TopTagsBanner({ tags }: { tags: Tag[] }) {
  const top3 = tags.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];
  const accentColors = ['#C8A96E', '#9A8F78', '#7A6050'];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 max-[700px]:grid-cols-1">
      {top3.map((tag, i) => {
        const color = GAME_COLORS[tag.game] || '#C8A96E';
        return (
          <div
            key={tag.id}
            className="relative p-5 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, #0C1220, #0A0F1A)`,
              border: `1px solid ${accentColors[i]}25`,
              ...clipWidget,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 60% at 50% 0%, ${accentColors[i]}08, transparent)` }}
            />
            <div className="text-[1.8rem] mb-2">{medals[i]}</div>
            <div className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.2em] uppercase mb-1" style={{ color: accentColors[i] }}>
              Trending #{i + 1}
            </div>
            <div className="font-['Cinzel',serif] text-[1.05rem] font-bold text-[#E8E0CC] mb-2">#{tag.name}</div>
            <GameBadge game={tag.game} />
            <div className="mt-3 font-['Space_Mono',monospace] text-[0.72rem] font-bold" style={{ color: '#4ECDC4' }}>
              ↑ {tag.trend.toFixed(1)}%
            </div>
            <div className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] mt-1">
              {tag.posts.toLocaleString()} posts
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── STATS BAR ──────────────────────────────────────────────────────────────
function StatsBar({ tags }: { tags: Tag[] }) {
  const totalPosts = tags.reduce((a, t) => a + t.posts, 0);
  const hotCount   = tags.filter(t => t.hot).length;
  const newCount   = tags.filter(t => t.new).length;
  const avgTrend   = (tags.reduce((a, t) => a + t.trend, 0) / tags.length).toFixed(1);

  const stats = [
    { label: 'Total Tags',   val: tags.length,              color: '#C8A96E' },
    { label: 'Total Posts',  val: totalPosts.toLocaleString(), color: '#4ECDC4' },
    { label: 'Hot Tags',     val: hotCount,                 color: '#C8A96E' },
    { label: 'New This Week',val: newCount,                 color: '#A855F7' },
    { label: 'Avg. Trend',   val: `+${avgTrend}%`,          color: '#6DD18A' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3 mb-8 max-[800px]:grid-cols-3 max-[500px]:grid-cols-2">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-4 text-center" style={clipWidget}>
          <div className="font-['Space_Mono',monospace] text-[1.1rem] font-bold mb-1" style={{ color: s.color }}>{s.val}</div>
          <div className="text-[0.62rem] text-[#5A5248] tracking-[0.08em] uppercase">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── GAME DISTRIBUTION ──────────────────────────────────────────────────────
function GameDistribution({ tags }: { tags: Tag[] }) {
  const games = ['hsr', 'gi', 'zzz', 'hi3'];
  const total = tags.length;
  const counts = games.map(g => ({ game: g, count: tags.filter(t => t.game === g).length }));

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-8" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.78rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[12px] bg-[#C8A96E]" />
        Distribusi per Game
      </div>
      <div className="flex gap-1 h-3 mb-4 overflow-hidden" style={clipHexSm}>
        {counts.map(({ game, count }) => (
          <div
            key={game}
            style={{ width: `${(count / total) * 100}%`, background: GAME_COLORS[game], transition: 'width 0.5s ease' }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {counts.map(({ game, count }) => (
          <div key={game} className="flex items-center gap-2">
            <div className="w-2 h-2" style={{ background: GAME_COLORS[game], clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }} />
            <span className="text-[0.72rem] text-[#9A8F78]">{GAME_LABELS[game]}</span>
            <span className="font-['Space_Mono',monospace] text-[0.68rem] text-[#5A5248]">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR COMPONENT ──────────────────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();
  
  const NavItem = ({ href, icon, label, badge, isNew }: { href: string; icon: React.ReactNode; label: string; badge?: string; isNew?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 mb-[2px] relative font-['Rajdhani',sans-serif] ${isActive ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`} style={clipHex}>
        {isActive && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
        <span className="w-4 h-4 shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] bg-[rgba(200,169,110,0.15)] text-[#C8A96E]" style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>{badge}</span>}
        {isNew && <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]" style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>New</span>}
      </Link>
    );
  };

  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
      <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
        <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
          </svg>
          Hoyoverse Hub
        </Link>
      </div>
      <nav className="flex-1 px-4 py-5">
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2">Main</div>
        <NavItem href="/UserHoyo/dashboard" icon={<GridIcon />} label="Dashboard" />
        <NavItem href="/UserHoyo/all-report" icon={<HexIcon />} label="All Reports" badge="1.2K" />
        
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Category</div>
        <NavItem href="/UserHoyo/mission&quest" icon={<HexDotIcon />} label="Mission & Quest" badge="482" />
        <NavItem href="/UserHoyo/event" icon={<CalendarIcon />} label="Event Seasonal" isNew />
        <NavItem href="/UserHoyo/puzzle" icon={<DiamondIcon />} label="Puzzle & Riddles" badge="324" />
        
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Explore</div>
        <NavItem href="/UserHoyo/trending-tags" icon={<TagIcon />} label="Trending Tags" isNew />
        
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Community</div>
        <NavItem href="/UserHoyo/discussion" icon={<UsersIcon />} label="Discussion" />
        <NavItem href="/UserHoyo/leaderboard" icon={<StarIcon />} label="Leaderboard" />
        <NavItem href="/UserHoyo/profile" icon={<PersonIcon />} label="My Profile" />
        <NavItem href="/UserHoyo/settings" icon={<InfoIcon />} label="Settings" />
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
  );
}

// ─── ICONS ──────────────────────────────────────────────────────────────────
const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>);
const HexIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>);
const HexDotIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>);
const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>);
const DiamondIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>);
const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>);
const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const InfoIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>);
const TagIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h6l6 6-6 6-6-6V2z" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="1" fill="currentColor"/></svg>);

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function TrendingTagsPage() {
  const [activeGame,     setActiveGame]     = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [sortBy,         setSortBy]         = useState<string>('trend');
  const [search,         setSearch]         = useState<string>('');
  const [viewMode,       setViewMode]       = useState<string>('grid');
  const [showOnlyHot,    setShowOnlyHot]    = useState<boolean>(false);

  const filtered = ALL_TAGS
    .filter(t => activeGame === 'all' || t.game === activeGame)
    .filter(t => activeCategory === 'Semua' || t.category === activeCategory)
    .filter(t => !showOnlyHot || t.hot)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'posts') return b.posts - a.posts;
      if (sortBy === 'trend') return b.trend - a.trend;
      return a.name.localeCompare(b.name);
    });

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
        `
      }} />

      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">

        {/* TOPBAR */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}
        >
          <div className="flex items-center gap-3">
            <Link href="/UserHoyo/dashboard" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.8rem] font-['Space_Mono',monospace]">Home</Link>
            <span className="text-[#5A5248]">/</span>
            <span className="text-[#C8A96E] text-[0.8rem] font-['Space_Mono',monospace]">Trending Tags</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] text-[0.8rem] text-[#E8E0CC] placeholder-[#5A5248] px-3 py-2 pr-8 focus:outline-none focus:border-[#C8A96E] transition-colors font-['Space_Mono',monospace] w-[180px]"
                style={clipHexSm}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="8" y1="8" x2="11" y2="11" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex border border-[rgba(200,169,110,0.2)] overflow-hidden" style={clipHexSm}>
              {['grid', 'list'].map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className="px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all border-none font-['Rajdhani',sans-serif]"
                  style={{
                    background: viewMode === v ? 'rgba(200,169,110,0.15)' : 'transparent',
                    color: viewMode === v ? '#C8A96E' : '#5A5248',
                  }}
                >
                  {v === 'grid' ? '⊞' : '≡'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 flex-1">

          {/* PAGE HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-[#5A5248]">Real-time</span>
              <span className="inline-flex items-center gap-1 px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase bg-[rgba(78,205,196,0.1)] text-[#4ECDC4]" style={clipBadge}>
                <span className="w-[5px] h-[5px] rounded-full bg-[#4ECDC4] animate-pulse inline-block" />
                Live
              </span>
            </div>
            <h1 className="font-['Cinzel',serif] text-[2rem] font-bold text-[#E8E0CC] leading-tight mb-2">
              Trending Tags
            </h1>
            <p className="text-[0.9rem] text-[#9A8F78] max-w-lg">
              Tag yang paling banyak dibicarakan komunitas Hoyoverse hari ini. Diperbarui setiap jam.
            </p>
          </div>

          <StatsBar tags={ALL_TAGS} />

          <SectionHeader
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="7,1 13,4 13,10 7,13 1,10 1,4" stroke="currentColor" strokeWidth="1.1"/><line x1="7" y1="5" x2="7" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="9.5" r="0.7" fill="currentColor"/></svg>}
            title="Top Trending"
            subtitle="Peringkat tertinggi minggu ini"
            accent="#C8A96E"
          />
          <TopTagsBanner tags={[...ALL_TAGS].sort((a, b) => b.trend - a.trend)} />

          <GameDistribution tags={ALL_TAGS} />

          {/* FILTERS */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id)}
                  className="px-4 py-[6px] text-[0.75rem] font-bold tracking-[0.06em] uppercase border transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif]"
                  style={{
                    ...clipHexSm,
                    borderColor: activeGame === g.id ? '#C8A96E' : 'rgba(200,169,110,0.15)',
                    color: activeGame === g.id ? '#C8A96E' : '#5A5248',
                    background: activeGame === g.id ? 'rgba(200,169,110,0.1)' : 'transparent',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowOnlyHot(h => !h)}
                className="px-3 py-[6px] text-[0.72rem] font-bold tracking-[0.06em] uppercase border transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif]"
                style={{
                  ...clipHexSm,
                  borderColor: showOnlyHot ? '#C8A96E' : 'rgba(200,169,110,0.12)',
                  color: showOnlyHot ? '#C8A96E' : '#5A5248',
                  background: showOnlyHot ? 'rgba(200,169,110,0.08)' : 'transparent',
                }}
              >
                🔥 Hot only
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] text-[0.75rem] text-[#9A8F78] px-3 py-[6px] focus:outline-none focus:border-[#C8A96E] cursor-pointer font-['Rajdhani',sans-serif] font-bold uppercase tracking-[0.06em]"
                style={clipHexSm}
              >
                {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="px-3 py-[4px] text-[0.7rem] font-bold tracking-[0.08em] uppercase border transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif]"
                style={{
                  ...clipBadge,
                  borderColor: activeCategory === c ? '#A855F7' : 'rgba(168,85,247,0.15)',
                  color: activeCategory === c ? '#A855F7' : '#5A5248',
                  background: activeCategory === c ? 'rgba(168,85,247,0.08)' : 'transparent',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* RESULTS COUNT */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
              Menampilkan <span className="text-[#C8A96E]">{filtered.length}</span> tag
              {search && <> untuk "<span className="text-[#E8E0CC]">{search}</span>"</>}
            </span>
            {(activeGame !== 'all' || activeCategory !== 'Semua' || search || showOnlyHot) && (
              <button
                onClick={() => { setActiveGame('all'); setActiveCategory('Semua'); setSearch(''); setShowOnlyHot(false); }}
                className="text-[0.68rem] text-[#E05C7A] underline cursor-pointer font-['Space_Mono',monospace] bg-transparent border-none"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* ALL TAGS */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#5A5248] font-['Space_Mono',monospace] text-[0.85rem]">
              Tidak ada tag yang ditemukan.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
              {filtered.map((tag, i) => (
                <TagCard key={tag.id} tag={tag} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((tag, i) => (
                <TagCard key={tag.id} tag={tag} rank={i + 1} compact />
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}