'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── THEME CONSTANTS ────────────────────────────────────────────────────────
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' };
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' };
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' };
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface TagDetail {
  id: number;
  name: string;
  game: string;
  category: string;
  posts_count: number;
  trend_percentage: number;
  is_hot: boolean;
  is_new: boolean;
  description?: string;
}

interface ReportItem {
  id: number;
  title: string;
  type: string;
  game: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
}

// ─── GAME CONSTANTS ─────────────────────────────────────────────────────────
const GAME_COLORS: Record<string, string> = {
  hsr: '#4ECDC4',
  gi:  '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

const GAME_LABELS: Record<string, string> = {
  hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact',
  zzz: 'Zenless Zone Zero',
  hi3: 'Honkai Impact 3rd',
};

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────
function GameBadge({ game }: { game: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    hsr: { label: 'Star Rail',  cls: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
    gi:  { label: 'Genshin',    cls: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
    zzz: { label: 'Zenless',    cls: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
    hi3: { label: 'Honkai 3rd', cls: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
  };
  const g = map[game] || map.hsr;
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase ${g.cls}`}
      style={clipBadge}
    >
      {g.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    guide: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    event: 'bg-green-500/20 text-green-400 border-green-500/30',
    puzzle: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    build: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  return (
    <span className={`px-2 py-[3px] text-[0.6rem] font-bold uppercase rounded ${map[type] || map.guide}`}>
      {type}
    </span>
  );
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (hasHalf) stars.push('½');
  while (stars.length < 5) stars.push('☆');
  return stars.join('');
}

// ─── SIDEBAR COMPONENT ──────────────────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();
  
  const NavItem = ({ href, icon, label, badge, isNew }: { href: string; icon: React.ReactNode; label: string; badge?: string; isNew?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 mb-[2px] relative font-['Rajdhani',sans-serif] ${isActive ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`} style={clipHex}>
        {isActive && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
        <span className="w-4 h-4 shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] bg-[rgba(200,169,110,0.15)] text-[#C8A96E]" style={clipBadge}>{badge}</span>}
        {isNew && <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]" style={clipBadge}>New</span>}
      </Link>
    );
  };

  const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>);
  const HexIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>);
  const HexDotIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>);
  const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>);
  const DiamondIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>);
  const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
  const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>);
  const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
  const InfoIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>);
  const TagIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h6l6 6-6 6-6-6V2z" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="1" fill="currentColor"/></svg>);

  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
      <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
        <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/><circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/></svg>
          Hoyoverse Hub
        </Link>
      </div>
      <nav className="flex-1 px-4 py-5">
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2">Main</div>
        <NavItem href="/UserHoyo/dashboard" icon={<GridIcon />} label="Dashboard" />
        <NavItem href="/UserHoyo/dashboard/all-report" icon={<HexIcon />} label="All Reports" badge="1.2K" />
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Category</div>
        <NavItem href="/UserHoyo/dashboard/mission&quest" icon={<HexDotIcon />} label="Mission & Quest" badge="482" />
        <NavItem href="/UserHoyo/dashboard/event" icon={<CalendarIcon />} label="Event Seasonal" isNew />
        <NavItem href="/UserHoyo/dashboard/puzzle" icon={<DiamondIcon />} label="Puzzle & Riddles" badge="324" />
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Explore</div>
        <NavItem href="/UserHoyo/dashboard/trending-tags" icon={<TagIcon />} label="Trending Tags" isNew />
        <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6">Community</div>
        <NavItem href="/UserHoyo/dashboard/discussion" icon={<UsersIcon />} label="Discussion" />
        <NavItem href="/UserHoyo/dashboard/leaderboard" icon={<StarIcon />} label="Leaderboard" />
        <NavItem href="/UserHoyo/dashboard/profile" icon={<PersonIcon />} label="My Profile" />
        <NavItem href="/UserHoyo/dashboard/settings" icon={<InfoIcon />} label="Settings" />
      </nav>
      <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
        <div className="flex items-center gap-[10px]">
          <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">TB</div>
          <div><div className="text-[0.85rem] font-semibold text-[#E8E0CC]">Trailblazer_01</div><div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div></div>
        </div>
      </div>
    </aside>
  );
}

// ─── DEFAULT DATA FALLBACK ──────────────────────────────────────────────────
const defaultReports: ReportItem[] = [
  { id: 1, title: 'Penacony Dreamscape Guide', type: 'guide', game: 'hsr', author: 'Trailblazer', initials: 'TB', rating: 4.8, votes: 1247, date: '2h ago', version: '2.0' },
  { id: 2, title: 'Arlecchino Boss Fight Strategy', type: 'guide', game: 'gi', author: 'Traveler', initials: 'TR', rating: 4.7, votes: 892, date: '5h ago', version: '4.5' },
  { id: 3, title: 'Hollow Zero Complete Guide', type: 'guide', game: 'zzz', author: 'Proxy', initials: 'PR', rating: 4.9, votes: 756, date: '1d ago', version: '1.2' },
];

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function TagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tagName = params.tagName as string;
  
  const [tag, setTag] = useState<TagDetail | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchTagDetail = async () => {
      try {
        // Fetch tag detail dari API
        const tagRes = await fetch(`${API_BASE_URL}/api/tags/${encodeURIComponent(tagName)}`);
        if (tagRes.ok) {
          const tagData = await tagRes.json();
          if (tagData.success && tagData.data) {
            setTag(tagData.data);
          } else {
            setTag({
              id: 1,
              name: tagName,
              game: 'hsr',
              category: 'General',
              posts_count: 1247,
              trend_percentage: 24.5,
              is_hot: true,
              is_new: false,
              description: `Explore all reports and guides related to ${tagName}.`
            });
          }
        } else {
          setTag({
            id: 1,
            name: tagName,
            game: 'hsr',
            category: 'General',
            posts_count: 1247,
            trend_percentage: 24.5,
            is_hot: true,
            is_new: false,
          });
        }

        // Fetch reports with this tag
        const reportsRes = await fetch(`${API_BASE_URL}/api/dashboard/reports?search=${encodeURIComponent(tagName)}&limit=20`);
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          if (reportsData.success && reportsData.reports) {
            setReports(reportsData.reports);
          } else {
            setReports(defaultReports);
          }
        } else {
          setReports(defaultReports);
        }
      } catch (error) {
        console.error('Error fetching tag detail:', error);
        setTag({
          id: 1,
          name: tagName,
          game: 'hsr',
          category: 'General',
          posts_count: 1247,
          trend_percentage: 24.5,
          is_hot: true,
          is_new: false,
        });
        setReports(defaultReports);
      } finally {
        setLoading(false);
      }
    };

    if (tagName) {
      fetchTagDetail();
    }
  }, [tagName]);

  const color = GAME_COLORS[tag?.game || 'hsr'] || '#C8A96E';
  const isRising = (tag?.trend_percentage || 0) > 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#050810' }}>
        <div className="text-[#C8A96E] font-['Space_Mono',monospace]">Loading tag details...</div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: '#050810' }}>
        <div className="text-[#E05C7A] text-4xl mb-4">404</div>
        <div className="text-[#9A8F78] mb-4">Tag "{tagName}" tidak ditemukan</div>
        <button onClick={() => router.back()} className="px-4 py-2 bg-[#C8A96E] text-black rounded-md cursor-pointer">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)` }} />
      
      <Sidebar />

      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div className="flex items-center gap-3">
            <Link href="/UserHoyo/dashboard" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.8rem] font-['Space_Mono',monospace]">Home</Link>
            <span className="text-[#5A5248]">/</span>
            <Link href="/UserHoyo/dashboard/trending-tags" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.8rem] font-['Space_Mono',monospace]">Trending Tags</Link>
            <span className="text-[#5A5248]">/</span>
            <span className="text-[#C8A96E] text-[0.8rem] font-['Space_Mono',monospace]">#{tag.name}</span>
          </div>
        </div>

        <div className="p-8 flex-1">
          {/* Tag Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="text-[2.5rem]">🏷️</div>
              <h1 className="font-['Cinzel',serif] text-[2rem] font-bold text-[#E8E0CC]">#{tag.name}</h1>
              {tag.is_hot && <span className="px-3 py-1 text-[0.7rem] font-bold bg-[rgba(200,169,110,0.15)] text-[#C8A96E] rounded-full">🔥 Hot</span>}
              {tag.is_new && <span className="px-3 py-1 text-[0.7rem] font-bold bg-[rgba(78,205,196,0.15)] text-[#4ECDC4] rounded-full">✨ New</span>}
            </div>
            <p className="text-[0.9rem] text-[#9A8F78] max-w-2xl mb-4">
              {tag.description || `Explore all reports, guides, and discussions related to ${tag.name}. Find the best tips and strategies from the community.`}
            </p>
            
            {/* Tag Stats */}
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wide">Game</div>
                <GameBadge game={tag.game} />
              </div>
              <div>
                <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wide">Category</div>
                <div className="text-[0.85rem] font-semibold" style={{ color }}>{tag.category}</div>
              </div>
              <div>
                <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wide">Total Posts</div>
                <div className="text-[1.1rem] font-bold font-['Space_Mono',monospace]" style={{ color }}>{tag.posts_count.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[0.65rem] text-[#5A5248] uppercase tracking-wide">Trend</div>
                <div className={`text-[1.1rem] font-bold font-['Space_Mono',monospace] ${isRising ? 'text-[#4ECDC4]' : 'text-[#E05C7A]'}`}>
                  {isRising ? '↑' : '↓'} {Math.abs(tag.trend_percentage).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <button
              onClick={() => setFollowing(f => !f)}
              className="mt-6 px-6 py-2 text-[0.85rem] font-bold uppercase tracking-wide transition-all cursor-pointer"
              style={{
                background: following ? `${color}20` : 'rgba(200,169,110,0.1)',
                border: `1px solid ${following ? color : 'rgba(200,169,110,0.3)'}`,
                color: following ? color : '#C8A96E',
                ...clipHexSm,
              }}
            >
              {following ? '✓ Following this tag' : '+ Follow this tag'}
            </button>
          </div>

          {/* Reports Section */}
          <div className="mt-8">
            <h2 className="font-['Cinzel',serif] text-[1.2rem] font-bold text-[#E8E0CC] mb-4 flex items-center gap-2">
              <span className="w-[4px] h-[16px] bg-[#C8A96E]" />
              Related Reports ({reports.length})
            </h2>

            {reports.length === 0 ? (
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-8 text-center text-[#5A5248]">
                No reports found for #{tag.name}. Be the first to create one!
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-4 rounded-lg hover:border-[rgba(200,169,110,0.3)] transition-all">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <TypeBadge type={report.type} />
                          <GameBadge game={report.game} />
                          <span className="text-[0.7rem] text-[#5A5248]">v{report.version}</span>
                        </div>
                        <h3 className="text-[1rem] font-semibold text-[#E8E0CC] mb-2 hover:text-[#C8A96E] transition-colors cursor-pointer">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#6A6058]">
                          <span>By {report.author}</span>
                          <span>⭐ {report.rating}</span>
                          <span>👍 {report.votes}</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[0.75rem] text-[#C8A96E]">{report.initials}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');`}</style>
    </div>
  );
}