'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';
import { MainQuestCard } from './MainQuestCard';
import { SideMissionRow } from './SideMissionRow';
import { RightPanel } from './RightPanel';
import { clipHex, clipBtn, clipCard, clipBadge } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

// ─── CLIP-PATH STYLE OBJECTS ─────────────────────────────────────────────────
const clipHexSidebar = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadgeSidebar = { clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' } as React.CSSProperties;

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type SideTypeFilter = 'all' | 'companion' | 'world' | 'exploration';

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

interface MainQuest {
  id: string;
  title: string;
  game: string;
  version: string;
  chapter: string;
  arc: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  status: string;
  tags: string[];
  summary: string;
}

interface SideMission {
  id: string;
  title: string;
  game: string;
  version: string;
  type: string;
  difficulty: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  tags: string[];
  reward: string;
  summary: string;
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
  </svg>
);

const HexIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const HexDotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1"/>
    <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="0.7" fill="currentColor"/>
  </svg>
);

// ─── NAV HELPERS ─────────────────────────────────────────────────────────────
function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span
      className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
        ${variant === 'new'
          ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]'
          : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={clipBadgeSidebar}
    >
      {children}
    </span>
  );
}

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  isNew?: boolean;
  active?: boolean;
}

function NavItem({ href, icon, label, badge, isNew, active }: NavItemProps) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : (href ? pathname === href : false);

  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold
    tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    font-['Rajdhani',sans-serif]
    ${isActive
      ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
      : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;

  const inner = (
    <>
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />
      )}
      <span className="w-4 h-4 shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge !== null && badge !== 0 && (
        <NavBadge>{badge}</NavBadge>
      )}
      {isNew && <NavBadge variant="new">New</NavBadge>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={clipHexSidebar}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} style={clipHexSidebar}>
      {inner}
    </div>
  );
}

export function MissionQuestClient() {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [sideTypeFilter, setSideTypeFilter] = useState<SideTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [mainQuests, setMainQuests] = useState<MainQuest[]>([]);
  const [sideMissions, setSideMissions] = useState<SideMission[]>([]);
  
  // Ref untuk debounce timeout
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Data untuk sidebar dari reportStats (realtime)
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    guide: 0,
    event: 0,
    puzzle: 0,
    build: 0,
  });
  
  // User data
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
  
  // Avatar photo state
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  // Banner photo state
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer (500ms delay)
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
    }, 500);
  };

  // Fetch user
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
        
        // Load avatar
        if (data.avatarPhoto) {
          setAvatarPhoto(data.avatarPhoto);
          localStorage.setItem('userAvatar', data.avatarPhoto);
        } else {
          const savedAvatar = localStorage.getItem('userAvatar');
          if (savedAvatar) setAvatarPhoto(savedAvatar);
        }
        
        // Load banner
        if (data.bannerPhoto) {
          setBannerPhoto(data.bannerPhoto);
          localStorage.setItem('userBanner', data.bannerPhoto);
        } else {
          const savedBanner = localStorage.getItem('userBanner');
          if (savedBanner) setBannerPhoto(savedBanner);
        }
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser({
            id: 'guest',
            username: 'Guest',
            email: 'guest@triablazer.com',
            rank: 'Novice Omni-Voyager',
            level: 1,
            xp: 0,
            initials: 'GT',
            totalReports: 0
          });
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
      const savedBanner = localStorage.getItem('userBanner');
      if (savedBanner) setBannerPhoto(savedBanner);
    }
  };

  // Fetch main quests dari API
  const fetchMainQuests = useCallback(async () => {
    try {
      let url = `/api/mission-quest/main-quests?page=1&limit=50`;
      if (gameFilter !== 'all') url += `&game=${gameFilter}`;
      if (debouncedSearchQuery) url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.quests) {
          setMainQuests(data.quests);
        }
      }
    } catch (error) {
      console.error('Error fetching main quests:', error);
    }
  }, [gameFilter, debouncedSearchQuery]);

  // Fetch side missions dari API
  const fetchSideMissions = useCallback(async () => {
    try {
      let url = `/api/mission-quest/side-missions?page=1&limit=50`;
      if (gameFilter !== 'all') url += `&game=${gameFilter}`;
      if (sideTypeFilter !== 'all') url += `&type=${sideTypeFilter}`;
      if (debouncedSearchQuery) url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.missions) {
          setSideMissions(data.missions);
        }
      }
    } catch (error) {
      console.error('Error fetching side missions:', error);
    }
  }, [gameFilter, sideTypeFilter, debouncedSearchQuery]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('Profile updated, refreshing sidebar user data...');
      fetchUser();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('adminProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Effect untuk fetch data ketika filter atau debounced search berubah
  useEffect(() => {
    // Subscribe ke global report stats untuk realtime update sidebar
    const unsubscribe = subscribeToReportStats((stats) => {
      console.log('📊 MissionQuestClient received stats:', stats);
      setTotalReports(stats.totalReports);
      setCategoryCounts(stats.categoryCounts);
    });
    
    fetchUser();
    fetchReportStats();
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMainQuests(),
        fetchSideMissions(),
      ]);
      setLoading(false);
    };
    
    loadData();
    
    const handleRefresh = () => {
      fetchReportStats();
      fetchUser();
      fetchMainQuests();
      fetchSideMissions();
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
  }, []); // Empty dependency array untuk initial load

  // Effect untuk refetch ketika filter berubah (tanpa loading awal)
  useEffect(() => {
    if (!loading) {
      setSearchLoading(true);
      Promise.all([
        fetchMainQuests(),
        fetchSideMissions(),
      ]).finally(() => {
        setSearchLoading(false);
      });
    }
  }, [gameFilter, sideTypeFilter, debouncedSearchQuery, fetchMainQuests, fetchSideMissions, loading]);

  const filteredMain = mainQuests;
  const filteredSide = sideMissions;

  // Format number untuk badge
  const formattedTotalReports = totalReports >= 1000 
    ? `${(totalReports / 1000).toFixed(1)}K` 
    : totalReports.toString();

  const formatCount = (count: number) => count.toString();

  // Hitung XP progress
  const currentLevelXP = user ? (user.level - 1) * 100 : 0;
  const nextLevelXP = user ? user.level * 100 : 100;
  const xpProgress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  const gamePillCls = (g: GameFilter) => {
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

  // Tampilkan loading hanya saat initial load
  if (loading) {
    return <LoadingAnimation message="LOADING QUESTS & MISSIONS..." />;
  }

  // Tampilkan loading indicator untuk search
  const showSearchLoading = searchLoading && (searchQuery !== debouncedSearchQuery || searchQuery !== '');

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)`,
      }} />

      {/* ── SIDEBAR DENGAN BANNER BACKGROUND ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        {/* Header dengan Banner Background */}
        <div className="relative">
          <div 
            className="h-[100px] w-full relative overflow-hidden"
            style={{ 
              background: bannerPhoto 
                ? `url(${bannerPhoto}) center/cover no-repeat` 
                : 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)'
            }}
          >
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1220] via-transparent to-transparent" />
          </div>
          
          <div className="absolute bottom-3 left-5 z-10">
            <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
                <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="8"    x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="17.5" x2="14" y2="20"   stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="8"  y1="14"   x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="17.5" y1="14" x2="20"   y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              </svg>
              Hoyoverse Hub
            </Link>
          </div>
          
          <div className="absolute bottom-3 right-5 z-10">
            <div
              className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
              style={{ ...clipBadgeSidebar, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.08)' }}
            >
              ● USER
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem 
            href="/UserHoyo/dashboard" 
            icon={<GridIcon />} 
            label="Dashboard" 
          />
          <NavItem 
            href="/UserHoyo/all-report" 
            icon={<HexIcon />} 
            label="All Reports" 
            badge={formattedTotalReports}
          />

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem 
            active={true}
            icon={<HexDotIcon />} 
            label="Mission &amp; Quest" 
            badge={formatCount(categoryCounts.guide)}
          />
          <NavItem 
            href="/UserHoyo/event" 
            icon={<CalendarIcon />} 
            label="Event Seasonal" 
            badge={formatCount(categoryCounts.event)}
            isNew={categoryCounts.event > 0}
          />
          <NavItem 
            href="/UserHoyo/puzzle" 
            icon={<DiamondIcon />} 
            label="Puzzle &amp; Riddles" 
            badge={formatCount(categoryCounts.puzzle)}
          />

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" icon={<UsersIcon />} label="Discussion" />
          <NavItem href="/UserHoyo/leaderboard" icon={<StarIcon />} label="Leaderboard" />
          <NavItem href="/UserHoyo/profile" icon={<PersonIcon />} label="My Profile" />
          <NavItem href="/UserHoyo/settings" icon={<InfoIcon />} label="Settings" />
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <Link href="/UserHoyo/profile" className="flex items-center gap-[10px] no-underline group">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0 overflow-hidden">
              {avatarPhoto ? (
                <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.initials || 'TB'
              )}
            </div>
            <div className="flex-1">
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors">
                {user?.username || 'Trailblazer'}
              </div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
                LV.{user?.level || 1} · {user?.totalReports || 0} reports
              </div>
              <div className="mt-1 h-[2px] bg-[rgba(200,169,110,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C8A96E] to-[#EDD28A] transition-all duration-300"
                  style={{ width: `${Math.min(Math.max(xpProgress, 0), 100)}%` }}
                />
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Mission &amp; Quest — {gameLabels[gameFilter]}
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Main quests, companion quests, side missions &amp; world quests</div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]" style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search quests & missions..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]"
              />
              {showSearchLoading && (
                <div className="w-4 h-4 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <Link href="/UserHoyo/create-report">
              <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
                style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                + Write Report
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">

          {/* Game Pills */}
          <div className="flex gap-2 mb-7 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setGameFilter(g)}>
                {gameLabels[g]}
              </span>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>

              {/* ── MAIN QUEST SECTION ── */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center border border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.06)]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="#C8A96E" strokeWidth="1.2"/>
                        <circle cx="8" cy="8" r="2" stroke="#C8A96E" strokeWidth="0.8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Main Quest</div>
                      <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase font-['Space_Mono',monospace]">
                        {filteredMain.length} guides · Trailblaze &amp; Archon Quests
                      </div>
                    </div>
                  </div>
                  <span className="text-[#C8A96E] text-[0.78rem] font-semibold tracking-[0.08em] cursor-pointer hover:text-[#F0D080] transition-colors duration-200">
                    View all →
                  </span>
                </div>

                <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.3)] to-transparent mb-5" />

                {filteredMain.length === 0 ? (
                  <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                    No main quests found for this filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredMain.map(q => <MainQuestCard key={q.id} quest={q} />)}
                  </div>
                )}
              </section>

              {/* ── SIDE MISSION SECTION ── */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center border border-[rgba(78,205,196,0.3)] bg-[rgba(78,205,196,0.06)]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="#4ECDC4" strokeWidth="1.2"/>
                        <line x1="8" y1="5" x2="11" y2="8" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="11" y1="8" x2="8" y2="11" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="8" y1="11" x2="5" y2="8" stroke="#4ECDC4" strokeWidth="0.8"/>
                        <line x1="5" y1="8" x2="8" y2="5" stroke="#4ECDC4" strokeWidth="0.8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Side Mission</div>
                      <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase font-['Space_Mono',monospace]">
                        {filteredSide.length} guides · World, Companion &amp; Exploration
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-[5px]">
                    {(['all', 'companion', 'world', 'exploration'] as const).map(f => (
                      <button
                        key={f}
                        style={clipBadge}
                        onClick={() => setSideTypeFilter(f)}
                        className={`px-[10px] py-[5px] text-[0.65rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                          ${sideTypeFilter === f
                            ? 'bg-[rgba(78,205,196,0.1)] border-[#4ECDC4] text-[#4ECDC4]'
                            : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(78,205,196,0.3)] hover:text-[#9A8F78]'}`}
                      >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[0.5px] bg-gradient-to-r from-[#4ECDC4] via-[rgba(78,205,196,0.3)] to-transparent mb-4" />

                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={clipCard}>
                  {filteredSide.length === 0 ? (
                    <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                      No side missions found for this filter.
                    </div>
                  ) : (
                    filteredSide.map(m => <SideMissionRow key={m.id} mission={m} />)
                  )}
                </div>
              </section>

            </div>

            {/* Right panel */}
            <RightPanel gameFilter={gameFilter} categoryCounts={categoryCounts} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space_Mono&display=swap');
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}