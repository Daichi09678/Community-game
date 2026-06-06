'use client';

import { clipBadge, clipWidget } from '@/components/utils/styles';
import { WidgetTitle } from '@/components/common';

interface RightWidgetsProps {
  accentColor: string;
  topReports?: Array<{ title: string; score: number; rankStyle: string }>;
  tags?: Array<{ label: string; variant: string; count: number }>;
  activity?: { days: string[]; vals: number[]; maxVal: number };
  coverage?: Array<{ label: string; pct: number; fill: string }>;
}

const defaultTopReports = [
  { title: 'Penacony Dreamscape Guide', score: 1247, rankStyle: 'text-[#C8A96E]' },
  { title: 'Arlecchino Boss Fight', score: 892, rankStyle: 'text-[#B0B8C4]' },
  { title: 'Hollow Zero Guide', score: 756, rankStyle: 'text-[#CD7F32]' },
  { title: 'Natlan Exploration Guide', score: 543, rankStyle: 'text-[#5A5248]' },
  { title: 'Elysian Realm Tips', score: 421, rankStyle: 'text-[#5A5248]' },
];

const defaultTags = [
  { label: '#Exploration', variant: 'gold', count: 234 },
  { label: '#Lore', variant: 'cyan', count: 189 },
  { label: '#Build', variant: 'default', count: 156 },
  { label: '#FarmRoute', variant: 'default', count: 142 },
  { label: '#Achievement', variant: 'gold', count: 128 },
  { label: '#Secret', variant: 'purple', count: 97 },
];

const defaultActivity = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  vals: [42, 38, 45, 52, 48, 67, 58],
  maxVal: 67
};

const defaultCoverage = [
  { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
  { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
  { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
  { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
];

export function RightWidgets({ 
  accentColor, 
  topReports = defaultTopReports,
  tags = defaultTags,
  activity = defaultActivity,
  coverage = defaultCoverage
}: RightWidgetsProps) {
  const tagVariant: Record<string, string> = {
    default: 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.2)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)]',
    gold: 'bg-[rgba(200,169,110,0.12)] border-[rgba(200,169,110,0.3)] text-[#F0D080] hover:bg-[rgba(200,169,110,0.2)]',
    cyan: 'bg-[rgba(78,205,196,0.08)] border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.15)]',
    purple: 'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]',
  };

  const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];

  return (
    <div>
      {/* Top Reports */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <WidgetTitle>Top Reports</WidgetTitle>
        {topReports.map((item, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.82rem] text-[#9A8F78] cursor-pointer transition-colors duration-200 hover:text-[#E8E0CC] leading-[1.3]">{item.title}</span>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{item.score}</span>
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Tags</WidgetTitle>
        <div className="-mt-1">
          {tags.map((tag, i) => (
            <span key={i} style={clipBadge} className={`inline-block px-[10px] py-[3px] border text-[0.7rem] font-semibold m-[3px] cursor-pointer transition-all duration-200 ${tagVariant[tag.variant]}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <WidgetTitle>Activity This Week</WidgetTitle>
        <div className="flex items-end gap-[6px] h-16">
          {activity.days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div style={{
                width: '100%',
                background: i === 5 ? accentColor : 'rgba(200,169,110,0.25)',
                borderTop: `0.5px solid ${i === 5 ? accentColor : 'rgba(200,169,110,0.4)'}`,
                height: `${Math.round((activity.vals[i] / activity.maxVal) * 52) + 8}px`,
                transition: 'height 0.3s',
              }} />
              <span className="text-[0.6rem] text-[#5A5248]">{day}</span>
            </div>
          ))}
        </div>
        <div className="text-right mt-2 text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
          {activity.vals.reduce((a, b) => a + b, 0)} total reports this week
        </div>
      </div>

      {/* Game Coverage */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
        <WidgetTitle>Game Coverage</WidgetTitle>
        {coverage.map((g, i) => (
          <div key={i} className="mb-[10px]">
            <div className="flex justify-between mb-1">
              <span className="text-[0.75rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <div className={`h-full ${g.fill} transition-[width] duration-[600ms] ease-in-out`} style={{ width: `${g.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}