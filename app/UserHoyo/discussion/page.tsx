'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const discussionsData = [
  {
    id: 1,
    title: "Best team comp for Memory of Chaos Floor 12?",
    game: "hsr",
    category: "strategy",
    author: "QuantumGale",
    initials: "QG",
    content: "I'm struggling with the new MoC floor 12. Currently using Acheron, Pela, Silver Wolf, and Fu Xuan but can't 3-star the second half...",
    replies: 47,
    views: 892,
    likes: 156,
    lastReply: "12m ago",
    isPinned: true,
    isHot: true,
  },
  {
    id: 2,
    title: "Natlan Hidden Chest Locations - Complete Map",
    game: "gi",
    category: "exploration",
    author: "VoidHunter_X",
    initials: "VH",
    content: "I've compiled all 127 hidden chest locations in Natlan. Here's an interactive map with screenshots for each location...",
    replies: 89,
    views: 2341,
    likes: 423,
    lastReply: "28m ago",
    isPinned: true,
    isHot: false,
  },
  {
    id: 3,
    title: "Ellen vs Zhu Yuan - Who to pull for endgame?",
    game: "zzz",
    category: "discussion",
    author: "Mei_Stellaron",
    initials: "MS",
    content: "Both are top-tier DPS but they have different playstyles. Ellen excels in burst windows while Zhu Yuan offers consistent damage...",
    replies: 134,
    views: 3567,
    likes: 289,
    lastReply: "1h ago",
    isPinned: false,
    isHot: true,
  },
  {
    id: 4,
    title: "Elysian Realm Remembrance Signet Priority Guide",
    game: "hi3",
    category: "guide",
    author: "TrailBossKai",
    initials: "TK",
    content: "With the new difficulty added, here's my updated signet priority for each valkyrja. Focus on Kevin signets for physical teams...",
    replies: 23,
    views: 456,
    likes: 78,
    lastReply: "2h ago",
    isPinned: false,
    isHot: false,
  },
  {
    id: 5,
    title: "Robin E2 vs E1 - Is it worth the investment?",
    game: "hsr",
    category: "theory",
    author: "Cocolia_Arc",
    initials: "CA",
    content: "Running numbers on Robin's eidolons. E1 gives 25% more DMG boost while E2 extends her Concerto state. For most players...",
    replies: 67,
    views: 1234,
    likes: 198,
    lastReply: "3h ago",
    isPinned: false,
    isHot: true,
  },
  {
    id: 6,
    title: "Chasca C0 vs C2 Comparison with calcs",
    game: "gi",
    category: "theory",
    author: "SilverWolf_Fan",
    initials: "SW",
    content: "Detailed DPS calculations for Chasca at different constellation levels. C2 increases her plunge damage by approximately 35%...",
    replies: 42,
    views: 876,
    likes: 145,
    lastReply: "4h ago",
    isPinned: false,
    isHot: false,
  },
  {
    id: 7,
    title: "Hollow Zero District 7 - First Clear Guide",
    game: "zzz",
    category: "guide",
    author: "ImaginaryRift",
    initials: "IR",
    content: "Just cleared the new District 7 content. Here's what worked for me - bring at least one support with shields because...",
    replies: 31,
    views: 567,
    likes: 89,
    lastReply: "5h ago",
    isPinned: false,
    isHot: false,
  },
  {
    id: 8,
    title: "Lore Discussion: Connection between Honkai universes",
    game: "hi3",
    category: "lore",
    author: "AstreaN_7",
    initials: "AN",
    content: "After the latest chapter, I think there's a clear connection between the Sea of Quanta and the Imaginary Tree. Evidence suggests...",
    replies: 156,
    views: 4523,
    likes: 567,
    lastReply: "6h ago",
    isPinned: false,
    isHot: true,
  },
];

const trendingTopics = [
  { title: "Acheron rerun speculation", game: "hsr", posts: 234 },
  { title: "5.4 Livestream discussion", game: "gi", posts: 189 },
  { title: "1.5 Banner predictions", game: "zzz", posts: 156 },
  { title: "Part 2 Chapter release", game: "hi3", posts: 98 },
  { title: "Robin team building", game: "hsr", posts: 87 },
];

const activeUsers = [
  { name: "QuantumGale", initials: "QG", posts: 47, game: "hsr" },
  { name: "VoidHunter_X", initials: "VH", posts: 39, game: "gi" },
  { name: "Mei_Stellaron", initials: "MS", posts: 35, game: "zzz" },
  { name: "Cocolia_Arc", initials: "CA", posts: 28, game: "hsr" },
  { name: "TrailBossKai", initials: "TK", posts: 24, game: "hi3" },
];

const categoryStats = [
  { label: "Discussion", count: 1243, color: "#C8A96E" },
  { label: "Guide", count: 876, color: "#4ECDC4" },
  { label: "Theory", count: 654, color: "#A855F7" },
  { label: "Lore", count: 432, color: "#E05C7A" },
  { label: "Strategy", count: 321, color: "#6DD18A" },
];

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type CategoryFilter = 'all' | 'discussion' | 'guide' | 'theory' | 'lore' | 'strategy' | 'exploration';
type SortOption = 'latest' | 'hot' | 'top' | 'unanswered';

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail', className: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
  gi: { label: 'Genshin', className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless', className: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
};

const categoryBadgeMap: Record<string, string> = {
  discussion: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
  guide: 'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
  theory: 'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
  lore: 'bg-[rgba(224,92,122,0.12)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]',
  strategy: 'bg-[rgba(109,209,138,0.12)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]',
  exploration: 'bg-[rgba(200,169,110,0.12)] text-[#F0D080] border border-[rgba(200,169,110,0.3)]',
};

// ─── CLIP-PATH STYLE OBJECTS ─────────────────────────────────────────────────

const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipHexSm = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipCard = { clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' } as React.CSSProperties;

// ─── SHARED NAV COMPONENTS ────────────────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span
      className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
        ${variant === 'new'
          ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]'
          : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

function NavItem({
  children, href, active, onClick,
}: {
  children: React.ReactNode;
  href?: string;
  active: boolean;
  onClick?: () => void;
}) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold
    tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    font-['Rajdhani',sans-serif]
    ${active
      ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
      : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = (
    <>
      {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
      {children}
    </>
  );
  if (href) return <a href={href} className={cls} style={clipHex}>{inner}</a>;
  return <div className={cls} style={clipHex} onClick={onClick}>{inner}</div>;
}

// ─── BADGE HELPERS ────────────────────────────────────────────────────────────

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${categoryBadgeMap[category] ?? ''}`} style={clipBadge}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

// ─── DISCUSSION CARD ──────────────────────────────────────────────────────────

function DiscussionCard({ discussion }: { discussion: typeof discussionsData[0] }) {
  return (
    <div 
      className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-3 hover:border-[rgba(200,169,110,0.3)] transition-all duration-200 cursor-pointer group"
      style={clipCard}
    >
      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <button className="text-[#5A5248] hover:text-[#4ECDC4] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3L13 9H3L8 3Z" fill="currentColor"/>
            </svg>
          </button>
          <span className="font-['Space_Mono',monospace] text-[0.9rem] text-[#4ECDC4] font-bold">{discussion.likes}</span>
          <button className="text-[#5A5248] hover:text-[#C84040] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 13L3 7H13L8 13Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            {discussion.isPinned && (
              <span className="text-[#C8A96E] text-[0.65rem] font-bold tracking-[0.1em] uppercase flex items-center gap-1">
                <PinIcon /> Pinned
              </span>
            )}
            {discussion.isHot && (
              <span className="text-[#E05C7A] text-[0.65rem] font-bold tracking-[0.1em] uppercase flex items-center gap-1">
                <FireIcon /> Hot
              </span>
            )}
          </div>
          
          <h3 className="text-[1rem] font-semibold text-[#E8E0CC] mb-2 group-hover:text-[#C8A96E] transition-colors leading-snug">
            {discussion.title}
          </h3>
          
          <p className="text-[0.82rem] text-[#9A8F78] mb-3 line-clamp-2 leading-relaxed">
            {discussion.content}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <GameBadge game={discussion.game} />
            <CategoryBadge category={discussion.category} />
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-[6px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.5rem] text-[#C8A96E] font-bold">
                  {discussion.initials}
                </div>
                <span className="text-[0.75rem] text-[#9A8F78]">{discussion.author}</span>
              </div>
              
              <span className="text-[#5A5248] text-[0.65rem]">·</span>
              
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248]">
                <CommentIcon /> {discussion.replies}
              </span>
              
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248]">
                <EyeIcon /> {discussion.views}
              </span>
              
              <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                {discussion.lastReply}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT WIDGETS ────────────────────────────────────────────────────────────

function RightWidgets({ accentColor }: { accentColor: string }) {
  return (
    <div>
      {/* Create Discussion CTA */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <div className="text-center">
          <div className="font-['Cinzel',serif] text-[0.9rem] font-semibold text-[#E8E0CC] mb-2">Start a Discussion</div>
          <p className="text-[0.75rem] text-[#9A8F78] mb-4">Share your thoughts, ask questions, or help fellow travelers</p>
          <button 
            className="w-full px-[18px] py-[10px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
            style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
          >
            + New Thread
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Topics</WidgetTitle>
        {trendingTopics.map((topic, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0 cursor-pointer hover:bg-[rgba(200,169,110,0.03)] -mx-2 px-2 transition-colors">
            <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#5A5248] min-w-[20px]">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <span className="text-[0.82rem] text-[#9A8F78] hover:text-[#E8E0CC] transition-colors block truncate">{topic.title}</span>
              <div className="flex items-center gap-2 mt-[2px]">
                <GameBadge game={topic.game} />
                <span className="text-[0.65rem] text-[#5A5248]">{topic.posts} posts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Contributors */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Active Contributors</WidgetTitle>
        {activeUsers.map((user, i) => (
          <div key={i} className="flex items-center gap-[10px] py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0">
            <div 
              className={`w-[28px] h-[28px] rounded-full flex items-center justify-center font-['Cinzel',serif] text-[0.55rem] font-bold shrink-0 border`}
              style={{
                background: `rgba(${user.game === 'hsr' ? '78,205,196' : user.game === 'gi' ? '109,209,138' : user.game === 'zzz' ? '168,85,247' : '224,92,122'},0.1)`,
                borderColor: user.game === 'hsr' ? '#4ECDC4' : user.game === 'gi' ? '#6DD18A' : user.game === 'zzz' ? '#A855F7' : '#E05C7A',
                color: user.game === 'hsr' ? '#4ECDC4' : user.game === 'gi' ? '#6DD18A' : user.game === 'zzz' ? '#A855F7' : '#E05C7A',
              }}
            >
              {user.initials}
            </div>
            <div className="flex-1">
              <span className="text-[0.82rem] text-[#E8E0CC] font-semibold">{user.name}</span>
            </div>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{user.posts} posts</span>
          </div>
        ))}
      </div>

      {/* Category Stats */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Categories</WidgetTitle>
        {categoryStats.map((cat, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(200,169,110,0.06)] last:border-b-0 last:pb-0 cursor-pointer hover:bg-[rgba(200,169,110,0.03)] -mx-2 px-2 transition-colors">
            <span className="w-[6px] h-[6px] rounded-sm" style={{ background: cat.color }} />
            <span className="flex-1 text-[0.82rem] text-[#9A8F78]">{cat.label}</span>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248]">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* Community Guidelines */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <WidgetTitle>Community Guidelines</WidgetTitle>
        <ul className="text-[0.75rem] text-[#9A8F78] space-y-2 list-none p-0 m-0">
          <li className="flex items-start gap-2">
            <span className="text-[#C8A96E]">▸</span>
            Be respectful to fellow travelers
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C8A96E]">▸</span>
            Use spoiler tags for story content
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C8A96E]">▸</span>
            No leaks from beta versions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C8A96E]">▸</span>
            Stay on topic in discussions
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Discussion() {
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('hot');

  const filteredDiscussions = discussionsData.filter(d => {
    const matchGame = activeGame === 'all' || d.game === activeGame;
    const matchCategory = activeCategory === 'all' || d.category === activeCategory;
    return matchGame && matchCategory;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case 'hot': return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0) || b.likes - a.likes;
      case 'top': return b.likes - a.likes;
      case 'latest': return 0; // Already sorted by date in data
      case 'unanswered': return a.replies - b.replies;
      default: return 0;
    }
  });

  const gameAccentMap: Record<GameFilter, string> = {
    all: '#C8A96E',
    hsr: '#4ECDC4',
    gi: '#6DD18A',
    zzz: '#A855F7',
    hi3: '#E05C7A',
  };
  const accentColor = gameAccentMap[activeGame];

  const gameLabels: Record<string, string> = {
    all: 'All Games', hsr: 'Honkai: Star Rail',
    gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
  };

  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const activeMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi: 'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hoverMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi: 'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${activeGame === g ? activeMap[g] : hoverMap[g]}`;
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG gradients */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)`,
      }} />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        {/* Header */}
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="/UserHoyo" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>

          <NavItem href="/UserHoyo" active={false}>
            <GridIcon /> Dashboard
          </NavItem>

          <NavItem href="/UserHoyo/all-report" active={false}>
            <HexIcon /> All Reports
            <NavBadge>1.2K</NavBadge>
          </NavItem>

          <NavGroupLabel>Category</NavGroupLabel>

          <NavItem href="/UserHoyo/mission&quest" active={false}>
            <HexDotIcon /> Mission &amp; Quest
            <NavBadge>482</NavBadge>
          </NavItem>

          <NavItem href="/UserHoyo/event" active={false}>
            <CalendarIcon /> Event Seasonal
            <NavBadge variant="new">New</NavBadge>
          </NavItem>

          <NavItem href="/UserHoyo/puzzle&ridldles" active={false}>
            <DiamondIcon /> Puzzle &amp; Riddles
            <NavBadge>324</NavBadge>
          </NavItem>

          <NavGroupLabel>Community</NavGroupLabel>

          <NavItem active={true}>
            <UsersIcon /> Discussion
          </NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">
              TB
            </div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">Trailblazer_01</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Discussion Forum</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              {gameLabels[activeGame]} · {filteredDiscussions.length} threads
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]" style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search discussions..." className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
            </div>
            <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
              + New Thread
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-6 max-[1100px]:grid-cols-2">
            {[
              { label: 'Total Threads', value: '8,432', change: '↑ +156 this week', accent: '#C8A96E' },
              { label: 'Active Today', value: '847', change: '↑ +23% from yesterday', accent: '#4ECDC4' },
              { label: 'Total Replies', value: '124.5K', change: '↑ +2.3K this week', accent: '#A855F7' },
              { label: 'Online Now', value: '1,247', change: 'Peak today: 2,140', accent: '#6DD18A' },
            ].map((card, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: card.accent }} />
                <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-[0.5rem]">{card.label}</div>
                <div className="font-['Space_Mono',monospace] text-[1.5rem] font-bold" style={{ color: card.accent }}>{card.value}</div>
                <div className="text-[0.7rem] text-[#4ECDC4] mt-1">{card.change}</div>
              </div>
            ))}
          </div>

          {/* Game Pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'hsr', 'gi', 'zzz', 'hi3'] as const).map(g => (
              <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => setActiveGame(g)}>
                {gameLabels[g]}
              </span>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-[1fr_300px] gap-6 max-[1100px]:grid-cols-1">
            {/* Discussions List */}
            <div>
              {/* Sort & Filter Bar */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex gap-[6px]">
                  {(['all', 'discussion', 'guide', 'theory', 'lore', 'strategy'] as const).map(cat => (
                    <button
                      key={cat}
                      style={clipHexSm}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase
                        transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                        ${activeCategory === cat
                          ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                          : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#9A8F78] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'}`}
                    >
                      {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[0.72rem] text-[#5A5248]">Sort by:</span>
                  {(['hot', 'latest', 'top', 'unanswered'] as const).map(sort => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-[10px] py-[4px] text-[0.7rem] font-semibold tracking-[0.05em] uppercase
                        transition-all duration-200 cursor-pointer border-none bg-transparent
                        ${sortBy === sort ? 'text-[#C8A96E]' : 'text-[#5A5248] hover:text-[#9A8F78]'}`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussion Cards */}
              {filteredDiscussions.length === 0 ? (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-12 text-center" style={clipCard}>
                  <div className="text-[#5A5248] font-['Space_Mono',monospace] text-[0.85rem]">
                    No discussions found for this filter.
                  </div>
                </div>
              ) : (
                filteredDiscussions.map(discussion => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))
              )}

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, '...', 42].map((page, i) => (
                  <button
                    key={i}
                    style={clipHexSm}
                    className={`px-[12px] py-[5px] text-[0.75rem] font-bold transition-all duration-200 border cursor-pointer
                      ${page === 1
                        ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                        : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#9A8F78] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Widgets */}
            <RightWidgets accentColor={accentColor} />
          </div>
        </div>
      </main>

      {/* Google Fonts */}
      <style>{`
        @import url('[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap)');
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/>
  </svg>
);
const HexIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const HexDotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="0.7" fill="currentColor"/>
  </svg>
);
const CommentIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 2.5C1 1.67 1.67 1 2.5 1H9.5C10.33 1 11 1.67 11 2.5V7.5C11 8.33 10.33 9 9.5 9H4L1 11V2.5Z" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 6C1 6 3 2 6 2C9 2 11 6 11 6C11 6 9 10 6 10C3 10 1 6 1 6Z" stroke="currentColor" strokeWidth="1"/>
    <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const PinIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 1V6M3 3H7M5 6L3 9M5 6L7 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
const FireIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 1C5 1 7 3 7 5C7 7 5.5 8 5 9C4.5 8 3 7 3 5C3 3 5 1 5 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
