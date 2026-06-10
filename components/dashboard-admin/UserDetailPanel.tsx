'use client';

import { useRouter } from 'next/navigation';
import { clipBtn, clipBadge } from '@/components/common/clipStyles';

interface UserActivity {
  id: string;
  username: string;
  email: string;
  level: number;
  rank: string;
  totalReports: number;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'banned';
  complaints: string[];
  recentReports: { title: string; type: string; date: string; votes: number }[];
}

interface UserDetailPanelProps {
  user: UserActivity;
  onClose: () => void;
}

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2L12.5 11H1.5L7 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <line x1="7" y1="6.5" x2="7" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="7" cy="10.5" r="0.7" fill="currentColor"/>
  </svg>
);

const BanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="3" y1="11" x2="11" y2="3" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export default function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const router = useRouter();

  const handleViewFullProfile = () => {
    router.push(`/HoyoAdmin/user-profile/${user.id}`);
  };

  const handleBanUser = () => {
    if (confirm(`Are you sure you want to ban ${user.username}?`)) {
      // TODO: Implement ban API call
      alert(`${user.username} has been banned`);
    }
  };

  const typeColor: Record<string, string> = {
    guide: '#C8A96E',
    event: '#4ECDC4',
    puzzle: '#A855F7',
    build: '#6DD18A',
  };

  const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
    active: { color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)', border: 'rgba(78,205,196,0.3)' },
    inactive: { color: '#C8A96E', bg: 'rgba(200,169,110,0.08)', border: 'rgba(200,169,110,0.3)' },
    banned: { color: '#E05C7A', bg: 'rgba(224,92,122,0.08)', border: 'rgba(224,92,122,0.3)' },
  };

  const s = statusStyle[user.status];

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 sticky top-[80px]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.15em] uppercase text-[#C8A96E]">User Detail</div>
        <button onClick={onClose} className="text-[#5A5248] hover:text-[#E05C7A] text-sm transition-colors">✕</button>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[rgba(200,169,110,0.1)]">
        <div className="w-12 h-12 rounded-full border-2 border-[#8B6A2E] bg-[rgba(200,169,110,0.08)] flex items-center justify-center font-['Cinzel',serif] text-[1rem] text-[#C8A96E] font-bold">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-[#E8E0CC] text-[0.95rem]">{user.username}</div>
          <div className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">{user.email}</div>
          <span
            className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase tracking-[0.08em] mt-1 inline-block"
            style={{ ...clipBadge, color: s.color, background: s.bg, borderColor: s.border }}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Level', value: `LV.${user.level}`, color: '#C8A96E' },
          { label: 'Reports', value: user.totalReports, color: '#4ECDC4' },
          { label: 'Joined', value: user.joinedAt, color: '#9A8F78' },
          { label: 'Last Active', value: user.lastActive, color: '#9A8F78' },
        ].map((item, i) => (
          <div key={i} className="bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.08)] p-3" style={clipBtn}>
            <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mb-1">{item.label}</div>
            <div className="font-['Space_Mono',monospace] text-[0.78rem]" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Rank */}
      <div className="mb-5 pb-5 border-b border-[rgba(200,169,110,0.1)]">
        <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mb-1">Rank</div>
        <div className="text-[0.82rem] text-[#C8A96E] font-semibold">{user.rank}</div>
      </div>

      {/* Complaints */}
      {user.complaints.length > 0 && (
        <div className="mb-5 pb-5 border-b border-[rgba(200,169,110,0.1)]">
          <div className="text-[0.65rem] uppercase tracking-[0.12em] text-[#E05C7A] mb-2 flex items-center gap-1">
            <AlertIcon /> Complaints ({user.complaints.length})
          </div>
          <div className="space-y-1">
            {user.complaints.map((c, i) => (
              <div key={i} className="text-[0.72rem] text-[#9A8F78] bg-[rgba(224,92,122,0.05)] border border-[rgba(224,92,122,0.1)] px-3 py-2" style={clipBtn}>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="mb-5">
        <div className="text-[0.65rem] uppercase tracking-[0.12em] text-[#5A5248] mb-2">Recent Reports</div>
        <div className="space-y-1">
          {user.recentReports.length > 0 ? (
            user.recentReports.map((r, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-[rgba(200,169,110,0.06)] last:border-0">
                <span
                  className="text-[0.6rem] uppercase px-[6px] py-[2px] border font-bold"
                  style={{ ...clipBadge, color: typeColor[r.type] || '#C8A96E', borderColor: `${typeColor[r.type] || '#C8A96E'}40`, background: `${typeColor[r.type] || '#C8A96E'}10` }}
                >
                  {r.type}
                </span>
                <span className="flex-1 text-[0.72rem] text-[#9A8F78] line-clamp-1">{r.title}</span>
                <span className="text-[0.65rem] text-[#4ECDC4] font-['Space_Mono',monospace]">↑{r.votes}</span>
              </div>
            ))
          ) : (
            <div className="text-[0.7rem] text-[#5A5248] text-center py-4">No reports yet</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleViewFullProfile}
          className="w-full py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#050810] transition-all hover:brightness-110 font-['Rajdhani',sans-serif]"
          style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
        >
          View Full Profile
        </button>
        {user.status !== 'banned' && (
          <button
            onClick={handleBanUser}
            className="w-full py-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] transition-all border border-[rgba(224,92,122,0.4)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.1)] font-['Rajdhani',sans-serif]"
            style={clipBtn}
          >
            <span className="flex items-center justify-center gap-2"><BanIcon /> Ban User</span>
          </button>
        )}
      </div>
    </div>
  );
}