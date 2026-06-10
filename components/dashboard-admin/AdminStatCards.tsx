'use client';

import { clipWidget } from '@/components/common/clipStyles';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalReports: number;
  pendingReports: number;
  totalComplaints: number;
  bannedUsers: number;
}

interface AdminStatCardsProps {
  stats: AdminStats;
}

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 10L5 6L8 9L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 3H13V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AdminStatCards({ stats }: AdminStatCardsProps) {
  // ✅ FIX: Default values jika stats undefined atau property-nya undefined
  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    activeToday: stats?.activeToday ?? 0,
    totalReports: stats?.totalReports ?? 0,
    pendingReports: stats?.pendingReports ?? 0,
    totalComplaints: stats?.totalComplaints ?? 0,
    bannedUsers: stats?.bannedUsers ?? 0,
  };

  const cards = [
    { label: 'Total Users', value: safeStats.totalUsers.toLocaleString(), change: '+12 this week', accent: '#C8A96E' },
    { label: 'Active Today', value: safeStats.activeToday.toLocaleString(), change: 'Online now', accent: '#4ECDC4' },
    { label: 'Total Reports', value: safeStats.totalReports.toLocaleString(), change: `${safeStats.pendingReports} pending review`, accent: '#A855F7' },
    { label: 'Open Complaints', value: safeStats.totalComplaints.toLocaleString(), change: `${safeStats.bannedUsers} users banned`, accent: '#E05C7A' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-6 relative overflow-hidden" style={clipWidget}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: card.accent }} />
          <div className="mb-3">
            <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#5A5248]">{card.label}</div>
          </div>
          <div className="font-['Space_Mono',monospace] text-[1.8rem] font-bold" style={{ color: card.accent }}>{card.value}</div>
          <div className="text-[0.72rem] mt-1 flex items-center gap-1" style={{ color: card.accent === '#E05C7A' ? '#E05C7A' : '#4ECDC4' }}>
            <TrendUpIcon /> {card.change}
          </div>
        </div>
      ))}
    </div>
  );
}