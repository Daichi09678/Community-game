import { clipBadge } from '@/components/common/clipStyles';

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
};

export function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`}
      style={clipBadge}
    >
      {g.label}
    </span>
  );
}