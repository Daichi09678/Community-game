'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { ToastContainer, showToast } from './Toast';

const clipCard = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;

interface UserProfileDetailClientProps {
  userId: string;
}

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  rank: string;
  level: number;
  xp: number;
  totalReports: number;
  joinedAt: string;
  lastActive: string;
  memberSince: string;
  initials: string;
  isVerified: boolean;
  role: string;
  isBanned?: boolean;
  banReason?: string | null;
  banExpiry?: string | null;
}

const interests = [
  { label: 'Star Rail', color: '#4ECDC4' },
  { label: 'Genshin', color: '#6DD18A' },
  { label: 'Theory', color: '#C8A96E' },
  { label: 'Lore', color: '#A855F7' },
  { label: 'Builds', color: '#E05C7A' },
];

const heatColors = [
  'rgba(78,205,196,0.07)',
  'rgba(78,205,196,0.2)',
  'rgba(78,205,196,0.4)',
  'rgba(78,205,196,0.65)',
  '#4ECDC4',
];

export default function UserProfileDetailClient({ userId }: UserProfileDetailClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [heatmap, setHeatmap] = useState<number[]>(Array(84).fill(0));
  
  // Modal states
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [banDuration, setBanDuration] = useState<'permanent' | '7days' | '30days' | '1day'>('permanent');
  const [warningError, setWarningError] = useState('');
  const [banError, setBanError] = useState('');
  const [modalClosing, setModalClosing] = useState(false);

  // Generate random heatmap data
  useEffect(() => {
    const generateHeatmap = (): number[] =>
      Array.from({ length: 12 * 7 }, () => {
        const r = Math.random();
        if (r < 0.4) return 0;
        if (r < 0.6) return 1;
        if (r < 0.78) return 2;
        if (r < 0.92) return 3;
        return 4;
      });
    setHeatmap(generateHeatmap());
  }, []);

  // Fetch user profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching profile for user:', userId);
      
      const response = await fetch(`/api/profile/${userId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Profile data received:', data.user);
        
        if (data.success && data.user) {
          setProfile({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            rank: data.user.rank || 'Novice Omni-Voyager',
            level: data.user.level || 1,
            xp: data.user.xp || 0,
            totalReports: data.user.totalReports || 0,
            joinedAt: data.user.createdAt || new Date().toISOString(),
            lastActive: data.user.lastLogin || new Date().toISOString(),
            memberSince: data.user.memberSince || 'Just joined',
            initials: data.user.initials || data.user.username?.slice(0, 2).toUpperCase() || 'U',
            isVerified: data.user.isVerified || true,
            role: data.user.role || 'user',
            isBanned: data.user.isBanned || false,
            banReason: data.user.banReason || null,
            banExpiry: data.user.banExpiry || null,
          });
        }
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  // Cek following status dari localStorage
  useEffect(() => {
    if (profile?.id) {
      const followingList = JSON.parse(localStorage.getItem('followingList') || '[]');
      setFollowing(followingList.includes(profile.id));
    }
  }, [profile?.id]);

  // Close modal with animation
  const closeWarningModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowWarningModal(false);
      setModalClosing(false);
      setWarningMessage('');
      setWarningError('');
    }, 300);
  };

  const closeBanModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowBanModal(false);
      setModalClosing(false);
      setBanReason('');
      setBanError('');
      setBanDuration('permanent');
    }, 300);
  };

  // Follow user
  const handleFollow = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    showToast(
      newFollowingState ? `Now following ${profile?.username}` : `Unfollowed ${profile?.username}`,
      'success'
    );
    
    // Simpan ke localStorage agar persist antar halaman
    const followingList = JSON.parse(localStorage.getItem('followingList') || '[]');
    if (newFollowingState) {
      if (!followingList.includes(profile?.id)) {
        followingList.push(profile?.id);
      }
    } else {
      const index = followingList.indexOf(profile?.id);
      if (index > -1) followingList.splice(index, 1);
    }
    localStorage.setItem('followingList', JSON.stringify(followingList));
  };

  // Send warning to user
  const handleSendWarning = async () => {
    if (!warningMessage.trim()) {
      setWarningError('Please enter a warning message');
      setTimeout(() => setWarningError(''), 3000);
      return;
    }

    setActionLoading(true);
    setWarningError('');
    
    try {
      const response = await fetch('/api/admin/warn-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          username: profile?.username,
          message: warningMessage,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(`⚠️ Warning sent to ${profile?.username}`, 'warning');
        closeWarningModal();
      } else {
        setWarningError(data.error || 'Failed to send warning');
      }
    } catch (error) {
      console.error('Error sending warning:', error);
      setWarningError('Failed to send warning. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Ban user
  const handleBanUser = async () => {
    if (!banReason.trim()) {
      setBanError('Please enter a ban reason');
      setTimeout(() => setBanError(''), 3000);
      return;
    }

    setActionLoading(true);
    setBanError('');
    
    try {
      const response = await fetch('/api/admin/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          username: profile?.username,
          reason: banReason,
          duration: banDuration,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const durationText = banDuration === 'permanent' ? 'permanently' : `for ${banDuration}`;
        showToast(`🔨 ${profile?.username} has been banned ${durationText}`, 'error');
        closeBanModal();
        setProfile(prev => prev ? { ...prev, isBanned: true } : null);
        // Refresh data dari server
        setTimeout(() => fetchProfile(), 500);
      } else {
        setBanError(data.error || 'Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      setBanError('Failed to ban user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Unban user
  const handleUnbanUser = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/unban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          username: profile?.username,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(`✅ ${profile?.username} has been unbanned`, 'success');
        setProfile(prev => prev ? { ...prev, isBanned: false } : null);
        // Refresh data dari server
        setTimeout(() => fetchProfile(), 500);
      } else {
        showToast(data.error || 'Failed to unban user', 'error');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      showToast('Failed to unban user. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
        }} />

        <AdminSidebar activePage="user-profile" />

        <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
          <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                Hoyoverse Hub — <span className="text-[#C8A96E]">User Profile</span>
              </div>
              <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
                Viewing profile · {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]"
              style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>

          <div style={{ padding: '32px', flex: 1 }}>
            <div className="flex items-center justify-center py-20">
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
                  LOADING USER PROFILE...
                </p>
              </div>
            </div>
          </div>
        </main>

        <ToastContainer />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
          @keyframes ping-slow { 0% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.5); } }
          .animate-ping-slow { animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        `}</style>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
        }} />

        <AdminSidebar activePage="user-profile" />

        <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
          <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                Hoyoverse Hub — <span className="text-[#C8A96E]">User Profile</span>
              </div>
              <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
                Viewing profile · {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]"
              style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>

          <div style={{ padding: '32px', flex: 1 }}>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm">User not found</p>
                <button onClick={() => router.back()} className="mt-4 text-[#C8A96E] hover:text-[#EDD28A] text-sm">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </main>

        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
      }} />

      {/* Sidebar */}
      <AdminSidebar activePage="user-profile" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}
        >
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Hoyoverse Hub — <span className="text-[#C8A96E]">User Profile</span>
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              Viewing profile · {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <button
              onClick={() => router.push('/HoyoAdmin/dashboard-admin')}
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif] bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] rounded transition-all hover:bg-[rgba(200,169,110,0.2)]"
              style={clipBtn}
            >
              ← Back to Dashboard
            </button>
            <div
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]"
              style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', flex: 1 }}>
          {/* Hero Section */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-xl p-8 mb-6">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#1a2a3a] to-[#0d1525] rounded-xl border-2 border-[#C8A96E] flex items-center justify-center shadow-lg">
                <span className="font-['Cinzel',serif] text-3xl font-bold text-[#C8A96E]">{profile.initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-['Cinzel',serif] text-2xl font-bold text-[#E8E0CC]">{profile.username}</h1>
                  {profile.isVerified && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.3)] text-[#A855F7]">
                      ✓ Verified
                    </span>
                  )}
                  {profile.isBanned && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded bg-[rgba(224,92,122,0.2)] border border-[rgba(224,92,122,0.5)] text-[#E05C7A]">
                      ⛔ Banned
                    </span>
                  )}
                </div>
                <div className="font-['Space_Mono',monospace] text-[0.75rem] text-[#5A5248] mt-1">{profile.email}</div>
                <div className="flex gap-2 mt-3">
                  <span className="text-[0.65rem] px-3 py-1 rounded bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.3)] text-[#4ECDC4]" style={clipBadge}>{profile.rank}</span>
                  <span className="text-[0.65rem] px-3 py-1 rounded bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E]" style={clipBadge}>Level {profile.level}</span>
                  <span className="text-[0.65rem] px-3 py-1 rounded bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.3)] text-[#4ECDC4]" style={clipBadge}>{profile.role}</span>
                </div>
              </div>

              {/* Stats Quick */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="font-['Space_Mono',monospace] text-2xl font-bold text-[#C8A96E]">{profile.totalReports}</div>
                  <div className="text-[0.65rem] text-[#5A5248]">Reports</div>
                </div>
                <div className="text-center">
                  <div className="font-['Space_Mono',monospace] text-2xl font-bold text-[#4ECDC4]">{profile.level}</div>
                  <div className="text-[0.65rem] text-[#5A5248]">Level</div>
                </div>
                <div className="text-center">
                  <div className="font-['Space_Mono',monospace] text-2xl font-bold text-[#A855F7]">{profile.xp.toLocaleString()}</div>
                  <div className="text-[0.65rem] text-[#5A5248]">XP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Left Column - Account Info */}
            <div>
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-xl p-6">
                <h3 className="font-['Cinzel',serif] text-[0.85rem] text-[#C8A96E] uppercase tracking-wider mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
                    <span className="text-[0.8rem] text-[#9A8F78]">Member Since</span>
                    <span className="text-[0.8rem] font-['Space_Mono',monospace] text-[#E8E0CC]">{profile.memberSince}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
                    <span className="text-[0.8rem] text-[#9A8F78]">Last Active</span>
                    <span className="text-[0.8rem] font-['Space_Mono',monospace] text-[#E8E0CC]">{profile.lastActive}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
                    <span className="text-[0.8rem] text-[#9A8F78]">User ID</span>
                    <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{profile.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
                    <span className="text-[0.8rem] text-[#9A8F78]">Total Reports</span>
                    <span className="text-[0.8rem] font-['Space_Mono',monospace] text-[#4ECDC4]">{profile.totalReports}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Action Buttons */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-xl p-5 mb-6">
                <button 
                  onClick={handleFollow} 
                  className="w-full py-2.5 mb-2 text-[0.75rem] font-bold uppercase tracking-wider rounded" 
                  style={{ background: following ? 'rgba(78,205,196,0.15)' : 'rgba(200,169,110,0.08)', border: following ? '1px solid rgba(78,205,196,0.4)' : '1px solid rgba(200,169,110,0.3)', color: following ? '#4ECDC4' : '#C8A96E', ...clipBtn }}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <button 
                  onClick={() => setShowWarningModal(true)} 
                  className="w-full py-2.5 mb-2 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E]" 
                  style={clipBtn}
                >
                  Send Warning
                </button>
                {profile.isBanned ? (
                  <button 
                    onClick={handleUnbanUser} 
                    className="w-full py-2.5 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.3)] text-[#4ECDC4]" 
                    style={clipBtn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Unban User'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowBanModal(true)} 
                    className="w-full py-2.5 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.1)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A]" 
                    style={clipBtn}
                  >
                    Ban User
                  </button>
                )}
              </div>

              {/* Interests */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-xl p-5 mb-6">
                <h3 className="font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] uppercase tracking-wider mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag, i) => (
                    <span key={i} className="text-[0.6rem] px-3 py-1 rounded" style={{ border: `1px solid ${tag.color}55`, background: `${tag.color}12`, color: tag.color, ...clipBadge }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-xl p-5">
                <h3 className="font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] uppercase tracking-wider mb-3">Activity (12 Weeks)</h3>
                <div className="grid grid-cols-12 gap-0.5">
                  {Array.from({ length: 12 }).map((_, week) => (
                    <div key={week} className="flex flex-col gap-0.5">
                      {Array.from({ length: 7 }).map((_, day) => {
                        const val = heatmap[week * 7 + day];
                        return (
                          <div key={day} className="w-full aspect-square rounded-sm" style={{ background: heatColors[val] }} title={val > 0 ? `${val} activities` : 'No activity'} />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[0.5rem] text-[#5A5248]">Less</span>
                  <div className="flex gap-1">{heatColors.map((c, i) => (<div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />))}</div>
                  <span className="text-[0.5rem] text-[#5A5248]">More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Warning Modal with Animation */}
      {showWarningModal && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 ${
            modalClosing ? 'opacity-0' : 'opacity-100'
          }`} 
          onClick={closeWarningModal}
        >
          <div 
            className={`relative max-w-md w-full mx-4 transform transition-all duration-500 ${
              modalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A96E] via-[#EDD28A] to-[#C8A96E] rounded-xl opacity-75 blur animate-gradient" />
            
            <div className="relative bg-[#0C1220] border border-[rgba(200,169,110,0.3)] rounded-xl p-6">
              {/* Animated icon */}
              <div className="flex items-center gap-3 mb-4 animate-slide-down">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#C8A96E] rounded-full blur-md opacity-50 animate-ping-slow" />
                  <div className="relative w-12 h-12 rounded-full bg-[rgba(200,169,110,0.15)] border-2 border-[#C8A96E] flex items-center justify-center animate-bounce-in">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M12 8v4M12 16h.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Cinzel',serif] text-xl text-[#C8A96E] animate-slide-right">Send Warning</h3>
              </div>
              
              <p className="text-[#9A8F78] text-sm mb-4 animate-fade-in">
                Send a warning to <span className="text-[#C8A96E] font-bold">{profile.username}</span>
              </p>
              
              {/* Animated textarea */}
              <div className="relative animate-slide-up">
                <textarea
                  value={warningMessage}
                  onChange={e => {
                    setWarningMessage(e.target.value);
                    if (warningError) setWarningError('');
                  }}
                  placeholder="Enter warning message..."
                  className={`w-full p-3 rounded-lg bg-[rgba(5,8,16,0.8)] border text-[#E8E0CC] text-sm resize-none focus:outline-none transition-all duration-200 ${
                    warningError 
                      ? 'border-[#E85050] shadow-[0_0_0_2px_rgba(232,80,80,0.1)] animate-shake' 
                      : 'border-[rgba(200,169,110,0.3)] focus:border-[#C8A96E] focus:shadow-[0_0_0_2px_rgba(200,169,110,0.1)]'
                  }`}
                  rows={4}
                />
                {warningError && (
                  <p className="text-[#E85050] text-xs mt-2 animate-slide-up">{warningError}</p>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeWarningModal}
                  className="flex-1 py-2 rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:text-[#C8A96E] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendWarning}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded bg-[rgba(200,169,110,0.15)] border border-[#C8A96E] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.25)] disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin-fast w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Warning'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal with Animation */}
      {showBanModal && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 ${
            modalClosing ? 'opacity-0' : 'opacity-100'
          }`} 
          onClick={closeBanModal}
        >
          <div 
            className={`relative max-w-md w-full mx-4 transform transition-all duration-500 ${
              modalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E05C7A] via-[#E85050] to-[#E05C7A] rounded-xl opacity-75 blur animate-gradient" />
            
            <div className="relative bg-[#0C1220] border border-[rgba(224,92,122,0.3)] rounded-xl p-6">
              {/* Animated icon */}
              <div className="flex items-center gap-3 mb-4 animate-slide-down">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#E05C7A] rounded-full blur-md opacity-50 animate-ping-slow" />
                  <div className="relative w-12 h-12 rounded-full bg-[rgba(224,92,122,0.15)] border-2 border-[#E05C7A] flex items-center justify-center animate-bounce-in">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E05C7A" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Cinzel',serif] text-xl text-[#E05C7A] animate-slide-right">Ban User</h3>
              </div>
              
              <p className="text-[#9A8F78] text-sm mb-4 animate-fade-in">
                Ban <span className="text-[#E05C7A] font-bold">{profile.username}</span> from the platform
              </p>
              
              {/* Ban Duration with animation */}
              <div className="mb-4 animate-slide-up">
                <label className="block text-[0.65rem] text-[#9A8F78] uppercase tracking-wider mb-2">Ban Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: '1day', label: '1 Day' },
                    { value: '7days', label: '7 Days' },
                    { value: '30days', label: '30 Days' },
                    { value: 'permanent', label: 'Permanent', icon: '⛔' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setBanDuration(option.value as any)}
                      className={`px-3 py-1.5 text-xs rounded transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        banDuration === option.value
                          ? 'bg-[rgba(224,92,122,0.2)] border border-[#E05C7A] text-[#E05C7A] shadow-[0_0_8px_rgba(224,92,122,0.3)]'
                          : 'bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)]'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {option.icon && <span>{option.icon}</span>}
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Animated textarea */}
              <div className="relative animate-slide-up">
                <textarea
                  value={banReason}
                  onChange={e => {
                    setBanReason(e.target.value);
                    if (banError) setBanError('');
                  }}
                  placeholder="Enter ban reason..."
                  className={`w-full p-3 rounded-lg bg-[rgba(5,8,16,0.8)] border text-[#E8E0CC] text-sm resize-none focus:outline-none transition-all duration-200 ${
                    banError 
                      ? 'border-[#E85050] shadow-[0_0_0_2px_rgba(232,80,80,0.1)] animate-shake' 
                      : 'border-[rgba(224,92,122,0.3)] focus:border-[#E05C7A] focus:shadow-[0_0_0_2px_rgba(224,92,122,0.1)]'
                  }`}
                  rows={3}
                />
                {banError && (
                  <p className="text-[#E85050] text-xs mt-2 animate-slide-up">{banError}</p>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeBanModal}
                  className="flex-1 py-2 rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:text-[#C8A96E] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded bg-[rgba(224,92,122,0.15)] border border-[#E05C7A] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.25)] disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin-fast w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeLinecap="round" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Ban User'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        
        @keyframes spin-fast { to { transform: rotate(360deg); } }
        .animate-spin-fast { animation: spin-fast 0.6s linear infinite; }
        
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        
        @keyframes ping-slow { 0% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.5); } }
        .animate-ping-slow { animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        
        @keyframes bounce-in { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 70% { transform: scale(1.1) rotate(5deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        
        @keyframes slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.4s ease-out both; }
        
        @keyframes slide-right { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-right { animation: slide-right 0.4s ease-out 0.1s both; }
        
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s ease-out 0.15s both; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out 0.05s both; }
        
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        
        @keyframes gradient { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
        .animate-gradient { animation: gradient 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}