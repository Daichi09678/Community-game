'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clipBadge, clipWidget } from '@/components/utils/styles';
import { WidgetTitle } from '@/components/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TopReport {
  id: number;
  title: string;
  score: number;
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

interface RightWidgetsProps {
  accentColor?: string;
  topReports?: TopReport[];
  tags?: TrendingTag[];
  activity?: ActivityData;
  coverage?: GameCoverage[];
  loading?: boolean;
  onTagClick?: (tag: string) => void;
}

const defaultTopReports: TopReport[] = [
  { id: 1, title: 'Penacony Dreamscape Guide', score: 1247, rankStyle: 'text-[#C8A96E]' },
  { id: 2, title: 'Arlecchino Boss Fight', score: 892, rankStyle: 'text-[#B0B8C4]' },
  { id: 3, title: 'Hollow Zero Guide', score: 756, rankStyle: 'text-[#CD7F32]' },
  { id: 4, title: 'Memory Bubble Locations', score: 521, rankStyle: 'text-[#5A5248]' },
  { id: 5, title: 'Neuvillette Best Build', score: 498, rankStyle: 'text-[#5A5248]' },
];

const defaultTags: TrendingTag[] = [
  { label: '#Guide', variant: 'default', count: 7 },
  { label: '#Arlecchino', variant: 'gold', count: 1 },
  { label: '#BossFight', variant: 'default', count: 1 },
  { label: '#Build', variant: 'default', count: 1 },
  { label: '#Endgame', variant: 'default', count: 1 },
  { label: '#Event', variant: 'cyan', count: 1 },
  { label: '#Exploration', variant: 'gold', count: 1 },
  { label: '#HollowZero', variant: 'purple', count: 1 },
  { label: '#MemoryBubble', variant: 'default', count: 1 },
  { label: '#Neuvillette', variant: 'default', count: 1 },
];

export function RightWidgets({ 
  accentColor = '#C8A96E', 
  topReports: propTopReports,
  tags: propTags,
  activity: propActivity,
  coverage: propCoverage,
  loading: propLoading = false,
  onTagClick
}: RightWidgetsProps) {
  const router = useRouter();
  const [topReports, setTopReports] = useState<TopReport[]>(propTopReports || defaultTopReports);
  const [tags, setTags] = useState<TrendingTag[]>(propTags || defaultTags);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [coverage, setCoverage] = useState<GameCoverage[]>(propCoverage || []);
  const [loading, setLoading] = useState(propLoading);

  // Fetch data from API jika tidak ada props
  useEffect(() => {
    if (propTopReports && propTags && propActivity && propCoverage) {
      setActivity(propActivity);
      setCoverage(propCoverage);
      return;
    }

    const fetchWidgetData = async () => {
      setLoading(true);
      try {
        // Fetch Top Reports
        if (!propTopReports) {
          const topRes = await fetch(`${API_BASE_URL}/api/dashboard/top-reports`);
          if (topRes.ok) {
            const topData = await topRes.json();
            if (topData.success && topData.data && topData.data.length > 0) {
              const formattedReports = topData.data.map((item: any, index: number) => ({
                id: item.id || index + 1,
                title: item.title,
                score: item.score || 0,
                rankStyle: ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'][index] || 'text-[#5A5248]',
              }));
              setTopReports(formattedReports);
            }
          }
        }

        // Fetch Trending Tags
        if (!propTags) {
          const tagsRes = await fetch(`${API_BASE_URL}/api/dashboard/trending-tags`);
          if (tagsRes.ok) {
            const tagsData = await tagsRes.json();
            if (tagsData.success && tagsData.data && tagsData.data.length > 0) {
              setTags(tagsData.data);
            }
          }
        }

        // Fetch Activity Data
        if (!propActivity) {
          const activityRes = await fetch(`${API_BASE_URL}/api/dashboard/activity`);
          if (activityRes.ok) {
            const activityData = await activityRes.json();
            if (activityData.success && activityData.data) {
              setActivity(activityData.data);
            }
          }
        }

        // Fetch Game Coverage
        if (!propCoverage) {
          const coverageRes = await fetch(`${API_BASE_URL}/api/dashboard/game-coverage`);
          if (coverageRes.ok) {
            const coverageData = await coverageRes.json();
            if (coverageData.success && coverageData.data) {
              setCoverage(coverageData.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching widget data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!propTopReports || !propTags || !propActivity || !propCoverage) {
      fetchWidgetData();
    } else {
      setLoading(false);
    }
  }, [propTopReports, propTags, propActivity, propCoverage]);

  const tagVariant: Record<string, string> = {
    default: 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.2)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)]',
    gold: 'bg-[rgba(200,169,110,0.12)] border-[rgba(200,169,110,0.3)] text-[#F0D080] hover:bg-[rgba(200,169,110,0.2)]',
    cyan: 'bg-[rgba(78,205,196,0.08)] border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.15)]',
    purple: 'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]',
  };

  const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];

  const handleTagClick = (tagLabel: string) => {
    const tagName = tagLabel.replace('#', '');
    if (onTagClick) {
      onTagClick(tagName);
    } else {
      router.push(`/UserHoyo/dashboard/trending-tags?tag=${encodeURIComponent(tagName)}`);
    }
  };

  const handleViewAll = () => {
    router.push('/UserHoyo/dashboard/trending-tags');
  };

  const isLoading = loading || propLoading;

  if (isLoading) {
    return (
      <div>
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
          <div className="animate-pulse text-[#5A5248] text-center">Loading widgets...</div>
        </div>
      </div>
    );
  }

  const displayActivity = activity || { 
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    vals: [42, 38, 45, 52, 48, 67, 58], 
    maxVal: 67 
  };
  const todayIndex = displayActivity.days.length - 1;

  return (
    <div>
      {/* Top Reports - WITH LINK TO DETAIL REPORT */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Top Reports</WidgetTitle>
        {topReports.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0 group">
            <span className={`font-['Space_Mono',monospace] text-[0.7rem] min-w-[20px] ${rankStyles[i]}`}>#{i + 1}</span>
            <Link 
              href={`/UserHoyo/report/${item.id}`} 
              className="flex-1 text-[0.78rem] text-[#9A8F78] cursor-pointer transition-colors duration-200 hover:text-[#E8E0CC] leading-[1.3] line-clamp-1 no-underline"
            >
              {item.title}
            </Link>
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4] whitespace-nowrap">
              {item.score.toLocaleString()} votes
            </span>
          </div>
        ))}
      </div>

      {/* Trending Tags Widget */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="flex items-center justify-between mb-3">
          <WidgetTitle>Trending Tags</WidgetTitle>
          <button 
            onClick={handleViewAll}
            className="text-[0.6rem] text-[#C8A96E] font-['Space_Mono',monospace] hover:text-[#EDD28A] transition-colors cursor-pointer bg-transparent border-none"
          >
            View all →
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 10).map((tag, i) => (
            <span
              key={i}
              style={clipBadge}
              onClick={() => handleTagClick(tag.label)}
              className={`inline-flex items-center gap-1 px-[8px] py-[2px] border text-[0.65rem] font-medium cursor-pointer transition-all duration-200 ${tagVariant[tag.variant] || tagVariant.default} hover:scale-105`}
            >
              {tag.label}
              <span className="text-[0.55rem] text-[#5A5248]">({tag.count})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="flex items-center justify-between mb-4">
          <WidgetTitle>Activity This Week</WidgetTitle>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
            <span className="text-[0.55rem] text-[#4ECDC4] font-['Space_Mono',monospace]">Live</span>
          </div>
        </div>
        
        <div className="flex items-end gap-1 h-20">
          {displayActivity.days.map((day, i) => {
            const barHeight = displayActivity.maxVal > 0 
              ? Math.max(6, (displayActivity.vals[i] / displayActivity.maxVal) * 60)
              : 6;
            const isToday = i === todayIndex;
            const barColor = isToday ? accentColor : 'rgba(200,169,110,0.35)';
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: `linear-gradient(180deg, ${barColor}, ${barColor}80)`,
                    borderRadius: '2px 2px 0 0',
                  }}
                />
                <span className={`text-[0.5rem] font-['Space_Mono',monospace] ${isToday ? 'text-[#C8A96E]' : 'text-[#5A5248]'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="text-right mt-3 text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace]">
          {displayActivity.vals.reduce((a, b) => a + b, 0)} total activities
        </div>
      </div>

      {/* Game Coverage */}
      {coverage.length > 0 && (
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
          <WidgetTitle>Game Coverage</WidgetTitle>
          {coverage.map((g, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-[0.7rem] text-[#9A8F78]">{g.label}</span>
                <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
              </div>
              <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${g.fill} transition-[width] duration-[600ms] ease-in-out rounded-full`} 
                  style={{ width: `${g.pct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}