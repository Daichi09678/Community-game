'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SidebarAllReport, ReportsTable, RightWidgets, GamePills, clipBtn } from './index';

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
  const [isSearching, setIsSearching] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReports = useCallback(async (page: number = 1) => {
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
  }, [gameFilter, filterType, searchQuery]);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // If value is empty, clear search immediately
    if (value.trim() === '') {
      setSearchQuery('');
      setIsSearching(false);
      return;
    }
    
    // Show loading indicator
    setIsSearching(true);
    
    // Set new timer (500ms delay)
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setIsSearching(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  // Show loading spinner for initial load
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

      {/* SIDEBAR ALL REPORT */}
      <SidebarAllReport />

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
              {/* SEARCH INPUT WITH DEBOUNCE - NO SEARCH BUTTON */}
              <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-4 py-2 min-w-[260px]" style={clipBtn}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                  <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none outline-none text-[#E8E0CC] w-48 placeholder-[#5A5248]"
                />
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                )}
                {searchInput && !isSearching && (
                  <button type="button" onClick={clearSearch} className="text-[#5A5248] hover:text-[#E05C7A] transition-colors">
                    ✕
                  </button>
                )}
              </div>

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
          <GamePills activeGame={gameFilter} onGameChange={setGameFilter} />

          {/* Reports Table and Right Widgets */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <ReportsTable
              filteredReports={reports}
              filterType={filterType}
              setFilterType={setFilterType}
              loading={loading && reports.length === 0 ? false : loading}
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}