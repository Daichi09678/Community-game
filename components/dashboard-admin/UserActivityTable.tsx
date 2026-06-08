'use client';

import { clipBadge } from '@/components/common/clipStyles';

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

interface UserActivityTableProps {
  users: UserActivity[];
  onSelectUser: (user: UserActivity) => void;
  selectedId: string | null;
}

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2L12.5 11H1.5L7 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <line x1="7" y1="6.5" x2="7" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="7" cy="10.5" r="0.7" fill="currentColor"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export default function UserActivityTable({ users, onSelectUser, selectedId }: UserActivityTableProps) {
  const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
    active: { color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)', border: 'rgba(78,205,196,0.3)' },
    inactive: { color: '#C8A96E', bg: 'rgba(200,169,110,0.08)', border: 'rgba(200,169,110,0.3)' },
    banned: { color: '#E05C7A', bg: 'rgba(224,92,122,0.08)', border: 'rgba(224,92,122,0.3)' },
  };

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['User', 'Email', 'Level / Rank', 'Reports', 'Last Active', 'Status', 'Complaints', 'Action'].map(h => (
              <th key={h} className="px-4 py-[10px] text-left text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const s = statusStyle[user.status];
            const isSelected = selectedId === user.id;
            return (
              <tr
                key={user.id}
                className="cursor-pointer transition-colors hover:[&>td]:bg-[rgba(200,169,110,0.03)]"
                style={{ background: isSelected ? 'rgba(200,169,110,0.05)' : undefined }}
                onClick={() => onSelectUser(user)}
              >
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.08)] flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] text-[#C8A96E] font-bold shrink-0">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[0.85rem] text-[#E8E0CC]">{user.username}</span>
                  </div>
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle text-[0.75rem] text-[#9A8F78] font-['Space_Mono',monospace]">
                  {user.email}
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <span className="text-[#C8A96E] font-['Space_Mono',monospace] text-[0.75rem]">LV.{user.level}</span>
                  <div className="text-[#5A5248] text-[0.65rem]">{user.rank}</div>
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#4ECDC4]">↑ {user.totalReports}</span>
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle text-[#5A5248] text-[0.72rem] font-['Space_Mono',monospace]">
                  {user.lastActive}
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <span
                    className="text-[0.62rem] font-bold px-2 py-[3px] border uppercase tracking-[0.08em]"
                    style={{ ...clipBadge, color: s.color, background: s.bg, borderColor: s.border }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  {user.complaints.length > 0 ? (
                    <span className="flex items-center gap-1 text-[#E05C7A] text-[0.72rem] font-['Space_Mono',monospace]">
                      <AlertIcon /> {user.complaints.length}
                    </span>
                  ) : (
                    <span className="text-[#5A5248] text-[0.72rem]">—</span>
                  )}
                </td>
                <td className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <button
                    className="flex items-center gap-1 text-[0.68rem] text-[#C8A96E] hover:text-[#EDD28A] transition-colors font-['Space_Mono',monospace]"
                    onClick={e => { e.stopPropagation(); onSelectUser(user); }}
                  >
                    <EyeIcon /> View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}