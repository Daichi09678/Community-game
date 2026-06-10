'use client';

import { useState, useEffect } from 'react';
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
  BellIcon,
  EyeIcon,
  ShieldIcon,
  LinkIcon,
  LogoutIcon,
  HeadsetIcon,
} from './Icons';
import { SettingsRow } from './SettingsRow';
import { Toggle } from './Toggle';
import { HexSelect } from './HexSelect';
import { LinkedAccountRow } from './LinkedAccountRow';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LogoutModal } from './LogoutModal';
import { SupportModal } from './SupportModal';
import { clipBtn, clipBadge, clipCard, clipWidget, clipHex } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';

type SettingsTab = 'account' | 'display' | 'privacy' | 'linked' | 'support';

const settingsTabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'account', label: 'Account', icon: <PersonIcon /> },
  { id: 'display', label: 'Display', icon: <EyeIcon /> },
  { id: 'privacy', label: 'Privacy', icon: <ShieldIcon /> },
  { id: 'linked', label: 'Linked Accounts', icon: <LinkIcon /> },
  { id: 'support', label: 'Support', icon: <HeadsetIcon /> },
];

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

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
  avatarPhoto?: string | null;
  bannerPhoto?: string | null;
}

// Tema yang tersedia
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

// Komponen untuk efek bintang di main content
function StarsEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 200 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              opacity: opacity,
              animation: `starFloatHorizontal ${duration}s ease-in-out infinite, starTwinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
              animationDelay: `${delay}s, ${Math.random() * 5}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        @keyframes starFloatHorizontal {
          0% { transform: translate(0, 0); }
          25% { transform: translate(15px, -5px); }
          50% { transform: translate(-10px, 3px); }
          75% { transform: translate(8px, 4px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

// Komponen untuk efek bintang di sidebar
function SidebarStarsEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-tl-lg">
      {Array.from({ length: 80 }).map((_, i) => {
        const size = Math.random() * 2.5 + 0.5;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 8;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.4 + 0.05;
        
        return (
          <div
            key={`sidebar-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              opacity: opacity,
              animation: `sidebarStarFloatHorizontal ${duration}s ease-in-out infinite, sidebarStarTwinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${delay}s, ${Math.random() * 4}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes sidebarStarTwinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.5; }
        }
        @keyframes sidebarStarFloatHorizontal {
          0% { transform: translate(0, 0); }
          25% { transform: translate(8px, -3px); }
          50% { transform: translate(-6px, 2px); }
          75% { transform: translate(5px, 2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

// Modal konfirmasi logout seperti di admin sidebar
const LogoutConfirmModal = ({ open, onClose, onConfirm, username }: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  username: string;
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clipModal = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' } as React.CSSProperties;
  const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    await onConfirm();
    setIsLoggingOut(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="absolute inset-0 bg-[#050810] opacity-80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0C1220] border border-[rgba(224,92,122,0.3)] w-[360px] max-w-[90%] overflow-hidden" style={{ ...clipModal, animation: 'slideUp 0.3s ease-out' }}>
        <div className="bg-[rgba(224,92,122,0.05)] px-6 py-4 border-b border-[rgba(224,92,122,0.15)] flex items-center gap-3">
          <div className="animate-pulse-red">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 23H2L14 2Z" stroke="#E05C7A" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="14" y1="11" x2="14" y2="17" stroke="#E05C7A" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="21" r="1.5" fill="#E05C7A"/>
            </svg>
          </div>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E05C7A]">Confirm Logout</div>
            <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] mt-0.5">
              {username}, are you sure?
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <p className="text-[0.85rem] text-[#9A8F78] leading-relaxed">
            You will be redirected to the login page and will need to sign in again to access your account.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-[rgba(224,92,122,0.05)] border border-[rgba(224,92,122,0.1)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E05C7A] animate-ping" />
              <span className="text-[0.7rem] text-[#E05C7A] font-['Space_Mono',monospace]">Session will be terminated</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-[rgba(200,169,110,0.1)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 rounded border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:bg-[rgba(200,169,110,0.08)] hover:text-[#C8A96E] font-['Rajdhani',sans-serif]"
            style={clipHex}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 rounded bg-[rgba(224,92,122,0.1)] border border-[#E05C7A] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Rajdhani',sans-serif]"
            style={clipHex}
          >
            {isLoggingOut ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logging out...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M6 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Yes, Logout
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(224,92,122,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 0 8px rgba(224,92,122,0); transform: scale(1.05); }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-pulse-red { animation: pulseRed 1.5s ease-in-out infinite; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export function SettingsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // User data from backend
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);
  
  // Password last changed
  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);
  const [loadingPasswordInfo, setLoadingPasswordInfo] = useState(true);
  
  // Sidebar stats
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    guide: 0,
    event: 0,
    puzzle: 0,
    build: 0,
  });
  
  // Account settings
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  
  // Display settings
  const [theme, setTheme] = useState('dark');
  const [density, setDensity] = useState('normal');
  const [animations, setAnimations] = useState(true);
  
  // Privacy settings (local storage)
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showVotes, setShowVotes] = useState(true);
  const [spoilerDefault, setSpoilerDefault] = useState(false);

  // Get current theme object
  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'starry')) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('userTheme', theme);
    applyThemeToDocument();
  }, [theme]);

  // Apply theme to document body
  const applyThemeToDocument = () => {
    const themeObj = themeOptions.find(t => t.value === theme) || themeOptions[0];
    
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', themeObj.bg);
    root.style.setProperty('--theme-color', themeObj.color);
    root.style.setProperty('--theme-card-bg', themeObj.cardBg);
    root.style.setProperty('--theme-card-border', themeObj.cardBorder);
    root.style.setProperty('--theme-input-bg', themeObj.inputBg);
    root.style.setProperty('--theme-input-border', themeObj.inputBorder);
    root.style.setProperty('--theme-text-muted', themeObj.textMuted);
    root.style.setProperty('--theme-text-secondary', themeObj.textSecondary);
    
    document.body.style.backgroundColor = themeObj.bg;
    document.body.style.color = themeObj.color;
    
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeObj } }));
  };

  // Apply theme on mount
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  // Format last changed time
  const formatLastChanged = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch password last changed
  const fetchPasswordLastChanged = async () => {
    setLoadingPasswordInfo(true);
    try {
      const response = await fetch('/api/user/password-last-changed', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.lastChanged) {
          const formatted = formatLastChanged(data.lastChanged);
          setPasswordLastChanged(formatted);
        } else {
          setPasswordLastChanged('Never');
        }
      } else {
        setPasswordLastChanged('Never');
      }
    } catch (error) {
      console.error('Error fetching password last changed:', error);
      setPasswordLastChanged('Never');
    } finally {
      setLoadingPasswordInfo(false);
    }
  };

  // Fetch user data from backend
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        const userData: UserData = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role || 'user',
          rank: data.rank || 'Novice Omni-Voyager',
          level: data.level || 1,
          xp: data.xp || 0,
          initials: data.initials || data.username?.slice(0, 2).toUpperCase() || 'TB',
          totalReports: data.totalReports || 0,
          avatarPhoto: data.avatarPhoto || null,
          bannerPhoto: data.bannerPhoto || null,
        };
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);
        
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
        
        loadSettingsFromLocalStorage();
      } else {
        router.push('/Sign-in');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load settings from localStorage
  const loadSettingsFromLocalStorage = () => {
    const savedDensity = localStorage.getItem('userDensity');
    const savedAnimations = localStorage.getItem('userAnimations');
    const savedProfilePublic = localStorage.getItem('profilePublic');
    const savedShowActivity = localStorage.getItem('showActivity');
    const savedShowVotes = localStorage.getItem('showVotes');
    const savedSpoilerDefault = localStorage.getItem('spoilerDefault');
    
    if (savedDensity) setDensity(savedDensity);
    if (savedAnimations) setAnimations(savedAnimations === 'true');
    if (savedProfilePublic) setProfilePublic(savedProfilePublic === 'true');
    if (savedShowActivity) setShowActivity(savedShowActivity === 'true');
    if (savedShowVotes) setShowVotes(savedShowVotes === 'true');
    if (savedSpoilerDefault) setSpoilerDefault(savedSpoilerDefault === 'true');
  };

  // Save settings (theme sudah otomatis, density dan lainnya)
  const handleDensityChange = (value: string) => {
    setDensity(value);
    localStorage.setItem('userDensity', value);
  };

  const handleAnimationsChange = (value: boolean) => {
    setAnimations(value);
    localStorage.setItem('userAnimations', String(value));
  };

  const handleProfilePublicChange = (value: boolean) => {
    setProfilePublic(value);
    localStorage.setItem('profilePublic', String(value));
  };

  const handleShowActivityChange = (value: boolean) => {
    setShowActivity(value);
    localStorage.setItem('showActivity', String(value));
  };

  const handleShowVotesChange = (value: boolean) => {
    setShowVotes(value);
    localStorage.setItem('showVotes', String(value));
  };

  const handleSpoilerDefaultChange = (value: boolean) => {
    setSpoilerDefault(value);
    localStorage.setItem('spoilerDefault', String(value));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.clear();
      router.push('/Sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/Sign-in');
    }
  };

  // Update username
  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });
      
      if (response.ok) {
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: { username, initials: username.slice(0, 2).toUpperCase() }
        }));
      }
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  // Listen for profile updates and password changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUser();
      fetchPasswordLastChanged();
    };
    
    const handlePasswordChanged = () => {
      fetchPasswordLastChanged();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('adminProfileUpdated', handleProfileUpdate);
    window.addEventListener('passwordChanged', handlePasswordChanged);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
      window.removeEventListener('passwordChanged', handlePasswordChanged);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToReportStats((stats) => {
      setTotalReports(stats.totalReports);
      setCategoryCounts(stats.categoryCounts);
    });
    
    fetchUser();
    fetchPasswordLastChanged();
    fetchReportStats();
    
    const handleRefresh = () => {
      fetchReportStats();
      fetchUser();
      fetchPasswordLastChanged();
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

  // Format number untuk badge
  const formattedTotalReports = totalReports >= 1000 
    ? `${(totalReports / 1000).toFixed(1)}K` 
    : totalReports.toString();

  const formatCount = (count: number) => count.toString();

  // Hitung XP progress
  const currentLevelXP = user ? (user.level - 1) * 100 : 0;
  const nextLevelXP = user ? user.level * 100 : 100;
  const xpProgress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  // Inline styles untuk komponen yang mengikuti tema
  const cardStyle = {
    background: currentTheme.cardBg,
    border: `1px solid ${currentTheme.cardBorder}`,
  };

  const inputStyle = {
    background: currentTheme.inputBg,
    border: `1px solid ${currentTheme.inputBorder}`,
    color: currentTheme.color,
  };

  if (loading) {
    return <LoadingAnimation message="LOADING SETTINGS..." />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ 
      background: currentTheme.bg, 
      color: currentTheme.color, 
      fontFamily: "'Rajdhani', sans-serif" 
    }}>
      {/* Stars effect for starry theme */}
      {currentTheme.stars && animations && <StarsEffect />}
      
      {/* Background gradient for non-starry themes */}
      {!currentTheme.stars && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: currentTheme.gradient }} />
      )}

      {/* SIDEBAR */}
      <aside 
        className="w-[260px] shrink-0 flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden transition-all duration-300"
        style={{ 
          background: currentTheme.cardBg,
          borderRight: `1px solid ${currentTheme.cardBorder}`
        }}
      >
        {/* Sidebar Stars Effect */}
        {currentTheme.sidebarStars && animations && <SidebarStarsEffect />}
        
        <div className="relative z-10">
          <div 
            className="h-[100px] w-full relative overflow-hidden"
            style={{ 
              background: bannerPhoto 
                ? `url(${bannerPhoto}) center/cover no-repeat` 
                : currentTheme.value === 'starry'
                  ? 'linear-gradient(135deg, #0d1435 0%, #1a0a3e 40%, #0a1a30 100%)'
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
          
          <div className="absolute bottom-3 left-5 z-20">
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
          
          <div className="absolute bottom-3 right-5 z-20">
            <div
              className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
              style={{ ...clipBadge, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.08)' }}
            >
              ● USER
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 relative z-10">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports <NavBadge>{formattedTotalReports}</NavBadge></NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest <NavBadge>{formatCount(categoryCounts.guide)}</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal {categoryCounts.event > 0 && <NavBadge variant="new">New</NavBadge>}</NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles <NavBadge>{formatCount(categoryCounts.puzzle)}</NavBadge></NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem active={true}><InfoIcon /> Settings</NavItem>
        </nav>

        <div className="px-5 py-5 border-t relative z-10" style={{ borderColor: currentTheme.cardBorder }}>
          <Link href="/UserHoyo/profile" className="flex items-center gap-[10px] no-underline group">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] font-bold text-[#C8A96E] shrink-0 overflow-hidden" style={{ background: '#C8A96E15' }}>
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

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar - tanpa Save Changes */}
        <div className="flex items-center justify-between px-8 py-4 border-b sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: `${currentTheme.bg}D9`, borderColor: currentTheme.cardBorder }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold" style={{ color: currentTheme.color }}>Settings</div>
            <div className="text-[0.75rem] mt-[2px]" style={{ color: currentTheme.textMuted }}>Manage your account, preferences & security</div>
          </div>
          {/* Tombol Save Changes dihapus */}
        </div>

        {/* Content - Settings dengan layout flex */}
        <div className="p-8 flex-1">
          <div className="flex gap-6 max-[900px]:flex-col">
            {/* SETTINGS NAV - KIRI */}
            <div className="w-[220px] shrink-0 space-y-1">
              <div className="p-3" style={{ ...cardStyle, ...clipWidget }}>
                <div className="text-[0.6rem] font-bold tracking-[0.18em] uppercase px-2 mb-3 font-['Space_Mono',monospace]" style={{ color: currentTheme.textMuted }}>Preferences</div>
                {settingsTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold tracking-[0.03em] transition-all duration-200 cursor-pointer mb-[2px] relative border-none bg-transparent font-['Rajdhani',sans-serif] text-left
                      ${activeTab === tab.id ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'hover:bg-[rgba(200,169,110,0.06)]'}`}
                    style={{ ...clipHex, color: activeTab === tab.id ? '#C8A96E' : currentTheme.textSecondary }}>
                    {activeTab === tab.id && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
                    <span className="shrink-0 w-4">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
                <div className="h-[0.5px] my-3" style={{ background: currentTheme.cardBorder }} />
                <button onClick={() => setShowSupport(true)} className="w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold transition-all duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif] text-left hover:bg-[rgba(78,205,196,0.06)] hover:text-[#4ECDC4]" style={{ ...clipHex, color: currentTheme.textSecondary }}>
                  <span className="shrink-0 w-4"><HeadsetIcon /></span>
                  <span>Customer Service</span>
                </button>
              </div>
            </div>

            {/* SETTINGS PANEL - KANAN */}
            <div className="flex-1 space-y-5">
              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div className="p-5" style={{ ...cardStyle, ...clipCard }}>
                  <WidgetTitle>Account Settings</WidgetTitle>
                  <SettingsRow label="Username" desc="Your public display name across the Hub">
                    <input 
                      value={username} 
                      onChange={e => setUsername(e.target.value)}
                      onBlur={handleUsernameUpdate}
                      className="text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-44 focus:border-[rgba(200,169,110,0.5)] transition-all" 
                      style={{ ...inputStyle, ...clipBadge }}
                    />
                  </SettingsRow>
                  <SettingsRow label="Email Address" desc="Used for login and support contact">
                    <input 
                      value={email} 
                      disabled 
                      className="text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-52 cursor-not-allowed" 
                      style={{ ...inputStyle, opacity: 0.6, ...clipBadge }}
                    />
                  </SettingsRow>
                  <SettingsRow 
                    label="Change Password" 
                    desc={loadingPasswordInfo ? 'Loading...' : `Last changed ${passwordLastChanged || 'Never'}`}
                  >
                    <button 
                      onClick={() => setShowChangePassword(true)} 
                      className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" 
                      style={clipBadge}
                    >
                      Change →
                    </button>
                  </SettingsRow>
                  <SettingsRow label="Two-Factor Auth" desc="Add an extra layer of security to your account">
                    <div className="flex items-center gap-2">
                      <span className={`text-[0.65rem] font-['Space_Mono',monospace] ${twoFactor ? 'text-[#6DD18A]' : 'text-[#5A5248]'}`}>{twoFactor ? 'Enabled' : 'Disabled'}</span>
                      <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} color="#6DD18A" />
                    </div>
                  </SettingsRow>
                  <SettingsRow label="Account Level" desc="Progress toward next level">
                    <div className="text-right">
                      <div className="text-[#C8A96E] font-['Space_Mono',monospace] text-[0.78rem] font-bold">LV.{user?.level || 1}</div>
                      <div className="w-28 h-[3px] bg-[rgba(255,255,255,0.05)] mt-1 overflow-hidden" style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}>
                        <div className="h-full" style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #8B6A2E, #C8A96E)' }} />
                      </div>
                      <div className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[3px]">{user?.xp || 0} / {nextLevelXP} XP</div>
                    </div>
                  </SettingsRow>
                </div>
              )}

              {/* DISPLAY */}
              {activeTab === 'display' && (
                <div className="p-5" style={{ ...cardStyle, ...clipCard }}>
                  <WidgetTitle>Display Settings</WidgetTitle>
                  
                  {/* Theme Selector - auto save */}
                  <SettingsRow label="Theme" desc="Choose your Hub color scheme">
                    <div className="flex gap-2">
                      {themeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`flex items-center gap-2 px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                            ${theme === option.value
                              ? 'bg-[rgba(200,169,110,0.15)] border-[#C8A96E] text-[#C8A96E]'
                              : 'bg-transparent border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:border-[rgba(200,169,110,0.4)] hover:text-[#E8E0CC]'}`}
                          style={clipBadge}
                        >
                          <span>{option.icon}</span>
                          <span className="hidden sm:inline">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </SettingsRow>
                  
                  {/* Layout Density */}
                  <SettingsRow label="Layout Density" desc="Adjust information density across pages">
                    <HexSelect value={density} onChange={handleDensityChange} options={[
                      { value: 'compact', label: 'Compact' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'roomy', label: 'Roomy' }
                    ]} />
                  </SettingsRow>
                  
                  {/* Animations Toggle */}
                  <SettingsRow label="Animations" desc="Enable motion effects and transitions">
                    <div className="flex items-center gap-2">
                      <span className={`text-[0.65rem] font-['Space_Mono',monospace] ${animations ? 'text-[#6DD18A]' : 'text-[#5A5248]'}`}>
                        {animations ? 'Enabled' : 'Disabled'}
                      </span>
                      <Toggle checked={animations} onChange={() => handleAnimationsChange(!animations)} color="#6DD18A" />
                    </div>
                  </SettingsRow>
                  
                  {/* Stars Animation Indicator */}
                  {animations && theme === 'starry' && (
                    <div className="mt-2 p-2 bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.2)] rounded text-[0.65rem] text-[#4ECDC4] font-['Space_Mono',monospace]">
                      ✨ Stars are floating gently left and right
                    </div>
                  )}
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="p-5" style={{ ...cardStyle, ...clipCard }}>
                  <WidgetTitle>Privacy Settings</WidgetTitle>
                  <SettingsRow label="Public Profile" desc="Allow others to view your profile and reports">
                    <Toggle checked={profilePublic} onChange={() => handleProfilePublicChange(!profilePublic)} color="#6DD18A" />
                  </SettingsRow>
                  <SettingsRow label="Show Activity Heatmap" desc="Display your contribution calendar on your profile">
                    <Toggle checked={showActivity} onChange={() => handleShowActivityChange(!showActivity)} />
                  </SettingsRow>
                  <SettingsRow label="Show Vote Count" desc="Let others see how many votes your reports received">
                    <Toggle checked={showVotes} onChange={() => handleShowVotesChange(!showVotes)} />
                  </SettingsRow>
                  <SettingsRow label="Spoiler Mode Default" desc="Auto-collapse spoiler content when browsing reports">
                    <Toggle checked={spoilerDefault} onChange={() => handleSpoilerDefaultChange(!spoilerDefault)} color="#A855F7" />
                  </SettingsRow>
                  <div className="h-[0.5px] my-4" style={{ background: currentTheme.cardBorder }} />
                  <SettingsRow label="Download My Data" desc="Export all your reports and account data as a ZIP file">
                    <button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>Export →</button>
                  </SettingsRow>
                </div>
              )}

              {/* LINKED ACCOUNTS */}
              {activeTab === 'linked' && (
                <div className="p-5" style={{ ...cardStyle, ...clipCard }}>
                  <WidgetTitle>Linked Game Accounts</WidgetTitle>
                  <p className="text-[0.72rem] mb-5 leading-relaxed" style={{ color: currentTheme.textMuted }}>Link your Hoyoverse UIDs to display stats and verify ownership of game-specific reports.</p>
                  <LinkedAccountRow game="hsr" uid="" linked={false} color="#4ECDC4" />
                  <LinkedAccountRow game="gi" uid="" linked={false} color="#6DD18A" />
                  <LinkedAccountRow game="zzz" linked={false} color="#A855F7" />
                  <LinkedAccountRow game="hi3" linked={false} color="#E05C7A" />
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === 'support' && (
                <div className="space-y-4">
                  <div className="p-5" style={{ ...cardStyle, ...clipCard }}>
                    <WidgetTitle>Support Center</WidgetTitle>
                    <p className="text-[0.72rem] mb-5 leading-relaxed" style={{ color: currentTheme.textMuted }}>Need help? Our team is here. Avg response time under 2 hours.</p>
                    <div className="grid grid-cols-2 gap-3 mb-5 max-sm:grid-cols-1">
                      <button onClick={() => setShowSupport(true)} className="flex items-center gap-3 p-4 border hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 cursor-pointer text-left bg-transparent" style={{ ...cardStyle, ...clipWidget }}>
                        <span className="text-[1.3rem]">📨</span>
                        <div><div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold" style={{ color: currentTheme.color }}>Submit Ticket</div><div className="text-[0.62rem] font-['Space_Mono',monospace] mt-[2px]" style={{ color: currentTheme.textMuted }}>Bug, account or content issue</div></div>
                      </button>
                      <button onClick={() => setShowSupport(true)} className="flex items-center gap-3 p-4 border hover:border-[rgba(78,205,196,0.35)] transition-all duration-200 cursor-pointer text-left bg-transparent" style={{ ...cardStyle, ...clipWidget }}>
                        <span className="text-[1.3rem]">⬡</span>
                        <div><div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold" style={{ color: currentTheme.color }}>FAQ</div><div className="text-[0.62rem] font-['Space_Mono',monospace] mt-[2px]" style={{ color: currentTheme.textMuted }}>Browse common questions</div></div>
                      </button>
                    </div>
                  </div>
                  <div className="p-5" style={{ ...cardStyle, ...clipWidget }}>
                    <WidgetTitle>About Hoyoverse Hub</WidgetTitle>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {[{ label: 'Version', value: 'v3.2.1' }, { label: 'Build', value: '2025.05' }, { label: 'Reports', value: totalReports.toLocaleString() }, { label: 'Members', value: '8,400+' }].map((s, i) => (
                        <div key={i} className="p-3 bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.07)]" style={clipBadge}>
                          <div className="font-['Space_Mono',monospace] text-[0.85rem] font-bold text-[#C8A96E]">{s.value}</div>
                          <div className="text-[0.58rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[0.62rem] font-['Space_Mono',monospace] leading-relaxed mt-4" style={{ color: currentTheme.textMuted }}>Hoyoverse Hub is a fan community platform and is not affiliated with miHoYo / Hoyoverse Co., Ltd.</p>
                  </div>
                </div>
              )}

              {/* DANGER ZONE - Sign Out only */}
              <div className="border p-4" style={{ background: currentTheme.cardBg, borderColor: 'rgba(224,92,122,0.1)', ...clipWidget }}>
                <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#E05C7A] mb-3 font-['Space_Mono',monospace]">Danger Zone</div>
                <button 
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full py-[8px] text-[0.72rem] font-bold font-['Rajdhani',sans-serif] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.08)] transition-all duration-200 cursor-pointer bg-transparent tracking-[0.08em] flex items-center justify-center gap-2"
                  style={clipBtn}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M6 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Sign Out
                </button>
              </div>

              {/* Bottom quick-access button */}
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setShowSupport(true)} className="flex items-center justify-center gap-2 py-3 border border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.06)] hover:border-[rgba(78,205,196,0.4)] transition-all duration-200 bg-transparent cursor-pointer text-[0.78rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.08em] uppercase" style={clipBtn}>
                  <HeadsetIcon /> Customer Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <LogoutConfirmModal 
        open={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout}
        username={user?.username || 'User'}
      />
      <SupportModal open={showSupport} onClose={() => setShowSupport(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>
    </div>
  );
}