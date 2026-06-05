'use client';

import { gameMeta } from './GameBadge';
import { StatusPill } from './StatusPill';
import { CategoryBadge } from './CategoryBadge';
import { GameBadge } from './GameBadge';
import { clipCard } from './clipStyles';

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

export function FeaturedBanner({ event }: { event: HoyoEvent }) {
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 90% 50%, ${gm.color}0D 0%, transparent 70%)`,
        }}
      />

      <div
        className="absolute top-0 right-0 px-3 py-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase font-['Space_Mono',monospace]"
        style={{ background: gm.color + '22', color: gm.color, borderLeft: `1px solid ${gm.color}44`, borderBottom: `1px solid ${gm.color}44` }}
      >
        Featured
      </div>

      <div className="relative flex items-start gap-6">
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