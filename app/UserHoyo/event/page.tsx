'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type EventStatus = 'live' | 'upcoming' | 'ended';

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

const calendarData = [
  { day: 'Mon',  events: [{ game: 'hsr', short: 'Clouded' }] },
  { day: 'Tue',  events: [{ game: 'gi', short: 'Natlan AQ' }, { game: 'zzz', short: 'HoloFest' }] },
  { day: 'Wed',  events: [{ game: 'hsr', short: 'Vibro-X' }] },
  { day: 'Thu',  events: [{ game: 'gi', short: 'Natlan AQ' }, { game: 'hi3', short: 'Elysian' }] },
  { day: 'Fri',  events: [{ game: 'zzz', short: 'HoloFest' }] },
  { day: 'Sat',  events: [{ game: 'hsr', short: 'Clouded' }, { game: 'hi3', short: 'Elysian' }] },
  { day: 'Sun',  events: [{ game: 'gi', short: 'Natlan AQ' }] },
];

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const gameMeta: Record<GameKey, { label: string; color: string; bg: string; border: string }> = {
  hsr: { label: 'Star Rail',   color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)',   border: 'rgba(78,205,196,0.3)'  },
  gi:  { label: 'Genshin',     color: '#6DD18A', bg: 'rgba(109,209,138,0.1)', border: 'rgba(109,209,138,0.3)' },
  zzz: { label: 'Zenless',     color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)'  },
  hi3: { label: 'Honkai 3rd',  color: '#E05C7A', bg: 'rgba(224,92,122,0.1)', border: 'rgba(224,92,122,0.3)'  },
};

const statusMeta: Record<EventStatus, { label: string; color: string; dot: string }> = {
  live:     { label: 'Live',     color: '#6DD18A', dot: '#6DD18A' },
  upcoming: { label: 'Upcoming', color: '#C8A96E', dot: '#C8A96E' },
  ended:    { label: 'Ended',    color: '#5A5248', dot: '#5A5248' },
};

const categoryColors: Record<string, string> = {
  limited:   'rgba(200,169,110,0.12) text-[#C8A96E] border-[rgba(200,169,110,0.3)]',
  permanent: 'rgba(78,205,196,0.12) text-[#4ECDC4] border-[rgba(78,205,196,0.3)]',
  collab:    'rgba(168,85,247,0.12) text-[#A855F7] border-[rgba(168,85,247,0.3)]',
  seasonal:  'rgba(224,92,122,0.12) text-[#E05C7A] border-[rgba(224,92,122,0.3)]',
};

// ─── CLIP-PATH STYLES ────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipCard   = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' } as React.CSSProperties;

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────

function GameBadge({ game }: { game: GameKey }) {
  const g = gameMeta[game];
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap"
      style={{ ...clipBadge, background: g.bg, color: g.color, border: `1px solid ${g.border}` }}
    >
      {g.label}
    </span>
  );
}

function StatusPill({ status }: { status: EventStatus }) {
  const s = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase"
      style={{
        ...clipBadge,
        background: `${s.dot}18`,
        color: s.color,
        border: `1px solid ${s.dot}44`,
      }}
    >
      {status === 'live' && (
        <span className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: s.dot }} />
      )}
      {s.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colorStr = categoryColors[category] ?? '';
  const [bg, textClass, borderClass] = colorStr.split(' ');
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <span
      className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase border ${textClass} ${borderClass}`}
      style={{ ...clipBadge, background: bg }}
    >
      {label}
    </span>
  );
}

// ─── EVENT CARD ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: HoyoEvent }) {
  const gm = gameMeta[event.game];
  const isEnded = event.status === 'ended';

  return (
    <div
      className={`relative bg-[#0C1220] border transition-all duration-300 group ${
        isEnded ? 'opacity-50' : 'hover:border-opacity-80'
      } ${event.featured ? '' : ''}`}
      style={{
        ...clipCard,
        borderColor: event.featured ? gm.color + '55' : 'rgba(200,169,110,0.15)',
        borderWidth: event.featured ? '1px' : '1px',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{ background: isEnded ? '#5A5248' : gm.color, opacity: isEnded ? 0.3 : 0.7 }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusPill status={event.status} />
              <CategoryBadge category={event.category} />
              <GameBadge game={event.game} />
            </div>
            <h3 className="font-['Cinzel',serif] text-[0.92rem] font-semibold text-[#E8E0CC] leading-tight group-hover:text-[#C8A96E] transition-colors duration-200 cursor-pointer">
              {event.title}
            </h3>
          </div>

          {/* Days countdown */}
          {!isEnded && (
            <div className="shrink-0 text-right">
              <div
                className="font-['Space_Mono',monospace] text-[1.3rem] font-bold leading-none"
                style={{ color: event.status === 'live' ? '#4ECDC4' : '#C8A96E' }}
              >
                {event.daysLeft}
              </div>
              <div className="text-[0.6rem] text-[#5A5248] tracking-[0.1em] uppercase mt-[2px]">
                {event.status === 'live' ? 'days left' : 'days until'}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[0.82rem] text-[#6A6058] leading-[1.5] mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-[rgba(200,169,110,0.08)] mb-4" />

        {/* Dates */}
        <div className="flex items-center gap-3 mb-4 text-[0.75rem] font-['Space_Mono',monospace]">
          <span className="text-[#5A5248]">
            <span className="text-[#9A8F78]">{event.startDate}</span>
            <span className="mx-[6px] text-[#3A3028]">→</span>
            <span className="text-[#9A8F78]">{event.endDate}</span>
          </span>
          <span
            className="px-2 py-[2px] text-[0.6rem] font-bold tracking-[0.08em]"
            style={{
              ...clipBadge,
              background: 'rgba(200,169,110,0.05)',
              color: '#5A5248',
              border: '1px solid rgba(200,169,110,0.1)',
            }}
          >
            v{event.version}
          </span>
        </div>

        {/* Rewards */}
        <div>
          <div className="text-[0.6rem] tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-bold">Rewards</div>
          <div className="flex flex-wrap gap-[5px]">
            {event.rewards.map((r, i) => (
              <span
                key={i}
                className="text-[0.68rem] text-[#9A8F78] px-[8px] py-[2px]"
                style={{
                  ...clipBadge,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(200,169,110,0.1)',
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!isEnded && (
          <div className="mt-4 pt-4 border-t border-[rgba(200,169,110,0.06)]">
            <button
              className="w-full py-[7px] text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer"
              style={{
                ...clipHexSm,
                background: event.featured ? `linear-gradient(135deg, ${gm.color}22, ${gm.color}11)` : 'rgba(200,169,110,0.05)',
                color: event.featured ? gm.color : '#9A8F78',
                border: `1px solid ${event.featured ? gm.color + '44' : 'rgba(200,169,110,0.15)'}`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = `${gm.color}22`;
                el.style.color = gm.color;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = event.featured ? `linear-gradient(135deg, ${gm.color}22, ${gm.color}11)` : 'rgba(200,169,110,0.05)';
                el.style.color = event.featured ? gm.color : '#9A8F78';
              }}
            >
              View Event Details →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FEATURED BANNER ─────────────────────────────────────────────────────────

function FeaturedBanner({ event }: { event: HoyoEvent }) {
  const gm = gameMeta[event.game];
  return (
    <div
      className="relative overflow-hidden border p-6 mb-6"
      style={{
        ...clipCard,
        background: '#0C1220',
        borderColor: gm.color + '55',
      }}
    >
      {/* Glow BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 90% 50%, ${gm.color}0D 0%, transparent 70%)`,
        }}
      />

      {/* Corner mark */}
      <div
        className="absolute top-0 right-0 px-3 py-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase font-['Space_Mono',monospace]"
        style={{ background: gm.color + '22', color: gm.color, borderLeft: `1px solid ${gm.color}44`, borderBottom: `1px solid ${gm.color}44` }}
      >
        Featured
      </div>

      <div className="relative flex items-start gap-6">
        {/* Icon hex */}
        <div
          className="shrink-0 w-[56px] h-[56px] flex items-center justify-center"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: gm.bg,
            border: `1px solid ${gm.border}`,
          }}
        >
          <span className="font-['Cinzel',serif] text-[1rem] font-bold" style={{ color: gm.color }}>
            {event.game.toUpperCase().slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusPill status={event.status} />
            <CategoryBadge category={event.category} />
            <GameBadge game={event.game} />
          </div>
          <h2 className="font-['Cinzel',serif] text-[1.1rem] font-bold text-[#E8E0CC] mb-2 leading-tight">
            {event.title}
          </h2>
          <p className="text-[0.82rem] text-[#6A6058] mb-4 leading-[1.5] max-w-xl">
            {event.description}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#9A8F78]">
              {event.startDate} → {event.endDate}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Space_Mono',monospace] text-[1.4rem] font-bold" style={{ color: gm.color }}>
                {event.daysLeft}
              </span>
              <span className="text-[0.65rem] text-[#5A5248] uppercase tracking-[0.1em]">days left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDEBAR WIDGETS ────────────────────────────────────────────────────

function RightWidgets({ events }: { events: HoyoEvent[] }) {
  const liveCount = events.filter(e => e.status === 'live').length;
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;

  const endingSoon = events
    .filter(e => e.status === 'live')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  return (
    <div>
      {/* Summary Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Event Overview
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Live Now', value: liveCount, color: '#6DD18A' },
            { label: 'Upcoming', value: upcomingCount, color: '#C8A96E' },
            { label: 'Total Events', value: events.length, color: '#4ECDC4' },
            { label: 'Games', value: 4, color: '#A855F7' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3"
              style={{
                ...clipBadge,
                background: `${stat.color}0D`,
                border: `1px solid ${stat.color}22`,
              }}
            >
              <div className="font-['Space_Mono',monospace] text-[1.1rem] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ending Soon */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#E05C7A] inline-block" />
          Ending Soon
        </div>
        {endingSoon.map((ev, i) => (
          <div key={i} className="flex items-center gap-3 py-[10px] border-b border-[rgba(200,169,110,0.06)] last:border-b-0">
            <div
              className="shrink-0 w-[6px] h-[6px] rounded-full"
              style={{ background: gameMeta[ev.game].color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[0.8rem] text-[#9A8F78] truncate">{ev.title}</div>
              <div className="text-[0.65rem] text-[#5A5248] mt-[1px]">{gameMeta[ev.game].label}</div>
            </div>
            <div
              className="font-['Space_Mono',monospace] text-[0.72rem] font-bold px-2 py-[2px]"
              style={{
                ...clipBadge,
                color: ev.daysLeft <= 7 ? '#E05C7A' : '#C8A96E',
                background: ev.daysLeft <= 7 ? 'rgba(224,92,122,0.08)' : 'rgba(200,169,110,0.08)',
                border: `1px solid ${ev.daysLeft <= 7 ? 'rgba(224,92,122,0.25)' : 'rgba(200,169,110,0.25)'}`,
              }}
            >
              {ev.daysLeft}d
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Calendar */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#4ECDC4] inline-block" />
          This Week
        </div>
        <div className="space-y-[6px]">
          {calendarData.map((day, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace] w-[24px] shrink-0 pt-[3px]">
                {day.day}
              </span>
              <div className="flex flex-wrap gap-[4px] flex-1">
                {day.events.map((ev, j) => (
                  <span
                    key={j}
                    className="text-[0.6rem] px-[6px] py-[1px] font-semibold"
                    style={{
                      ...clipBadge,
                      background: gameMeta[ev.game as GameKey].bg,
                      color: gameMeta[ev.game as GameKey].color,
                      border: `1px solid ${gameMeta[ev.game as GameKey].border}`,
                    }}
                  >
                    {ev.short}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-game event count */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Events by Game
        </div>
        {(['hsr', 'gi', 'zzz', 'hi3'] as GameKey[]).map(g => {
          const count = events.filter(e => e.game === g).length;
          const liveC = events.filter(e => e.game === g && e.status === 'live').length;
          const pct = Math.round((count / events.length) * 100);
          return (
            <div key={g} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[0.75rem] text-[#9A8F78]">{gameMeta[g].label}</span>
                <div className="flex items-center gap-2">
                  {liveC > 0 && (
                    <span
                      className="text-[0.6rem] px-[5px] py-[1px] font-bold"
                      style={{
                        ...clipBadge,
                        background: 'rgba(109,209,138,0.12)',
                        color: '#6DD18A',
                        border: '1px solid rgba(109,209,138,0.3)',
                      }}
                    >
                      {liveC} live
                    </span>
                  )}
                  <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{count}</span>
                </div>
              </div>
              <div className="h-[3px] bg-[rgba(255,255,255,0.04)] overflow-hidden" style={{ clipPath: 'none' }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: gameMeta[g].color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type GameFilter = 'all' | GameKey;
type StatusFilter = 'all' | EventStatus;
type CategoryFilter = 'all' | 'limited' | 'permanent' | 'collab' | 'seasonal';

export default function EventSeasonalPage() {
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('live');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const gameLabels: Record<GameFilter, string> = {
    all: 'All Games', hsr: 'Honkai: Star Rail',
    gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
  };

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
    return { className: base, style: { clipPath: (clipHex as any).clipPath, borderColor: isActive ? c : 'transparent', color: isActive ? c : '#5A5248', background: isActive ? `${c}14` : 'rgba(255,255,255,0.03)' } };
  };

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
    >
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

      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
      `}</style>
    </div>
  );
}

// ─── REUSED NAV COMPONENTS (same as AllReportPage) ───────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">{children}</div>;
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span
      className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

function NavItem({ children, href, active, onClick }: { children: React.ReactNode; href?: string; active: boolean; onClick?: () => void }) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const style: React.CSSProperties = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' };
  const inner = <>{active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}{children}</>;
  return href ? <a href={href} className={cls} style={style}>{inner}</a> : <div className={cls} style={style} onClick={onClick}>{inner}</div>;
}

const GridIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>;
const HexIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>;
const HexDotIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>;
const DiamondIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PersonIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>;