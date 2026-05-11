'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const mainQuestData = [
  {
    id: "MQ001", title: "Where the Stairway Leads", game: "hsr", version: "3.2",
    chapter: "Chapter IV", arc: "The Xianzhou Luofu Saga",
    author: "AstreaN_7", initials: "AN", rating: 5, votes: 521,
    date: "2h ago", status: "complete",
    tags: ["Trailblaze", "Luofu", "Dan Heng"],
    summary: "A deep-dive walkthrough of the pivotal main quest arc in version 3.2, covering all branching dialogues and hidden lore.",
  },
  {
    id: "MQ002", title: "Natlan Archon Quest Act II — Goddess of the Flame",
    game: "gi", version: "5.3", chapter: "Act II", arc: "Natlan Arc",
    author: "VoidHunter_X", initials: "VH", rating: 4, votes: 334,
    date: "5h ago", status: "complete",
    tags: ["Archon Quest", "Natlan", "Pyro"],
    summary: "Full story recap and all achievement triggers for the second act of the Natlan Archon Quest.",
  },
  {
    id: "MQ003", title: "Robin & The Harmony of Stars", game: "hsr", version: "3.1",
    chapter: "Interlude", arc: "Penacony Dreams",
    author: "Cocolia_Arc", initials: "CA", rating: 5, votes: 489,
    date: "4h ago", status: "complete",
    tags: ["Interlude", "Robin", "Penacony"],
    summary: "Character analysis and full quest guide for Robin's companion quest including all dialogue trees.",
  },
  {
    id: "MQ004", title: "Farewell, Trailblaze Continuance", game: "hsr", version: "3.0",
    chapter: "Epilogue", arc: "Penacony Arc",
    author: "QuantumGale", initials: "QG", rating: 5, votes: 412,
    date: "1d ago", status: "complete",
    tags: ["Penacony", "Epilogue", "Aventurine"],
    summary: "Complete walkthrough for the Penacony arc epilogue with all hidden collectibles and lore entries marked.",
  },
  {
    id: "MQ005", title: "Chasca Hangout Quest — Winds of the Past", game: "gi", version: "5.3",
    chapter: "Hangout", arc: "Natlan Stories",
    author: "AstreaN_7", initials: "AN", rating: 5, votes: 298,
    date: "1h ago", status: "complete",
    tags: ["Hangout", "Chasca", "Natlan"],
    summary: "All 6 endings guide for Chasca's hangout event with optimal route for achievement hunters.",
  },
  {
    id: "MQ006", title: "Amphoreus — The Chrysos Heirs Prologue", game: "hsr", version: "3.2",
    chapter: "Prologue", arc: "Amphoreus Saga",
    author: "SilverWolf_Fan", initials: "SW", rating: 4, votes: 187,
    date: "3h ago", status: "ongoing",
    tags: ["Amphoreus", "New Arc", "3.2"],
    summary: "First look and analysis of the new Amphoreus main quest prologue — story beats and lore implications.",
  },
];

const sideMissionData = [
  {
    id: "SM001", title: "The Fox Waits Under the Crescent Moon",
    game: "hsr", version: "3.2", type: "companion",
    author: "ImaginaryRift", initials: "IR", rating: 5, votes: 267,
    date: "2h ago", difficulty: "normal",
    tags: ["Xianzhou", "Fugue", "Hidden"],
    reward: "4★ Material ×8",
    summary: "Hidden companion quest unlock guide — requires completing specific daily commissions in sequence.",
  },
  {
    id: "SM002", title: "A Song Drifting Afar — Lumine's Letter",
    game: "gi", version: "5.2", type: "world",
    author: "QuantumGale", initials: "QG", rating: 4, votes: 198,
    date: "6h ago", difficulty: "easy",
    tags: ["World Quest", "Fontaine", "Lore"],
    reward: "Primogem ×60",
    summary: "Complete guide to this easily missable Fontaine world quest — all NPC locations and timed triggers.",
  },
  {
    id: "SM003", title: "Hollow Zero Anomaly — District 7 Secret",
    game: "zzz", version: "1.4", type: "exploration",
    author: "Mei_Stellaron", initials: "MS", rating: 5, votes: 334,
    date: "2h ago", difficulty: "hard",
    tags: ["Hollow Zero", "Secret Room", "ZZZ"],
    reward: "Polychrome ×80",
    summary: "Step-by-step unlock for the hidden District 7 anomaly in Hollow Zero — exact puzzle input sequence included.",
  },
  {
    id: "SM004", title: "Liyue Hidden Treasure — Geo Archon Relics",
    game: "gi", version: "5.2", type: "exploration",
    author: "SilverWolf_Fan", initials: "SW", rating: 4, votes: 178,
    date: "3h ago", difficulty: "normal",
    tags: ["Liyue", "Hidden", "Achievement"],
    reward: "Mora ×150,000",
    summary: "All 9 hidden Geo Archon relic locations in Liyue with interactive waypoint descriptions.",
  },
  {
    id: "SM005", title: "Elysian Realm — Elysia's Secret Monologue",
    game: "hi3", version: "7.4", type: "companion",
    author: "TrailBossKai", initials: "TK", rating: 3, votes: 92,
    date: "1h ago", difficulty: "hard",
    tags: ["Elysian Realm", "Elysia", "HI3"],
    reward: "ELF Shards ×40",
    summary: "Unlock conditions and full transcript for Elysia's hidden monologue event in Elysian Realm.",
  },
  {
    id: "SM006", title: "ZZZ: Bangboo Lab — All Secret Dialogue Routes",
    game: "zzz", version: "1.3", type: "world",
    author: "ImaginaryRift", initials: "IR", rating: 4, votes: 143,
    date: "8h ago", difficulty: "easy",
    tags: ["Bangboo", "Sixth Street", "Secret"],
    reward: "Polychrome ×40",
    summary: "All secret dialogue branches in the Bangboo Lab side quest — choose this specific path for bonus rewards.",
  },
  {
    id: "SM007", title: "HSR: Xianzhou Rare Monster Hunt Chain",
    game: "hsr", version: "3.1", type: "exploration",
    author: "Cocolia_Arc", initials: "CA", rating: 5, votes: 221,
    date: "5h ago", difficulty: "hard",
    tags: ["Hunt", "Xianzhou", "Achievement"],
    reward: "Stellar Jade ×40",
    summary: "Complete chain guide for all 12 rare monster hunts on the Xianzhou Luofu — optimal kill order included.",
  },
  {
    id: "SM008", title: "Genshin: Mondstadt Windtrace History Quest",
    game: "gi", version: "5.1", type: "world",
    author: "VoidHunter_X", initials: "VH", rating: 4, votes: 156,
    date: "1d ago", difficulty: "normal",
    tags: ["Mondstadt", "World Quest", "Windtrace"],
    reward: "Primogem ×40",
    summary: "Solving the hidden windtrace lore quest — NPC interaction order matters for the bonus ending.",
  },
];

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type SideTypeFilter = 'all' | 'companion' | 'world' | 'exploration';

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'   },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]'  },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]'   },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'   },
};

const difficultyMap: Record<string, { label: string; className: string }> = {
  easy:   { label: 'Easy',   className: 'text-[#6DD18A] border-[rgba(109,209,138,0.4)] bg-[rgba(109,209,138,0.08)]' },
  normal: { label: 'Normal', className: 'text-[#C8A96E] border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.08)]' },
  hard:   { label: 'Hard',   className: 'text-[#E05C7A] border-[rgba(224,92,122,0.4)]  bg-[rgba(224,92,122,0.08)]'  },
};

const sideTypeMap: Record<string, { label: string; className: string }> = {
  companion:   { label: 'Companion',   className: 'text-[#C8A96E] border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.1)]' },
  world:       { label: 'World',       className: 'text-[#4ECDC4] border-[rgba(78,205,196,0.3)]  bg-[rgba(78,205,196,0.1)]'  },
  exploration: { label: 'Exploration', className: 'text-[#A855F7] border-[rgba(168,85,247,0.3)]  bg-[rgba(168,85,247,0.1)]'  },
};

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

// ─── CLIP PATHS ───────────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }   as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }       as React.CSSProperties;
const clipCard   = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }   as React.CSSProperties;

// ─── SHARED NAV COMPONENTS ────────────────────────────────────────────────────

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
        ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

function NavItem({ children, href, active, onClick }: {
  children: React.ReactNode; href?: string; active: boolean; onClick?: () => void;
}) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold
    tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    font-['Rajdhani',sans-serif]
    ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = (<>{active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}{children}</>);
  if (href) return <a href={href} className={cls} style={clipHex}>{inner}</a>;
  return <div className={cls} style={clipHex} onClick={onClick}>{inner}</div>;
}

// ─── BADGE HELPERS ────────────────────────────────────────────────────────────

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
    </span>
  );
}

const renderStars = (r: number) => '★'.repeat(r) + '☆'.repeat(5 - r);

// ─── MAIN QUEST CARD ─────────────────────────────────────────────────────────

function MainQuestCard({ quest }: { quest: typeof mainQuestData[0] }) {
  return (
    <div
      className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden group
        transition-all duration-300 hover:border-[rgba(200,169,110,0.35)] hover:bg-[#0F1728]"
      style={clipCard}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C8A96E] to-[rgba(200,169,110,0.1)]" />

      {/* Status indicator top-right */}
      <div className="absolute top-0 right-0">
        <div className={`px-3 py-1 text-[0.58rem] font-bold tracking-[0.15em] uppercase font-['Space_Mono',monospace]
          ${quest.status === 'complete'
            ? 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border-l border-b border-[rgba(78,205,196,0.25)]'
            : 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border-l border-b border-[rgba(200,169,110,0.25)]'}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)' }}
        >
          {quest.status === 'complete' ? '✓ Complete' : '◎ Ongoing'}
        </div>
      </div>

      {/* Arc label */}
      <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">
        {quest.arc} · {quest.chapter}
      </div>

      {/* Title */}
      <h3 className="font-['Cinzel',serif] text-[0.95rem] font-semibold text-[#E8E0CC] mb-2 leading-snug
        group-hover:text-[#C8A96E] transition-colors duration-200 pr-20 cursor-pointer">
        {quest.title}
      </h3>

      {/* Summary */}
      <p className="text-[0.78rem] text-[#5A5248] leading-relaxed mb-4 line-clamp-2">
        {quest.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {quest.tags.map((tag, i) => (
          <span key={i} className="text-[0.62rem] font-semibold px-[8px] py-[2px] text-[#9A8F78] bg-[rgba(255,255,255,0.03)] border border-[rgba(200,169,110,0.1)]" style={clipBadge}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GameBadge game={quest.game} />
          <span className="text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248]">v{quest.version}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Author */}
          <div className="flex items-center gap-[6px]">
            <div className="w-[22px] h-[22px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.55rem] text-[#C8A96E] font-bold shrink-0">
              {quest.initials}
            </div>
            <span className="text-[0.72rem] text-[#9A8F78]">{quest.author}</span>
          </div>
          {/* Stars */}
          <span className="text-[#C8A96E] text-[0.65rem] tracking-[1px]">{renderStars(quest.rating)}</span>
          {/* Votes */}
          <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">↑ {quest.votes}</span>
          {/* Date */}
          <span className="text-[#5A5248] text-[0.7rem] font-['Space_Mono',monospace]">{quest.date}</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDE MISSION ROW ────────────────────────────────────────────────────────

function SideMissionRow({ mission }: { mission: typeof sideMissionData[0] }) {
  const diff   = difficultyMap[mission.difficulty];
  const typeInfo = sideTypeMap[mission.type];

  return (
    <div
      className="flex items-start gap-4 p-4 border-b border-[rgba(200,169,110,0.07)]
        transition-all duration-200 hover:bg-[rgba(200,169,110,0.03)] group cursor-pointer"
    >
      {/* ID pill */}
      <div className="shrink-0 mt-[2px]">
        <div className="font-['Space_Mono',monospace] text-[0.58rem] text-[#5A5248] bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.1)] px-2 py-1 text-center" style={clipBadge}>
          {mission.id}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-['Rajdhani',sans-serif] text-[0.9rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-200 truncate">
            {mission.title}
          </span>
        </div>
        <p className="text-[0.73rem] text-[#5A5248] leading-relaxed mb-2 line-clamp-1">{mission.summary}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {mission.tags.map((tag, i) => (
            <span key={i} className="text-[0.6rem] px-[7px] py-[1px] text-[#9A8F78] border border-[rgba(200,169,110,0.1)] bg-[rgba(255,255,255,0.02)]" style={clipBadge}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Meta column */}
      <div className="shrink-0 flex flex-col items-end gap-[6px]">
        <div className="flex items-center gap-2">
          <GameBadge game={mission.game} />
          <span className={`text-[0.6rem] font-bold px-[8px] py-[2px] border ${typeInfo.className}`} style={clipBadge}>
            {typeInfo.label}
          </span>
          <span className={`text-[0.6rem] font-bold px-[8px] py-[2px] border ${diff.className}`} style={clipBadge}>
            {diff.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#C8A96E]">🎁 {mission.reward}</span>
          <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">↑ {mission.votes}</span>
          <span className="text-[#5A5248] text-[0.65rem] font-['Space_Mono',monospace]">{mission.date}</span>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────

function RightPanel({ gameFilter }: { gameFilter: GameFilter }) {
  const questStats = [
    { label: 'Main Quests',  value: '482',  color: '#C8A96E' },
    { label: 'Side Missions',value: '1.2K', color: '#4ECDC4' },
    { label: 'Completed',    value: '89%',  color: '#6DD18A' },
    { label: 'This Week',    value: '+38',  color: '#A855F7' },
  ];

  const hotQuests = [
    { title: "Robin Companion Quest",         votes: 521, game: 'hsr' },
    { title: "Chasca All Endings Guide",      votes: 298, game: 'gi'  },
    { title: "Hollow Zero District 6",        votes: 267, game: 'zzz' },
    { title: "Amphoreus Prologue Analysis",   votes: 187, game: 'hsr' },
    { title: "Xianzhou Monster Hunt Chain",   votes: 221, game: 'hsr' },
  ];

  const rankStyles = ['text-[#C8A96E]','text-[#C8A96E]','text-[#9AA0AA]','text-[#9AA0AA]','text-[#CD7F32]'];

  return (
    <div>
      {/* Quest Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Quest Stats</WidgetTitle>
        <div className="grid grid-cols-2 gap-3">
          {questStats.map((s, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.08)] p-3" style={clipBadge}>
              <div className="font-['Space_Mono',monospace] text-[1.2rem] font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[0.62rem] text-[#5A5248] tracking-[0.1em] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Quests */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Quests</WidgetTitle>
        {hotQuests.map((q, i) => (
          <div key={i} className="flex items-center gap-[10px] py-[9px] border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.8rem] text-[#9A8F78] cursor-pointer hover:text-[#E8E0CC] transition-colors duration-200 leading-[1.3]">{q.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              <GameBadge game={q.game} />
              <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑{q.votes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Game Progress */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Quest Coverage</WidgetTitle>
        {[
          { label: 'Honkai: Star Rail', main: 48, side: 52, barColor: '#4ECDC4' },
          { label: 'Genshin Impact',    main: 35, side: 65, barColor: '#6DD18A' },
          { label: 'Zenless Zone Zero', main: 40, side: 60, barColor: '#A855F7' },
          { label: 'Honkai Impact 3rd', main: 55, side: 45, barColor: '#E05C7A' },
        ].map((g, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex justify-between mb-[5px]">
              <span className="text-[0.73rem] text-[#9A8F78]">{g.label}</span>
              <div className="flex gap-3 text-[0.62rem] font-['Space_Mono',monospace]">
                <span className="text-[#C8A96E]">MQ {g.main}%</span>
                <span className="text-[#5A5248]">SM {g.side}%</span>
              </div>
            </div>
            <div className="h-[3px] bg-[rgba(255,255,255,0.05)] overflow-hidden mb-1">
              <div className="h-full transition-all duration-[600ms] ease-in-out" style={{ width: `${g.main}%`, background: g.barColor }} />
            </div>
            <div className="h-[2px] bg-[rgba(255,255,255,0.03)] overflow-hidden">
              <div className="h-full transition-all duration-[600ms] ease-in-out bg-[rgba(200,169,110,0.3)]" style={{ width: `${g.side}%` }} />
            </div>
          </div>
        ))}
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-[3px] bg-[#4ECDC4]" />
            <span className="text-[0.58rem] text-[#5A5248]">Main Quest</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-[2px] bg-[rgba(200,169,110,0.3)]" />
            <span className="text-[0.58rem] text-[#5A5248]">Side Mission</span>
          </div>
        </div>
      </div>

      {/* Write CTA */}
      <div
        className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 relative overflow-hidden"
        style={clipWidget}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #C8A96E, transparent 60%)' }} />
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-2">
          Share Your Guide
        </div>
        <p className="text-[0.72rem] text-[#5A5248] leading-relaxed mb-4">
          Help fellow Trailblazers and Travelers — write a quest report and earn community votes.
        </p>
        <button
          className="w-full py-[8px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer hover:brightness-110 transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipHexSm }}
        >
          + Write Quest Report
        </button>
      </div>
    </div>
  );
}

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function MissionQuestPage() {
  const [gameFilter,    setGameFilter]    = useState<GameFilter>('all');
  const [sideTypeFilter, setSideTypeFilter] = useState<SideTypeFilter>('all');
  const [searchQuery,   setSearchQuery]   = useState('');

  const filteredMain = mainQuestData.filter(q => {
    const matchGame  = gameFilter === 'all' || q.game === gameFilter;
    const matchSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGame && matchSearch;
  });

  const filteredSide = sideMissionData.filter(m => {
    const matchGame  = gameFilter === 'all' || m.game === gameFilter;
    const matchType  = sideTypeFilter === 'all' || m.type === sideTypeFilter;
    const matchSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGame && matchType && matchSearch;
  });

  const gamePillCls = (g: GameFilter) => {
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
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)`,
      }} />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
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
          <NavItem href="/UserHoyo/homepage" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports <NavBadge>1.2K</NavBadge></NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem active={true}><HexDotIcon /> Mission &amp; Quest <NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal <NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles <NavBadge>324</NavBadge></NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href = "/UserHoyo/discussion"active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href = "/UserHoyoleaderboard"active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href = "/UserHoyo/profil"active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href = "/UserHoyo/settings"active={false}><InfoIcon /> Settings</NavItem>
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
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Mission &amp; Quest — {gameLabels[gameFilter]}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Main quests, companion quests, side missions &amp; world quests</div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]" style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search quests & missions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]"
              />
            </div>
            <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
              + Write Report
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">

          {/* Game Pills */}
          <div className="flex gap-2 mb-7 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setGameFilter(g)}>
                {gameLabels[g]}
              </span>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>

              {/* ── MAIN QUEST SECTION ── */}
              <section className="mb-10">
                {/* Section heading */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {/* Decorative hex icon */}
                    <div className="w-8 h-8 flex items-center justify-center border border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.06)]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="#C8A96E" strokeWidth="1.2"/>
                        <circle cx="8" cy="8" r="2" stroke="#C8A96E" strokeWidth="0.8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Main Quest</div>
                      <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase font-['Space_Mono',monospace]">
                        {filteredMain.length} guides · Trailblaze &amp; Archon Quests
                      </div>
                    </div>
                  </div>
                  <span className="text-[#C8A96E] text-[0.78rem] font-semibold tracking-[0.08em] cursor-pointer hover:text-[#F0D080] transition-colors duration-200">
                    View all →
                  </span>
                </div>

                {/* Divider with glow */}
                <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.3)] to-transparent mb-5" />

                {/* Cards grid */}
                {filteredMain.length === 0 ? (
                  <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                    No main quests found for this filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredMain.map(q => <MainQuestCard key={q.id} quest={q} />)}
                  </div>
                )}
              </section>

              {/* ── SIDE MISSION SECTION ── */}
              <section>
                {/* Section heading */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center border border-[rgba(78,205,196,0.3)] bg-[rgba(78,205,196,0.06)]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="#4ECDC4" strokeWidth="1.2"/>
                        <line x1="8" y1="5" x2="11" y2="8" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="11" y1="8" x2="8" y2="11" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="8" y1="11" x2="5" y2="8" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="5" y1="8" x2="8" y2="5" stroke="#4ECDC4" strokeWidth="0.8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Side Mission</div>
                      <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase font-['Space_Mono',monospace]">
                        {filteredSide.length} guides · World, Companion &amp; Exploration
                      </div>
                    </div>
                  </div>

                  {/* Type filter tabs */}
                  <div className="flex gap-[5px]">
                    {(['all', 'companion', 'world', 'exploration'] as const).map(f => (
                      <button
                        key={f}
                        style={clipBadge}
                        onClick={() => setSideTypeFilter(f)}
                        className={`px-[10px] py-[5px] text-[0.65rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                          ${sideTypeFilter === f
                            ? 'bg-[rgba(78,205,196,0.1)] border-[#4ECDC4] text-[#4ECDC4]'
                            : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(78,205,196,0.3)] hover:text-[#9A8F78]'}`}
                      >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[0.5px] bg-gradient-to-r from-[#4ECDC4] via-[rgba(78,205,196,0.3)] to-transparent mb-4" />

                {/* List */}
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={clipCard}>
                  {filteredSide.length === 0 ? (
                    <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                      No side missions found for this filter.
                    </div>
                  ) : (
                    filteredSide.map(m => <SideMissionRow key={m.id} mission={m} />)
                  )}
                </div>
              </section>

            </div>

            {/* Right panel */}
            <RightPanel gameFilter={gameFilter} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
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