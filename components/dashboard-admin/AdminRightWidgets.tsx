'use client';

import { useEffect, useState } from 'react';
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

interface TopContributor {
  rank: number;
  username: string;
  reportCount: number;
}

interface DailyActivity {
  date: string;
  reports: number;
}

export default function AdminRightWidgets({ stats }: AdminRightWidgetsProps) {
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [reportsByGame, setReportsByGame] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    activeToday: stats?.activeToday ?? 0,
    totalReports: stats?.totalReports ?? 0,
    pendingReports: stats?.pendingReports ?? 0,
    totalComplaints: stats?.totalComplaints ?? 0,
    bannedUsers: stats?.bannedUsers ?? 0,
  };

// Fetch real data dari API
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Widget data:', data); // Debug log
        if (data.success && data.stats) {
          // ✅ GUNAKAN dailyActivity untuk chart (bukan userRegistrationTrend)
          if (data.stats.dailyActivity && data.stats.dailyActivity.length > 0) {
            setDailyActivity(data.stats.dailyActivity);
            console.log('Daily activity set:', data.stats.dailyActivity);
          } else {
            // Fallback data jika kosong
            const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            setDailyActivity(weekDays.map(day => ({ date: day, reports: 0 })));
          }

          // Top contributors
          if (data.stats.topContributors && data.stats.topContributors.length > 0) {
            setTopContributors(data.stats.topContributors);
          }

          // Reports by game
          if (data.stats.reportsByGame && data.stats.reportsByGame.length > 0) {
            setReportsByGame(data.stats.reportsByGame);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching widget data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Game distribution colors
  const gameColors: Record<string, string> = {
    hsr: 'bg-[#4ECDC4]',
    gi: 'bg-[#6DD18A]',
    zzz: 'bg-[#A855F7]',
    hi3: 'bg-[#E05C7A]',
  };

  const gameLabels: Record<string, string> = {
    hsr: 'Honkai: Star Rail',
    gi: 'Genshin Impact',
    zzz: 'Zenless Zone Zero',
    hi3: 'Honkai Impact 3rd',
  };

  // Hitung total untuk persentase
  const totalReportsCount = reportsByGame.reduce((sum, g) => sum + (g.count || 0), 0);

  // Data untuk chart (menggunakan daily activity)
  const weekDays = dailyActivity.map(d => d.date);
  const weekVals = dailyActivity.map(d => d.reports);
  const maxVal = Math.max(...weekVals, 1);

  const rankColors = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]'];

  if (loading) {
    return (
      <div>
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
          <div className="text-center py-8">
            <div className="animate-pulse text-[#5A5248] text-sm">Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Platform Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4">Platform Overview</div>
        <div className="space-y-3">
          {[
            { label: 'Registered Users', value: safeStats.totalUsers.toLocaleString(), color: '#C8A96E' },
            { label: 'Online Now', value: safeStats.activeToday.toLocaleString(), color: '#4ECDC4' },
            { label: 'Total Reports', value: safeStats.totalReports.toLocaleString(), color: '#A855F7' },
            { label: 'Banned Accounts', value: safeStats.bannedUsers.toString(), color: '#E05C7A' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(200,169,110,0.06)] last:border-0">
              <span className="text-[0.75rem] text-[#9A8F78]">{item.label}</span>
              <span className="font-['Space_Mono',monospace] text-[0.82rem] font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Chart - REAL DATA */}
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
            const reportCount = weekVals[i];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300 cursor-pointer hover:opacity-80"
                  style={{ height: `${barHeight}px`, background: `linear-gradient(180deg, ${barColor}, ${barColor}80)`, borderRadius: '2px 2px 0 0' }}
                />
                <span className={`text-[0.5rem] font-['Space_Mono',monospace] ${isToday ? 'text-[#C8A96E]' : 'text-[#5A5248]'}`}>{day}</span>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#050810] border border-[#C8A96E] px-2 py-1 rounded text-[0.6rem] whitespace-nowrap z-10">
                  {reportCount} reports
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-[0.55rem] text-[#5A5248] mt-3">
          Last 7 days activity
        </div>
      </div>

      {/* Top Contributors - REAL DATA */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-3">Top Contributors</div>
        {topContributors.length > 0 ? (
          topContributors.map((u, i) => (
            <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-0 group">
              <span className={`font-['Space_Mono',monospace] text-[0.7rem] min-w-[20px] ${rankColors[i] || 'text-[#5A5248]'}`}>#{u.rank || i + 1}</span>
              <span className="flex-1 text-[0.78rem] text-[#9A8F78] line-clamp-1 group-hover:text-[#C8A96E] transition-colors cursor-pointer">
                {u.username}
              </span>
              <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">
                {(u.reportCount || 0).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-[#5A5248] text-sm">No contributors yet</div>
        )}
      </div>

      {/* Game Distribution - REAL DATA */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4">Report Distribution</div>
        {reportsByGame.length > 0 ? (
          reportsByGame.map((g, i) => {
            const pct = totalReportsCount > 0 ? Math.round((g.count / totalReportsCount) * 100) : 0;
            const gameName = gameLabels[g.game] || g.game;
            const color = gameColors[g.game] || 'bg-[#C8A96E]';
            return (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[0.7rem] text-[#9A8F78]">{gameName}</span>
                  <span className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248]">{pct}% ({g.count})</span>
                </div>
                <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} transition-[width] duration-[600ms] ease-in-out rounded-full`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-[#5A5248] text-sm">No reports yet</div>
        )}
      </div>
    </div>
  );
}