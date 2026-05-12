'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const discussionsData = [
  {
    id: 1,
    title: "Apakah The Hunt adalah path terbaik untuk DPS di HSR 3.2?",
    body: "Setelah nemuin build baru buat Acheron + Sunday combo, kayaknya meta DPS sekarang udah beda banget. Ada yang udah coba full Hunt team di MoC 12?",
    game: "hsr", category: "meta", author: "QuantumGale", initials: "QG",
    replies: 48, likes: 124, views: 1820, date: "32 menit lalu", pinned: true, hot: true,
    tags: ["Meta", "Hunt", "MoC"],
  },
  {
    id: 2,
    title: "Natlan Archon Quest Act III — Prediksi lore & ending teori",
    body: "Setelah Act II, banyak hints soal asal usul Pyro Archon. Ini beberapa teori yang aku kumpulin dari dialog tersembunyi...",
    game: "gi", category: "lore", author: "SilverWolf_Fan", initials: "SW",
    replies: 73, likes: 298, views: 4130, date: "1 jam lalu", pinned: false, hot: true,
    tags: ["Lore", "Natlan", "Spoiler"],
  },
  {
    id: 3,
    title: "ZZZ Patch 1.4 — Tier list Bangboo terbaru versi komunitas",
    body: "Setelah buff Bangboo di 1.4, urutan tier udah berubah drastis. Baihu naik ke S tier menurut mayoritas voting komunitas.",
    game: "zzz", category: "guide", author: "ImaginaryRift", initials: "IR",
    replies: 35, likes: 87, views: 960, date: "2 jam lalu", pinned: false, hot: false,
    tags: ["Tier List", "Bangboo", "1.4"],
  },
  {
    id: 4,
    title: "Elysian Realm Season 7 — Lineup ELF terbaik tanpa limited?",
    body: "Buat yang F2P atau skip banner limited, ELF mana yang paling worth buat ER Season 7? Sharing pengalaman dari sini...",
    game: "hi3", category: "guide", author: "TrailBossKai", initials: "TK",
    replies: 29, likes: 61, views: 740, date: "4 jam lalu", pinned: false, hot: false,
    tags: ["Elysian Realm", "F2P", "Guide"],
  },
  {
    id: 5,
    title: "Robin vs Sunday — Siapa support terbaik untuk team ComposurE?",
    body: "Udah test dua-duanya di Pure Fiction dan MOC. Hasilnya cukup mengejutkan. Sunday masih unggul di mono-element, tapi Robin lebih fleksibel...",
    game: "hsr", category: "meta", author: "Cocolia_Arc", initials: "CA",
    replies: 91, likes: 342, views: 5670, date: "5 jam lalu", pinned: false, hot: true,
    tags: ["Robin", "Sunday", "Support"],
  },
  {
    id: 6,
    title: "Hidden Achievement di Sumeru yang mungkin belum kamu temukan",
    body: "Setelah grinding hampir 200 jam di Sumeru, aku nemuin beberapa achievement tersembunyi yang bahkan guide besar belum bahas. Thread ini bakal diupdate terus.",
    game: "gi", category: "discovery", author: "VoidHunter_X", initials: "VH",
    replies: 54, likes: 176, views: 3200, date: "6 jam lalu", pinned: false, hot: false,
    tags: ["Achievement", "Sumeru", "Hidden"],
  },
  {
    id: 7,
    title: "HoloFest Stage 5 — Strategi skip tanpa pull karakter baru?",
    body: "Udah 3 kali wipe di Stage 5 karena enemy shield mechanic. Ada yang berhasil clear pake roster lama? Minta saran.",
    game: "zzz", category: "help", author: "Mei_Stellaron", initials: "MS",
    replies: 22, likes: 45, views: 520, date: "8 jam lalu", pinned: false, hot: false,
    tags: ["HoloFest", "Help", "Strategy"],
  },
  {
    id: 8,
    title: "Kesan pertama Honkai Impact 3rd setelah Chapter 35 — Worth it?",
    body: "Baru selesai Chapter 35 setelah hiatus panjang. Ceritanya lebih gelap dari yang aku ekspektasi. Story direction-nya sekarang gimana menurut veteran?",
    game: "hi3", category: "general", author: "AstreaN_7", initials: "AN",
    replies: 17, likes: 39, views: 430, date: "10 jam lalu", pinned: false, hot: false,
    tags: ["Story", "Chapter 35", "Discussion"],
  },
];

const onlineUsersData = [
  { initials: "QG", name: "QuantumGale",    game: "hsr", status: "online"  },
  { initials: "SW", name: "SilverWolf_Fan", game: "gi",  status: "online"  },
  { initials: "CA", name: "Cocolia_Arc",    game: "hsr", status: "online"  },
  { initials: "VH", name: "VoidHunter_X",   game: "gi",  status: "busy"    },
  { initials: "TK", name: "TrailBossKai",   game: "hi3", status: "online"  },
  { initials: "MS", name: "Mei_Stellaron",  game: "zzz", status: "away"    },
];

const trendingTopicsData = [
  { tag: "HSR 3.2 Meta",      count: 48, game: "hsr" },
  { tag: "Natlan Lore",       count: 73, game: "gi"  },
  { tag: "Robin Support",     count: 91, game: "hsr" },
  { tag: "ZZZ 1.4 Bangboo",   count: 35, game: "zzz" },
  { tag: "ER Season 7",       count: 29, game: "hi3" },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

type GameFilter     = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type CategoryFilter = 'all' | 'meta' | 'lore' | 'guide' | 'discovery' | 'help' | 'general';
type SortOption     = 'hot' | 'latest' | 'top' | 'unanswered';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }           as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }           as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }           as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }    as React.CSSProperties;

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'   },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]'  },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]'   },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'   },
};

const gameAccentMap: Record<GameFilter, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

const categoryMap: Record<string, { label: string; color: string }> = {
  meta:      { label: 'Meta',      color: 'text-[#4ECDC4] border-[rgba(78,205,196,0.3)]  bg-[rgba(78,205,196,0.08)]'   },
  lore:      { label: 'Lore',      color: 'text-[#C8A96E] border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.08)]'  },
  guide:     { label: 'Guide',     color: 'text-[#6DD18A] border-[rgba(109,209,138,0.3)] bg-[rgba(109,209,138,0.08)]'  },
  discovery: { label: 'Discovery', color: 'text-[#F0D080] border-[rgba(240,208,128,0.3)] bg-[rgba(240,208,128,0.08)]'  },
  help:      { label: 'Help',      color: 'text-[#A855F7] border-[rgba(168,85,247,0.3)]  bg-[rgba(168,85,247,0.08)]'   },
  general:   { label: 'General',   color: 'text-[#9A8F78] border-[rgba(154,143,120,0.3)] bg-[rgba(154,143,120,0.08)]'  },
};

const statusDot: Record<string, string> = {
  online: 'bg-[#6DD18A]',
  busy:   'bg-[#E05C7A]',
  away:   'bg-[#C8A96E]',
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
      ${variant === 'new'
        ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]'
        : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
      {children}
    </span>
  );
}

function NavItem({ children, href, active, onClick }: {
  children: React.ReactNode; href?: string; active: boolean; onClick?: () => void;
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

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
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

// ─── DISCUSSION CARD ─────────────────────────────────────────────────────────

function DiscussionCard({ disc, accentColor }: { disc: typeof discussionsData[0]; accentColor: string }) {
  const [liked, setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(disc.likes);
  const cat = categoryMap[disc.category];

  const handleLike = () => {
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
  };

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-3 relative group transition-all duration-200 hover:border-[rgba(200,169,110,0.3)] hover:bg-[rgba(12,18,32,0.95)]"
      style={clipWidget}>
      {/* Pinned indicator */}
      {disc.pinned && (
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
      )}

      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 shrink-0 min-w-[42px]">
          <button onClick={handleLike}
            className={`flex flex-col items-center gap-[2px] cursor-pointer transition-all duration-200 border-none bg-transparent p-1
              ${liked ? 'text-[#C8A96E]' : 'text-[#5A5248] hover:text-[#C8A96E]'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,13 1,13" stroke="currentColor" strokeWidth="1.2"
                fill={liked ? 'rgba(200,169,110,0.2)' : 'none'} />
            </svg>
            <span className="font-['Space_Mono',monospace] text-[0.7rem]">{likeCount}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2 flex-wrap mb-2">
            {disc.pinned && (
              <span className="inline-flex items-center px-2 py-[2px] text-[0.55rem] font-bold tracking-[0.1em] uppercase bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)] shrink-0"
                style={clipBadge}>📌 Pinned</span>
            )}
            {disc.hot && (
              <span className="inline-flex items-center px-2 py-[2px] text-[0.55rem] font-bold tracking-[0.1em] uppercase bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)] shrink-0"
                style={clipBadge}>🔥 Hot</span>
            )}
            <span className={`inline-flex items-center px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase border shrink-0 ${cat.color}`}
              style={clipBadge}>{cat.label}</span>
          </div>

          <h3 className="font-['Cinzel',serif] text-[0.9rem] font-semibold text-[#E8E0CC] mb-[6px] cursor-pointer leading-[1.4]
            group-hover:text-[#C8A96E] transition-colors duration-200">
            {disc.title}
          </h3>

          <p className="text-[0.8rem] text-[#5A5248] leading-[1.6] mb-3 line-clamp-2">{disc.body}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-[4px] mb-3">
            {disc.tags.map((tag, i) => (
              <span key={i} className="px-[8px] py-[2px] text-[0.62rem] font-semibold bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.12)] text-[#5A5248] cursor-pointer hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.3)] transition-all duration-200"
                style={clipBadge}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Author */}
              <div className="flex items-center gap-[6px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.5rem] text-[#C8A96E] font-bold shrink-0">
                  {disc.initials}
                </div>
                <span className="text-[0.75rem] text-[#9A8F78]">{disc.author}</span>
              </div>
              <GameBadge game={disc.game} />
              <span className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">{disc.date}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                <BubbleIcon /> {disc.replies} replies
              </span>
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                <EyeIcon /> {disc.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────

function DiscussionRightWidgets({ accentColor, activeGame }: { accentColor: string; activeGame: GameFilter }) {
  const gameColorMap: Record<string, string> = {
    hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
  };

  return (
    <div>
      {/* New Discussion CTA */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5 relative overflow-hidden" style={clipWidget}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
        <WidgetTitle>Ikut Berdiskusi</WidgetTitle>
        <p className="text-[0.78rem] text-[#5A5248] leading-[1.6] mb-4">
          Punya teori, temuan, atau pertanyaan soal game Hoyo? Bagikan ke komunitas!
        </p>
        <button className="w-full py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none text-[#050810]"
          style={{ background: `linear-gradient(135deg, #8B6A2E, #C8A96E)`, ...clipBtn }}>
          + Buat Thread Baru
        </button>
      </div>

      {/* Trending Topics */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Topik</WidgetTitle>
        {trendingTopicsData.map((t, i) => {
          const gc = gameColorMap[t.game] ?? '#C8A96E';
          return (
            <div key={i} className="flex items-center justify-between py-[8px] border-b border-[rgba(200,169,110,0.06)] last:border-0 cursor-pointer group/item">
              <div className="flex items-center gap-2">
                <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] min-w-[18px]">#{i + 1}</span>
                <span className="text-[0.8rem] text-[#9A8F78] group-hover/item:text-[#E8E0CC] transition-colors duration-200">{t.tag}</span>
              </div>
              <span className="font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]"
                style={{ color: gc, background: `${gc}18`, clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                {t.count} posts
              </span>
            </div>
          );
        })}
      </div>

      {/* Online Users */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>
          <span>Online Sekarang</span>
          <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] text-[#6DD18A]">● {onlineUsersData.filter(u => u.status === 'online').length} online</span>
        </WidgetTitle>
        <div className="space-y-[8px]">
          {onlineUsersData.map((u, i) => {
            const gc = gameColorMap[u.game] ?? '#C8A96E';
            return (
              <div key={i} className="flex items-center gap-[10px] cursor-pointer group/u">
                <div className="relative shrink-0">
                  <div className="w-[30px] h-[30px] rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] font-bold"
                    style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                    {u.initials}
                  </div>
                  <span className={`absolute -bottom-[1px] -right-[1px] w-[8px] h-[8px] rounded-full border border-[#0C1220] ${statusDot[u.status]}`} />
                </div>
                <div>
                  <div className="text-[0.78rem] text-[#9A8F78] group-hover/u:text-[#E8E0CC] transition-colors duration-200">{u.name}</div>
                  <div className="text-[0.62rem] text-[#5A5248]">{gameLabels[u.game as GameFilter]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forum Rules */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <WidgetTitle>Aturan Forum</WidgetTitle>
        <ul className="space-y-2">
          {[
            'Hormati sesama Traveler & Trailblazer',
            'Gunakan tag spoiler untuk konten story',
            'Dilarang share akun / jual beli ilegal',
            'Cek thread existing sebelum post baru',
            'Sertakan versi game di judul thread',
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.75rem] text-[#5A5248] leading-[1.5]">
              <span className="text-[#C8A96E] shrink-0 mt-[1px]">▸</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DiscussionPage() {
  const [activeGame,     setActiveGame]     = useState<GameFilter>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeSort,     setActiveSort]     = useState<SortOption>('hot');
  const [searchQuery,    setSearchQuery]    = useState('');

  const accentColor = gameAccentMap[activeGame];

  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const aMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi:  'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi:  'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${activeGame === g ? aMap[g] : hMap[g]}`;
  };

  const filteredDisc = discussionsData.filter(d => {
    const gMatch = activeGame === 'all' || d.game === activeGame;
    const cMatch = activeCategory === 'all' || d.category === activeCategory;
    const sMatch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return gMatch && cMatch && sMatch;
  }).sort((a, b) => {
    if (activeSort === 'hot')        return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.views - a.views;
    if (activeSort === 'top')        return b.likes - a.likes;
    if (activeSort === 'unanswered') return a.replies - b.replies;
    return 0; // latest – preserve original order
  });

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
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="8"    x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="17.5" x2="14" y2="20"   stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="8"  y1="14"   x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="17.5" y1="14" x2="20"   y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </a>
        </div>

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports<NavBadge>1.2K</NavBadge></NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={true}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>

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
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Discussion</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              {gameLabels[activeGame]} · {filteredDisc.length} thread aktif
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-60 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Cari diskusi..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
            </div>
            <button className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
              + Buat Thread
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Stats Banner */}
          <div className="grid grid-cols-4 gap-4 mb-8 max-[1100px]:grid-cols-2">
            {[
              { label: 'Total Thread',    value: '3,842',  change: '↑ +28 hari ini',    accent: '#C8A96E' },
              { label: 'Aktif Bulan Ini', value: '1,204',  change: 'Thread dibalas baru', accent: '#4ECDC4' },
              { label: 'Members',         value: '31.6K',  change: '● 420 online kini',  accent: '#6DD18A' },
              { label: 'Post Hari Ini',   value: '847',    change: '↑ +12% dari kemarin', accent: '#A855F7' },
            ].map((card, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: card.accent }} />
                <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-[0.5rem]">{card.label}</div>
                <div className="font-['Space_Mono',monospace] text-[1.6rem] font-bold" style={{ color: card.accent }}>{card.value}</div>
                <div className="text-[0.72rem] text-[#4ECDC4] mt-1">{card.change}</div>
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

          {/* Controls Row */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            {/* Category Filters */}
            <div className="flex gap-[5px] flex-wrap">
              {(['all', 'meta', 'lore', 'guide', 'discovery', 'help', 'general'] as const).map(c => (
                <button key={c} style={clipHexSm}
                  onClick={() => setActiveCategory(c)}
                  className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                    ${activeCategory === c
                      ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                      : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#9A8F78]'}`}>
                  {c === 'all' ? 'Semua' : categoryMap[c]?.label ?? c}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex gap-[5px]">
              {(['hot', 'latest', 'top', 'unanswered'] as const).map(s => (
                <button key={s} style={clipHexSm}
                  onClick={() => setActiveSort(s)}
                  className={`px-[12px] py-[5px] text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
                    ${activeSort === s
                      ? 'bg-[rgba(78,205,196,0.08)] border-[#4ECDC4] text-[#4ECDC4]'
                      : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:border-[rgba(200,169,110,0.25)] hover:text-[#9A8F78]'}`}>
                  {s === 'hot' ? '🔥 Hot' : s === 'latest' ? '⏱ Terbaru' : s === 'top' ? '⭐ Top' : '💬 Unanswered'}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
            {/* Discussions List */}
            <div>
              {filteredDisc.length === 0 ? (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-12 text-center" style={clipWidget}>
                  <div className="text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                    Tidak ada diskusi ditemukan untuk filter ini.
                  </div>
                </div>
              ) : (
                filteredDisc.map(disc => (
                  <DiscussionCard key={disc.id} disc={disc} accentColor={accentColor} />
                ))
              )}

              {/* Pagination */}
              {filteredDisc.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[1, 2, 3, '...', 12].map((p, i) => (
                    <button key={i} style={clipHexSm}
                      className={`w-9 h-9 font-['Space_Mono',monospace] text-[0.75rem] border cursor-pointer transition-all duration-200
                        ${p === 1
                          ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                          : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'}`}>
                      {p}
                    </button>
                  ))}
                  <button style={clipHexSm}
                    className="px-4 h-9 font-['Space_Mono',monospace] text-[0.75rem] border cursor-pointer transition-all duration-200 bg-transparent border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]">
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <DiscussionRightWidgets accentColor={accentColor} activeGame={activeGame} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
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

// ─── ICONS ────────────────────────────────────────────────────────────────────

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
const BubbleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 2C1 1.45 1.45 1 2 1H10C10.55 1 11 1.45 11 2V8C11 8.55 10.55 9 10 9H4L1 11V2Z" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1"/>
    <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);