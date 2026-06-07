// components/all-report/AllReportClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import {
  ReportsTable,
  RightWidgets,
  clipBtn,
} from '@/components/all-report';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type TypeFilter = 'all' | 'guide' | 'event' | 'puzzle' | 'build';

interface Report {
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

const gameLabels: Record<string, string> = {
  all: 'All Games', 
  hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', 
  zzz: 'Zenless Zone Zero', 
  hi3: 'Honkai Impact 3rd',
};

export default function AllReportClient() {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TypeFilter>('all');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Fetch reports from API
  const fetchReports = async (page: number = 1) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/dashboard/reports?page=${page}&limit=10`;
      if (gameFilter !== 'all') url += `&game=${gameFilter}`;
      if (filterType !== 'all') url += `&type=${filterType}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedReports = (data.reports || []).map((report: any) => ({
            id: report.id,
            title: report.title,
            type: report.type,
            game: report.game,
            author: report.author || 'Anonymous',
            initials: report.authorInitials || report.author?.slice(0, 2).toUpperCase() || 'TB',
            rating: report.rating || 0,
            votes: report.votes || 0,
            date: report.date || 'Just now',
            version: report.version || '1.0',
          }));
          setReports(formattedReports);
          setPagination(data.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 });
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchReports(1);
  }, [gameFilter, filterType, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const gamePillClass = (g: GameFilter): string => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const activeMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi:  'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hoverMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi:  'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${gameFilter === g ? activeMap[g] : hoverMap[g]}`;
  };

  // Loading screen
  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 relative">
            <svg width="80" height="80" viewBox="0 0 28 28" className="mx-auto">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2">
                <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </polygon>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <p className="mt-6 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
            LOADING REPORTS LIBRARY...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{
        background: '#050810',
        color: '#E8E0CC',
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Background gradients */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* SIDEBAR - Menggunakan komponen Sidebar dari dashboard */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="sticky top-0 z-40 backdrop-blur-[10px] border-b border-[rgba(200,169,110,0.15)] px-8 py-4" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                All Reports — {gameLabels[gameFilter]}
                {filterType !== 'all' && ` / ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
                {searchQuery && <span className="ml-2 text-[#C8A96E] text-[0.8rem]">· Searching: "{searchQuery}"</span>}
              </h1>
              <p className="text-[0.7rem] text-[#5A5248] mt-1">{pagination.totalItems} reports found</p>
            </div>

            <div className="flex gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-4 py-2" style={clipBtn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                    <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#E8E0CC] w-48 placeholder-[#5A5248]"
                  />
                  {searchInput && (
                    <button type="button" onClick={clearSearch} className="text-[#5A5248] hover:text-[#E05C7A]">✕</button>
                  )}
                </div>
                <button type="submit" className="px-4 py-2 bg-[rgba(200,169,110,0.1)] border border-[#C8A96E] text-[#C8A96E] text-[0.7rem] font-bold uppercase tracking-wide" style={clipBtn}>
                  Search
                </button>
              </form>

              <button
                onClick={() => window.location.href = '/UserHoyo/write-report'}
                className="px-4 py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.75rem] font-bold tracking-[0.1em] uppercase cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
              >
                + Write Report
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Game Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span
                key={g}
                className={gamePillClass(g)}
                onClick={() => setGameFilter(g)}
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                {gameLabels[g]}
              </span>
            ))}
          </div>

          {/* Reports Table and Right Widgets */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <ReportsTable
              filteredReports={reports}
              filterType={filterType}
              setFilterType={setFilterType}
              loading={loading}
            />
            <RightWidgets />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => fetchReports(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-[rgba(200,169,110,0.3)] text-[#9A8F78] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#C8A96E] transition-all"
                style={clipBtn}
              >
                ← Previous
              </button>
              <span className="px-4 py-2 text-[#9A8F78]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchReports(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-[rgba(200,169,110,0.3)] text-[#9A8F78] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#C8A96E] transition-all"
                style={clipBtn}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}