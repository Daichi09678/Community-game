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

interface ReportItem {
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

// Default data untuk fallback
const defaultStats = [
  { label: 'Total Reports', value: '12,480', change: '↑ +248 this week', accent: '#C8A96E' },
  { label: 'Active Events', value: '7', change: 'Across all games', accent: '#4ECDC4' },
  { label: 'Puzzles Solved', value: '4,230', change: '↑ +62 today', accent: '#A855F7' },
  { label: 'Active Travelers', value: '31.6K', change: '↑ Online now: 420', accent: '#C84040' },
];

const defaultReports: ReportItem[] = [
  { title: 'Penacony Dreamscape Guide', type: 'mission', game: 'hsr', author: 'StellaronHunter', initials: 'SH', rating: 4.8, votes: 1247, date: '2h ago', version: '3.2' },
  { title: 'Arlecchino Boss Fight', type: 'event', game: 'gi', author: 'LumineMain', initials: 'LM', rating: 4.9, votes: 892, date: '5h ago', version: '5.3' },
  { title: 'Hollow Zero Guide', type: 'puzzle', game: 'zzz', author: 'Proxy_01', initials: 'PR', rating: 4.7, votes: 756, date: '1d ago', version: '1.4' },
  { title: 'Elysian Realm Tips', type: 'mission', game: 'hi3', author: 'Captain', initials: 'CP', rating: 4.6, votes: 543, date: '2d ago', version: '7.4' },
];

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TypeFilter>('all');
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [statsData, setStatsData] = useState(defaultStats);
  const [reportsData, setReportsData] = useState<ReportItem[]>(defaultReports);
  const [topReports, setTopReports] = useState<any[]>([
    { title: 'Penacony Dreamscape Guide', score: 1247, rankStyle: 'text-[#C8A96E]' },
    { title: 'Arlecchino Boss Fight', score: 892, rankStyle: 'text-[#B0B8C4]' },
    { title: 'Hollow Zero Guide', score: 756, rankStyle: 'text-[#CD7F32]' },
  ]);
  const [trendingTags, setTrendingTags] = useState<any[]>([
    { label: '#Exploration', variant: 'gold', count: 234 },
    { label: '#Lore', variant: 'cyan', count: 189 },
    { label: '#Build', variant: 'default', count: 156 },
  ]);
  const [activityData, setActivityData] = useState<any>({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    vals: [42, 38, 45, 52, 48, 67, 58],
    maxVal: 67
  });
  const [gameCoverage, setGameCoverage] = useState<any[]>([
    { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
    { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
    { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
    { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
  ]);

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Coba fetch dari backend, jika gagal pakai default data
        const fetchWithTimeout = async (url: string, timeout = 5000) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        };

        const [statsRes, reportsRes, topRes, tagsRes, activityRes, coverageRes] = await Promise.all([
          fetchWithTimeout('/api/dashboard/stats').catch(() => null),
          fetchWithTimeout('/api/dashboard/reports').catch(() => null),
          fetchWithTimeout('/api/dashboard/top-reports').catch(() => null),
          fetchWithTimeout('/api/dashboard/trending-tags').catch(() => null),
          fetchWithTimeout('/api/dashboard/activity').catch(() => null),
          fetchWithTimeout('/api/dashboard/game-coverage').catch(() => null),
        ]);

        // Handle stats
        if (statsRes && statsRes.ok) {
          const stats = await statsRes.json();
          if (stats.success && stats.data) setStatsData(stats.data);
        }

        // Handle reports
        if (reportsRes && reportsRes.ok) {
          const reports = await reportsRes.json();
          if (reports.success && reports.reports?.length > 0) {
            setReportsData(reports.reports);
          }
        }

        // Handle top reports
        if (topRes && topRes.ok) {
          const top = await topRes.json();
          if (top.success && top.data?.length > 0) setTopReports(top.data);
        }

        // Handle tags
        if (tagsRes && tagsRes.ok) {
          const tags = await tagsRes.json();
          if (tags.success && tags.data?.length > 0) setTrendingTags(tags.data);
        }

        // Handle activity
        if (activityRes && activityRes.ok) {
          const activity = await activityRes.json();
          if (activity.success && activity.data) setActivityData(activity.data);
        }

        // Handle coverage
        if (coverageRes && coverageRes.ok) {
          const coverage = await coverageRes.json();
          if (coverage.success && coverage.data?.length > 0) setGameCoverage(coverage.data);
        }

      } catch (error) {
        console.error('Error fetching dashboard, using default data:', error);
        // Data default sudah diset di useState
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch filtered reports when filter changes
  useEffect(() => {
    const fetchFilteredReports = async () => {
      try {
        const res = await fetch(`/api/dashboard/reports?game=${activeGame}&type=${activeFilter}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reports?.length > 0) {
            setReportsData(data.reports);
          } else if (activeGame !== 'all' || activeFilter !== 'all') {
            // Filter tidak menemukan data, tetap pakai data yang ada
            console.log('No filtered results');
          }
        }
      } catch (error) {
        console.error('Error fetching filtered reports:', error);
      }
    };

    fetchFilteredReports();
  }, [activeGame, activeFilter]);

  const handleGameNav = (game: GameFilter) => {
    setActiveGame(game);
    setActiveFilter('all');
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
        <Topbar activeGame={activeGame} />

        <div style={{ padding: '32px', flex: 1 }}>
          <StatCards stats={statsData} />
          <GamePills activeGame={activeGame} onGameChange={handleGameNav} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '24px',
          }}>
            <ReportsSection
              filteredReports={reportsData}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            <RightWidgets 
              accentColor={accentColor}
              topReports={topReports}
              tags={trendingTags}
              activity={activityData}
              coverage={gameCoverage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}