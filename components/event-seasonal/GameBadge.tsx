import { clipBadge } from './clipStyles';

export const gameMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
  hsr: { label: 'Star Rail',   color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)',   border: 'rgba(78,205,196,0.3)'  },
  gi:  { label: 'Genshin',     color: '#6DD18A', bg: 'rgba(109,209,138,0.1)', border: 'rgba(109,209,138,0.3)' },
  zzz: { label: 'Zenless',     color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)'  },
  hi3: { label: 'Honkai 3rd',  color: '#E05C7A', bg: 'rgba(224,92,122,0.1)', border: 'rgba(224,92,122,0.3)'  },
};

export function GameBadge({ game }: { game: string }) {
  const g = gameMeta[game];
  if (!g) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap"
      style={{ ...clipBadge, background: g.bg, color: g.color, border: `1px solid ${g.border}` }}
    >
      {g.label}
    </span>
  );
}