'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';
import { clipBadge, clipBtn, clipCard, clipWidget, clipHexSm, clipHex } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';
import { 
  GridIcon, HexIcon, HexDotIcon, CalendarIcon, 
  DiamondIcon, UsersIcon, StarIcon, PersonIcon, InfoIcon 
} from './Icons';
import { NavGroupLabel, NavBadge, NavItem } from './NavItem';
import { AvatarEditor } from './AvatarEditor';
import { ProfileBanner, bgOptions } from './ProfileBanner';
import { EditableText } from './EditableText';
import { FavoriteGameSelector } from './FavoriteGameSelector';
import { BgPicker } from './BgPicker';
import { GameBadge, gameBadgeMap } from './GameBadge';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  rank: string;
  level: number;
  xp: number;
  initials: string;
  totalReports: number;
  totalVotes: number;
  bio: string;
  location: string;
  avatarPhoto: string | null;
  bannerId: string;
  bannerPhoto: string | null;
  favGames: string[];
  gameStats?: Array<{ game: string; count: number; votes: number }>;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  tag: string;
  tagColor: string;
  votes: number;
  time: string;
}

// Game names and colors for display
const gameNames: Record<string, string> = {
  hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact',
  zzz: 'Zenless Zone Zero',
  hi3: 'Honkai Impact 3rd',
};

const gameColors: Record<string, string> = {
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

// Tema options (sama dengan di SettingsClient)
const themeOptions = [
  { 
    value: 'dark', 
    label: 'Dark Mode', 
    icon: '🌙', 
    bg: '#050810', 
    color: '#E8E0CC',
    cardBg: '#0C1220',
    cardBorder: 'rgba(200,169,110,0.15)',
    inputBg: 'rgba(200,169,110,0.06)',
    inputBorder: 'rgba(200,169,110,0.2)',
    textMuted: '#5A5248',
    textSecondary: '#9A8F78',
    gradient: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(123,79,166,0.12) 0%, transparent 60%)',
    stars: false,
    sidebarStars: false
  },
  { 
    value: 'starry', 
    label: 'Starry Night', 
    icon: '✨', 
    bg: '#0a0f2a', 
    color: '#E8E0CC',
    cardBg: '#0d1435',
    cardBorder: 'rgba(78,205,196,0.2)',
    inputBg: 'rgba(78,205,196,0.08)',
    inputBorder: 'rgba(78,205,196,0.25)',
    textMuted: '#6B6B8F',
    textSecondary: '#A0A0C0',
    gradient: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(78,205,196,0.1) 0%, transparent 60%)',
    stars: true,
    sidebarStars: true
  },
];

export default function ProfileClient() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [gameStats, setGameStats] = useState<Array<{ game: string; count: number; votes: number }>>([]);
  
  // State untuk tema
  const [theme, setTheme] = useState('dark');
  const [animations, setAnimations] = useState(true);
  
  // Data untuk sidebar dari reportStats (realtime)
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    guide: 0,
    event: 0,
    puzzle: 0,
    build: 0,
  });
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Edit form state
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState('default');
  const [editFavGames, setEditFavGames] = useState<GameKey[]>(['hsr', 'gi']);

  // Get current theme object
  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0];

  // Load theme dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    const savedAnimations = localStorage.getItem('userAnimations');
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'starry')) {
      setTheme(savedTheme);
    }
    if (savedAnimations !== null) {
      setAnimations(savedAnimations === 'true');
    }
  }, []);

  // Apply theme to document body
  useEffect(() => {
    const applyTheme = () => {
      const themeObj = themeOptions.find(t => t.value === theme) || themeOptions[0];
      
      document.body.style.backgroundColor = themeObj.bg;
      document.body.style.color = themeObj.color;
      
      // Dispatch event untuk komponen lain
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeObj } }));
    };
    
    applyTheme();
  }, [theme]);

  // Listen untuk perubahan tema dari Settings
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      if (event.detail?.theme?.value) {
        setTheme(event.detail.theme.value);
      }
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch user game stats dari API
  const fetchGameStats = async () => {
    try {
      const response = await fetch('/api/user/game-stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setGameStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  };

  // Fetch user activities dari API
  const fetchActivities = async () => {
    setActivityLoading(true);
    try {
      const response = await fetch('/api/user/recent-activity', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.activities) {
          setActivities(data.activities);
        }
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  // Load semua data dari localStorage
  const loadFromLocalStorage = () => {
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedBanner = localStorage.getItem('userBanner');
    const savedBio = localStorage.getItem('userBio');
    const savedLocation = localStorage.getItem('userLocation');
    const savedFavGames = localStorage.getItem('userFavGames');
    
    if (savedAvatar) setAvatarPhoto(savedAvatar);
    if (savedBanner) setBannerPhoto(savedBanner);
    if (savedBio) setEditBio(savedBio);
    if (savedLocation) setEditLocation(savedLocation);
    
    let favGamesArray: GameKey[] = ['hsr', 'gi'];
    if (savedFavGames) {
      try {
        favGamesArray = JSON.parse(savedFavGames);
      } catch {
        favGamesArray = ['hsr', 'gi'];
      }
    }
    setEditFavGames(favGamesArray);
    
    return { savedBio, savedLocation, savedFavGames };
  };

  // Fetch user profile dari API /api/auth/me
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me', { 
        credentials: 'include' 
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User data from /api/auth/me:', data);
        
        const { savedBio, savedLocation, savedFavGames } = loadFromLocalStorage();
        
        let favGamesArray: GameKey[] = ['hsr', 'gi'];
        if (savedFavGames) {
          try {
            favGamesArray = JSON.parse(savedFavGames);
          } catch {
            favGamesArray = ['hsr', 'gi'];
          }
        }
        
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role || 'user',
          rank: data.rank || 'Novice Omni-Voyager',
          level: data.level || 1,
          xp: data.xp || 0,
          initials: data.initials || data.username?.slice(0, 2).toUpperCase() || 'TB',
          totalReports: data.totalReports || 0,
          totalVotes: data.totalVotes || 0,
          bio: savedBio || data.bio || '',
          location: savedLocation || data.location || '',
          avatarPhoto: data.avatarPhoto || null,
          bannerId: data.bannerId || 'default',
          bannerPhoto: data.bannerPhoto || null,
          favGames: favGamesArray,
          gameStats: data.gameStats || [],
        });
        
        if (data.gameStats) {
          setGameStats(data.gameStats);
        }
        
        setEditUsername(data.username || '');
        setEditBio(savedBio || data.bio || '');
        setEditLocation(savedLocation || data.location || '');
        setEditFavGames(favGamesArray);
        
      } else {
        console.log('Not authenticated, redirecting to login...');
        window.location.href = '/Sign-in';
        return;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload - simpan ke localStorage dan kirim ke server
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'err');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB', 'err');
      return;
    }

    setUploadingAvatar(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      localStorage.setItem('userAvatar', base64String);
      setAvatarPhoto(base64String);
      
      // Kirim ke server
      try {
        await fetch('/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ avatarPhoto: base64String }),
        });
      } catch (error) {
        console.error('Error saving avatar to server:', error);
      }
      
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      showToast('Profile picture updated!', 'ok');
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle banner upload - simpan ke localStorage dan kirim ke server
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'err');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Banner size must be less than 5MB', 'err');
      return;
    }

    setUploadingBanner(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      localStorage.setItem('userBanner', base64String);
      setBannerPhoto(base64String);
      
      // Kirim ke server
      try {
        await fetch('/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ bannerPhoto: base64String, bannerId: 'custom' }),
        });
      } catch (error) {
        console.error('Error saving banner to server:', error);
      }
      
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      showToast('Banner updated!', 'ok');
      setUploadingBanner(false);
    };
    reader.readAsDataURL(file);
  };

  // Reset avatar
  const resetAvatar = async () => {
    localStorage.removeItem('userAvatar');
    setAvatarPhoto(null);
    
    try {
      await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatarPhoto: null }),
      });
    } catch (error) {
      console.error('Error resetting avatar:', error);
    }
    
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    showToast('Avatar reset to default', 'ok');
  };

  // Reset banner
  const resetBanner = async () => {
    localStorage.removeItem('userBanner');
    setBannerPhoto(null);
    setBannerId('default');
    
    try {
      await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bannerPhoto: null, bannerId: 'default' }),
      });
    } catch (error) {
      console.error('Error resetting banner:', error);
    }
    
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    showToast('Banner reset to default', 'ok');
  };

  // Save profile - simpan semua ke localStorage dan server
  const handleSaveProfile = async () => {
    setSaving(true);
    
    // Simpan ke localStorage
    localStorage.setItem('userBio', editBio);
    localStorage.setItem('userLocation', editLocation);
    localStorage.setItem('userFavGames', JSON.stringify(editFavGames));
    
    // Kirim ke server
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: editUsername,
          bio: editBio,
          location: editLocation,
          favGames: editFavGames,
        }),
      });
      
      if (response.ok) {
        // Update user state
        setUser(prev => prev ? {
          ...prev,
          username: editUsername,
          bio: editBio,
          location: editLocation,
          initials: editUsername.slice(0, 2).toUpperCase(),
          favGames: editFavGames,
        } : prev);
        
        showToast('Profile updated successfully!', 'ok');
        setIsEditing(false);
        
        // Dispatch event untuk update sidebar
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: { 
            username: editUsername,
            initials: editUsername.slice(0, 2).toUpperCase(),
          }
        }));
        window.dispatchEvent(new CustomEvent('refreshSidebarStats'));
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update profile', 'err');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save profile', 'err');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchActivities();
    fetchGameStats();
    
    const unsubscribe = subscribeToReportStats((stats) => {
      console.log('📊 Profile page received stats:', stats);
      setTotalReports(stats.totalReports);
      setCategoryCounts(stats.categoryCounts);
    });
    
    fetchReportStats();
    
    const handleRefresh = () => {
      fetchReportStats();
      fetchUserProfile();
      fetchActivities();
      fetchGameStats();
    };
    
    window.addEventListener('refreshSidebarStats', handleRefresh);
    window.addEventListener('reportCreated', handleRefresh);
    window.addEventListener('reportDeleted', handleRefresh);
    window.addEventListener('profileUpdated', handleRefresh);
    
    return () => {
      unsubscribe();
      window.removeEventListener('refreshSidebarStats', handleRefresh);
      window.removeEventListener('reportCreated', handleRefresh);
      window.removeEventListener('reportDeleted', handleRefresh);
      window.removeEventListener('profileUpdated', handleRefresh);
    };
  }, []);

  // Format number untuk badge
  const formattedTotalReports = totalReports >= 1000 
    ? `${(totalReports / 1000).toFixed(1)}K` 
    : totalReports.toString();

  const formatCount = (count: number) => count.toString();

  // Stats untuk display
  const stats = [
    { label: 'Reports', value: user?.totalReports?.toLocaleString() || '0', color: '#C8A96E' },
    { label: 'Votes', value: user?.totalVotes?.toLocaleString() || '0', color: '#4ECDC4' },
    { label: 'Rank', value: user?.rank?.slice(0, 3) || '#12', color: '#A855F7' },
    { label: 'Level', value: user?.level || 1, color: '#6DD18A' },
  ];

  // Hitung XP progress
  const currentLevelXP = user ? (user.level - 1) * 100 : 0;
  const nextLevelXP = user ? user.level * 100 : 100;
  const xpProgress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  const currentBg = bgOptions.find(b => b.id === bannerId) || bgOptions[0];
  const bannerStyle = bannerPhoto 
    ? { background: `url(${bannerPhoto}) center/cover no-repeat` }
    : currentBg.style;

  if (loading) {
    return <LoadingAnimation message="LOADING PROFILE..." />;
  }

  // Hitung total reports untuk game breakdown
  const totalGameReports = gameStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: currentTheme.bg, color: currentTheme.color, fontFamily: "'Rajdhani', sans-serif" }}>
      {!bannerPhoto && currentTheme.stars && animations && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {!bannerPhoto && !currentTheme.stars && (
        <>
          <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-700" style={currentBg.style} />
          <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'rgba(5,8,16,0.7)' }} />
        </>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          padding: '10px 20px', borderRadius: '8px',
          background: toast.type === 'ok' ? 'rgba(109,209,138,0.2)' : 'rgba(224,92,122,0.2)',
          border: `1px solid ${toast.type === 'ok' ? '#6DD18A' : '#E05C7A'}`,
          color: toast.type === 'ok' ? '#6DD18A' : '#E05C7A',
          fontFamily: "'Space Mono', monospace", fontSize: '0.75rem',
          animation: 'fadein 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
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
                <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              </svg>
              Hoyoverse Hub
            </Link>
          </div>
          
          <div className="absolute bottom-3 right-5 z-10">
            <div
              className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
              style={{ ...clipBadge, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.08)' }}
            >
              ● USER
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" icon={<GridIcon />} label="Dashboard" />
          <NavItem href="/UserHoyo/all-report" icon={<HexIcon />} label="All Reports" badge={formattedTotalReports} />

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" icon={<HexDotIcon />} label="Mission &amp; Quest" badge={formatCount(categoryCounts.guide)} />
          <NavItem href="/UserHoyo/event" icon={<CalendarIcon />} label="Event Seasonal" badge={formatCount(categoryCounts.event)} isNew={categoryCounts.event > 0} />
          <NavItem href="/UserHoyo/puzzle" icon={<DiamondIcon />} label="Puzzle &amp; Riddles" badge={formatCount(categoryCounts.puzzle)} />

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
                user?.initials?.slice(0, 2).toUpperCase() || 'TB'
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

      {/* MAIN CONTENT - sama seperti sebelumnya, tanpa perubahan */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">My Profile</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Manage your identity across the Hoyoverse Hub</div>
          </div>
        </div>

        {/* Content - 2 Kolom */}
        <div className="p-8 flex-1">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN - sama seperti sebelumnya */}
            <div>
              {/* ... konten left column sama seperti sebelumnya ... */}
              <div className="relative mb-6 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                {/* Banner */}
                <div 
                  className="h-[140px] w-full relative cursor-pointer group overflow-hidden"
                  style={bannerStyle}
                  onClick={() => bannerInputRef.current?.click()}
                >
                  {!bannerPhoto && Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-white"
                      style={{
                        width: i % 3 === 0 ? '2px' : '1px',
                        height: i % 3 === 0 ? '2px' : '1px',
                        top: `${10 + (i * 17) % 80}%`,
                        left: `${5 + (i * 23) % 90}%`,
                        opacity: 0.15 + (i % 5) * 0.1,
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-[0.7rem] text-[#C8A96E] bg-[rgba(5,8,16,0.8)] px-3 py-1 rounded-full">
                      {uploadingBanner ? 'Uploading...' : 'Change Banner'}
                    </div>
                  </div>
                  
                  {uploadingBanner && (
                    <div className="absolute inset-0 bg-[rgba(5,8,16,0.7)] flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248]">
                    {bannerPhoto ? 'Custom Banner' : (bgOptions.find(b => b.id === bannerId)?.label || 'Astral Night')}
                  </div>
                  
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                  />
                </div>
                
                <div className="px-8 pb-6">
                  <div className="flex flex-col items-center text-center -mt-10 mb-5 relative">
                    {/* Avatar */}
                    <div className="shrink-0 relative group mb-3">
                      <div
                        className="w-[80px] h-[80px] rounded-xl border-2 border-[#C8A96E] bg-[#0d1525] flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(200,169,110,0.4)]"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        {avatarPhoto ? (
                          <img src={avatarPhoto} alt="User Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <svg width="80" height="88" viewBox="0 0 80 88">
                            <polygon points="40,4 76,24 76,64 40,84 4,64 4,24" fill="#0d1525" stroke="#C8A96E" strokeWidth="1.5"/>
                            <text x="40" y="50" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif" fontSize="20" fontWeight="700" fill="#C8A96E">{user?.initials || 'TB'}</text>
                          </svg>
                        )}
                        {uploadingAvatar && (
                          <div className="absolute inset-0 bg-[rgba(5,8,16,0.8)] flex items-center justify-center rounded-xl">
                            <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C8A96E] border-2 border-[#0C1220] flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 2.5h8v6H2V2.5Z" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
                          <line x1="6" y1="4" x2="6" y2="8" stroke="#fff" strokeWidth="1"/>
                          <line x1="4" y1="6" x2="8" y2="6" stroke="#fff" strokeWidth="1"/>
                        </svg>
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </div>
                    
                    {/* Nama dan Email */}
                    <div className="text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="bg-[#0C1220] border border-[rgba(200,169,110,0.3)] rounded px-3 py-1 text-[#E8E0CC] font-['Cinzel',serif] text-[1.1rem] font-bold outline-none focus:border-[#C8A96E] w-full text-center"
                        />
                      ) : (
                        <h1 className="font-['Cinzel',serif] text-[1.3rem] font-bold text-[#E8E0CC] leading-tight break-words max-w-[280px] mx-auto">
                          {user?.username || 'Trailblazer'}
                        </h1>
                      )}
                      <div className="text-[0.75rem] text-[#9A8F78] font-['Space_Mono',monospace] mt-[2px] break-all max-w-[280px] mx-auto">
                        {user?.email}
                      </div>
                    </div>
                    
                    {/* Rank badge */}
                    <div className="absolute top-0 right-0">
                      <div className="text-[0.6rem] font-['Space_Mono',monospace] tracking-[0.15em] px-3 py-[4px] border" style={{ ...clipBadge, color: '#C8A96E', borderColor: 'rgba(200,169,110,0.5)', background: 'rgba(200,169,110,0.08)' }}>
                        {user?.rank || 'Novice Omni-Voyager'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="5" r="2.5" stroke="#5A5248" strokeWidth="1"/>
                      <path d="M6 2C4.3 2 3 3.3 3 5c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" stroke="#5A5248" strokeWidth="1"/>
                    </svg>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="bg-[#0C1220] border border-[rgba(200,169,110,0.3)] rounded px-2 py-1 text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] outline-none focus:border-[#C8A96E] w-48 text-center"
                      />
                    ) : (
                      <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">{user?.location || 'Unknown Location'}</span>
                    )}
                  </div>
                  
                  {/* Favorite Games */}
                  <div className="mb-4">
                    <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-2 text-center">Favorite Games</div>
                    <FavoriteGameSelector selected={editFavGames} onChange={setEditFavGames} isEditing={isEditing} />
                  </div>
                  
                  {/* Bio */}
                  <div className="mb-1">
                    <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-1 text-center">Bio</div>
                    {isEditing ? (
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={4}
                        className="w-full bg-[#0C1220] border border-[rgba(200,169,110,0.3)] rounded px-3 py-2 text-[0.82rem] text-[#9A8F78] font-['Rajdhani',sans-serif] outline-none focus:border-[#C8A96E] resize-none"
                        placeholder="Write something about yourself..."
                      />
                    ) : (
                      <p className="text-[0.82rem] text-[#9A8F78] leading-relaxed text-center">{user?.bio || 'No bio yet. Click edit to add one!'}</p>
                    )}
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="border-t border-[rgba(200,169,110,0.1)] grid grid-cols-4">
                  {stats.map((s, i) => (
                    <div key={i} className={`py-4 text-center ${i < 3 ? 'border-r border-[rgba(200,169,110,0.08)]' : ''}`}>
                      <div className="font-['Space_Mono',monospace] text-[1.1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Profile Buttons */}
              <div className="flex gap-3 mb-6 flex-wrap justify-center">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(109,209,138,0.1)] border border-[#6DD18A] text-[#6DD18A] hover:bg-[rgba(109,209,138,0.2)] transition-all disabled:opacity-50" style={clipBtn}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    <button onClick={() => { setIsEditing(false); setEditUsername(user?.username || ''); setEditBio(user?.bio || ''); setEditLocation(user?.location || ''); }} className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:bg-[rgba(200,169,110,0.15)] transition-all" style={clipBtn}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.2)] transition-all" style={clipBtn}>Edit Profile</button>
                )}
                <button onClick={resetAvatar} className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.08)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.15)] transition-all" style={clipBtn}>Reset Avatar</button>
                <button onClick={resetBanner} className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)] transition-all" style={clipBtn}>Reset Banner</button>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(200,169,110,0.1)]">
                  <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] flex items-center gap-2">
                    <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
                    Recent Activity
                  </div>
                  <Link href="/UserHoyo/all-report" className="text-[0.65rem] text-[#C8A96E] hover:text-[#EDD28A] font-['Space_Mono',monospace] transition-colors">
                    View all →
                  </Link>
                </div>
                <div>
                  {activityLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[0.7rem] text-[#5A5248]">Loading activities...</p>
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((act, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-[14px] border-b border-[rgba(200,169,110,0.06)] last:border-0 hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                        <div className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248] w-[60px] shrink-0">{act.id}</div>
                        <div className="flex-1">
                          <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{act.title}</div>
                          <div className="text-[0.7rem] text-[#5A5248] mt-[2px]">{act.type}</div>
                        </div>
                        <span className="text-[0.6rem] font-bold px-2 py-[3px] border uppercase shrink-0" style={{ ...clipBadge, color: act.tagColor, borderColor: `${act.tagColor}40`, background: `${act.tagColor}10` }}>
                          {act.tag}
                        </span>
                        <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] shrink-0 w-[60px] text-right">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-[0.8rem] text-[#5A5248] mb-2">No recent activity</div>
                      <p className="text-[0.65rem] text-[#5A5248]">Activities will appear here when you create reports.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Achievements */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
                  Achievements
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border transition-all relative overflow-hidden opacity-70" style={{ ...clipBtn, borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 flex items-center justify-center text-[#3A3530]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="6" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1"/></svg>
                      </div>
                      <span className="text-[0.55rem] font-bold uppercase tracking-[0.1em] text-[#3A3530]">STAR RAIL</span>
                    </div>
                    <div className="text-[0.72rem] font-semibold text-[#E8E0CC]">Trailblazer</div>
                    <div className="text-[0.62rem] text-[#5A5248] mt-[2px] leading-tight">Posted 10+ reports</div>
                  </div>
                  <div className="p-3 border transition-all relative overflow-hidden opacity-70" style={{ ...clipBtn, borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 flex items-center justify-center text-[#3A3530]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="6" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1"/></svg>
                      </div>
                      <span className="text-[0.55rem] font-bold uppercase tracking-[0.1em] text-[#3A3530]">GENSHIN</span>
                    </div>
                    <div className="text-[0.72rem] font-semibold text-[#E8E0CC]">Star Witness</div>
                    <div className="text-[0.62rem] text-[#5A5248] mt-[2px] leading-tight">Received 1000 total votes</div>
                  </div>
                </div>
              </div>

              {/* Game Breakdown */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
                  Game Breakdown
                </div>
                
                {gameStats.length > 0 && totalGameReports > 0 ? (
                  <div className="space-y-3">
                    {gameStats.map((stat) => {
                      const percentage = totalGameReports > 0 ? Math.round((stat.count / totalGameReports) * 100) : 0;
                      const gameName = gameNames[stat.game.toLowerCase()] || stat.game.toUpperCase();
                      const gameColor = gameColors[stat.game.toLowerCase()] || '#C8A96E';
                      
                      return (
                        <div key={stat.game}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: gameColor }} />
                              <span className="text-[0.7rem] text-[#9A8F78]">{gameName}</span>
                            </div>
                            <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#C8A96E]">{stat.count} reports</span>
                          </div>
                          <div className="h-1.5 bg-[rgba(200,169,110,0.1)] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: gameColor
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[0.7rem] text-[#5A5248]">No game stats yet</div>
                )}
              </div>

              {/* Share Profile */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 relative overflow-hidden" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse at 80% 20%, #C8A96E, transparent 60%)' }} />
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-2">Share Your Profile</div>
                <p className="text-[0.72rem] text-[#5A5248] leading-relaxed mb-4">Invite fellow Trailblazers to your guide collection.</p>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/UserHoyo/profile/${user?.id}`;
                    navigator.clipboard.writeText(url);
                    showToast('Profile link copied!', 'ok');
                  }}
                  className="w-full py-[8px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer hover:brightness-110 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipHexSm }}
                >
                  ⬡ Copy Profile Link
                </button>
              </div>

              {/* BgPicker - muncul hanya saat editing */}
              {isEditing && (
                <BgPicker 
                  current={bannerId} 
                  onChange={(id) => {
                    setBannerId(id);
                    if (id !== 'custom') {
                      setBannerPhoto(null);
                      localStorage.removeItem('userBanner');
                    }
                  }}
                  onPhotoUpload={handleBannerUpload}
                  onPhotoRemove={resetBanner}
                  photoUrl={bannerPhoto}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space_Mono&display=swap');
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}