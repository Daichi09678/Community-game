'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clipBadge, clipWidget } from '@/components/common/clipStyles';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TopReport {
  id: number;
  title: string;
  score: number;
  author: string;
  rankStyle: string;
}

interface TrendingTag {
  label: string;
  variant: string;
  count: number;
}

interface ActivityData {
  days: string[];
  vals: number[];
  maxVal: number;
}

interface GameCoverage {
  label: string;
  pct: number;
  fill: string;
}

const rankStyles = ['text-[#C8A96E]', 'text-[#C8A96E]', 'text-[#9AA0AA]', 'text-[#9AA0AA]', 'text-[#CD7F32]'];

const tagVariantClass: Record<string, string> = {
  default: 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.2)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)]',
  gold:    'bg-[rgba(200,169,110,0.12)] border-[rgba(200,169,110,0.3)] text-[#F0D080] hover:bg-[rgba(200,169,110,0.2)]',
  cyan:    'bg-[rgba(78,205,196,0.08)] border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.15)]',
  purple:  'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]',
};

export function RightWidgets() {
  const [mounted, setMounted] = useState(false);
  const [topReports, setTopReports] = useState<TopReport[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [gameCoverage, setGameCoverage] = useState<GameCoverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchAllWidgetData();
  }, []);

  const fetchAllWidgetData = async () => {
    setLoading(true);
    try {
      // Fetch Top Reports
      const topRes = await fetch(`${API_BASE_URL}/api/dashboard/top-reports`);
      if (topRes.ok) {
        const topData = await topRes.json();
        if (topData.success && topData.data) {
          setTopReports(topData.data);
        } else {
          // Fallback data
          setTopReports([
            { id: 1, title: 'Penacony Dreamscape Guide', score: 1247, author: 'Trailblazer', rankStyle: 'text-[#C8A96E]' },
            { id: 2, title: 'Arlecchino Boss Fight', score: 892, author: 'Traveler', rankStyle: 'text-[#C8A96E]' },
            { id: 3, title: 'Hollow Zero Guide', score: 756, author: 'Proxy', rankStyle: 'text-[#9AA0AA]' },
            { id: 4, title: 'Chasca Hangout Quest', score: 521, author: 'GenshinPlayer', rankStyle: 'text-[#9AA0AA]' },
            { id: 5, title: 'Elysian Realm Guide', score: 498, author: 'Captain', rankStyle: 'text-[#CD7F32]' },
          ]);
        }
      }

      // Fetch Trending Tags
      const tagsRes = await fetch(`${API_BASE_URL}/api/dashboard/trending-tags`);
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        if (tagsData.success && tagsData.data) {
          setTrendingTags(tagsData.data);
        } else {
          setTrendingTags([
            { label: '#Exploration', variant: 'gold', count: 234 },
            { label: '#Lore', variant: 'cyan', count: 189 },
            { label: '#Build', variant: 'default', count: 156 },
            { label: '#Guide', variant: 'default', count: 142 },
            { label: '#Achievement', variant: 'gold', count: 128 },
            { label: '#Secret', variant: 'purple', count: 97 },
            { label: '#BossFight', variant: 'default', count: 86 },
            { label: '#EventExclusive', variant: 'cyan', count: 72 },
          ]);
        }
      }

      // Fetch Activity Data
      const activityRes = await fetch(`${API_BASE_URL}/api/dashboard/activity`);
      if (activityRes.ok) {
        const activity = await activityRes.json();
        if (activity.success && activity.data) {
          setActivityData(activity.data);
        }
      }

      // Fetch Game Coverage
      const coverageRes = await fetch(`${API_BASE_URL}/api/dashboard/game-coverage`);
      if (coverageRes.ok) {
        const coverage = await coverageRes.json();
        if (coverage.success && coverage.data) {
          setGameCoverage(coverage.data);
        }
      }
    } catch (error) {
      console.error('Error fetching widget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayActivity = activityData || { 
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    vals: [0, 0, 0, 0, 0, 0, 0], 
    maxVal: 1 
  };
  
  const displayCoverage = gameCoverage.length > 0 ? gameCoverage : [
    { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
    { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
    { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
    { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
  ];

  if (loading && mounted) {
    return (
      <div>
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 mb-5" style={clipWidget}>
          <div className="animate-pulse text-[#5A5248] text-center">Loading widgets...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Reports */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Top Reports
        </div>
        {topReports.slice(0, 5).map((item, i) => (
          <div key={item.id || i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <span className={`font-['Space_Mono',monospace] text-[0.72rem] min-w-[20px] ${rankStyles[i] || 'text-[#5A5248]'}`}>#{i + 1}</span>
            <Link 
              href={`/UserHoyo/report/${item.id}`}
              className="flex-1 text-[0.82rem] text-[#9A8F78] cursor-pointer transition-colors duration-200 hover:text-[#E8E0CC] leading-[1.3] no-underline"
            >
              {item.title}
            </Link>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{item.score.toLocaleString()} votes</span>
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Trending Tags
        </div>
        <div className="-mt-1">
          {trendingTags.slice(0, 10).map((tag, i) => (
            <span
              key={i}
              style={clipBadge}
              className={`inline-block px-[10px] py-[3px] border text-[0.7rem] font-semibold m-[3px] cursor-pointer transition-all duration-200 ${tagVariantClass[tag.variant]}`}
            >
              {tag.label} ({tag.count})
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Activity This Week
        </div>
        <div className="flex items-end gap-[6px] h-20">
          {displayActivity.days.map((day, i) => {
            const barHeight = displayActivity.maxVal > 0 
              ? Math.max(8, (displayActivity.vals[i] / displayActivity.maxVal) * 52)
              : 8;
            const isToday = i === displayActivity.days.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300"
                  style={{
                    height: mounted ? `${barHeight}px` : '30px',
                    background: isToday ? '#C8A96E' : 'rgba(200,169,110,0.25)',
                  }}
                />
                <span className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace]">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Coverage */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
          <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
          Game Coverage
        </div>
        {displayCoverage.map((g, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-[0.7rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <div 
                className={`h-full ${g.fill} transition-all duration-[600ms] ease-in-out rounded-full`} 
                style={{ width: mounted ? `${g.pct}%` : '0%' }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}