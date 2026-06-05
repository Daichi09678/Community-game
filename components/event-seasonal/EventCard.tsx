'use client';

import { GameBadge, gameMeta } from './GameBadge';
import { StatusPill } from './StatusPill';
import { CategoryBadge } from './CategoryBadge';
import { clipHexSm, clipCard, clipBadge } from './clipStyles';

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

export function EventCard({ event }: { event: HoyoEvent }) {
  const gm = gameMeta[event.game];
  const isEnded = event.status === 'ended';

  return (
    <div
      className={`relative bg-[#0C1220] border transition-all duration-300 group ${
        isEnded ? 'opacity-50' : 'hover:border-opacity-80'
      }`}
      style={{
        ...clipCard,
        borderColor: event.featured ? gm.color + '55' : 'rgba(200,169,110,0.15)',
        borderWidth: event.featured ? '1px' : '1px',
      }}
    >
      <div
        className="h-[2px] w-full"
        style={{ background: isEnded ? '#5A5248' : gm.color, opacity: isEnded ? 0.3 : 0.7 }}
      />

      <div className="p-5">
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

        <p className="text-[0.82rem] text-[#6A6058] leading-[1.5] mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="h-px bg-[rgba(200,169,110,0.08)] mb-4" />

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
                e.currentTarget.style.background = `${gm.color}22`;
                e.currentTarget.style.color = gm.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = event.featured ? `linear-gradient(135deg, ${gm.color}22, ${gm.color}11)` : 'rgba(200,169,110,0.05)';
                e.currentTarget.style.color = event.featured ? gm.color : '#9A8F78';
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