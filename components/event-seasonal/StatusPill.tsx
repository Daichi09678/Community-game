import { clipBadge } from './clipStyles';

type EventStatus = 'live' | 'upcoming' | 'ended';

const statusMeta: Record<EventStatus, { label: string; color: string; dot: string }> = {
  live:     { label: 'Live',     color: '#6DD18A', dot: '#6DD18A' },
  upcoming: { label: 'Upcoming', color: '#C8A96E', dot: '#C8A96E' },
  ended:    { label: 'Ended',    color: '#5A5248', dot: '#5A5248' },
};

export function StatusPill({ status }: { status: EventStatus }) {
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