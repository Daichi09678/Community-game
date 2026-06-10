'use client';

import { GameBadge, gameMeta } from './GameBadge';
import { CategoryBadge } from './CategoryBadge';
import { clipHexSm, clipCard, clipBadge } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

interface HoyoEvent {
  id: string | number;
  title: string;
  game: GameKey;
  reportStatus: 'published' | 'pending' | 'archived';
  category: 'limited' | 'permanent' | 'collab' | 'seasonal';
  startDate: string;
  endDate: string;
  rewards: string[];
  description: string;
  tag: string;
  featured?: boolean;
  thumbnail?: string;
  content?: string;
  authorName?: string;
  authorInitials?: string;
  votes?: number;
  views?: number;
  createdAt?: string;
}

interface EventCardProps {
  event: HoyoEvent;
  hideDetails?: boolean;
  hideVersion?: boolean;
  showStatus?: boolean;
}

// Map reportStatus ke display
const getStatusFromReport = (reportStatus: string) => {
  switch (reportStatus) {
    case 'published': return 'live';
    case 'pending': return 'upcoming';
    case 'archived': return 'ended';
    default: return 'upcoming';
  }
};

const getStatusLabel = (reportStatus: string) => {
  switch (reportStatus) {
    case 'published': return 'ACCEPTED';
    case 'pending': return ' PENDING';
    case 'archived': return 'REJECTED';
    default: return 'UNKNOWN';
  }
};

const getStatusColor = (reportStatus: string) => {
  switch (reportStatus) {
    case 'published': return '#4ECDC4';
    case 'pending': return '#F5A623';
    case 'archived': return '#E05C7A';
    default: return '#5A5248';
  }
};

export function EventCard({ event, hideDetails = false, hideVersion = true, showStatus = true }: EventCardProps) {
  const gm = gameMeta[event.game];
  const isEnded = event.reportStatus === 'archived';
  const isPending = event.reportStatus === 'pending';
  const isPublished = event.reportStatus === 'published';

  // Tentukan warna border berdasarkan status
  let borderColor = 'rgba(200,169,110,0.15)';
  if (isPublished) borderColor = '#4ECDC4' + '55';
  if (isPending) borderColor = '#F5A623' + '55';
  if (isEnded) borderColor = '#E05C7A' + '33';

  return (
    <div
      className={`relative bg-[#0C1220] border transition-all duration-300 group ${
        isEnded ? 'opacity-50' : 'hover:border-opacity-80'
      }`}
      style={{
        ...clipCard,
        borderColor: event.featured ? gm.color + '55' : borderColor,
        borderWidth: '1px',
      }}
    >
      <div
        className="h-[2px] w-full"
        style={{ background: isEnded ? '#5A5248' : getStatusColor(event.reportStatus), opacity: isEnded ? 0.3 : 0.7 }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Status Badge based on reportStatus */}
              {showStatus && (
                <span
                  className="text-[0.65rem] font-bold px-2 py-[2px] rounded-sm"
                  style={{
                    background: `${getStatusColor(event.reportStatus)}20`,
                    color: getStatusColor(event.reportStatus),
                    border: `1px solid ${getStatusColor(event.reportStatus)}40`,
                  }}
                >
                  {getStatusLabel(event.reportStatus)}
                </span>
              )}
              <CategoryBadge category={event.category} />
              <GameBadge game={event.game} />
            </div>
            <h3 className="font-['Cinzel',serif] text-[0.92rem] font-semibold text-[#E8E0CC] leading-tight group-hover:text-[#C8A96E] transition-colors duration-200 cursor-pointer">
              {event.title}
            </h3>
          </div>

          {/* Tampilkan votes/views instead of daysLeft */}
          <div className="shrink-0 text-right">
            {event.votes !== undefined && (
              <div className="font-['Space_Mono',monospace] text-[0.8rem] text-[#4ECDC4]">
                👍 {event.votes}
              </div>
            )}
            {event.views !== undefined && (
              <div className="text-[0.65rem] text-[#5A5248]">👁️ {event.views}</div>
            )}
          </div>
        </div>

        <p className="text-[0.82rem] text-[#6A6058] leading-[1.5] mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="h-px bg-[rgba(200,169,110,0.08)] mb-4" />

        <div className="flex items-center gap-3 mb-4 text-[0.75rem] font-['Space_Mono',monospace] flex-wrap">
          <span className="text-[#5A5248]">
            <span className="text-[#9A8F78]">{event.startDate}</span>
            <span className="mx-[6px] text-[#3A3028]">→</span>
            <span className="text-[#9A8F78]">{event.endDate}</span>
          </span>
          
          {/* Version - hide if hideVersion is true */}
          {!hideVersion && (
            <span
              className="px-2 py-[2px] text-[0.6rem] font-bold tracking-[0.08em]"
              style={{
                ...clipBadge,
                background: 'rgba(200,169,110,0.05)',
                color: '#5A5248',
                border: '1px solid rgba(200,169,110,0.1)',
              }}
            >
              v{(event as any).version || '1.0'}
            </span>
          )}
        </div>

        {event.rewards && event.rewards.length > 0 && (
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
        )}

        {/* View Details Button - hide if hideDetails is true */}
        {!hideDetails && !isEnded && (
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