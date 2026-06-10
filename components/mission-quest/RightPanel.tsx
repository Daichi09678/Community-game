'use client';
// Import Link di atas (tambahkan di bagian import)
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { clipCard, clipHex } from './clipStyles';

interface RightPanelProps {
  gameFilter: 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
  categoryCounts?: {
    guide: number;
    event: number;
    puzzle: number;
    build: number;
  };
}

interface TopReport {
  id: string;
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

export function RightPanel({ gameFilter, categoryCounts }: RightPanelProps) {
  const [topReports, setTopReports] = useState<TopReport[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [activityData, setActivityData] = useState<ActivityData>({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    vals: [42, 38, 45, 52, 48, 67, 58],
    maxVal: 67
  });
  const [gameCoverage, setGameCoverage] = useState<GameCoverage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch top reports
  const fetchTopReports = async () => {
    try {
      const response = await fetch('/api/dashboard/top-reports', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setTopReports(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching top reports:', error);
    }
  };

  // Fetch trending tags
  const fetchTrendingTags = async () => {
    try {
      const response = await fetch('/api/dashboard/trending-tags', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setTrendingTags(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching trending tags:', error);
    }
  };

  // Fetch activity data
  const fetchActivityData = async () => {
    try {
      const response = await fetch('/api/dashboard/activity', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setActivityData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };

  // Fetch game coverage
  const fetchGameCoverage = async () => {
    try {
      const response = await fetch('/api/dashboard/game-coverage', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setGameCoverage(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching game coverage:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTopReports(),
        fetchTrendingTags(),
        fetchActivityData(),
        fetchGameCoverage(),
      ]);
      setLoading(false);
    };
    
    loadData();
    
    // Refresh data when gameFilter changes
    const handleRefresh = () => {
      fetchTopReports();
      fetchTrendingTags();
      fetchActivityData();
      fetchGameCoverage();
    };
    
    window.addEventListener('refreshSidebarStats', handleRefresh);
    window.addEventListener('reportCreated', handleRefresh);
    window.addEventListener('reportDeleted', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshSidebarStats', handleRefresh);
      window.removeEventListener('reportCreated', handleRefresh);
      window.removeEventListener('reportDeleted', handleRefresh);
    };
  }, []);

  // Variant style mapping untuk tags
  const getTagStyle = (variant: string) => {
    switch (variant) {
      case 'gold':
        return 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border-[rgba(200,169,110,0.3)]';
      case 'cyan':
        return 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border-[rgba(78,205,196,0.3)]';
      case 'purple':
        return 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border-[rgba(168,85,247,0.3)]';
      default:
        return 'bg-[rgba(255,255,255,0.05)] text-[#9A8F78] border-[rgba(255,255,255,0.1)]';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-800 rounded"></div>
            <div className="h-10 bg-gray-800 rounded"></div>
            <div className="h-10 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Coverage Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
        <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#C8A96E]" />
          GAME COVERAGE
        </div>
        <div className="space-y-3">
          {gameCoverage.map((g, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-[0.7rem] font-['Space_Mono',monospace] mb-1">
                <span className="text-[#9A8F78]">{g.label}</span>
                <span className="text-[#E8E0CC]">{g.pct}%</span>
              </div>
              <div className="h-[2px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div className={`h-full ${g.fill} rounded-full`} style={{ width: `${g.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Stats Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
        <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-[#4ECDC4] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#4ECDC4]" />
          CATEGORY STATS
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] text-[#9A8F78] font-['Space_Mono',monospace]">📖 Mission & Quest</span>
            <span className="text-[#C8A96E] font-['Cinzel',serif] font-bold">{categoryCounts?.guide || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] text-[#9A8F78] font-['Space_Mono',monospace]">🎪 Event Seasonal</span>
            <span className="text-[#4ECDC4] font-['Cinzel',serif] font-bold">{categoryCounts?.event || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] text-[#9A8F78] font-['Space_Mono',monospace]">🔍 Puzzle & Riddles</span>
            <span className="text-[#A855F7] font-['Cinzel',serif] font-bold">{categoryCounts?.puzzle || 0}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[rgba(200,169,110,0.1)]">
            <span className="text-[0.7rem] text-[#E8E0CC] font-semibold">Total Reports</span>
            <span className="text-[#C8A96E] font-['Cinzel',serif] font-bold">
              {(categoryCounts?.guide || 0) + (categoryCounts?.event || 0) + (categoryCounts?.puzzle || 0) + (categoryCounts?.build || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Top Reports Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
        <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#C8A96E]" />
          TOP REPORTS
        </div>
        <div className="space-y-3">
          {topReports.length === 0 ? (
            <div className="text-center py-4 text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
              No reports yet
            </div>
          ) : (
            topReports.map((report, idx) => (
              <Link 
                key={report.id} 
                href={`/UserHoyo/report/${report.id}`}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-['Cinzel',serif] font-bold text-[0.85rem] w-5 ${report.rankStyle}`}>
                    {idx + 1}
                  </span>
                  <span className="text-[0.75rem] text-[#9A8F78] group-hover:text-[#C8A96E] transition-colors line-clamp-1">
                    {report.title}
                  </span>
                </div>
                <span className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace]">
                  {report.score} votes
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Trending Tags Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
        <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-[#A855F7] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#A855F7]" />
          TRENDING TAGS
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 text-[0.65rem] font-['Space_Mono',monospace] border rounded-sm ${getTagStyle(tag.variant)}`}
            >
              {tag.label} ({tag.count})
            </span>
          ))}
        </div>
      </div>

      {/* Activity Chart Card */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
        <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-[#4ECDC4] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#4ECDC4]" />
          WEEKLY ACTIVITY
        </div>
        <div className="flex items-end justify-between h-24 gap-1">
          {activityData.days.map((day, idx) => (
            <div key={day} className="flex-1 text-center">
              <div 
                className="w-full bg-gradient-to-t from-[#4ECDC4] to-[#6DD18A] rounded-sm transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${(activityData.vals[idx] / activityData.maxVal) * 80}px`,
                  opacity: gameFilter === 'all' ? 1 : 0.5
                }}
              />
              <div className="text-[0.55rem] text-[#5A5248] mt-2 font-['Space_Mono',monospace]">
                {day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

