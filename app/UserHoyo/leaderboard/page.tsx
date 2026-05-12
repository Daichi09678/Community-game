'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const leaderboardData = [
  { rank: 1,  name: "Cocolia_Arc",    initials: "CA", level: 85, game: "hsr", reports: 312, votes: 14820, badges: ["🏆","⭐","🔥"], streak: 47, title: "Stellaron Hunter",   change: 0  },
  { rank: 2,  name: "QuantumGale",    initials: "QG", level: 78, game: "hsr", reports: 289, votes: 12340, badges: ["⭐","🔥"],       streak: 31, title: "Trailblaze Elite", change: 1  },
  { rank: 3,  name: "SilverWolf_Fan", initials: "SW", level: 74, game: "gi",  reports: 241, votes: 10980, badges: ["⭐","💎"],       streak: 28, title: "Archon Scribe",    change: -1 },
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

const weeklyTopData = [
  { name: "QuantumGale",    initials: "QG", game: "hsr", weeklyReports: 28, weeklyVotes: 1240 },
  { name: "AstreaN_7",      initials: "AN", game: "hsr", weeklyReports: 24, weeklyVotes: 980  },
  { name: "VoidHunter_X",   initials: "VH", game: "gi",  weeklyReports: 21, weeklyVotes: 870  },
];

const badgeDescMap: Record<string, { label: string; desc: string }> = {
  "🏆": { label: "Champion",   desc: "Rank #1 All-Time" },
  "⭐": { label: "Star Author", desc: "100+ reports di top voted" },
  "🔥": { label: "On Fire",    desc: "Streak 10+ hari berturut" },
  "💎": { label: "Diamond",    desc: "10K+ total votes diterima" },
};

const gameAccentMap: Record<string, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};
const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]  text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'  },
  gi:  { label: 'Genshin',   className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless',   className: 'bg-[rgba(168,85,247,0.1)]  text-[#A855F7] border border-[rgba(168,85,247,0.3)]'  },
  hi3: { label: 'Honkai 3rd',className: 'bg-[rgba(224,92,122,0.1)]  text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'  },
};
const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

type GameFilter  = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type SortMode    = 'votes' | 'reports' | 'streak' | 'level';
type PeriodMode  = 'alltime' | 'monthly' | 'weekly';

// ─── CLIP STYLES ─────────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }           as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }           as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }           as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }    as React.CSSProperties;

// ─── SHARED NAV ───────────────────────────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">{children}</div>;
}
function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
      ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
      {children}
    </span>
  );
}
function NavItem({ children, href, active, onClick }: { children: React.ReactNode; href?: string; active: boolean; onClick?: () => void }) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative font-['Rajdhani',sans-serif]
    ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = <>{active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}{children}</>;
  if (href) return <a href={href} className={cls} style={clipHex}>{inner}</a>;
  return <div className={cls} style={clipHex} onClick={onClick}>{inner}</div>;
}

// ─── BADGE & WIDGET HELPERS ───────────────────────────────────────────────────

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>{g.label}</span>;
}
function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />{children}
    </div>
  );
}

// ─── RANK MEDAL ───────────────────────────────────────────────────────────────

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(200,169,110,0.12)" stroke="#C8A96E" strokeWidth="1.2"/>
        <polygon points="20,7 34,14 34,26 20,33 6,26 6,14" fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.4)" strokeWidth="0.6"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#F0D080]">1</span>
    </div>
  );
  if (rank === 2) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(180,190,200,0.08)" stroke="#9AA0AA" strokeWidth="1.2"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#C0C8D0]">2</span>
    </div>
  );
  if (rank === 3) return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(205,127,50,0.08)" stroke="#CD7F32" strokeWidth="1.2"/>
      </svg>
      <span className="absolute font-['Cinzel',serif] text-[0.75rem] font-bold text-[#CD7F32]">3</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center w-10 h-10 shrink-0">
      <span className="font-['Space_Mono',monospace] text-[0.82rem] text-[#5A5248]">#{rank}</span>
    </div>
  );
}

// ─── CHANGE INDICATOR ─────────────────────────────────────────────────────────

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#5A5248]">—</span>;
  if (change > 0)  return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#6DD18A]">▲{change}</span>;
  return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#E05C7A]">▼{Math.abs(change)}</span>;
}

// ─── PODIUM (TOP 3) ───────────────────────────────────────────────────────────

function Podium({ top3, accentColor }: { top3: typeof leaderboardData; accentColor: string }) {
  // Display order: 2nd, 1st, 3rd
  const order = [top3[1], top3[0], top3[2]];
  const heights = ['h-20', 'h-28', 'h-14'];
  const podiumRanks = [2, 1, 3];
  const medColors = ['#9AA0AA', '#F0D080', '#CD7F32'];
  const avatarSize = ['w-12 h-12', 'w-16 h-16', 'w-10 h-10'];
  const avatarBorder = ['border-[#9AA0AA]', 'border-[#F0D080]', 'border-[#CD7F32]'];
  const nameSize = ['text-[0.78rem]', 'text-[0.9rem]', 'text-[0.72rem]'];

  return (
    <div className="flex items-end justify-center gap-3 mb-8 px-4 pt-6">
      {order.map((user, i) => {
        if (!user) return null;
        const gc = gameAccentMap[user.game as GameFilter] ?? '#C8A96E';
        return (
          <div key={user.rank} className="flex flex-col items-center gap-2" style={{ flex: podiumRanks[i] === 1 ? '0 0 160px' : '0 0 130px' }}>
            {/* Crown for rank 1 */}
            {podiumRanks[i] === 1 && (
              <div className="mb-1">
                <svg width="28" height="18" viewBox="0 0 28 18">
                  <polygon points="2,16 6,4 14,12 22,4 26,16" fill="none" stroke="#F0D080" strokeWidth="1.2" strokeLinejoin="round"/>
                  <circle cx="2"  cy="16" r="2" fill="#F0D080"/>
                  <circle cx="26" cy="16" r="2" fill="#F0D080"/>
                  <circle cx="14" cy="12" r="2" fill="#F0D080"/>
                </svg>
              </div>
            )}

            {/* Avatar */}
            <div className={`${avatarSize[i]} rounded-full border-2 ${avatarBorder[i]} flex items-center justify-center font-['Cinzel',serif] font-bold shrink-0 relative`}
              style={{ background: `${gc}18`, color: gc, fontSize: podiumRanks[i] === 1 ? '0.9rem' : '0.7rem' }}>
              {user.initials}
              {/* glow ring for rank 1 */}
              {podiumRanks[i] === 1 && (
                <div className="absolute inset-[-4px] rounded-full border border-[rgba(240,208,128,0.3)]" />
              )}
            </div>

            {/* Name & info */}
            <div className="text-center">
              <div className={`font-['Rajdhani',sans-serif] font-bold ${nameSize[i]} text-[#E8E0CC]`}>{user.name}</div>
              <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{user.title}</div>
              <div className="flex justify-center gap-1 mt-1">{user.badges.map((b,j) => <span key={j} className="text-[0.7rem]">{b}</span>)}</div>
            </div>

            {/* Podium block */}
            <div className={`w-full ${heights[i]} relative border-t-2 flex flex-col items-center justify-start pt-2 overflow-hidden`}
              style={{ borderColor: medColors[i], background: `linear-gradient(180deg, ${medColors[i]}18 0%, transparent 100%)` }}>
              <span className="font-['Cinzel',serif] text-[1.1rem] font-bold" style={{ color: medColors[i] }}>#{podiumRanks[i]}</span>
              <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] mt-[2px]">
                {user.votes.toLocaleString()} pts
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LEADERBOARD ROW ─────────────────────────────────────────────────────────

function LeaderboardRow({ user, sortMode, accentColor, isMe }: {
  user: typeof leaderboardData[0]; sortMode: SortMode; accentColor: string; isMe?: boolean;
}) {
  const gc = gameAccentMap[user.game as GameFilter] ?? '#C8A96E';
  const highlightVal = sortMode === 'votes' ? user.votes.toLocaleString()
    : sortMode === 'reports' ? user.reports.toString()
    : sortMode === 'streak'  ? `${user.streak}d`
    : `LV.${user.level}`;

  return (
    <tr className={`group transition-all duration-150 ${isMe ? 'bg-[rgba(200,169,110,0.05)]' : 'hover:[&>td]:bg-[rgba(200,169,110,0.02)]'}`}>
      {/* Rank */}
      <td className={`px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle ${isMe ? 'border-l-2 border-l-[#C8A96E]' : ''}`}>
        <RankMedal rank={user.rank} />
      </td>

      {/* Change */}
      <td className="px-2 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle text-center">
        <ChangeIndicator change={user.change} />
      </td>

      {/* Player */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] font-bold shrink-0"
            style={{ background: `${gc}18`, borderColor: `${gc}80`, color: gc }}>
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-[0.88rem] font-['Rajdhani',sans-serif] ${isMe ? 'text-[#C8A96E]' : 'text-[#E8E0CC]'} cursor-pointer hover:text-[#C8A96E] transition-colors`}>
                {user.name} {isMe && <span className="text-[0.6rem] text-[#C8A96E] ml-1">(You)</span>}
              </span>
              {user.badges.map((b, i) => <span key={i} className="text-[0.72rem]">{b}</span>)}
            </div>
            <div className="text-[0.67rem] text-[#5A5248]">{user.title}</div>
          </div>
        </div>
      </td>

      {/* Game */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <GameBadge game={user.game} />
      </td>

      {/* Level */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-2">
          <div className="h-[4px] w-[52px] bg-[rgba(255,255,255,0.05)] overflow-hidden" style={clipHexSm}>
            <div className="h-full transition-[width] duration-500" style={{ width: `${(user.level / 100) * 100}%`, background: gc }} />
          </div>
          <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#9A8F78]">LV.{user.level}</span>
        </div>
      </td>

      {/* Reports */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <span className={`font-['Space_Mono',monospace] text-[0.78rem] ${sortMode === 'reports' ? 'text-[#C8A96E]' : 'text-[#9A8F78]'}`}>
          {user.reports}
        </span>
      </td>

      {/* Votes */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <span className={`font-['Space_Mono',monospace] text-[0.78rem] ${sortMode === 'votes' ? 'text-[#4ECDC4]' : 'text-[#9A8F78]'}`}>
          {user.votes.toLocaleString()}
        </span>
      </td>

      {/* Streak */}
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-1">
          <span className="text-[0.75rem]">{user.streak >= 10 ? '🔥' : '📅'}</span>
          <span className={`font-['Space_Mono',monospace] text-[0.72rem] ${sortMode === 'streak' ? 'text-[#E05C7A]' : 'text-[#9A8F78]'}`}>
            {user.streak}d
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────

function LeaderboardRightWidgets({ accentColor }: { accentColor: string }) {
  return (
    <div>
      {/* Your Rank Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5 relative overflow-hidden" style={clipWidget}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
        <WidgetTitle>Peringkat Kamu</WidgetTitle>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold">
            TB
          </div>
          <div>
            <div className="text-[0.88rem] font-bold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Trailblazer_01</div>
            <div className="text-[0.67rem] text-[#5A5248]">Memo Scout · LV.60</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Global Rank', val: '#48',   color: '#C8A96E' },
            { label: 'Reports',     val: '48',     color: '#4ECDC4' },
            { label: 'Total Votes', val: '1,842',  color: '#A855F7' },
            { label: 'Streak',      val: '7 hari', color: '#E05C7A' },
          ].map((s, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.08)] p-3" style={clipWidget}>
              <div className="text-[0.58rem] uppercase tracking-[0.12em] text-[#5A5248] mb-1">{s.label}</div>
              <div className="font-['Space_Mono',monospace] text-[0.9rem] font-bold" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[0.7rem] text-[#5A5248] mb-1 flex justify-between">
          <span>Progress ke Rank #45</span>
          <span className="text-[#C8A96E]">68%</span>
        </div>
        <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden mb-3">
          <div className="h-full bg-[#C8A96E] transition-[width] duration-500" style={{ width: '68%' }} />
        </div>
        <button className="w-full py-[9px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 border-none text-[#050810]"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
          Lihat Profil Kamu
        </button>
      </div>

      {/* Weekly Stars */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Bintang Minggu Ini</WidgetTitle>
        {weeklyTopData.map((u, i) => {
          const gc = gameAccentMap[u.game as GameFilter] ?? '#C8A96E';
          const medals = ['🥇','🥈','🥉'];
          return (
            <div key={i} className="flex items-center gap-3 py-[8px] border-b border-[rgba(200,169,110,0.06)] last:border-0">
              <span className="text-[0.9rem]">{medals[i]}</span>
              <div className="w-8 h-8 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.58rem] font-bold shrink-0"
                style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                {u.initials}
              </div>
              <div className="flex-1">
                <div className="text-[0.78rem] text-[#E8E0CC] font-semibold">{u.name}</div>
                <div className="text-[0.62rem] text-[#5A5248]">{u.weeklyReports} reports · {u.weeklyVotes.toLocaleString()} votes</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Legend */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Legenda Badge</WidgetTitle>
        <div className="space-y-[10px]">
          {Object.entries(badgeDescMap).map(([emoji, info]) => (
            <div key={emoji} className="flex items-center gap-3">
              <span className="text-[1rem] w-6 text-center shrink-0">{emoji}</span>
              <div>
                <div className="text-[0.78rem] font-bold text-[#E8E0CC]">{info.label}</div>
                <div className="text-[0.65rem] text-[#5A5248]">{info.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Coverage mini */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <WidgetTitle>Distribusi Game</WidgetTitle>
        {[
          { label: 'Honkai: Star Rail', pct: 42, color: '#4ECDC4' },
          { label: 'Genshin Impact',    pct: 33, color: '#6DD18A' },
          { label: 'Zenless Zone Zero', pct: 17, color: '#A855F7' },
          { label: 'Honkai Impact 3rd', pct: 8,  color: '#E05C7A' },
        ].map((g, i) => (
          <div key={i} className="mb-[10px]">
            <div className="flex justify-between mb-1">
              <span className="text-[0.72rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.68rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className="h-full transition-[width] duration-700" style={{ width: `${g.pct}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [activeGame,   setActiveGame]   = useState<GameFilter>('all');
  const [sortMode,     setSortMode]     = useState<SortMode>('votes');
  const [periodMode,   setPeriodMode]   = useState<PeriodMode>('alltime');
  const [showPodium,   setShowPodium]   = useState(true);

  const accentColor = gameAccentMap[activeGame];

  const filteredData = leaderboardData
    .filter(u => activeGame === 'all' || u.game === activeGame)
    .sort((a, b) => {
      if (sortMode === 'votes')   return b.votes - a.votes;
      if (sortMode === 'reports') return b.reports - a.reports;
      if (sortMode === 'streak')  return b.streak - a.streak;
      return b.level - a.level;
    })
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = filteredData.slice(0, 3);

  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const aMap: Record<string,string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi:  'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hMap: Record<string,string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi:  'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${activeGame === g ? aMap[g] : hMap[g]}`;
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%),
          radial-gradient(ellipse 30% 30% at 50% 50%, rgba(200,169,110,0.02) 0%, transparent 60%)`,
      }} />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
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
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports<NavBadge>1.2K</NavBadge></NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leadearboard" active={true}><StarIcon /> Leaderboard</NavItem>
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

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Leaderboard</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">{gameLabels[activeGame]} · Season aktif</div>
          </div>
          <div className="flex gap-[10px] items-center">
            {/* Period toggle */}
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

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Stat Cards */}
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

          {/* Game Pills */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setActiveGame(g)}>
                {gameLabels[g]}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              {/* Podium */}
              {showPodium && top3.length >= 3 && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] mb-5 relative overflow-hidden" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                  {/* Stars bg decoration */}
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

              {/* Table Controls */}
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
                      onClick={() => setSortMode(s.key)}
                      className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.06em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                        ${sortMode === s.key
                          ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                          : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)] hover:text-[#9A8F78]'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipWidget}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Rank','±','Player','Game','Level','Reports','Votes','Streak'].map(h => (
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

              {/* My position callout */}
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

            <LeaderboardRightWidgets accentColor={accentColor} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const GridIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>;
const HexIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>;
const HexDotIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>;
const CalendarIcon= () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>;
const DiamondIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>;
const UsersIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PersonIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const InfoIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>;