'use client';

import { clipWidget } from '@/components/utils/styles';

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  accent: string;
}

interface StatCardsProps {
  stats?: StatCard[];
}

const defaultStats: StatCard[] = [
  { label: 'Total Reports', value: '0', change: 'Loading...', accent: '#C8A96E' },
  { label: 'Active Events', value: '0', change: 'Loading...', accent: '#4ECDC4' },
  { label: 'Puzzles Solved', value: '0', change: 'Loading...', accent: '#A855F7' },
  { label: 'Active Travelers', value: '0', change: 'Loading...', accent: '#C84040' },
];

export function StatCards({ stats }: StatCardsProps) {
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <div className="grid grid-cols-4 gap-4 mb-8 max-[1100px]:grid-cols-2">
      {displayStats.map((card, i) => (
        <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 relative overflow-hidden" style={clipWidget}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: card.accent }} />
          <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-[0.6rem]">{card.label}</div>
          <div className="font-['Space_Mono',monospace] text-[1.8rem] font-bold" style={{ color: card.accent }}>{card.value}</div>
          <div className="text-[0.72rem] text-[#4ECDC4] mt-1">{card.change}</div>
        </div>
      ))}
    </div>
  );
}