import { clipBadge } from '@/components/utils/styles';

export function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    guide:   'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
    mission: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
    event:   'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
    puzzle:  'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
    build:   'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
  };
  
  const getLabel = (t: string) => {
    switch (t) {
      case 'guide': return 'Guide';
      case 'mission': return 'Mission';
      case 'event': return 'Event';
      case 'puzzle': return 'Puzzle';
      case 'build': return 'Build';
      default: return t.charAt(0).toUpperCase() + t.slice(1);
    }
  };
  
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${map[type] || map.mission}`} style={clipBadge}>
      {getLabel(type)}
    </span>
  );
}