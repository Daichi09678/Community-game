import { clipBadge } from './clipStyles';

const categoryColors: Record<string, string> = {
  limited:   'rgba(200,169,110,0.12) text-[#C8A96E] border-[rgba(200,169,110,0.3)]',
  permanent: 'rgba(78,205,196,0.12) text-[#4ECDC4] border-[rgba(78,205,196,0.3)]',
  collab:    'rgba(168,85,247,0.12) text-[#A855F7] border-[rgba(168,85,247,0.3)]',
  seasonal:  'rgba(224,92,122,0.12) text-[#E05C7A] border-[rgba(224,92,122,0.3)]',
};

export function CategoryBadge({ category }: { category: string }) {
  const colorStr = categoryColors[category] ?? '';
  const [bg, textClass, borderClass] = colorStr.split(' ');
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <span
      className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase border ${textClass} ${borderClass}`}
      style={{ ...clipBadge, background: bg }}
    >
      {label}
    </span>
  );
}