import { clipBadge } from './clipStyles';

type Difficulty = 'easy' | 'medium' | 'hard';

export const diffMeta: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Easy',   color: '#6DD18A', bg: 'rgba(109,209,138,0.1)' },
  medium: { label: 'Medium', color: '#C8A96E', bg: 'rgba(200,169,110,0.1)' },
  hard:   { label: 'Hard',   color: '#E05C7A', bg: 'rgba(224,92,122,0.1)' },
};

export function DiffBadge({ diff }: { diff: Difficulty }) {
  const d = diffMeta[diff];
  return (
    <span className="inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase"
      style={{ ...clipBadge, background: d.bg, color: d.color, border: `1px solid ${d.color}44` }}>
      {d.label}
    </span>
  );
}