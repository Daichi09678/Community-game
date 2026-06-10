'use client';

import { useState, useEffect } from 'react';

const clipCard = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;

interface UserProfileDetailProps {
  userId: string;
  onClose: () => void;
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

const stats = [
  { label: 'Reports', color: '#C8A96E' },
  { label: 'Level', color: '#4ECDC4' },
  { label: 'XP', color: '#A855F7' },
  { label: 'Rank', color: '#E8E0CC' },
];

export default function UserProfileDetail({ userId, onClose }: UserProfileDetailProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [heatmap, setHeatmap] = useState<number[]>(Array(84).fill(0));

  const heatColors = [
    'rgba(78,205,196,0.07)',
    'rgba(78,205,196,0.2)',
    'rgba(78,205,196,0.4)',
    'rgba(78,205,196,0.65)',
    '#4ECDC4',
  ];

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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '500px',
          background: '#0C1220',
          borderLeft: '1px solid rgba(200,169,110,0.2)',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#C8A96E] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#5A5248]">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '500px',
          background: '#0C1220',
          borderLeft: '1px solid rgba(200,169,110,0.2)',
          zIndex: 1000,
          padding: '24px',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Cinzel',serif] text-[#C8A96E]">User Profile</h2>
          <button onClick={onClose} className="text-[#5A5248] hover:text-[#E05C7A]">✕</button>
        </div>
        <div className="text-center py-8 text-[#5A5248]">User not found</div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '500px',
        background: '#0C1220',
        borderLeft: '1px solid rgba(200,169,110,0.2)',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#0C1220',
          borderBottom: '1px solid rgba(200,169,110,0.1)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div className="font-['Cinzel',serif] text-[0.85rem] text-[#C8A96E] uppercase tracking-wider">
          User Profile
        </div>
        <button
          onClick={onClose}
          className="text-[#5A5248] hover:text-[#E05C7A] transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* Avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 12px',
              background: 'linear-gradient(135deg, #1a2a3a, #0d1525)',
              borderRadius: '12px',
              border: '2px solid #C8A96E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="font-['Cinzel',serif] text-2xl font-bold text-[#C8A96E]">
              {profile.initials}
            </span>
          </div>

          {/* Username */}
          <div className="font-['Cinzel',serif] text-xl font-bold text-[#E8E0CC]">
            {profile.username}
          </div>
          <div className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248] mt-1">
            {profile.email}
          </div>

          {/* Badges */}
          <div className="flex justify-center gap-2 mt-3">
            <span
              className="text-[0.6rem] px-3 py-1 rounded"
              style={{
                background: 'rgba(78,205,196,0.1)',
                border: '1px solid rgba(78,205,196,0.3)',
                color: '#4ECDC4',
                ...clipBadge,
              }}
            >
              {profile.rank}
            </span>
            <span
              className="text-[0.6rem] px-3 py-1 rounded"
              style={{
                background: 'rgba(200,169,110,0.1)',
                border: '1px solid rgba(200,169,110,0.3)',
                color: '#C8A96E',
                ...clipBadge,
              }}
            >
              Level {profile.level}
            </span>
            {profile.isVerified && (
              <span
                className="text-[0.6rem] px-3 py-1 rounded"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#A855F7',
                  ...clipBadge,
                }}
              >
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(5,8,16,0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(200,169,110,0.1)',
          }}
        >
          {[
            { label: 'Reports', value: profile.totalReports.toLocaleString(), color: '#C8A96E' },
            { label: 'Level', value: profile.level, color: '#4ECDC4' },
            { label: 'XP', value: profile.xp.toLocaleString(), color: '#A855F7' },
            { label: 'Rank', value: profile.rank.split(' ')[0], color: '#E8E0CC' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="font-['Space_Mono',monospace] text-[1.2rem] font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[0.6rem] text-[#5A5248] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{ marginBottom: '24px' }}>
          <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wider mb-3">Account Info</div>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
              <span className="text-[0.75rem] text-[#9A8F78]">Member Since</span>
              <span className="text-[0.75rem] font-['Space_Mono',monospace] text-[#E8E0CC]">{profile.memberSince}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
              <span className="text-[0.75rem] text-[#9A8F78]">Last Active</span>
              <span className="text-[0.75rem] font-['Space_Mono',monospace] text-[#E8E0CC]">{profile.lastActive}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(200,169,110,0.05)]">
              <span className="text-[0.75rem] text-[#9A8F78]">User ID</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{profile.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div style={{ marginBottom: '24px' }}>
          <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wider mb-3">Interests</div>
          <div className="flex flex-wrap gap-2">
            {interests.map((tag, i) => (
              <span
                key={i}
                className="text-[0.6rem] px-3 py-1"
                style={{
                  border: `1px solid ${tag.color}55`,
                  background: `${tag.color}12`,
                  color: tag.color,
                  ...clipBadge,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div style={{ marginBottom: '24px' }}>
          <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wider mb-3">Activity — 12 Weeks</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px' }}>
            {Array.from({ length: 12 }).map((_, week) => (
              <div key={week} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {Array.from({ length: 7 }).map((_, day) => {
                  const val = heatmap[week * 7 + day];
                  return (
                    <div
                      key={day}
                      style={{
                        width: '100%',
                        paddingTop: '100%',
                        borderRadius: '2px',
                        background: heatColors[val],
                        cursor: 'pointer',
                      }}
                      title={val > 0 ? `${val} activities` : 'No activity'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[0.5rem] text-[#5A5248]">Less</span>
            <div className="flex gap-1">
              {heatColors.map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              ))}
            </div>
            <span className="text-[0.5rem] text-[#5A5248]">More</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setFollowing(!following)}
            style={{
              flex: 1,
              padding: '10px',
              background: following ? 'rgba(78,205,196,0.15)' : 'rgba(200,169,110,0.08)',
              border: following ? '1px solid rgba(78,205,196,0.4)' : '1px solid rgba(200,169,110,0.3)',
              color: following ? '#4ECDC4' : '#C8A96E',
              ...clipBtn,
            }}
            className="text-[0.7rem] font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            {following ? 'Following' : 'Follow'}
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px',
              background: 'rgba(78,205,196,0.08)',
              border: '1px solid rgba(78,205,196,0.3)',
              color: '#4ECDC4',
              ...clipBtn,
            }}
            className="text-[0.7rem] font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Message
          </button>
          <button
            style={{
              padding: '10px 16px',
              background: 'rgba(224,92,122,0.1)',
              border: '1px solid rgba(224,92,122,0.3)',
              color: '#E05C7A',
              ...clipBtn,
            }}
            className="text-[0.7rem] font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Warn
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}