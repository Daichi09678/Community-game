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

interface AdminRightWidgetsProps {
  stats: AdminStats;
}

export default function AdminRightWidgets({ stats }: AdminRightWidgetsProps) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekVals = [28, 45, 33, 61, 78, 52, stats.activeToday];
  const maxVal = Math.max(...weekVals);

  const gameDistribution = [
    { label: 'Honkai: Star Rail', pct: 38, fill: 'bg-[#4ECDC4]' },
    { label: 'Genshin Impact', pct: 29, fill: 'bg-[#6DD18A]' },
    { label: 'Zenless Zone Zero', pct: 19, fill: 'bg-[#A855F7]' },
    { label: 'Honkai Impact 3rd', pct: 14, fill: 'bg-[#E05C7A]' },
  ];

  const topContributors = [
    { username: 'StarRailCrafter', reports: 112, score: 3840 },
    { username: 'AetherVoyager', reports: 47, score: 1890 },
    { username: 'LunarWatcher', reports: 23, score: 920 },
    { username: 'NightOwlGamer', reports: 7, score: 210 },
  ];

  const rankColors = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]'];

  return (
    <div>
      {/* Platform Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4">Platform Overview</div>
        <div className="space-y-3">
          {[
            { label: 'Registered Users', value: stats.totalUsers.toLocaleString(), color: '#C8A96E' },
            { label: 'Online Now', value: stats.activeToday.toLocaleString(), color: '#4ECDC4' },
            { label: 'Total Reports', value: stats.totalReports.toLocaleString(), color: '#A855F7' },
            { label: 'Banned Accounts', value: stats.bannedUsers.toString(), color: '#E05C7A' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(200,169,110,0.06)] last:border-0">
              <span className="text-[0.75rem] text-[#9A8F78]">{item.label}</span>
              <span className="font-['Space_Mono',monospace] text-[0.82rem] font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E]">User Activity</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
            <span className="text-[0.55rem] text-[#4ECDC4] font-['Space_Mono',monospace]">Live</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-20">
          {weekDays.map((day, i) => {
            const barHeight = Math.max(6, (weekVals[i] / maxVal) * 60);
            const isToday = i === weekDays.length - 1;
            const barColor = isToday ? '#C8A96E' : 'rgba(200,169,110,0.35)';
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300"
                  style={{ height: `${barHeight}px`, background: `linear-gradient(180deg, ${barColor}, ${barColor}80)`, borderRadius: '2px 2px 0 0' }}
                />
                <span className={`text-[0.5rem] font-['Space_Mono',monospace] ${isToday ? 'text-[#C8A96E]' : 'text-[#5A5248]'}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-3">Top Contributors</div>
        {topContributors.map((u, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-0">
            <span className={`font-['Space_Mono',monospace] text-[0.7rem] min-w-[20px] ${rankColors[i]}`}>#{i + 1}</span>
            <span className="flex-1 text-[0.78rem] text-[#9A8F78] line-clamp-1">{u.username}</span>
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">{u.score.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Game Distribution */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4">Report Distribution</div>
        {gameDistribution.map((g, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-[0.7rem] text-[#9A8F78]">{g.label}</span>
              <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248]">{g.pct}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <div className={`h-full ${g.fill} transition-[width] duration-[600ms] ease-in-out rounded-full`} style={{ width: `${g.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}