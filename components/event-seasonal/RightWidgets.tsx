'use client';

import { gameMeta, GameBadge } from './GameBadge';
import { clipWidget, clipBadge } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type EventStatus = 'live' | 'upcoming' | 'ended';

interface HoyoEvent {
  id: number;
  title: string;
  game: GameKey;
  status: EventStatus;
  startDate: string;
  endDate: string;
  daysLeft: number;
}

const calendarData = [
  { day: 'Mon',  events: [{ game: 'hsr', short: 'Clouded' }] },
  { day: 'Tue',  events: [{ game: 'gi', short: 'Natlan AQ' }, { game: 'zzz', short: 'HoloFest' }] },
  { day: 'Wed',  events: [{ game: 'hsr', short: 'Vibro-X' }] },
  { day: 'Thu',  events: [{ game: 'gi', short: 'Natlan AQ' }, { game: 'hi3', short: 'Elysian' }] },
  { day: 'Fri',  events: [{ game: 'zzz', short: 'HoloFest' }] },
  { day: 'Sat',  events: [{ game: 'hsr', short: 'Clouded' }, { game: 'hi3', short: 'Elysian' }] },
  { day: 'Sun',  events: [{ game: 'gi', short: 'Natlan AQ' }] },
];

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function RightWidgets({ events }: { events: HoyoEvent[] }) {
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
        <WidgetTitle>Event Overview</WidgetTitle>
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
        <WidgetTitle>Ending Soon</WidgetTitle>
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
        <WidgetTitle>This Week</WidgetTitle>
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
        <WidgetTitle>Events by Game</WidgetTitle>
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