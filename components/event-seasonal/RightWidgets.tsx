'use client';

import { gameMeta, GameBadge } from './GameBadge';
import { clipWidget, clipBadge } from './clipStyles';

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
  const publishedCount = events.filter(e => e.reportStatus === 'published').length;
  const pendingCount = events.filter(e => e.reportStatus === 'pending').length;
  const archivedCount = events.filter(e => e.reportStatus === 'archived').length;

  // Recently added events (based on createdAt)
  const recentEvents = [...events]
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    })
    .slice(0, 4);

  return (
    <div>
      {/* Summary Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Event Overview</WidgetTitle>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Accepted', value: publishedCount, color: '#4ECDC4' },
            { label: 'Pending', value: pendingCount, color: '#F5A623' },
            { label: 'Rejected', value: archivedCount, color: '#E05C7A' },
            { label: 'Total Events', value: events.length, color: '#C8A96E' },
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

      {/* Recent Events (Replaces Ending Soon) */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Recent Events</WidgetTitle>
        {recentEvents.length > 0 ? (
          recentEvents.map((ev, i) => (
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
                className="font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]"
                style={{
                  ...clipBadge,
                  color: ev.reportStatus === 'published' ? '#4ECDC4' : ev.reportStatus === 'pending' ? '#F5A623' : '#E05C7A',
                  background: ev.reportStatus === 'published' ? 'rgba(78,205,196,0.08)' : ev.reportStatus === 'pending' ? 'rgba(245,166,35,0.08)' : 'rgba(224,92,122,0.08)',
                  border: `1px solid ${ev.reportStatus === 'published' ? 'rgba(78,205,196,0.25)' : ev.reportStatus === 'pending' ? 'rgba(245,166,35,0.25)' : 'rgba(224,92,122,0.25)'}`,
                }}
              >
                {ev.reportStatus === 'published' ? '✓' : ev.reportStatus === 'pending' ? '⏳' : '✗'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-[0.7rem] text-[#5A5248]">No events yet</div>
        )}
      </div>

      {/* Weekly Calendar - same as before */}
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
                      background: gameMeta[ev.game].bg,
                      color: gameMeta[ev.game].color,
                      border: `1px solid ${gameMeta[ev.game].border}`,
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
          const liveC = events.filter(e => e.game === g && e.reportStatus === 'published').length;
          const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
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
                        background: 'rgba(78,205,196,0.12)',
                        color: '#4ECDC4',
                        border: '1px solid rgba(78,205,196,0.3)',
                      }}
                    >
                      {liveC} accepted
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