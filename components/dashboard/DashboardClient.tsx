'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { StatCards } from '@/components/dashboard/StatCards';
import { GamePills } from '@/components/dashboard/GamePills';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { RightWidgets } from '@/components/dashboard/RightWidgets';
import { GameFilter, TypeFilter, gameAccentMap } from '@/components/utils/constants';
import { LoadingAnimation } from '@/components/ui';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ReportItem {
  id: number;
  title: string;
  type: string;
  game: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TypeFilter>('all');
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statsData, setStatsData] = useState<any[]>([]);
  const [reportsData, setReportsData] = useState<ReportItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [topReports, setTopReports] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any>(null);
  const [gameCoverage, setGameCoverage] = useState<any[]>([]);
  const [widgetsLoading, setWidgetsLoading] = useState(true);

  // Handle tag click from widget
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveFilter('all');
    setActiveGame('all');
  };

  const handleFilterChange = (filter: TypeFilter) => {
    setActiveFilter(filter);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle search from Topbar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveFilter('all');
    setActiveGame('all');
  };

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsRes = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (stats.success && stats.data) setStatsData(stats.data);
        }

        await fetchReports();
        await fetchWidgetsData();

      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchReports = async (game?: GameFilter, type?: TypeFilter, search?: string) => {
    setReportsLoading(true);
    try {
      const gameParam = game !== undefined ? game : activeGame;
      const typeParam = type !== undefined ? type : activeFilter;
      const searchParam = search !== undefined ? search : searchQuery;
      
      let url = `${API_BASE_URL}/api/dashboard/reports?game=${gameParam}&type=${typeParam}&page=1&limit=20`;
      if (searchParam && searchParam.trim()) {
        url += `&search=${encodeURIComponent(searchParam.trim())}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reports) {
          setReportsData(data.reports);
        } else {
          setReportsData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchWidgetsData = async () => {
    setWidgetsLoading(true);
    try {
      const [topRes, tagsRes, activityRes, coverageRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/top-reports`),
        fetch(`${API_BASE_URL}/api/dashboard/trending-tags`),
        fetch(`${API_BASE_URL}/api/dashboard/activity`),
        fetch(`${API_BASE_URL}/api/dashboard/game-coverage`)
      ]);

      if (topRes.ok) {
        const top = await topRes.json();
        if (top.success && top.data) setTopReports(top.data);
      }
      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        if (tags.success && tags.data) setTrendingTags(tags.data);
      }
      if (activityRes.ok) {
        const activity = await activityRes.json();
        if (activity.success && activity.data) setActivityData(activity.data);
      }
      if (coverageRes.ok) {
        const coverage = await coverageRes.json();
        if (coverage.success && coverage.data) setGameCoverage(coverage.data);
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setWidgetsLoading(false);
    }
  };

  // Fetch when filters or search change
  useEffect(() => {
    if (!loading) {
      fetchReports(activeGame, activeFilter, searchQuery);
    }
  }, [activeGame, activeFilter, searchQuery]);

  const handleGameNav = (game: GameFilter) => {
    setActiveGame(game);
    setActiveFilter('all');
    setSearchQuery('');
  };

  const accentColor = gameAccentMap[activeGame] || '#C8A96E';

  if (loading) {
    return <LoadingAnimation message="LOADING DASHBOARD..." />;
  }

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)`,
      }} />

      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
        <Topbar 
          activeGame={activeGame} 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClearSearch={clearSearch}
        />

        <div style={{ padding: '32px', flex: 1 }}>
          <StatCards stats={statsData} />
          
          <GamePills activeGame={activeGame} onGameChange={handleGameNav} />

          {/* Active search indicator */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-md flex items-center justify-between" style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[0.75rem] text-[#C8A96E] font-semibold">Search results for:</span>
                <span className="font-bold text-[#E8E0CC]">"{searchQuery}"</span>
                <span className="text-[0.7rem] text-[#5A5248]">({reportsData.length} reports found)</span>
              </div>
              <button
                onClick={clearSearch}
                className="text-[0.7rem] text-[#E05C7A] hover:text-[#E85050] transition-colors bg-transparent border-none cursor-pointer"
              >
                ✕ Clear search
              </button>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '24px',
          }}>
            <ReportsSection
              filteredReports={reportsData}
              activeFilter={activeFilter}
              setActiveFilter={handleFilterChange}
              loading={reportsLoading}
              searchTag={searchQuery}
            />
            <RightWidgets 
              accentColor={accentColor}
              topReports={topReports}
              tags={trendingTags}
              activity={activityData}
              coverage={gameCoverage}
              loading={widgetsLoading}
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}