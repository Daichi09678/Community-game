'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';

// ─── CLIP-PATH STYLE OBJECTS ─────────────────────────────────────────────────
const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' } as React.CSSProperties;

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
      style={clipBadge}
    >
      {children}
    </span>
  );
}

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isNew?: boolean;
}

function NavItem({ href, icon, label, badge, isNew }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

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
      {badge && <NavBadge>{badge}</NavBadge>}
      {isNew && <NavBadge variant="new">New</NavBadge>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={clipHex}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} style={clipHex}>
      {inner}
    </div>
  );
}

// ─── SIDEBAR ALL REPORT ─────────────────────────────────────────────────────
export function SidebarAllReport() {
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
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    guide: 0,
    event: 0,
    puzzle: 0,
    build: 0,
  });
  const [loading, setLoading] = useState(true);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);

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
          window.location.href = '/Sign-in';
          return;
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
      } else {
        window.location.href = '/Sign-in';
      }
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    // Subscribe ke global report stats
    const unsubscribe = subscribeToReportStats((stats) => {
      console.log('📊 SidebarAllReport received stats:', stats);
      setTotalReports(stats.totalReports);
      setCategoryCounts(stats.categoryCounts);
    });
    
    fetchUser();
    fetchReportStats();
    
    const handleRefresh = () => {
      fetchReportStats();
      fetchUser();
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
  }, []);

  // Format number
  const formattedTotal = totalReports >= 1000 
    ? `${(totalReports / 1000).toFixed(1)}K` 
    : totalReports.toString();

  const formatCount = (count: number) => count.toString();

  // Hitung XP progress
  const currentLevelXP = user ? (user.level - 1) * 100 : 0;
  const nextLevelXP = user ? user.level * 100 : 100;
  const xpProgress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  if (loading) {
    return (
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E]">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </div>
        </div>
        <div className="flex-1 px-4 py-5">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
      {/* Header dengan Banner Background seperti Admin Sidebar */}
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
          {/* Stars effect (only when no custom banner) */}
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
        
        {/* Logo - positioned inside banner area */}
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
        
        {/* USER ACCESS badge */}
        <div className="absolute bottom-3 right-5 z-10">
          <div
            className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
            style={{ ...clipBadge, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.08)' }}
          >
            ● USER
          </div>
        </div>
      </div>

      {/* Navigation */}
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
          badge={formattedTotal || "0"} 
        />

        <NavGroupLabel>Category</NavGroupLabel>
        <NavItem 
          href="/UserHoyo/mission&quest" 
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

      {/* User Footer - Akan update otomatis saat profile berubah */}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space_Mono&display=swap');
      `}</style>
    </aside>
  );
}