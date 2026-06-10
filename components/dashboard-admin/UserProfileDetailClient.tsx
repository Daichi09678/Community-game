'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

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

  // Fetch user profile data - HANYA AMBIL DATA USER, bukan reports
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/${userId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
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
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleWarn = async () => {
    alert(`Warning sent to ${profile?.username}`);
  };

  const handleBan = async () => {
    if (confirm(`Are you sure you want to ban ${profile?.username}?`)) {
      alert(`${profile?.username} has been banned`);
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

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
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

      {/* Sidebar - di kiri */}
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

          {/* Two Column Layout - Hanya Account Info dan Interests, tanpa Recent Reports */}
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
                <button onClick={() => setFollowing(!following)} className="w-full py-2.5 mb-2 text-[0.75rem] font-bold uppercase tracking-wider rounded" style={{ background: following ? 'rgba(78,205,196,0.15)' : 'rgba(200,169,110,0.08)', border: following ? '1px solid rgba(78,205,196,0.4)' : '1px solid rgba(200,169,110,0.3)', color: following ? '#4ECDC4' : '#C8A96E', ...clipBtn }}>
                  {following ? 'Following' : 'Follow'}
                </button>
                <button onClick={handleWarn} className="w-full py-2.5 mb-2 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E]" style={clipBtn}>
                  Send Warning
                </button>
                <button onClick={handleBan} className="w-full py-2.5 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.1)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A]" style={clipBtn}>
                  Ban User
                </button>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}