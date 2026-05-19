import { gameBadgeMap } from '@/components/utils/constants';
import { clipBadge } from '@/components/utils/styles';

export function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
    </span>
  );
}