'use client';

import { useState, useEffect } from 'react';
import { clipBadge, clipBtn } from '@/components/common/clipStyles';

interface AdminReport {
  id: string;
  title: string;
  type: string;
  tag: string;
  tagColor: string;
  votes: number;
  time: string;
}

interface GameBreakdown {
  label: string;
  reports: number;
  votes: number;
  color: string;
}

interface Achievement {
  title: string;
  desc: string;
  game: string;
  color: string;
  unlocked: boolean;
}

interface StatItem {
  label: string;
  value: string;
  color: string;
}

const adminReports: AdminReport[] = [
  { id: 'AD001', title: 'Banned ZZZHackerX — spam policy violation', type: 'Moderation', tag: 'USER BAN', tagColor: '#E05C7A', votes: 0, time: '2h ago' },
  { id: 'AD002', title: 'Accepted: Kafka Max Build v2.5 by StarRailCrafter', type: 'Report Approval', tag: 'APPROVED', tagColor: '#4ECDC4', votes: 671, time: '4h ago' },
  { id: 'AD003', title: 'Rejected: Clickbait spam report #103', type: 'Report Review', tag: 'REJECTED', tagColor: '#E05C7A', votes: 0, time: '6h ago' },
  { id: 'AD004', title: 'Updated platform announcement for v3.2 season', type: 'Announcement', tag: 'SYSTEM', tagColor: '#A855F7', votes: 0, time: '1d ago' },
  { id: 'AD005', title: 'Accepted: Genshin Fontaine Puzzle Compendium', type: 'Report Approval', tag: 'APPROVED', tagColor: '#4ECDC4', votes: 89, time: '1d ago' },
];

const gameBreakdown: GameBreakdown[] = [
  { label: 'STAR RAIL', reports: 612, votes: 14820, color: '#4ECDC4' },
  { label: 'GENSHIN', reports: 421, votes: 9340, color: '#6DD18A' },
  { label: 'ZENLESS', reports: 156, votes: 3210, color: '#A855F7' },
  { label: 'HONKAI 3RD', reports: 95, votes: 1630, color: '#E05C7A' },
];

const achievements: Achievement[] = [
  { title: 'Grand Moderator', desc: 'Reviewed 1,000+ reports', game: 'SYSTEM', color: '#C8A96E', unlocked: true },
  { title: 'Sentinel Prime', desc: 'Banned 20+ policy violators', game: 'SYSTEM', color: '#E05C7A', unlocked: true },
  { title: 'Lore Guardian', desc: 'Approved 500+ lore guides', game: 'STAR RAIL', color: '#4ECDC4', unlocked: true },
  { title: 'Zero Tolerance', desc: 'Cleared 100+ spam reports', game: 'ZENLESS', color: '#A855F7', unlocked: false },
  { title: "Archon's Seal", desc: 'Featured 50 Genshin reports', game: 'GENSHIN', color: '#6DD18A', unlocked: false },
  { title: 'Signal Master', desc: 'Active 365 consecutive days', game: 'SYSTEM', color: '#C8A96E', unlocked: false },
];

const stats: StatItem[] = [
  { label: 'Reviews', value: '1,284', color: '#C8A96E' },
  { label: 'Approved', value: '1,201', color: '#4ECDC4' },
  { label: 'Rank', value: '#1', color: '#A855F7' },
  { label: 'Days Active', value: '521d', color: '#E8E0CC' },
];

const accessLevels: string[] = ['ALL GAMES', 'MODERATION', 'SYSTEM'];
const accessColors: string[] = ['#4ECDC4', '#E05C7A', '#A855F7'];

const heatColors: string[] = [
  'rgba(200,169,110,0.06)',
  'rgba(200,169,110,0.2)',
  'rgba(200,169,110,0.4)',
  'rgba(200,169,110,0.65)',
  '#C8A96E',
];

// Generate heatmap data (hanya di client side)
const generateHeatmap = (): number[] => {
  return Array.from({ length: 12 * 7 }, () => {
    const r = Math.random();
    if (r < 0.45) return 0;
    if (r < 0.65) return 1;
    if (r < 0.80) return 2;
    if (r < 0.92) return 3;
    return 4;
  });
};

export default function AdminProfilePage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [heatmap, setHeatmap] = useState<number[]>(Array(12 * 7).fill(0));

  useEffect(() => {
    setMounted(true);
    setHeatmap(generateHeatmap());
  }, []);

  const maxReports: number = Math.max(...gameBreakdown.map(g => g.reports));

  // Render placeholder saat belum mounted (server side)
  if (!mounted) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN - Placeholder */}
        <div>
          {/* Hero Banner */}
          <div className="relative mb-6 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="h-[140px] w-full relative" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)' }}>
              {Array.from({ length: 18 }).map((_, i) => (
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
              <div className="absolute top-4 right-4 text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248]">v3.2 · Season Active</div>
            </div>
            <div className="px-8 pb-6">
              <div className="flex items-end gap-5 -mt-10 mb-5">
                <div className="shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(224,92,122,0.3))' }}>
                  <svg width="80" height="88" viewBox="0 0 80 88">
                    <polygon points="40,4 76,24 76,64 40,84 4,64 4,24" fill="#0d1525" stroke="#E05C7A" strokeWidth="1.5"/>
                    <text x="40" y="50" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif" fontSize="20" fontWeight="700" fill="#E05C7A">AD</text>
                  </svg>
                </div>
                <div className="pb-1">
                  <h1 className="font-['Cinzel',serif] text-[1.3rem] font-bold text-[#E8E0CC] leading-tight">Administrator</h1>
                  <div className="text-[0.8rem] text-[#9A8F78] font-['Space_Mono',monospace] mt-[2px]">Supreme Overseer</div>
                </div>
                <div className="ml-auto pb-1">
                  <div className="text-[0.6rem] font-['Space_Mono',monospace] tracking-[0.15em] px-3 py-[4px] border" style={{ ...clipBadge, color: '#E05C7A', borderColor: 'rgba(224,92,122,0.5)', background: 'rgba(224,92,122,0.08)' }}>● ADMIN ACCESS</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="5" r="2.5" stroke="#5A5248" strokeWidth="1"/><path d="M6 2C4.3 2 3 3.3 3 5c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" stroke="#5A5248" strokeWidth="1"/></svg>
                <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">Hoyoverse Hub, Global</span>
              </div>
              <div className="mb-4">
                <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-2">Access Level</div>
                <div className="flex gap-2">
                  {accessLevels.map((tag, i) => (
                    <span key={i} className="text-[0.65rem] font-bold px-3 py-[4px] border uppercase" style={{ ...clipBadge, color: accessColors[i], borderColor: `${accessColors[i]}50`, background: `${accessColors[i]}10` }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="mb-1">
                <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-1">Bio</div>
                <p className="text-[0.82rem] text-[#9A8F78] leading-relaxed">Platform administrator for Hoyoverse Hub. Responsible for content moderation, report approvals, user management, and maintaining community guidelines across all game categories.</p>
              </div>
            </div>
            <div className="border-t border-[rgba(200,169,110,0.1)] grid grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className={`py-4 text-center ${i < 3 ? 'border-r border-[rgba(200,169,110,0.08)]' : ''}`}>
                  <div className="font-['Space_Mono',monospace] text-[1.1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(200,169,110,0.1)]">
              <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] flex items-center gap-2">
                <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
                Recent Activity
              </div>
              <button className="text-[0.65rem] text-[#C8A96E] hover:text-[#EDD28A] font-['Space_Mono',monospace] transition-colors">View all →</button>
            </div>
            <div>
              {adminReports.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-[14px] border-b border-[rgba(200,169,110,0.06)] last:border-0 hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <div className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248] w-[50px] shrink-0">{r.id}</div>
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{r.title}</div>
                    <div className="text-[0.7rem] text-[#5A5248] mt-[2px]">{r.type}</div>
                  </div>
                  <span className="text-[0.6rem] font-bold px-2 py-[3px] border uppercase shrink-0" style={{ ...clipBadge, color: r.tagColor, borderColor: `${r.tagColor}40`, background: `${r.tagColor}10` }}>{r.tag}</span>
                  {r.votes > 0 && <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#4ECDC4] shrink-0">↑ {r.votes}</span>}
                  <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] shrink-0 w-[40px] text-right">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Placeholder */}
        <div>
          {/* Achievements Placeholder */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
              <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
              Achievements
            </div>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((a, i) => (
                <div key={i} className="p-3 border transition-all" style={{ ...clipBtn, borderColor: a.unlocked ? `${a.color}30` : 'rgba(255,255,255,0.04)', background: a.unlocked ? `${a.color}08` : 'rgba(255,255,255,0.02)', opacity: a.unlocked ? 1 : 0.45 }}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Game Breakdown Placeholder */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
              <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
              Game Breakdown
            </div>
            <div className="space-y-3">
              {gameBreakdown.map((g, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[0.62rem] font-bold px-2 py-[2px] border uppercase" style={{ ...clipBadge, color: g.color, borderColor: `${g.color}40`, background: `${g.color}10` }}>{g.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.65rem] text-[#9A8F78]">{g.reports} reports</span>
                      <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {g.votes.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-[3px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(g.reports / maxReports) * 100}%`, background: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Placeholder */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
              <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
              Activity — Last 12 Weeks
            </div>
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
              {Array.from({ length: 12 }).map((_, week) => (
                <div key={week} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, day) => (
                    <div key={day} className="w-full rounded-[2px]" style={{ paddingTop: '100%', background: 'rgba(200,169,110,0.06)' }} />
                  ))}
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
          </div>
        </div>
      </div>
    );
  }

  // Render actual content (client side only)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
      {/* LEFT COLUMN */}
      <div>
        {/* Hero Banner + Avatar */}
        <div className="relative mb-6 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="h-[140px] w-full relative" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)' }}>
            {Array.from({ length: 18 }).map((_, i) => (
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
            <div className="absolute top-4 right-4 text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248]">v3.2 · Season Active</div>
          </div>
          <div className="px-8 pb-6">
            <div className="flex items-end gap-5 -mt-10 mb-5">
              <div className="shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(224,92,122,0.3))' }}>
                <svg width="80" height="88" viewBox="0 0 80 88">
                  <polygon points="40,4 76,24 76,64 40,84 4,64 4,24" fill="#0d1525" stroke="#E05C7A" strokeWidth="1.5"/>
                  <text x="40" y="50" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif" fontSize="20" fontWeight="700" fill="#E05C7A">AD</text>
                </svg>
              </div>
              <div className="pb-1">
                <h1 className="font-['Cinzel',serif] text-[1.3rem] font-bold text-[#E8E0CC] leading-tight">Administrator</h1>
                <div className="text-[0.8rem] text-[#9A8F78] font-['Space_Mono',monospace] mt-[2px]">Supreme Overseer</div>
              </div>
              <div className="ml-auto pb-1">
                <div className="text-[0.6rem] font-['Space_Mono',monospace] tracking-[0.15em] px-3 py-[4px] border" style={{ ...clipBadge, color: '#E05C7A', borderColor: 'rgba(224,92,122,0.5)', background: 'rgba(224,92,122,0.08)' }}>● ADMIN ACCESS</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="5" r="2.5" stroke="#5A5248" strokeWidth="1"/><path d="M6 2C4.3 2 3 3.3 3 5c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" stroke="#5A5248" strokeWidth="1"/></svg>
              <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">Hoyoverse Hub, Global</span>
            </div>
            <div className="mb-4">
              <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-2">Access Level</div>
              <div className="flex gap-2">
                {accessLevels.map((tag, i) => (
                  <span key={i} className="text-[0.65rem] font-bold px-3 py-[4px] border uppercase" style={{ ...clipBadge, color: accessColors[i], borderColor: `${accessColors[i]}50`, background: `${accessColors[i]}10` }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <div className="text-[0.6rem] uppercase tracking-[0.14em] text-[#5A5248] mb-1">Bio</div>
              <p className="text-[0.82rem] text-[#9A8F78] leading-relaxed">Platform administrator for Hoyoverse Hub. Responsible for content moderation, report approvals, user management, and maintaining community guidelines across all game categories.</p>
            </div>
          </div>
          <div className="border-t border-[rgba(200,169,110,0.1)] grid grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className={`py-4 text-center ${i < 3 ? 'border-r border-[rgba(200,169,110,0.08)]' : ''}`}>
                <div className="font-['Space_Mono',monospace] text-[1.1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
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
            {adminReports.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-[14px] border-b border-[rgba(200,169,110,0.06)] last:border-0 hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                <div className="text-[0.65rem] font-['Space_Mono',monospace] text-[#5A5248] w-[50px] shrink-0">{r.id}</div>
                <div className="flex-1">
                  <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{r.title}</div>
                  <div className="text-[0.7rem] text-[#5A5248] mt-[2px]">{r.type}</div>
                </div>
                <span className="text-[0.6rem] font-bold px-2 py-[3px] border uppercase shrink-0" style={{ ...clipBadge, color: r.tagColor, borderColor: `${r.tagColor}40`, background: `${r.tagColor}10` }}>{r.tag}</span>
                {r.votes > 0 && <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#4ECDC4] shrink-0">↑ {r.votes}</span>}
                <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] shrink-0 w-[40px] text-right">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        {/* Achievements */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
            <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
            Achievements
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a, i) => (
              <div key={i} className="p-3 border transition-all" style={{ ...clipBtn, borderColor: a.unlocked ? `${a.color}30` : 'rgba(255,255,255,0.04)', background: a.unlocked ? `${a.color}08` : 'rgba(255,255,255,0.02)', opacity: a.unlocked ? 1 : 0.45 }}>
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
              </div>
            ))}
          </div>
        </div>

        {/* Game Breakdown */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
            <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
            Game Breakdown
          </div>
          <div className="space-y-3">
            {gameBreakdown.map((g, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.62rem] font-bold px-2 py-[2px] border uppercase" style={{ ...clipBadge, color: g.color, borderColor: `${g.color}40`, background: `${g.color}10` }}>{g.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.65rem] text-[#9A8F78]">{g.reports} reports</span>
                    <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {g.votes.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-[3px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(g.reports / maxReports) * 100}%`, background: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          <div className="text-[0.7rem] font-['Cinzel',serif] tracking-[0.12em] uppercase text-[#C8A96E] mb-4 flex items-center gap-2">
            <span className="w-[3px] h-4 bg-[#C8A96E] inline-block" />
            Activity — Last 12 Weeks
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
            {Array.from({ length: 12 }).map((_, week) => (
              <div key={week} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, day) => {
                  const val = heatmap[week * 7 + day];
                  return (
                    <div
                      key={day}
                      className="w-full rounded-[2px]"
                      style={{ paddingTop: '100%', background: heatColors[val] }}
                      title={`${val > 0 ? val + ' actions' : 'No activity'}`}
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
        </div>
      </div>
    </div>
  );
}