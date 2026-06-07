'use client';

import { clipBadge } from '@/components/common/clipStyles';

const typeMap: Record<string, { label: string; className: string }> = {
  guide: { 
    label: 'Guide', 
    className: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]' 
  },
  event: { 
    label: 'Event', 
    className: 'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' 
  },
  puzzle: { 
    label: 'Puzzle', 
    className: 'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' 
  },
  build: { 
    label: 'Build', 
    className: 'bg-[rgba(224,92,122,0.12)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' 
  },
};

export function TypeBadge({ type }: { type: string }) {
  const t = typeMap[type];
  if (!t) {
    // Fallback untuk type yang tidak dikenal
    return (
      <span
        className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase bg-[rgba(200,169,110,0.08)] text-[#C8A96E] border border-[rgba(200,169,110,0.2)]`}
        style={clipBadge}
      >
        {type}
      </span>
    );
  }
  
  return (
    <span
      className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${t.className}`}
      style={clipBadge}
    >
      {t.label}
    </span>
  );
}