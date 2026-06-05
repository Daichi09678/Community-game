import { clipBadge } from './clipStyles';

type PuzzleType = 'riddle' | 'cipher' | 'lore-quiz' | 'sequence';

export const typeMeta: Record<PuzzleType, { label: string; icon: string }> = {
  riddle:    { label: 'Riddle',    icon: '◈' },
  cipher:    { label: 'Cipher',    icon: '⟐' },
  'lore-quiz': { label: 'Lore Quiz', icon: '◎' },
  sequence:  { label: 'Sequence',  icon: '⋯' },
};

export function TypeBadge({ type }: { type: PuzzleType }) {
  const t = typeMeta[type];
  return (
    <span className="inline-flex items-center gap-1 px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase"
      style={{ ...clipBadge, background: 'rgba(200,169,110,0.07)', color: '#9A8F78', border: '1px solid rgba(200,169,110,0.2)' }}>
      <span>{t.icon}</span>{t.label}
    </span>
  );
}