'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const threadData = {
  id: 1,
  title: "Apakah The Hunt adalah path terbaik untuk DPS di HSR 3.2?",
  body: `Setelah nemuin build baru buat Acheron + Sunday combo, kayaknya meta DPS sekarang udah beda banget. Aku udah ngetes berbagai path di Memory of Chaos 12 dan hasilnya cukup mengejutkan.

The Hunt emang kuat karena kit Seele dan Dr. Ratio yang outstanding, tapi setelah patch 3.2 buffed Acheron's follow-up chain via Sunday support, Nihility route mulai masuk S-tier juga.

Beberapa poin yang aku temuin:
- Hunt: damage ceiling lebih tinggi di single target, tapi nge-drop tajam di AoE encounter
- Nihility (Acheron + Sunday): konsisten di semua skenario, bahkan tanpa full stack condition
- Destruction: BiSi buat hypercarry tapi butuh investment yang gede banget

Gimana pengalaman kalian di MoC 12 dengan team berbeda? Sharing build dan score di sini biar bisa kita compare bareng!`,
  game: "hsr",
  category: "meta",
  author: "QuantumGale",
  initials: "QG",
  replies: 48,
  likes: 124,
  views: 1820,
  date: "32 menit lalu",
  pinned: true,
  hot: true,
  tags: ["Meta", "Hunt", "MoC", "Acheron", "Sunday"],
  accentColor: "#4ECDC4",
};

const repliesData = [
  {
    id: 1,
    author: "Cocolia_Arc",
    initials: "CA",
    game: "hsr",
    rank: "Trailblazer Elite",
    rankColor: "#4ECDC4",
    content: "Sunday support beneran game-changer buat Acheron. Aku udah test di full MoC 12 dan hasilnya stabil banget di atas 36k per cycle. Dibanding Hunt lineup yang average 40k tapi butuh perfect RNG, Nihility lebih reliable buat clear konsisten.",
    likes: 67,
    date: "28 menit lalu",
    isLiked: false,
    isBestAnswer: true,
    replies: [],
  },
  {
    id: 2,
    author: "SilverWolf_Fan",
    initials: "SW",
    game: "gi",
    rank: "Archon Theorist",
    rankColor: "#6DD18A",
    content: "Setuju soal AoE weakness Hunt path. Seele emang monster di single target, tapi begitu ada multi-wave encounter dia mulai ketinggalan. Destruction path sama Blade masih worth buat mixed content menurut aku.",
    likes: 34,
    date: "25 menit lalu",
    isLiked: false,
    isBestAnswer: false,
    replies: [],
  },
  {
    id: 3,
    author: "ImaginaryRift",
    initials: "IR",
    game: "zzz",
    rank: "Proxy Veteran",
    rankColor: "#A855F7",
    content: "Dari sisi investment, Hunt path lebih F2P friendly karena light cone pilihan lebih banyak. Acheron + Sunday itu butuh 2 limited LC yang harganya gila-gilaan. Buat majority player yang budget terbatas, Hunt masih lebih accessible.",
    likes: 28,
    date: "20 menit lalu",
    isLiked: true,
    isBestAnswer: false,
    replies: [],
  },
  {
    id: 4,
    author: "VoidHunter_X",
    initials: "VH",
    game: "gi",
    rank: "Lore Keeper",
    rankColor: "#C8A96E",
    content: "Ada yang udah coba Erudition path buat Pure Fiction? Himeko + Herta combo di 3.2 kayaknya underrated banget. Dengan mechanics baru Pure Fiction, stack generation-nya jadi lebih smooth.",
    likes: 19,
    date: "15 menit lalu",
    isLiked: false,
    isBestAnswer: false,
    replies: [],
  },
  {
    id: 5,
    author: "TrailBossKai",
    initials: "TK",
    game: "hi3",
    rank: "Honkai Veteran",
    rankColor: "#E05C7A",
    content: "Dari data yang aku kumpulin di komunitas CN, Hunt masih top chart secara keseluruhan. Cuma gap sama Nihility udah mulai menyempit. Kalau patch 3.3 ada buff buat Follow-up, bisa jadi Hunt kembali dominan.",
    likes: 41,
    date: "10 menit lalu",
    isLiked: false,
    isBestAnswer: false,
    replies: [],
  },
];

const groupData = {
  name: "HSR Meta Council",
  description: "Grup diskusi khusus untuk analisis meta, tierlist, dan theorycrafting Honkai: Star Rail. Semua konten terverifikasi oleh mod team.",
  game: "hsr",
  accentColor: "#4ECDC4",
  members: 2847,
  posts: 18420,
  createdAt: "Maret 2023",
  rules: [
    "Gunakan data & bukti saat klaim meta",
    "Hormati pendapat sesama member",
    "Tag [SPOILER] untuk konten 3.x ke atas",
    "Dilarang promosi joki / akun ilegal",
    "Min. 1 screenshot sebagai bukti build",
  ],
};

const groupMembersData = [
  { initials: "QG", name: "QuantumGale",    rank: "Mod",            game: "hsr", status: "online",  rankColor: "#C8A96E",  joinDate: "Mar 2023" },
  { initials: "CA", name: "Cocolia_Arc",    rank: "Elite Member",   game: "hsr", status: "online",  rankColor: "#4ECDC4",  joinDate: "Apr 2023" },
  { initials: "TK", name: "TrailBossKai",   rank: "Senior",         game: "hi3", status: "online",  rankColor: "#E05C7A",  joinDate: "May 2023" },
  { initials: "SW", name: "SilverWolf_Fan", rank: "Senior",         game: "gi",  status: "busy",    rankColor: "#6DD18A",  joinDate: "Jun 2023" },
  { initials: "IR", name: "ImaginaryRift",  rank: "Member",         game: "zzz", status: "away",    rankColor: "#A855F7",  joinDate: "Jul 2023" },
  { initials: "VH", name: "VoidHunter_X",   rank: "Member",         game: "gi",  status: "offline", rankColor: "#9A8F78",  joinDate: "Aug 2023" },
  { initials: "MS", name: "Mei_Stellaron",  rank: "New Member",     game: "zzz", status: "online",  rankColor: "#A855F7",  joinDate: "Jan 2024" },
  { initials: "AN", name: "AstreaN_7",      rank: "New Member",     game: "hi3", status: "offline", rankColor: "#9A8F78",  joinDate: "Feb 2024" },
  { initials: "RW", name: "RailWatcher",    rank: "Member",         game: "hsr", status: "online",  rankColor: "#4ECDC4",  joinDate: "Sep 2023" },
  { initials: "PF", name: "PureFiction_99", rank: "Elite Member",   game: "hsr", status: "busy",    rankColor: "#4ECDC4",  joinDate: "Oct 2023" },
];

const relatedThreads = [
  { title: "Robin vs Sunday — Siapa support terbaik?", replies: 91, hot: true, game: "hsr" },
  { title: "Full Hunt team di MoC 12 clear showcase", replies: 23, hot: false, game: "hsr" },
  { title: "Acheron build guide post-3.2 patch", replies: 57, hot: true, game: "hsr" },
  { title: "Budget team untuk MoC clear F2P", replies: 38, hot: false, game: "hsr" },
];

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'   },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]'  },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]'   },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'   },
};

const statusDot: Record<string, string> = {
  online:  'bg-[#6DD18A]',
  busy:    'bg-[#E05C7A]',
  away:    'bg-[#C8A96E]',
  offline: 'bg-[#3A3530]',
};

const gameLabels: Record<string, string> = {
  hsr: 'Honkai: Star Rail', gi: 'Genshin Impact',
  zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

// ─── SHARED ───────────────────────────────────────────────────────────────────

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

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
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

// ─── MEMBER PANEL ────────────────────────────────────────────────────────────

function MemberPanel({ members, group, onClose }: {
  members: typeof groupMembersData;
  group: typeof groupData;
  onClose: () => void;
}) {
  const [searchMember, setSearchMember] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'busy' | 'away'>('all');

  const gameColorMap: Record<string, string> = {
    hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
  };

  const filtered = members.filter(m => {
    const sMatch = !searchMember || m.name.toLowerCase().includes(searchMember.toLowerCase());
    const statusMatch = filterStatus === 'all' || m.status === filterStatus;
    return sMatch && statusMatch;
  });

  const onlineCount = members.filter(m => m.status === 'online').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(5,8,16,0.85)' }}>
      <div className="w-[560px] max-h-[85vh] flex flex-col bg-[#0C1220] border border-[rgba(200,169,110,0.25)] relative overflow-hidden" style={clipWidget}>
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: group.accentColor }} />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[rgba(200,169,110,0.12)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC] mb-1">{group.name}</div>
              <div className="flex items-center gap-3">
                <GameBadge game={group.game} />
                <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#6DD18A]">● {onlineCount} online</span>
                <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{group.members.toLocaleString()} members total</span>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#5A5248] hover:text-[#E8E0CC] transition-colors duration-200 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-transparent cursor-pointer"
              style={clipBtn}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <p className="text-[0.75rem] text-[#5A5248] leading-[1.6] mb-4">{group.description}</p>

          {/* Group Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Members', value: group.members.toLocaleString(), color: group.accentColor },
              { label: 'Total Posts',   value: group.posts.toLocaleString(),   color: '#C8A96E' },
              { label: 'Since',         value: group.createdAt,                color: '#9A8F78' },
            ].map((s, i) => (
              <div key={i} className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.08)] px-3 py-[10px]" style={clipBtn}>
                <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[#5A5248] mb-1">{s.label}</div>
                <div className="font-['Space_Mono',monospace] text-[0.9rem] font-bold" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="px-6 py-3 border-b border-[rgba(200,169,110,0.08)] flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.12)] px-3 py-[6px]" style={clipBtn}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5.5" cy="5.5" r="3.5" stroke="#5A5248" strokeWidth="1.1"/>
              <line x1="8.5" y1="8.5" x2="11" y2="11" stroke="#5A5248" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Cari member..."
              value={searchMember} onChange={e => setSearchMember(e.target.value)}
              className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.82rem] flex-1 placeholder-[#5A5248]" />
          </div>
          <div className="flex gap-1">
            {(['all', 'online', 'busy', 'away'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-[5px] text-[0.65rem] font-bold tracking-[0.08em] uppercase border cursor-pointer transition-all duration-200 font-['Rajdhani',sans-serif]
                  ${filterStatus === s
                    ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                    : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:text-[#9A8F78]'}`}
                style={clipHexSm}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-[#5A5248] font-['Space_Mono',monospace] text-[0.75rem]">
              Tidak ada member ditemukan.
            </div>
          ) : filtered.map((m, i) => {
            const gc = gameColorMap[m.game] ?? '#C8A96E';
            return (
              <div key={i} className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.06)] hover:border-[rgba(200,169,110,0.2)] hover:bg-[rgba(200,169,110,0.03)] transition-all duration-200 cursor-pointer group/m" style={clipBtn}>
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-[38px] h-[38px] rounded-full border-[1.5px] flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] font-bold"
                    style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                    {m.initials}
                  </div>
                  <span className={`absolute -bottom-[1px] -right-[1px] w-[9px] h-[9px] rounded-full border-[1.5px] border-[#0C1220] ${statusDot[m.status]}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.82rem] font-semibold text-[#9A8F78] group-hover/m:text-[#E8E0CC] transition-colors duration-200">{m.name}</span>
                    {m.rank === 'Mod' && (
                      <span className="px-[6px] py-[1px] text-[0.52rem] font-bold tracking-[0.1em] uppercase bg-[rgba(200,169,110,0.15)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]" style={clipBadge}>MOD</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-[2px]">
                    <span className="text-[0.65rem] font-bold" style={{ color: m.rankColor }}>{m.rank}</span>
                    <span className="text-[#3A3530]">·</span>
                    <span className="text-[0.62rem] text-[#5A5248]">{gameLabels[m.game]}</span>
                  </div>
                </div>

                {/* Join date */}
                <div className="text-right shrink-0">
                  <div className="text-[0.58rem] text-[#5A5248] mb-[2px]">Joined</div>
                  <div className="font-['Space_Mono',monospace] text-[0.62rem] text-[#9A8F78]">{m.joinDate}</div>
                </div>

                {/* Status text */}
                <div className={`text-[0.6rem] font-bold tracking-[0.08em] uppercase shrink-0 ${
                  m.status === 'online' ? 'text-[#6DD18A]' :
                  m.status === 'busy'   ? 'text-[#E05C7A]' :
                  m.status === 'away'   ? 'text-[#C8A96E]' : 'text-[#3A3530]'}`}>
                  {m.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(200,169,110,0.08)]">
          <h4 className="font-['Cinzel',serif] text-[0.72rem] font-semibold text-[#C8A96E] mb-3 flex items-center gap-2">
            <span className="w-[2px] h-[10px] bg-[#C8A96E] inline-block" />
            Aturan Grup
          </h4>
          <div className="space-y-[6px]">
            {group.rules.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-[0.72rem] text-[#5A5248]">
                <span className="text-[#C8A96E] shrink-0 mt-[1px] text-[0.65rem]">▸</span>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REPLY CARD ───────────────────────────────────────────────────────────────

function ReplyCard({ reply, threadAccent }: { reply: typeof repliesData[0]; threadAccent: string }) {
  const [liked, setLiked] = useState(reply.isLiked);
  const [likeCount, setLikeCount] = useState(reply.likes);
  const gameColorMap: Record<string, string> = { hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A' };
  const gc = gameColorMap[reply.game] ?? '#C8A96E';

  return (
    <div className={`bg-[#0C1220] border p-5 mb-3 relative transition-all duration-200 hover:bg-[rgba(12,18,32,0.95)]
      ${reply.isBestAnswer
        ? 'border-[rgba(78,205,196,0.35)] hover:border-[rgba(78,205,196,0.5)]'
        : 'border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.25)]'}`}
      style={clipWidget}>
      {reply.isBestAnswer && (
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: '#4ECDC4' }} />
      )}
      {reply.isBestAnswer && (
        <div className="mb-3 flex">
          <span className="inline-flex items-center gap-1 px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.1em] uppercase bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]" style={clipBadge}>
            ✓ Best Answer
          </span>
        </div>
      )}

      <div className="flex gap-4">
        {/* Avatar Column */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-[40px] h-[40px] rounded-full border-[1.5px] flex items-center justify-center font-['Cinzel',serif] text-[0.7rem] font-bold"
              style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
              {reply.initials}
            </div>
          </div>
          {/* Vote */}
          <button onClick={() => { setLiked(p => !p); setLikeCount(p => liked ? p - 1 : p + 1); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 border-none bg-transparent p-1
              ${liked ? 'text-[#C8A96E]' : 'text-[#5A5248] hover:text-[#C8A96E]'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,13 1,13" stroke="currentColor" strokeWidth="1.2"
                fill={liked ? 'rgba(200,169,110,0.2)' : 'none'} />
            </svg>
            <span className="font-['Space_Mono',monospace] text-[0.68rem]">{likeCount}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[0.85rem] font-bold text-[#E8E0CC] font-['Rajdhani',sans-serif]">{reply.author}</span>
            <span className="text-[0.65rem] font-bold" style={{ color: gc }}>{reply.rank}</span>
            <GameBadge game={reply.game} />
            <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{reply.date}</span>
          </div>
          <p className="text-[0.83rem] text-[#9A8F78] leading-[1.7] mb-3">{reply.content}</p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-[0.7rem] text-[#5A5248] hover:text-[#C8A96E] transition-colors duration-200 border-none bg-transparent cursor-pointer font-['Rajdhani',sans-serif] font-semibold tracking-[0.06em]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 2C1 1.45 1.45 1 2 1H10C10.55 1 11 1.45 11 2V8C11 8.55 10.55 9 10 9H4L1 11V2Z" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Reply
            </button>
            <button className="flex items-center gap-1 text-[0.7rem] text-[#5A5248] hover:text-[#E05C7A] transition-colors duration-200 border-none bg-transparent cursor-pointer font-['Rajdhani',sans-serif] font-semibold tracking-[0.06em]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.5 4H11L8.25 6L9.5 9.5L6 7.5L2.5 9.5L3.75 6L1 4H4.5L6 1Z" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Quote
            </button>
            <button className="flex items-center gap-1 text-[0.7rem] text-[#5A5248] hover:text-[#9A8F78] transition-colors duration-200 border-none bg-transparent cursor-pointer font-['Rajdhani',sans-serif] font-semibold tracking-[0.06em]">
              ··· More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function DiscussionDetailPage() {
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [threadLiked, setThreadLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(threadData.likes);
  const [activeTab, setActiveTab] = useState<'discussion' | 'group'>('discussion');

  const accentColor = threadData.accentColor;
  const gameColorMap: Record<string, string> = { hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A' };
  const gc = gameColorMap[threadData.game] ?? '#C8A96E';

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG gradients */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(78,205,196,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
      }} />

      {/* Member Panel Modal */}
      {showMemberPanel && (
        <MemberPanel members={groupMembersData} group={groupData} onClose={() => setShowMemberPanel(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="/UserHoyo/dashboard" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
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
        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports</NavItem>
          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission&quest" active={false}><HexDotIcon /> Mission &amp; Quest</NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal</NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles</NavItem>
          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={true}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>
        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] font-bold shrink-0">TB</div>
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
          style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div className="flex items-center gap-2 text-[0.78rem] text-[#5A5248]">
            <a href="/UserHoyo/discussion" className="hover:text-[#C8A96E] transition-colors duration-200 no-underline text-[#5A5248]">Discussion</a>
            <span>›</span>
            <a href="#" className="hover:text-[#C8A96E] transition-colors duration-200 no-underline text-[#5A5248]">HSR Meta Council</a>
            <span>›</span>
            <span className="text-[#9A8F78] truncate max-w-[300px]">{threadData.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMemberPanel(true)}
              className="flex items-center gap-2 px-4 py-[7px] border border-[rgba(78,205,196,0.3)] text-[#4ECDC4] bg-[rgba(78,205,196,0.05)] hover:bg-[rgba(78,205,196,0.1)] transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.08em]"
              style={clipBtn}>
              <UsersIcon />
              Lihat Member Grup
            </button>
            <a href="/UserHoyo/discussion" className="px-4 py-[7px] border border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.08em] no-underline flex items-center"
              style={clipBtn}>
              ← Kembali
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[rgba(200,169,110,0.1)] pb-0">
            {(['discussion', 'group'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-[9px] text-[0.82rem] font-bold tracking-[0.08em] uppercase border-none cursor-pointer transition-all duration-200 font-['Rajdhani',sans-serif] relative
                  ${activeTab === tab ? 'text-[#C8A96E]' : 'text-[#5A5248] hover:text-[#9A8F78]'} bg-transparent`}>
                {tab === 'discussion' ? '💬 Thread Diskusi' : '👥 Info Grup'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96E]" />
                )}
              </button>
            ))}
          </div>

          {/* ── Tab: Discussion ── */}
          {activeTab === 'discussion' && (
            <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
              {/* Left: Thread + Replies */}
              <div>
                {/* OP Thread Card */}
                <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.25)] p-6 mb-4 relative" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />

                  {/* Thread Header */}
                  <div className="flex gap-4 mb-4">
                    <div className="shrink-0">
                      <div className="w-[48px] h-[48px] rounded-full border-[2px] flex items-center justify-center font-['Cinzel',serif] text-[0.8rem] font-bold"
                        style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                        {threadData.initials}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-['Cinzel',serif] text-[0.9rem] font-semibold text-[#E8E0CC]">{threadData.author}</span>
                        <span className="text-[0.62rem] font-bold" style={{ color: accentColor }}>Trailblazer Elite</span>
                        <GameBadge game={threadData.game} />
                        <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{threadData.date}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]" style={clipBadge}>📌 Pinned</span>
                        <span className="px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]" style={clipBadge}>🔥 Hot</span>
                        <span className="px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase bg-[rgba(78,205,196,0.08)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]" style={clipBadge}>Meta</span>
                      </div>
                    </div>
                  </div>

                  {/* Thread Title */}
                  <h1 className="font-['Cinzel',serif] text-[1.15rem] font-semibold text-[#E8E0CC] mb-4 leading-[1.4]">
                    {threadData.title}
                  </h1>

                  {/* Thread Body */}
                  <div className="text-[0.85rem] text-[#9A8F78] leading-[1.8] mb-5 whitespace-pre-line">
                    {threadData.body}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-[5px] mb-5">
                    {threadData.tags.map((tag, i) => (
                      <span key={i} className="px-[8px] py-[3px] text-[0.62rem] font-semibold bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.35)] transition-all duration-200 cursor-pointer"
                        style={clipBadge}>#{tag}</span>
                    ))}
                  </div>

                  {/* Thread Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(200,169,110,0.08)] flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <button onClick={() => { setThreadLiked(p => !p); setThreadLikes(p => threadLiked ? p - 1 : p + 1); }}
                        className={`flex items-center gap-2 px-3 py-[6px] border cursor-pointer transition-all duration-200 font-['Rajdhani',sans-serif] text-[0.75rem] font-bold tracking-[0.06em] uppercase bg-transparent
                          ${threadLiked ? 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]' : 'border-[rgba(200,169,110,0.2)] text-[#5A5248] hover:border-[#C8A96E] hover:text-[#C8A96E]'}`}
                        style={clipBtn}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <polygon points="6,1 11,11 1,11" stroke="currentColor" strokeWidth="1.2" fill={threadLiked ? 'rgba(200,169,110,0.2)' : 'none'} />
                        </svg>
                        {threadLikes} Upvote
                      </button>
                      <button className="flex items-center gap-2 px-3 py-[6px] border border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.35)] transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif] text-[0.75rem] font-bold tracking-[0.06em] uppercase bg-transparent"
                        style={clipBtn}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 2C1 1.45 1.45 1 2 1H10C10.55 1 11 1.45 11 2V8C11 8.55 10.55 9 10 9H4L1 11V2Z" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                        {threadData.replies} Replies
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-['Space_Mono',monospace] text-[0.68rem] text-[#5A5248] flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1"/><circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1"/></svg>
                        {threadData.views.toLocaleString()} views
                      </span>
                      <button className="text-[0.7rem] text-[#5A5248] hover:text-[#9A8F78] transition-colors duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]">Share</button>
                      <button className="text-[0.7rem] text-[#5A5248] hover:text-[#E05C7A] transition-colors duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]">Report</button>
                    </div>
                  </div>
                </div>

                {/* Replies Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="font-['Cinzel',serif] text-[0.85rem] font-semibold text-[#C8A96E] flex items-center gap-2">
                    <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                    {repliesData.length} Balasan
                  </div>
                  <div className="flex gap-1">
                    {['Terbaru', 'Terlama', 'Top'].map((s, i) => (
                      <button key={i} className={`px-3 py-[4px] text-[0.68rem] font-bold tracking-[0.06em] uppercase border cursor-pointer transition-all duration-200 font-['Rajdhani',sans-serif]
                        ${i === 0 ? 'bg-[rgba(200,169,110,0.08)] border-[#C8A96E] text-[#C8A96E]' : 'bg-transparent border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:text-[#9A8F78]'}`}
                        style={clipHexSm}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Replies */}
                {repliesData.map(reply => (
                  <ReplyCard key={reply.id} reply={reply} threadAccent={accentColor} />
                ))}

                {/* Reply Box */}
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mt-5 relative" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: '#C8A96E' }} />
                  <WidgetTitle>Tulis Balasan</WidgetTitle>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {['Bold', 'Italic', 'Quote', 'Code', 'Spoiler'].map((f, i) => (
                      <button key={i} className="px-3 py-[4px] text-[0.68rem] font-bold tracking-[0.06em] uppercase border border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.35)] transition-all duration-200 cursor-pointer bg-transparent font-['Rajdhani',sans-serif]"
                        style={clipHexSm}>{f}</button>
                    ))}
                  </div>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Bagikan perspektif atau pertanyaan kamu..."
                    className="w-full bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.12)] text-[#E8E0CC] placeholder-[#5A5248] font-['Rajdhani',sans-serif] text-[0.85rem] leading-[1.6] p-4 resize-none outline-none focus:border-[rgba(200,169,110,0.35)] transition-colors duration-200"
                    style={{ minHeight: '110px', ...clipBtn }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace]">
                      {replyText.length} / 2000 chars
                    </div>
                    <button className="px-5 py-[8px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase border-none cursor-pointer transition-all duration-200 hover:brightness-110 text-[#050810]"
                      style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                      Kirim Balasan →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div>
                {/* Group Info Card */}
                <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.2)] p-5 mb-5 relative" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
                  <WidgetTitle>Grup Diskusi</WidgetTitle>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] font-bold"
                      style={{ background: `${accentColor}18`, borderColor: `${accentColor}60`, color: accentColor }}>
                      HSR
                    </div>
                    <div>
                      <div className="text-[0.88rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">{groupData.name}</div>
                      <GameBadge game={groupData.game} />
                    </div>
                  </div>
                  <p className="text-[0.72rem] text-[#5A5248] leading-[1.6] mb-4">{groupData.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: 'Members', value: groupData.members.toLocaleString(), color: accentColor },
                      { label: 'Posts', value: groupData.posts.toLocaleString(), color: '#C8A96E' },
                    ].map((s, i) => (
                      <div key={i} className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.08)] p-3 text-center" style={clipBtn}>
                        <div className="font-['Space_Mono',monospace] text-[1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[0.6rem] text-[#5A5248] mt-1 uppercase tracking-[0.08em]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowMemberPanel(true)}
                    className="w-full py-[9px] text-[0.78rem] font-bold tracking-[0.08em] uppercase border border-[rgba(78,205,196,0.3)] text-[#4ECDC4] bg-[rgba(78,205,196,0.05)] hover:bg-[rgba(78,205,196,0.1)] transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif] flex items-center justify-center gap-2"
                    style={clipBtn}>
                    <UsersIcon /> Lihat Semua Member
                  </button>
                </div>

                {/* Online in Group */}
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
                  <WidgetTitle>
                    <span>Online di Grup</span>
                    <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] text-[#6DD18A]">● {groupMembersData.filter(m => m.status === 'online').length} online</span>
                  </WidgetTitle>
                  <div className="space-y-[9px]">
                    {groupMembersData.filter(m => m.status !== 'offline').slice(0, 5).map((u, i) => {
                      const gc2 = gameColorMap[u.game] ?? '#C8A96E';
                      return (
                        <div key={i} className="flex items-center gap-[10px] cursor-pointer group/u">
                          <div className="relative shrink-0">
                            <div className="w-[28px] h-[28px] rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.55rem] font-bold"
                              style={{ background: `${gc2}18`, borderColor: `${gc2}60`, color: gc2 }}>
                              {u.initials}
                            </div>
                            <span className={`absolute -bottom-[1px] -right-[1px] w-[7px] h-[7px] rounded-full border border-[#0C1220] ${statusDot[u.status]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[0.75rem] text-[#9A8F78] group-hover/u:text-[#E8E0CC] transition-colors duration-200 truncate">{u.name}</div>
                            <div className="text-[0.6rem]" style={{ color: u.rankColor }}>{u.rank}</div>
                          </div>
                        </div>
                      );
                    })}
                    <button onClick={() => setShowMemberPanel(true)}
                      className="w-full mt-1 py-[6px] text-[0.68rem] font-bold tracking-[0.06em] uppercase border border-[rgba(200,169,110,0.12)] text-[#5A5248] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.3)] transition-all duration-200 cursor-pointer bg-transparent font-['Rajdhani',sans-serif]"
                      style={clipHexSm}>
                      Lihat {groupMembersData.length} Member →
                    </button>
                  </div>
                </div>

                {/* Related Threads */}
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                  <WidgetTitle>Thread Terkait</WidgetTitle>
                  <div className="space-y-3">
                    {relatedThreads.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 cursor-pointer group/rt pb-3 border-b border-[rgba(200,169,110,0.06)] last:border-0 last:pb-0">
                        {t.hot && <span className="text-[#E05C7A] text-[0.65rem] shrink-0 mt-[2px]">🔥</span>}
                        <div className="flex-1">
                          <div className="text-[0.78rem] text-[#9A8F78] group-hover/rt:text-[#E8E0CC] transition-colors duration-200 leading-[1.4]">{t.title}</div>
                          <div className="text-[0.62rem] text-[#5A5248] mt-[3px] font-['Space_Mono',monospace]">{t.replies} replies</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Group Info ── */}
          {activeTab === 'group' && (
            <div className="grid grid-cols-[1fr_280px] gap-6 max-[1100px]:grid-cols-1">
              <div>
                {/* Group Header */}
                <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.25)] p-6 mb-5 relative" style={clipWidget}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-[56px] h-[56px] rounded-full border-[2px] flex items-center justify-center font-['Cinzel',serif] text-[0.9rem] font-bold shrink-0"
                      style={{ background: `${accentColor}18`, borderColor: `${accentColor}60`, color: accentColor }}>HSR</div>
                    <div>
                      <div className="font-['Cinzel',serif] text-[1.1rem] font-semibold text-[#E8E0CC] mb-1">{groupData.name}</div>
                      <div className="flex items-center gap-2">
                        <GameBadge game={groupData.game} />
                        <span className="text-[0.68rem] text-[#5A5248]">Dibuat {groupData.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[0.82rem] text-[#9A8F78] leading-[1.7] mb-5">{groupData.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Member', value: groupData.members.toLocaleString(), accent: accentColor },
                      { label: 'Total Post', value: groupData.posts.toLocaleString(), accent: '#C8A96E' },
                      { label: 'Online Sekarang', value: String(groupMembersData.filter(m => m.status === 'online').length), accent: '#6DD18A' },
                    ].map((s, i) => (
                      <div key={i} className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.08)] p-4 text-center" style={clipWidget}>
                        <div className="font-['Space_Mono',monospace] text-[1.3rem] font-bold" style={{ color: s.accent }}>{s.value}</div>
                        <div className="text-[0.62rem] text-[#5A5248] mt-1 uppercase tracking-[0.08em]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Members Table */}
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                  <div className="flex items-center justify-between mb-4">
                    <WidgetTitle>Semua Member</WidgetTitle>
                    <button onClick={() => setShowMemberPanel(true)}
                      className="px-4 py-[6px] text-[0.72rem] font-bold tracking-[0.06em] uppercase border border-[rgba(78,205,196,0.3)] text-[#4ECDC4] bg-[rgba(78,205,196,0.05)] hover:bg-[rgba(78,205,196,0.1)] transition-all duration-200 cursor-pointer bg-transparent font-['Rajdhani',sans-serif]"
                      style={clipBtn}>Filter &amp; Cari</button>
                  </div>
                  {groupMembersData.map((m, i) => {
                    const gc2 = gameColorMap[m.game] ?? '#C8A96E';
                    return (
                      <div key={i} className="flex items-center gap-3 py-3 border-b border-[rgba(200,169,110,0.06)] last:border-0 hover:bg-[rgba(200,169,110,0.02)] transition-colors duration-200 cursor-pointer group/row -mx-5 px-5">
                        <div className="relative shrink-0">
                          <div className="w-[36px] h-[36px] rounded-full border-[1.5px] flex items-center justify-center font-['Cinzel',serif] text-[0.62rem] font-bold"
                            style={{ background: `${gc2}18`, borderColor: `${gc2}60`, color: gc2 }}>{m.initials}</div>
                          <span className={`absolute -bottom-[1px] -right-[1px] w-[8px] h-[8px] rounded-full border-[1.5px] border-[#0C1220] ${statusDot[m.status]}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[0.82rem] font-semibold text-[#9A8F78] group-hover/row:text-[#E8E0CC] transition-colors duration-200">{m.name}</span>
                            {m.rank === 'Mod' && <span className="px-[5px] py-[1px] text-[0.52rem] font-bold tracking-[0.1em] bg-[rgba(200,169,110,0.15)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]" style={clipBadge}>MOD</span>}
                          </div>
                          <span className="text-[0.62rem] font-bold" style={{ color: m.rankColor }}>{m.rank}</span>
                        </div>
                        <div className="text-center shrink-0">
                          <GameBadge game={m.game} />
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[0.62rem] text-[#5A5248]">Joined</div>
                          <div className="font-['Space_Mono',monospace] text-[0.65rem] text-[#9A8F78]">{m.joinDate}</div>
                        </div>
                        <div className={`shrink-0 text-[0.6rem] font-bold tracking-[0.08em] uppercase w-14 text-right
                          ${m.status === 'online' ? 'text-[#6DD18A]' : m.status === 'busy' ? 'text-[#E05C7A]' : m.status === 'away' ? 'text-[#C8A96E]' : 'text-[#3A3530]'}`}>
                          {m.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Rules + Quick Actions */}
              <div>
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
                  <WidgetTitle>Aturan Grup</WidgetTitle>
                  {groupData.rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="w-[22px] h-[22px] shrink-0 flex items-center justify-center font-['Space_Mono',monospace] text-[0.6rem] text-[#C8A96E] border border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.06)]" style={clipBadge}>
                        {i + 1}
                      </div>
                      <span className="text-[0.78rem] text-[#9A8F78] leading-[1.5]">{r}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                  <WidgetTitle>Aksi Cepat</WidgetTitle>
                  <div className="space-y-2">
                    {[
                      { label: '+ Buat Thread Baru', color: '#C8A96E', bg: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', dark: true },
                      { label: '🔔 Ikuti Grup',      color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)', dark: false },
                      { label: '🔖 Simpan Thread',   color: '#A855F7', bg: 'rgba(168,85,247,0.08)', dark: false },
                      { label: '📤 Bagikan Thread',  color: '#9A8F78', bg: 'rgba(154,143,120,0.06)', dark: false },
                    ].map((a, i) => (
                      <button key={i}
                        className={`w-full py-[9px] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none`}
                        style={{
                          background: a.bg,
                          color: a.dark ? '#050810' : a.color,
                          border: a.dark ? 'none' : `1px solid ${a.color}40`,
                          ...clipBtn,
                        }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>);
const HexIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>);
const HexDotIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>);
const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>);
const DiamondIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>);
const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>);
const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const InfoIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>);