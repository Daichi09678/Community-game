import { clipBadge } from '@/components/utils/styles';

export function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    mission: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
    event:   'bg-[rgba(78,205,196,0.12)]  text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
    puzzle:  'bg-[rgba(168,85,247,0.12)]  text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
  };
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${map[type] ?? ''}`} style={clipBadge}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}