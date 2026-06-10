'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DiscussionCard } from './DiscussionCard';
import { RightWidgets } from './RightWidgets';
import { clipHex, clipHexSm, clipBtn, clipWidget, clipBadge } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';
import { subscribeToReportStats, fetchReportStats } from '@/lib/reportStats';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type CategoryFilter = 'all' | 'meta' | 'lore' | 'guide' | 'discovery' | 'help' | 'general';
type SortOption = 'hot' | 'latest' | 'top' | 'unanswered';

interface Discussion {
  id: number;
  title: string;
  body: string;
  game: string;
  category: string;
  author: string;
  initials: string;
  replies: number;
  likes: number;
  views: number;
  date: string;
  pinned: boolean;
  hot: boolean;
  tags: string[];
}

// Icon Components
const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>);
const HexIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>);
const HexDotIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>);
const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>);
const DiamondIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>);
const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>);
const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const InfoIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>);

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">{children}</div>;
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px] ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>{children}</span>
  );
}

function NavItem({ href, icon, label, badge, isNew }: { href?: string; icon: React.ReactNode; label: string; badge?: string; isNew?: boolean }) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative font-['Rajdhani',sans-serif] ${isActive ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = (<>{isActive && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}<span className="w-4 h-4 shrink-0">{icon}</span><span className="flex-1">{label}</span>{badge && <NavBadge>{badge}</NavBadge>}{isNew && <NavBadge variant="new">New</NavBadge>}</>);
  if (href) return <Link href={href} className={cls} style={clipHex}>{inner}</Link>;
  return <div className={cls} style={clipHex}>{inner}</div>;
}

const discussionsData: Discussion[] = [
  { id: 1, title: "Apakah The Hunt adalah path terbaik untuk DPS di HSR 3.2?", body: "Setelah nemuin build baru buat Acheron + Sunday combo, kayaknya meta DPS sekarang udah beda banget. Ada yang udah coba full Hunt team di MoC 12?", game: "hsr", category: "meta", author: "QuantumGale", initials: "QG", replies: 48, likes: 124, views: 1820, date: "32 menit lalu", pinned: true, hot: true, tags: ["Meta", "Hunt", "MoC"] },
  { id: 2, title: "Natlan Archon Quest Act III — Prediksi lore & ending teori", body: "Setelah Act II, banyak hints soal asal usul Pyro Archon. Ini beberapa teori yang aku kumpulin dari dialog tersembunyi...", game: "gi", category: "lore", author: "SilverWolf_Fan", initials: "SW", replies: 73, likes: 298, views: 4130, date: "1 jam lalu", pinned: false, hot: true, tags: ["Lore", "Natlan", "Spoiler"] },
  { id: 3, title: "ZZZ Patch 1.4 — Tier list Bangboo terbaru versi komunitas", body: "Setelah buff Bangboo di 1.4, urutan tier udah berubah drastis. Baihu naik ke S tier menurut mayoritas voting komunitas.", game: "zzz", category: "guide", author: "ImaginaryRift", initials: "IR", replies: 35, likes: 87, views: 960, date: "2 jam lalu", pinned: false, hot: false, tags: ["Tier List", "Bangboo", "1.4"] },
  { id: 4, title: "Elysian Realm Season 7 — Lineup ELF terbaik tanpa limited?", body: "Buat yang F2P atau skip banner limited, ELF mana yang paling worth buat ER Season 7? Sharing pengalaman dari sini...", game: "hi3", category: "guide", author: "TrailBossKai", initials: "TK", replies: 29, likes: 61, views: 740, date: "4 jam lalu", pinned: false, hot: false, tags: ["Elysian Realm", "F2P", "Guide"] },
  { id: 5, title: "Robin vs Sunday — Siapa support terbaik untuk team ComposurE?", body: "Udah test dua-duanya di Pure Fiction dan MOC. Hasilnya cukup mengejutkan. Sunday masih unggul di mono-element, tapi Robin lebih fleksibel...", game: "hsr", category: "meta", author: "Cocolia_Arc", initials: "CA", replies: 91, likes: 342, views: 5670, date: "5 jam lalu", pinned: false, hot: true, tags: ["Robin", "Sunday", "Support"] },
  { id: 6, title: "Hidden Achievement di Sumeru yang mungkin belum kamu temukan", body: "Setelah grinding hampir 200 jam di Sumeru, aku nemuin beberapa achievement tersembunyi yang bahkan guide besar belum bahas. Thread ini bakal diupdate terus.", game: "gi", category: "discovery", author: "VoidHunter_X", initials: "VH", replies: 54, likes: 176, views: 3200, date: "6 jam lalu", pinned: false, hot: false, tags: ["Achievement", "Sumeru", "Hidden"] },
  { id: 7, title: "HoloFest Stage 5 — Strategi skip tanpa pull karakter baru?", body: "Udah 3 kali wipe di Stage 5 karena enemy shield mechanic. Ada yang berhasil clear pake roster lama? Minta saran.", game: "zzz", category: "help", author: "Mei_Stellaron", initials: "MS", replies: 22, likes: 45, views: 520, date: "8 jam lalu", pinned: false, hot: false, tags: ["HoloFest", "Help", "Strategy"] },
  { id: 8, title: "Kesan pertama Honkai Impact 3rd setelah Chapter 35 — Worth it?", body: "Baru selesai Chapter 35 setelah hiatus panjang. Ceritanya lebih gelap dari yang aku ekspektasi. Story direction-nya sekarang gimana menurut veteran?", game: "hi3", category: "general", author: "AstreaN_7", initials: "AN", replies: 17, likes: 39, views: 430, date: "10 jam lalu", pinned: false, hot: false, tags: ["Story", "Chapter 35", "Discussion"] },
];

const gameLabels: Record<string, string> = { all: 'All Games', hsr: 'Honkai: Star Rail', gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd' };
const gameAccentMap: Record<GameFilter, string> = { all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A' };
const categoryMap: Record<string, { label: string }> = { meta: { label: 'Meta' }, lore: { label: 'Lore' }, guide: { label: 'Guide' }, discovery: { label: 'Discovery' }, help: { label: 'Help' }, general: { label: 'General' } };

export function DiscussionClient() {
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User state
  const [user, setUser] = useState<{ username: string; level: number; totalReports: number; initials: string; xp: number } | null>(null);
  const [totalReports, setTotalReports] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({ guide: 0, event: 0, puzzle: 0, build: 0 });
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } });
      if (response.ok) {
        const data = await response.json();
        setUser({ username: data.username, level: data.level || 1, totalReports: data.totalReports || 0, initials: data.initials || data.username?.slice(0, 2).toUpperCase() || 'TB', xp: data.xp || 0 });
        if (data.avatarPhoto) setAvatarPhoto(data.avatarPhoto);
        else { const saved = localStorage.getItem('userAvatar'); if (saved) setAvatarPhoto(saved); }
        if (data.bannerPhoto) setBannerPhoto(data.bannerPhoto);
        else { const saved = localStorage.getItem('userBanner'); if (saved) setBannerPhoto(saved); }
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarPhoto(savedAvatar);
        const savedBanner = localStorage.getItem('userBanner');
        if (savedBanner) setBannerPhoto(savedBanner);
      }
    } catch (error) { console.error('Error fetching user:', error); }
  };

  useEffect(() => {
    const unsubscribe = subscribeToReportStats((stats) => { setTotalReports(stats.totalReports); setCategoryCounts(stats.categoryCounts); });
    fetchUser();
    fetchReportStats();
    const handleRefresh = () => { fetchReportStats(); fetchUser(); };
    window.addEventListener('refreshSidebarStats', handleRefresh);
    window.addEventListener('profileUpdated', handleRefresh);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => { unsubscribe(); window.removeEventListener('refreshSidebarStats', handleRefresh); window.removeEventListener('profileUpdated', handleRefresh); clearTimeout(timer); };
  }, []);

  const accentColor = gameAccentMap[activeGame];
  const formattedTotal = totalReports >= 1000 ? `${(totalReports / 1000).toFixed(1)}K` : totalReports.toString();
  const formatCount = (count: number) => count.toString();
  const currentLevelXP = user ? (user.level - 1) * 100 : 0;
  const nextLevelXP = user ? user.level * 100 : 100;
  const xpProgress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const aMap: Record<string, string> = { all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]', hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]', gi: 'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]', zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]', hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]' };
    const hMap: Record<string, string> = { all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]', hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]', gi: 'hover:border-[#6DD18A] hover:text-[#6DD18A]', zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]', hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]' };
    return `${base} ${activeGame === g ? aMap[g] : hMap[g]}`;
  };

  const filteredDisc = discussionsData.filter(d => {
    const gMatch = activeGame === 'all' || d.game === activeGame;
    const cMatch = activeCategory === 'all' || d.category === activeCategory;
    const sMatch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return gMatch && cMatch && sMatch;
  }).sort((a, b) => {
    if (activeSort === 'hot') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.views - a.views;
    if (activeSort === 'top') return b.likes - a.likes;
    if (activeSort === 'unanswered') return a.replies - b.replies;
    return 0;
  });

  if (loading) return <LoadingAnimation message="LOADING DISCUSSION BOARD..." />;

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)` }} />

      {/* ── SIDEBAR (seperti SidebarAllReport) ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
        <div className="relative">
          <div className="h-[100px] w-full relative overflow-hidden" style={{ background: bannerPhoto ? `url(${bannerPhoto}) center/cover no-repeat` : 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 40%, #0a1a20 100%)' }}>
            {!bannerPhoto && Array.from({ length: 15 }).map((_, i) => (<div key={i} className="absolute rounded-full bg-white" style={{ width: i % 3 === 0 ? '2px' : '1px', height: i % 3 === 0 ? '2px' : '1px', top: `${10 + (i * 17) % 80}%`, left: `${5 + (i * 23) % 90}%`, opacity: 0.1 + (i % 5) * 0.08 }} />))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1220] via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-3 left-5 z-10">
            <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
              <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/><circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/></svg>
              Hoyoverse Hub
            </Link>
          </div>
          <div className="absolute bottom-3 right-5 z-10">
            <div className="text-[0.55rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[2px] border" style={{ ...clipBadge, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.08)' }}>● DISCUSSION</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" icon={<GridIcon />} label="Dashboard" />
          <NavItem href="/UserHoyo/all-report" icon={<HexIcon />} label="All Reports" badge={formattedTotal || "0"} />
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" icon={<HexDotIcon />} label="Mission &amp; Quest" badge={formatCount(categoryCounts.guide)} />
          <NavItem href="/UserHoyo/event" icon={<CalendarIcon />} label="Event Seasonal" badge={formatCount(categoryCounts.event)} isNew={categoryCounts.event > 0} />
          <NavItem href="/UserHoyo/puzzle" icon={<DiamondIcon />} label="Puzzle &amp; Riddles" badge={formatCount(categoryCounts.puzzle)} />
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" icon={<UsersIcon />} label="Discussion" />
          <NavItem href="/UserHoyo/leaderboard" icon={<StarIcon />} label="Leaderboard" />
          <NavItem href="/UserHoyo/profile" icon={<PersonIcon />} label="My Profile" />
          <NavItem href="/UserHoyo/settings" icon={<InfoIcon />} label="Settings" />
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <Link href="/UserHoyo/profile" className="flex items-center gap-[10px] no-underline group">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0 overflow-hidden">
              {avatarPhoto ? <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" /> : (user?.initials || 'TB')}
            </div>
            <div className="flex-1">
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors">{user?.username || 'Trailblazer'}</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.{user?.level || 1} · {user?.totalReports || 0} reports</div>
              <div className="mt-1 h-[2px] bg-[rgba(200,169,110,0.1)] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#C8A96E] to-[#EDD28A] transition-all duration-300" style={{ width: `${Math.min(Math.max(xpProgress, 0), 100)}%` }} /></div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div><div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Discussion</div><div className="text-[#5A5248] text-[0.75rem] mt-[2px]">{gameLabels[activeGame]} · {filteredDisc.length} thread aktif</div></div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]" style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input type="text" placeholder="Cari diskusi..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
            </div>
            <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none" style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>+ Buat Thread</button>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="grid grid-cols-4 gap-4 mb-8 max-[1100px]:grid-cols-2">
            {[
              { label: 'Total Thread', value: '3,842', change: '↑ +28 hari ini', accent: '#C8A96E' },
              { label: 'Aktif Bulan Ini', value: '1,204', change: 'Thread dibalas baru', accent: '#4ECDC4' },
              { label: 'Members', value: '31.6K', change: '● 420 online kini', accent: '#6DD18A' },
              { label: 'Post Hari Ini', value: '847', change: '↑ +12% dari kemarin', accent: '#A855F7' },
            ].map((card, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: card.accent }} />
                <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-[0.5rem]">{card.label}</div>
                <div className="font-['Space_Mono',monospace] text-[1.6rem] font-bold" style={{ color: card.accent }}>{card.value}</div>
                <div className="text-[0.72rem] text-[#4ECDC4] mt-1">{card.change}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (<span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setActiveGame(g)}>{gameLabels[g]}</span>))}
          </div>

          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex gap-[5px] flex-wrap">
              {(['all', 'meta', 'lore', 'guide', 'discovery', 'help', 'general'] as const).map(c => (
                <button key={c} style={clipHexSm} onClick={() => setActiveCategory(c)} className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif] ${activeCategory === c ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]' : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#9A8F78]'}`}>{c === 'all' ? 'Semua' : categoryMap[c]?.label ?? c}</button>
              ))}
            </div>
            <div className="flex gap-[5px]">
              {(['hot', 'latest', 'top', 'unanswered'] as const).map(s => (
                <button key={s} style={clipHexSm} onClick={() => setActiveSort(s)} className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif] ${activeSort === s ? 'bg-[rgba(78,205,196,0.08)] border-[#4ECDC4] text-[#4ECDC4]' : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.25)] hover:text-[#9A8F78]'}`}>{s === 'hot' ? '🔥 Hot' : s === 'latest' ? '⏱ Terbaru' : s === 'top' ? '⭐ Top' : '💬 Unanswered'}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            <div>
              {filteredDisc.length === 0 ? (<div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-12 text-center" style={clipWidget}><div className="text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">Tidak ada diskusi ditemukan untuk filter ini.</div></div>) : (filteredDisc.map(disc => (<DiscussionCard key={disc.id} disc={disc} accentColor={accentColor} />)))}
              {filteredDisc.length > 0 && (<div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2, 3, '...', 12].map((p, i) => (<button key={i} style={clipHexSm} className={`w-9 h-9 font-['Space_Mono',monospace] text-[0.75rem] border cursor-pointer transition-all duration-200 ${p === 1 ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]' : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'}`}>{p}</button>))}
                <button style={clipHexSm} className="px-4 h-9 font-['Space_Mono',monospace] text-[0.75rem] border cursor-pointer transition-all duration-200 bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]">Next →</button>
              </div>)}
            </div>
            <RightWidgets accentColor={accentColor} activeGame={activeGame} />
          </div>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space_Mono&display=swap'); .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
}