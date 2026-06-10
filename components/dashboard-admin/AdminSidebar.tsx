'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' } as React.CSSProperties;
const clipModal = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' } as React.CSSProperties;

// Icons
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

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M6 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
    <path d="M12 2C6.477 2 2 6.477 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L26 23H2L14 2Z" stroke="#E05C7A" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="#E05C7A" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="21" r="1.5" fill="#E05C7A"/>
  </svg>
);

interface AdminSidebarProps {
  activePage?: string;
}

interface AdminData {
  username: string;
  email: string;
  initials: string;
  role: string;
  avatar?: string | null;
  banner?: string | null;
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAdminData({
          username: data.username || data.name || 'Admin',
          email: data.email || 'admin@hoyohub.io',
          initials: data.initials || data.username?.slice(0, 2).toUpperCase() || 'AD',
          role: data.role || 'admin',
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAdminData({
        username: 'Admin',
        email: 'admin@hoyohub.io',
        initials: 'AD',
        role: 'admin',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load avatar and banner from localStorage
  const loadAvatar = () => {
    const savedAvatar = localStorage.getItem('adminAvatar');
    setAvatar(savedAvatar);
  };

  const loadBanner = () => {
    const savedBanner = localStorage.getItem('adminBanner');
    setBanner(savedBanner);
  };

  useEffect(() => {
    fetchAdminData();
    loadAvatar();
    loadBanner();
    
    // ✅ Dengarkan event ketika profile diupdate
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated, refreshing sidebar...');
      fetchAdminData();
      loadAvatar();
      loadBanner();
    };
    
    // ✅ Dengarkan event ketika avatar diupload
    const handleAvatarUpdate = () => {
      console.log('Avatar updated, refreshing sidebar avatar...');
      loadAvatar();
    };
    
    // ✅ Dengarkan event ketika banner diupload
    const handleBannerUpdate = () => {
      console.log('Banner updated, refreshing sidebar banner...');
      loadBanner();
    };
    
    window.addEventListener('adminProfileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('adminAvatarUpdated', handleAvatarUpdate as EventListener);
    window.addEventListener('adminBannerUpdated', handleBannerUpdate as EventListener);
    
    return () => {
      window.removeEventListener('adminProfileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('adminAvatarUpdated', handleAvatarUpdate as EventListener);
      window.removeEventListener('adminBannerUpdated', handleBannerUpdate as EventListener);
    };
  }, []);

  const isActive = (pageId: string) => {
    if (activePage) return activePage === pageId;
    return pathname?.includes(pageId);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setTimeout(() => {
        router.push('/Sign-in');
      }, 600);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      router.push('/Sign-in');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItemCls = (id: string) =>
    `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] 
     transition-all duration-200 cursor-pointer mb-[2px] relative font-['Rajdhani',sans-serif]
     ${isActive(id)
       ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
       : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;

  const NavGroup = ({ label }: { label: string }) => (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {label}
    </div>
  );

  const getDisplayName = (name: string) => {
    if (name.length > 15) {
      return name.slice(0, 12) + '...';
    }
    return name;
  };

  const getDisplayEmail = (email: string) => {
    if (email.length > 20) {
      return email.slice(0, 17) + '...';
    }
    return email;
  };

  return (
    <>
      <aside
        className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto"
      >
        {/* Header dengan Banner/Background */}
        <div className="relative">
          {/* Banner Background */}
          <div 
            className="h-[100px] w-full relative overflow-hidden"
            style={{ 
              background: banner 
                ? `url(${banner}) center/cover no-repeat` 
                : 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)'
            }}
          >
            {/* Stars effect (only when no banner) */}
            {!banner && Array.from({ length: 15 }).map((_, i) => (
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
            <Link href="/HoyoAdmin/dashboard-admin" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
                <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
                <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              </svg>
              HoyoAdmin
            </Link>
          </div>
          
          {/* ADMIN ACCESS badge */}
          <div className="absolute bottom-3 right-5 z-10">
            <div
              className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border"
              style={{ ...clipBadge, color: '#E05C7A', borderColor: 'rgba(224,92,122,0.4)', background: 'rgba(224,92,122,0.08)' }}
            >
              ● ADMIN
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5">
          <NavGroup label="Overview" />
          <Link href="/HoyoAdmin/dashboard-admin" className={navItemCls('dashboard')} style={clipHex}>
            {isActive('dashboard') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
            <span className="w-4 h-4 shrink-0"><GridIcon /></span>
            <span className="flex-1">Dashboard</span>
          </Link>

          <NavGroup label="Management" />
          <Link href="/HoyoAdmin/all-reports" className={navItemCls('all-reports')} style={clipHex}>
            {isActive('all-reports') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
            <span className="w-4 h-4 shrink-0"><HexIcon /></span>
            <span className="flex-1">All Reports</span>
          </Link>
          <Link href="/HoyoAdmin/grub-accept" className={navItemCls('grub-accept')} style={clipHex}>
            {isActive('grub-accept') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
            <span className="w-4 h-4 shrink-0"><CheckCircleIcon /></span>
            <span className="flex-1">Grub Accept</span>
          </Link>

          <NavGroup label="Account" />
          <Link href="/HoyoAdmin/profile" className={navItemCls('profile')} style={clipHex}>
            {isActive('profile') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
            <span className="w-4 h-4 shrink-0"><PersonIcon /></span>
            <span className="flex-1">Admin Profile</span>
          </Link>
        </nav>

        {/* Footer - User Info & Logout Button */}
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          {loading ? (
            <div className="flex items-center gap-[10px]">
              <div className="w-9 h-9 rounded-full bg-[rgba(200,169,110,0.1)] animate-pulse" />
              <div className="flex-1">
                <div className="h-3 bg-[rgba(200,169,110,0.1)] rounded animate-pulse w-20 mb-2" />
                <div className="h-2 bg-[rgba(200,169,110,0.1)] rounded animate-pulse w-24" />
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-[10px] w-full group cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(224,92,122,0)] via-[rgba(224,92,122,0.05)] to-[rgba(224,92,122,0)] transition-all duration-500 group-hover:from-[rgba(224,92,122,0.1)] group-hover:via-[rgba(224,92,122,0.15)] group-hover:to-[rgba(224,92,122,0.1)]" />
              
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full border border-[#E05C7A] bg-[rgba(224,92,122,0.1)] flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(224,92,122,0.3)]"
              >
                {avatar ? (
                  <img src={avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-['Cinzel',serif] text-[0.75rem] text-[#E05C7A] font-bold">
                    {adminData?.initials || 'AD'}
                  </span>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-left relative z-10 min-w-0">
                <div className="text-[0.85rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-300 truncate max-w-[140px]" title={adminData?.username}>
                  {getDisplayName(adminData?.username || 'Admin')}
                </div>
                <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] transition-all duration-300 group-hover:text-[#E05C7A] truncate max-w-[140px]" title={adminData?.email}>
                  {getDisplayEmail(adminData?.email || 'admin@hoyohub.io')}
                </div>
              </div>
              
              {/* Logout Icon */}
              <div className="text-[#5A5248] group-hover:text-[#E05C7A] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 transform relative z-10 shrink-0">
                <LogoutIcon />
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div 
            className="absolute inset-0 bg-[#050810] opacity-80 backdrop-blur-sm"
            onClick={handleCancelLogout}
          />
          
          <div 
            className="relative bg-[#0C1220] border border-[rgba(224,92,122,0.3)] w-[360px] max-w-[90%] overflow-hidden"
            style={{ ...clipModal, animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="bg-[rgba(224,92,122,0.05)] px-6 py-4 border-b border-[rgba(224,92,122,0.15)] flex items-center gap-3">
              <div className="animate-pulse-red">
                <WarningIcon />
              </div>
              <div>
                <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E05C7A]">Confirm Logout</div>
                <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] mt-0.5">
                  {adminData?.username || 'Admin'}, are you sure?
                </div>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <p className="text-[0.85rem] text-[#9A8F78] leading-relaxed">
                You will be redirected to the login page and will need to sign in again to access the admin dashboard.
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
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 rounded border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:bg-[rgba(200,169,110,0.08)] hover:text-[#C8A96E] font-['Rajdhani',sans-serif]"
                style={clipHex}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 rounded bg-[rgba(224,92,122,0.1)] border border-[#E05C7A] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Rajdhani',sans-serif]"
                style={clipHex}
              >
                {isLoggingOut ? (
                  <>
                    <SpinnerIcon />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogoutIcon />
                    Yes, Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseRed {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(224,92,122,0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(224,92,122,0);
            transform: scale(1.05);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        
        .animate-pulse-red {
          animation: pulseRed 1.5s ease-in-out infinite;
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}