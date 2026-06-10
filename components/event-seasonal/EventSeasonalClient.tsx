'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  NavGroupLabel,
  NavBadge,
  NavItem,
} from './NavItem';
import {
  GridIcon,
  HexIcon,
  HexDotIcon,
  CalendarIcon,
  DiamondIcon,
  UsersIcon,
  StarIcon,
  PersonIcon,
  InfoIcon,
} from './Icons';
import { EventCard } from './EventCard';
import { FeaturedBanner } from './FeaturedBanner';
import { RightWidgets } from './RightWidgets';
import { clipHex, clipHexSm, clipBtn, clipBadge } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

interface HoyoEvent {
  id: string;
  title: string;
  game: GameKey;
  reportStatus: 'published' | 'pending' | 'archived';
  category: 'limited' | 'permanent' | 'collab' | 'seasonal';
  startDate: string;
  endDate: string;
  rewards: string[];
  description: string;
  tag: string;
  featured?: boolean;
  thumbnail?: string;
  content?: string;
  authorName?: string;
  authorInitials?: string;
  votes?: number;
  views?: number;
  createdAt?: string;
}

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

// Map status ke label dan warna
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'published':
      return { label: 'ACCEPTED', color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)' };
    case 'pending':
      return { label: 'PENDING', color: '#F5A623', bg: 'rgba(245,166,35,0.1)' };
    case 'archived':
      return { label: 'REJECTED', color: '#E05C7A', bg: 'rgba(224,92,122,0.1)' };
    default:
      return { label: 'UNKNOWN', color: '#5A5248', bg: 'rgba(90,82,72,0.1)' };
  }
};

export function EventSeasonalClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [events, setEvents] = useState<HoyoEvent[]>([]);
  const [stats, setStats] = useState({ total: 0, byGame: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Data untuk sidebar dari reportStats (realtime)
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    guide: 0,
    event: 0,
    puzzle: 0,
    build: 0,
  });
  
  // User data untuk sidebar
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
    rank: string;
    level: number;
    xp: number;
    initials: string;
    totalReports: number;
  } | null>(null);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);
  const [xpProgress, setXpProgress] = useState(0);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 500);
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          rank: data.rank || 'Novice Omni-Voyager',
          level: data.level || 1,
          xp: data.xp || 0,
          initials: data.initials || (data.username?.slice(0, 2).toUpperCase() || 'TB'),
          totalReports: data.totalReports || 0
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (data.avatarPhoto) {
          setAvatarPhoto(data.avatarPhoto);
          localStorage.setItem('userAvatar', data.avatarPhoto);
        } else {
          const savedAvatar = localStorage.getItem('userAvatar');
          if (savedAvatar) setAvatarPhoto(savedAvatar);
        }
        
        if (data.bannerPhoto) {
          setBannerPhoto(data.bannerPhoto);
          localStorage.setItem('userBanner', data.bannerPhoto);
        } else {
          const savedBanner = localStorage.getItem('userBanner');
          if (savedBanner) setBannerPhoto(savedBanner);
        }
        
        const currentLevelXP = (userData.level - 1) * 100;
        const nextLevelXP = userData.level * 100;
        const progress = ((userData.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        setXpProgress(Math.min(Math.max(progress, 0), 100));
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarPhoto(savedAvatar);
        const savedBanner = localStorage.getItem('userBanner');
        if (savedBanner) setBannerPhoto(savedBanner);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  };

  // Fetch events from API (dari reports dengan type='event')
  const fetchEvents = async () => {
    try {
      let url = `/api/events?page=1&limit=50`;
      if (gameFilter !== 'all') url += `&game=${gameFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.events) {
          const formattedEvents = data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            game: event.game,
            reportStatus: event.status || 'pending',
            category: 'limited',
            startDate: event.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            endDate: 'N/A',
            rewards: [],
            description: event.description || event.summary || event.title,
            tag: event.type,
            featured: false,
            authorName: event.authorName,
            authorInitials: event.authorInitials,
            votes: event.votes,
            views: event.views,
            content: event.content,
            createdAt: event.createdAt,
          }));
          setEvents(formattedEvents);
          setStats({ total: formattedEvents.length, byGame: [] });
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUser();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('adminProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToReportStats((stats) => {
      setTotalReports(stats.totalReports);
      setCategoryCounts(stats.categoryCounts);
    });
    
    fetchUser();
    fetchReportStats();
    fetchEvents();
    
    const handleRefresh = () => {
      fetchReportStats();
      fetchUser();
      fetchEvents();
    };
    
    window.addEventListener('refreshSidebarStats', handleRefresh);
    window.addEventListener('reportCreated', handleRefresh);
    window.addEventListener('reportDeleted', handleRefresh);
    
    return () => {
      unsubscribe();
      window.removeEventListener('refreshSidebarStats', handleRefresh);
      window.removeEventListener('reportCreated', handleRefresh);
      window.removeEventListener('reportDeleted', handleRefresh);
    };
  }, [gameFilter, searchQuery]);

  const filteredEvents = events.filter(e => {
    if (statusFilter !== 'all' && e.reportStatus !== statusFilter) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    return true;
  });

  const featuredEvents = filteredEvents.filter(e => e.featured);

  // Format number untuk badge
  const formattedTotalReports = totalReports >= 1000 
    ? `${(totalReports / 1000).toFixed(1)}K` 
    : totalReports.toString();

  const formatCount = (count: number) => count.toString();

  const gamePillClass = (g: string) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const colors: Record<string, string> = {
      all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
    };
    const c = colors[g];
    const isActive = gameFilter === g;
    const style = { clipPath: (clipHex as any).clipPath, borderColor: isActive ? c : 'transparent', color: isActive ? c : '#5A5248', background: isActive ? `${c}14` : 'rgba(255,255,255,0.03)' };
    return { className: base, style };
  };

  // Function to get display name (truncate if too long)
  const getDisplayName = (name: string) => {
    if (name && name.length > 15) {
      return name.slice(0, 12) + '...';
    }
    return name || 'Traveler';
  };

  if (loading && events.length === 0) {
    return <LoadingAnimation message="LOADING EVENTS..." />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG Gradients */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        {/* Header dengan Banner/Background */}
        <div className="relative">
          {/* Banner Background */}
          <div 
            className="h-[100px] w-full relative overflow-hidden"
            style={{ 
              background: bannerPhoto 
                ? `url(${bannerPhoto}) center/cover no-repeat` 
                : 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)'
            }}
          >
            {/* Stars effect (only when no banner) */}
            {!bannerPhoto && Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 3 === 0 ? '2px' : '1px',
                  height: i % 3 === 0 ? '2px' : '1px',
                  top: `${10 + (i * 17) % 80}%`,
                  left: `${5 + (i * 23) % 90}%`,
                  opacity: 0.1 + (i % 5) * 0.08,
                }}
              />
            ))}
            
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1220] via-transparent to-transparent" />
          </div>
          
          {/* Logo - dipindahkan ke dalam header agar menyatu dengan banner */}
          <div className="absolute bottom-3 left-5 z-10">
            <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
                <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              </svg>
              Hoyoverse Hub
            </Link>
          </div>
          
          {/* TRAVELER badge */}
          <div className="absolute bottom-3 right-5 z-10">
            <div
              className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
              style={{ ...clipBadge, color: '#C8A96E', borderColor: 'rgba(200,169,110,0.4)', background: 'rgba(200,169,110,0.08)' }}
            >
              ● TRAVELER
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports <NavBadge>{formattedTotalReports}</NavBadge></NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest <NavBadge>{formatCount(categoryCounts.guide)}</NavBadge></NavItem>
          <NavItem active={true}><CalendarIcon /> Event Seasonal <NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles <NavBadge>{formatCount(categoryCounts.puzzle)}</NavBadge></NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>

        {/* Footer - User Info (tanpa tombol logout) */}
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <Link href="/UserHoyo/profile" className="flex items-center gap-[10px] no-underline group">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full border border-[#C8A96E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(200,169,110,0.3)]"
            >
              {avatarPhoto ? (
                <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold">
                  {user?.initials || 'TB'}
                </span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-left relative z-10 min-w-0">
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-300 truncate max-w-[140px]" title={user?.username}>
                {getDisplayName(user?.username || 'Trailblazer')}
              </div>
              <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] transition-all duration-300 group-hover:text-[#C8A96E] truncate max-w-[140px]">
                LV.{user?.level || 1} · {user?.totalReports || 0} reports
              </div>
              {/* XP Bar */}
              <div className="mt-1 h-[2px] bg-[rgba(200,169,110,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C8A96E] to-[#EDD28A] transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}
        >
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Event Seasonal — {gameLabels[gameFilter]}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              {events.length} events found
              {searchQuery && <span className="ml-2 text-[#C8A96E]">· Searching: "{searchQuery}"</span>}
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div
              className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-56 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchInput}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" 
              />
            </div>
            {/* View toggle */}
            <div className="flex border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipHexSm}>
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className="px-3 py-[7px] text-[0.7rem] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all duration-200 border-none"
                  style={{
                    background: viewMode === v ? 'rgba(200,169,110,0.1)' : 'transparent',
                    color: viewMode === v ? '#C8A96E' : '#5A5248',
                  }}
                >
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Game Pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => {
              const pill = gamePillClass(g);
              return (
                <span
                  key={g}
                  className={pill.className}
                  style={pill.style}
                  onClick={() => setGameFilter(g)}
                >
                  {gameLabels[g]}
                </span>
              );
            })}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Status filter - berdasarkan report status */}
            <div className="flex gap-[5px]">
              {(['all', 'published', 'pending', 'archived'] as const).map(s => {
                const statusInfo = getStatusInfo(s);
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-[12px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer rounded-sm
                      ${statusFilter === s
                        ? 'border-[#C8A96E] text-[#C8A96E]'
                        : 'border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)] hover:text-[#9A8F78]'
                      }`}
                    style={{
                      background: statusFilter === s ? statusInfo.bg : 'transparent',
                      borderColor: statusFilter === s ? statusInfo.color : undefined,
                      color: statusFilter === s ? statusInfo.color : undefined,
                    }}
                  >
                    {s === 'all' ? 'All Status' : statusInfo.label}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-4 bg-[rgba(200,169,110,0.15)]" />

            {/* Category filter */}
            <div className="flex gap-[5px]">
              {(['all', 'limited', 'permanent', 'collab', 'seasonal'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-[10px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer rounded-sm
                    ${categoryFilter === c
                      ? 'bg-[rgba(200,169,110,0.08)] border-[rgba(200,169,110,0.5)] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:text-[#9A8F78]'
                    }`}
                >
                  {c === 'all' ? 'All Types' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
              {filteredEvents.length} events
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              {/* Featured banners */}
              {featuredEvents.length > 0 && (
                <div className="mb-6">
                  <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] mb-3">
                    ◆ Featured Events
                  </div>
                  {featuredEvents.map(ev => (
                    <FeaturedBanner key={ev.id} event={ev} />
                  ))}
                </div>
              )}

              {/* All events */}
              {(() => {
                const rest = filteredEvents.filter(e => !e.featured);
                if (rest.length === 0 && featuredEvents.length === 0) {
                  return (
                    <div className="text-center py-16 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                      No events found for this filter.
                    </div>
                  );
                }
                if (rest.length === 0) return null;
                return (
                  <div>
                    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] mb-3">
                      ◆ All Events
                    </div>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4 max-[780px]:grid-cols-1' : 'flex flex-col gap-4'}>
                      {rest.map(ev => (
                        <EventCard 
                          key={ev.id} 
                          event={ev}
                          hideDetails={true}
                          hideVersion={true}
                          showStatus={true}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <RightWidgets events={events} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,169,110,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 0 8px rgba(200,169,110,0); transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-pulse{animation:pulse 1.5s ease-in-out infinite}
        .animate-pulse-gold{animation:pulseGold 1.5s ease-in-out infinite}
        .animate-spin{animation:spin 0.8s linear infinite}
        .animate-ping{animation:ping 1s cubic-bezier(0,0,0.2,1) infinite}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}