'use client';

import { useState, useEffect, useRef } from 'react';
import { clipBadge, clipBtn } from '@/components/common/clipStyles';

interface AdminData {
  id: string;
  username: string;
  email: string;
  role: string;
  rank: string;
  level: number;
  xp: number;
  initials: string;
  totalReports: number;
  totalReviews: number;
  totalApproved: number;
  totalRejected: number;
  daysActive: number;
  rankPosition: string;
  createdAt: string;
  lastLogin: string;
  bio?: string;
  location?: string;
  avatar?: string;
  banner?: string;
}

interface AdminActivity {
  id: string;
  title: string;
  type: string;
  tag: string;
  tagColor: string;
  votes: number;
  time: string;
  status?: string;
  game?: string;
  details?: string;
}

const accessLevels: string[] = ['ALL GAMES', 'MODERATION', 'SYSTEM'];
const accessColors: string[] = ['#4ECDC4', '#E05C7A', '#A855F7'];

const heatColors: string[] = [
  'rgba(200,169,110,0.06)',
  'rgba(200,169,110,0.2)',
  'rgba(200,169,110,0.4)',
  'rgba(200,169,110,0.65)',
  '#C8A96E',
];

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>(Array(12 * 7).fill(0));
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Edit form
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch activities dari API
  const fetchActivities = async () => {
    setActivityLoading(true);
    try {
      const response = await fetch('/api/admin/profile/activity', {
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

  // Fetch weekly activity heatmap dari API
  const fetchWeeklyActivity = async () => {
    setHeatmapLoading(true);
    try {
      const response = await fetch('/api/admin/profile/activity-stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.heatmap) {
          setWeeklyActivity(data.heatmap);
        } else {
          // Fallback ke data kosong
          setWeeklyActivity(Array(12 * 7).fill(0));
        }
      } else {
        setWeeklyActivity(Array(12 * 7).fill(0));
      }
    } catch (error) {
      console.error('Error fetching weekly activity:', error);
      setWeeklyActivity(Array(12 * 7).fill(0));
    } finally {
      setHeatmapLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin data
        const userRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (userRes.ok) {
          const userData = await userRes.json();
          setAdmin(userData);
          setEditUsername(userData.username || '');
          setEditBio(userData.bio || 'Platform administrator for Hoyoverse Hub. Responsible for content moderation, report approvals, user management, and maintaining community guidelines across all game categories.');
          setEditLocation(userData.location || 'Hoyoverse Hub, Global');
        }
        
        // Fetch activities
        await fetchActivities();
        
        // Fetch weekly activity heatmap
        await fetchWeeklyActivity();
        
        // Load avatar from localStorage
        const savedAvatar = localStorage.getItem('adminAvatar');
        if (savedAvatar) {
          setAvatar(savedAvatar);
        }
        
        // Load banner from localStorage
        const savedBanner = localStorage.getItem('adminBanner');
        if (savedBanner) {
          setBanner(savedBanner);
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      localStorage.setItem('adminAvatar', base64String);
      setAvatar(base64String);
      
      window.dispatchEvent(new CustomEvent('adminAvatarUpdated'));
      showToast('Profile picture updated successfully!', 'ok');
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

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
      localStorage.setItem('adminBanner', base64String);
      setBanner(base64String);
      
      window.dispatchEvent(new CustomEvent('adminBannerUpdated'));
      showToast('Banner updated successfully!', 'ok');
      setUploadingBanner(false);
    };
    reader.readAsDataURL(file);
  };

  const resetAvatar = () => {
    localStorage.removeItem('adminAvatar');
    setAvatar(null);
    window.dispatchEvent(new CustomEvent('adminAvatarUpdated'));
    showToast('Avatar reset to default', 'ok');
  };

  const resetBanner = () => {
    localStorage.removeItem('adminBanner');
    setBanner(null);
    window.dispatchEvent(new CustomEvent('adminBannerUpdated'));
    showToast('Banner reset to default', 'ok');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editUsername,
          bio: editBio,
          location: editLocation,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdmin(prev => prev ? { 
            ...prev, 
            username: editUsername,
            bio: editBio,
            location: editLocation,
          } : prev);
          
          window.dispatchEvent(new CustomEvent('adminProfileUpdated', {
            detail: { username: editUsername, email: admin?.email }
          }));
          
          showToast('Profile updated successfully!', 'ok');
          setIsEditing(false);
          
          // Refresh activity data after profile update
          await fetchWeeklyActivity();
        } else {
          showToast(data.error || 'Failed to update profile', 'err');
        }
      } else {
        showToast('Failed to update profile', 'err');
      }
    } catch (error) {
      showToast('Error updating profile', 'err');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Reviews', value: admin?.totalReviews?.toLocaleString() || '0', color: '#C8A96E' },
    { label: 'Approved', value: admin?.totalApproved?.toLocaleString() || '0', color: '#4ECDC4' },
    { label: 'Rank', value: admin?.rankPosition || '#1', color: '#A855F7' },
    { label: 'Days Active', value: admin?.daysActive ? `${admin.daysActive}d` : '0d', color: '#E8E0CC' },
  ];

  // Achievements dengan kondisi unlock dari data real
  const achievements = [
    { 
      title: 'Grand Moderator', 
      desc: 'Reviewed 1,000+ reports', 
      game: 'SYSTEM', 
      color: '#C8A96E', 
      unlocked: (admin?.totalReviews || 0) >= 1000,
      current: admin?.totalReviews || 0,
      target: 1000
    },
    { 
      title: 'Sentinel Prime', 
      desc: 'Banned 20+ policy violators', 
      game: 'SYSTEM', 
      color: '#E05C7A', 
      unlocked: false,
      current: 0,
      target: 20
    },
    { 
      title: 'Lore Guardian', 
      desc: 'Approved 500+ reports', 
      game: 'STAR RAIL', 
      color: '#4ECDC4', 
      unlocked: (admin?.totalApproved || 0) >= 500,
      current: admin?.totalApproved || 0,
      target: 500
    },
    { 
      title: 'Zero Tolerance', 
      desc: 'Rejected 100+ spam reports', 
      game: 'ZENLESS', 
      color: '#A855F7', 
      unlocked: false,
      current: 0,
      target: 100
    },
    { 
      title: "Archon's Seal", 
      desc: 'Featured 50 Genshin reports', 
      game: 'GENSHIN', 
      color: '#6DD18A', 
      unlocked: false,
      current: 0,
      target: 50
    },
    { 
      title: 'Signal Master', 
      desc: 'Active 365 consecutive days', 
      game: 'SYSTEM', 
      color: '#C8A96E', 
      unlocked: (admin?.daysActive || 0) >= 365,
      current: admin?.daysActive || 0,
      target: 365
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A5248]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
      {/* Toast Notification */}
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

      {/* LEFT COLUMN */}
      <div>
        {/* Hero Banner + Avatar */}
        <div className="relative mb-6 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          {/* Banner */}
          <div 
            className="h-[140px] w-full relative cursor-pointer group overflow-hidden"
            style={{ 
              background: banner 
                ? `url(${banner}) center/cover no-repeat` 
                : 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)'
            }}
            onClick={() => bannerInputRef.current?.click()}
          >
            {!banner && Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
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
              {banner ? 'Custom Banner' : 'v3.2 · Season Active'}
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
                  className="w-[80px] h-[80px] rounded-xl border-2 border-[#E05C7A] bg-[#0d1525] flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(224,92,122,0.4)]"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatar ? (
                    <img src={avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="80" height="88" viewBox="0 0 80 88">
                      <polygon points="40,4 76,24 76,64 40,84 4,64 4,24" fill="#0d1525" stroke="#E05C7A" strokeWidth="1.5"/>
                      <text x="40" y="50" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif" fontSize="20" fontWeight="700" fill="#E05C7A">{admin?.initials || 'AD'}</text>
                    </svg>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-[rgba(5,8,16,0.8)] flex items-center justify-center rounded-xl">
                      <div className="w-6 h-6 border-2 border-[#E05C7A] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#E05C7A] border-2 border-[#0C1220] flex items-center justify-center hover:scale-110 transition-transform"
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
                    {admin?.username || 'Administrator'}
                  </h1>
                )}
                <div className="text-[0.75rem] text-[#9A8F78] font-['Space_Mono',monospace] mt-[2px] break-all max-w-[280px] mx-auto">
                  {admin?.email}
                </div>
              </div>
              
              {/* ADMIN ACCESS badge */}
              <div className="absolute top-0 right-0">
                <div className="text-[0.6rem] font-['Space_Mono',monospace] tracking-[0.15em] px-3 py-[4px] border" style={{ ...clipBadge, color: '#E05C7A', borderColor: 'rgba(224,92,122,0.5)', background: 'rgba(224,92,122,0.08)' }}>
                  ● ADMIN ACCESS
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
                <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">{editLocation}</span>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-2">Access Level</div>
              <div className="flex justify-center gap-2">
                {accessLevels.map((tag, i) => (
                  <span key={i} className="text-[0.65rem] font-bold px-3 py-[4px] border uppercase" style={{ ...clipBadge, color: accessColors[i], borderColor: `${accessColors[i]}50`, background: `${accessColors[i]}10` }}>{tag}</span>
                ))}
              </div>
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
                />
              ) : (
                <p className="text-[0.82rem] text-[#9A8F78] leading-relaxed text-center">{editBio}</p>
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
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(109,209,138,0.1)] border border-[#6DD18A] text-[#6DD18A] hover:bg-[rgba(109,209,138,0.2)] transition-all disabled:opacity-50"
                style={clipBtn}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditUsername(admin?.username || '');
                  setEditBio(admin?.bio || '');
                  setEditLocation(admin?.location || '');
                }}
                className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:bg-[rgba(200,169,110,0.15)] transition-all"
                style={clipBtn}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.2)] transition-all"
              style={clipBtn}
            >
              Edit Profile
            </button>
          )}
          
          <button
            onClick={resetAvatar}
            className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.08)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.15)] transition-all"
            style={clipBtn}
          >
            Reset Avatar
          </button>
          <button
            onClick={resetBanner}
            className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.15)] transition-all"
            style={clipBtn}
          >
            Reset Banner
          </button>
        </div>

        {/* Recent Admin Activity */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(200,169,110,0.1)]">
            <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] flex items-center gap-2">
              <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
              Recent Activity
            </div>
            <button className="text-[0.65rem] text-[#C8A96E] hover:text-[#EDD28A] font-['Space_Mono',monospace] transition-colors">View all →</button>
          </div>
          <div>
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-[0.7rem] text-[#5A5248]">Loading activities...</p>
              </div>
            ) : activities.length > 0 ? (
              activities.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-[14px] border-b border-[rgba(200,169,110,0.06)] last:border-0 hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <div className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248] w-[60px] shrink-0">{r.id}</div>
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{r.title}</div>
                    <div className="text-[0.7rem] text-[#5A5248] mt-[2px] flex items-center gap-2">
                      <span>{r.type}</span>
                    </div>
                  </div>
                  <span className="text-[0.6rem] font-bold px-2 py-[3px] border uppercase shrink-0" style={{ ...clipBadge, color: r.tagColor, borderColor: `${r.tagColor}40`, background: `${r.tagColor}10` }}>
                    {r.tag}
                  </span>
                  <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] shrink-0 w-[60px] text-right">{r.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-[0.8rem] text-[#5A5248] mb-2">No recent activity</div>
                <p className="text-[0.65rem] text-[#5A5248]">Activities will appear here when you review reports.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        {/* Achievements - dengan progress bar */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
            <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
            Achievements
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a, i) => {
              const progressPercent = Math.min(100, Math.round((a.current / a.target) * 100));
              return (
                <div key={i} className="p-3 border transition-all relative overflow-hidden" style={{ 
                  ...clipBtn, 
                  borderColor: a.unlocked ? `${a.color}30` : 'rgba(255,255,255,0.04)', 
                  background: a.unlocked ? `${a.color}08` : 'rgba(255,255,255,0.02)', 
                  opacity: a.unlocked ? 1 : 0.7 
                }}>
                  {/* Progress bar untuk locked achievements */}
                  {!a.unlocked && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.05)]">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPercent}%`, background: a.color }} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 flex items-center justify-center" style={{ color: a.unlocked ? a.color : '#3A3530' }}>
                      {a.unlocked ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <polygon points="7,1 9,5 13,5 10,8 11,12 7,10 3,12 4,8 1,5 5,5" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.3"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="4" y="6" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/>
                          <path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.1em]" style={{ color: a.unlocked ? a.color : '#3A3530' }}>{a.game}</span>
                  </div>
                  <div className="text-[0.72rem] font-semibold text-[#E8E0CC]">{a.title}</div>
                  <div className="text-[0.62rem] text-[#5A5248] mt-[2px] leading-tight">{a.desc}</div>
                  {!a.unlocked && (
                    <div className="text-[0.55rem] text-[#5A5248] mt-1">
                      {a.current.toLocaleString()} / {a.target.toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
            <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
            Activity — Last 12 Weeks
          </div>
          {heatmapLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                {Array.from({ length: 12 }).map((_, week) => (
                  <div key={week} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, day) => {
                      const val = weeklyActivity[week * 7 + day] || 0;
                      return (
                        <div
                          key={day}
                          className="w-full rounded-[2px] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_4px_rgba(200,169,110,0.5)]"
                          style={{ 
                            paddingTop: '100%', 
                            background: heatColors[Math.min(val, heatColors.length - 1)],
                            cursor: 'pointer'
                          }}
                          title={`Week ${week + 1}, Day ${day + 1}: ${val > 0 ? val + ' actions' : 'No activity'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace]">Less</span>
                <div className="flex gap-[3px]">
                  {heatColors.map((c, i) => (
                    <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace]">More</span>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}