'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SidebarGroups } from './SidebarGroups';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const groupsData = [
  {
    id: 1,
    name: "Star Rail Council",
    game: "hsr",
    initials: "SR",
    description: "Diskusi mendalam soal lore, meta, dan guide Honkai: Star Rail. Dari Simulated Universe sampai story quest.",
    members: 1420,
    online: 84,
    threads: 312,
    tags: ["Meta", "Lore", "Guide"],
    isJoined: true,
    isOwner: false,
    createdAt: "Jan 2024",
    privacy: "public",
    channels: [
      { id: "general",     label: "# general",          unread: 3  },
      { id: "meta",        label: "# meta-discussion",  unread: 0  },
      { id: "guide",       label: "# guide-sharing",    unread: 12 },
      { id: "lore",        label: "# lore-theory",      unread: 0  },
      { id: "pulls",       label: "# pull-result",      unread: 1  },
    ],
    messages: [
      { author: "QuantumGale",    initials: "QG", game: "hsr", time: "14:32", text: "Baru clear MoC 12 pake Acheron + Sunday combo, damage-nya gila banget 😭", reactions: [{emoji:"🔥",count:8}] },
      { author: "Cocolia_Arc",    initials: "CA", game: "hsr", time: "14:35", text: "Serius? Aku masih struggle di node terakhir. Share build-nya dong!", reactions: [] },
      { author: "AstreaN_7",      initials: "AN", game: "hsr", time: "14:37", text: "Sunday emang broken untuk follow-up team. Coba pair sama Feixiao juga worth.", reactions: [{emoji:"⭐",count:5},{emoji:"💯",count:3}] },
      { author: "QuantumGale",    initials: "QG", game: "hsr", time: "14:40", text: "Nih screennya. Relic setup full Speed + Crit DMG untuk Acheron, Sunday full ER.", reactions: [{emoji:"🙏",count:11}] },
      { author: "PrismaticArc",   initials: "PA", game: "hsr", time: "14:41", text: "Lightcone-nya pake apa? Punya E0S1 atau free LC?", reactions: [] },
      { author: "QuantumGale",    initials: "QG", game: "hsr", time: "14:43", text: "Free LC masih bisa jalan kok asal relicnya bagus. Minimal 3200 ATK + 70/140 ratio.", reactions: [{emoji:"❤️",count:6}] },
      { author: "Cocolia_Arc",    initials: "CA", game: "hsr", time: "14:47", text: "Update: baru clear juga! Terima kasih banyak QG 🏆 Build-nya works banget!", reactions: [{emoji:"🎉",count:14},{emoji:"🔥",count:9}] },
    ],
    membersData: [
      { name: "Cocolia_Arc",    initials: "CA", game: "hsr", role: "owner",  status: "online",  joinDate: "Jan 2024" },
      { name: "QuantumGale",    initials: "QG", game: "hsr", role: "mod",    status: "online",  joinDate: "Jan 2024" },
      { name: "AstreaN_7",      initials: "AN", game: "hsr", role: "member", status: "online",  joinDate: "Feb 2024" },
      { name: "PrismaticArc",   initials: "PA", game: "hsr", role: "member", status: "away",    joinDate: "Mar 2024" },
      { name: "SilverWolf_Fan", initials: "SW", game: "gi",  role: "member", status: "offline", joinDate: "Apr 2024" },
      { name: "NovaSerpent",    initials: "NS", game: "gi",  role: "member", status: "offline", joinDate: "May 2024" },
      { name: "Trailblazer_01", initials: "TB", game: "hsr", role: "member", status: "online",  joinDate: "Jun 2024" },
    ],
  },
  {
    id: 2,
    name: "Teyvat Archives",
    game: "gi",
    initials: "TA",
    description: "Komunitas Genshin Impact Indonesia. Lore hunting, world quest guide, dan hidden achievement.",
    members: 2310,
    online: 126,
    threads: 541,
    tags: ["Lore", "Achievement", "World Quest"],
    isJoined: true,
    isOwner: false,
    createdAt: "Dec 2023",
    privacy: "public",
    channels: [
      { id: "general",   label: "# general",          unread: 7  },
      { id: "lore",      label: "# lore-discussion",  unread: 2  },
      { id: "guide",     label: "# guide-sharing",    unread: 0  },
      { id: "pull",      label: "# wish-result",      unread: 4  },
      { id: "help",      label: "# help-needed",      unread: 0  },
    ],
    messages: [
      { author: "SilverWolf_Fan", initials: "SW", game: "gi",  time: "13:10", text: "Baru selesai baca semua buku Liyue di library. Ada hidden lore soal Guizhong yang gak banyak orang tau nih.", reactions: [{emoji:"📖",count:15}] },
      { author: "VoidHunter_X",   initials: "VH", game: "gi",  time: "13:14", text: "Yang mana? Soal pactnya sama Zhongli? Atau yang soal Cornerstone Geo?", reactions: [] },
      { author: "SilverWolf_Fan", initials: "SW", game: "gi",  time: "13:16", text: "Soal warisan ilmu Guizhong ke Zhongli. Ada referensinya di buku Wangshu Inn lantai 2.", reactions: [{emoji:"🤯",count:9},{emoji:"❤️",count:7}] },
      { author: "NovaSerpent",    initials: "NS", game: "gi",  time: "13:20", text: "Wah beneran? Aku udah main sejak launch tapi gak pernah baca buku itu 😅", reactions: [{emoji:"😅",count:12}] },
    ],
    membersData: [
      { name: "SilverWolf_Fan", initials: "SW", game: "gi",  role: "owner",  status: "online",  joinDate: "Dec 2023" },
      { name: "VoidHunter_X",   initials: "VH", game: "gi",  role: "mod",    status: "online",  joinDate: "Dec 2023" },
      { name: "NovaSerpent",    initials: "NS", game: "gi",  role: "member", status: "online",  joinDate: "Jan 2024" },
      { name: "AstreaN_7",      initials: "AN", game: "hsr", role: "member", status: "away",    joinDate: "Feb 2024" },
      { name: "Trailblazer_01", initials: "TB", game: "hsr", role: "member", status: "online",  joinDate: "Mar 2024" },
    ],
  },
  {
    id: 3,
    name: "Hollow Operators",
    game: "zzz",
    initials: "HO",
    description: "Semua soal Zenless Zone Zero. Hollow Zero strategy, agent tier list, dan bangboo build.",
    members: 876,
    online: 43,
    threads: 198,
    tags: ["Strategy", "Tier List", "Bangboo"],
    isJoined: false,
    isOwner: false,
    createdAt: "Jul 2024",
    privacy: "public",
    channels: [
      { id: "general",  label: "# general",         unread: 0 },
      { id: "hollow",   label: "# hollow-zero",     unread: 0 },
      { id: "agents",   label: "# agent-builds",    unread: 0 },
      { id: "events",   label: "# event-guide",     unread: 0 },
    ],
    messages: [
      { author: "ImaginaryRift",  initials: "IR", game: "zzz", time: "12:00", text: "Patch 1.4 bawa perubahan besar di Hollow Zero mechanic. Ada yang udah coba District 7?", reactions: [{emoji:"👀",count:6}] },
      { author: "Mei_Stellaron",  initials: "MS", game: "zzz", time: "12:05", text: "Baru masuk tadi, enemy density-nya lebih padat. Recommend bawa Zhu Yuan untuk single target.", reactions: [{emoji:"💯",count:4}] },
    ],
    membersData: [
      { name: "ImaginaryRift",  initials: "IR", game: "zzz", role: "owner",  status: "online",  joinDate: "Jul 2024" },
      { name: "Mei_Stellaron",  initials: "MS", game: "zzz", role: "mod",    status: "away",    joinDate: "Jul 2024" },
      { name: "ZephyrBlade",    initials: "ZB", game: "zzz", role: "member", status: "offline", joinDate: "Aug 2024" },
    ],
  },
  {
    id: 4,
    name: "Valkyrie Order",
    game: "hi3",
    initials: "VO",
    description: "Komunitas Honkai Impact 3rd. Elysian Realm tips, battlesuit guide, dan lore manga discussion.",
    members: 634,
    online: 28,
    threads: 147,
    tags: ["Elysian Realm", "Battlesuit", "Manga Lore"],
    isJoined: true,
    isOwner: false,
    createdAt: "Nov 2023",
    privacy: "private",
    channels: [
      { id: "general",    label: "# general",         unread: 1 },
      { id: "er",         label: "# elysian-realm",   unread: 5 },
      { id: "battlesuit", label: "# battlesuit-meta", unread: 0 },
      { id: "manga",      label: "# manga-lore",      unread: 2 },
    ],
    messages: [
      { author: "TrailBossKai",  initials: "TK", game: "hi3", time: "11:20", text: "Ada yang tau cara optimize signet pick di ER Season 7 tanpa limited battlesuit?", reactions: [] },
      { author: "ElyseaCore",    initials: "EC", game: "hi3", time: "11:25", text: "Coba path Deepspace + Infinity combo. Aku clear S-rank pake Fu Hua kemarin.", reactions: [{emoji:"🙏",count:7}] },
    ],
    membersData: [
      { name: "TrailBossKai",   initials: "TK", game: "hi3", role: "owner",  status: "online",  joinDate: "Nov 2023" },
      { name: "ElyseaCore",     initials: "EC", game: "hi3", role: "mod",    status: "online",  joinDate: "Nov 2023" },
      { name: "Trailblazer_01", initials: "TB", game: "hsr", role: "member", status: "online",  joinDate: "Jan 2024" },
    ],
  },
];

const allUsersData = [
  { name: "QuantumGale",    initials: "QG", game: "hsr", level: 78 },
  { name: "SilverWolf_Fan", initials: "SW", game: "gi",  level: 74 },
  { name: "VoidHunter_X",   initials: "VH", game: "gi",  level: 71 },
  { name: "ImaginaryRift",  initials: "IR", game: "zzz", level: 65 },
  { name: "Mei_Stellaron",  initials: "MS", game: "zzz", level: 62 },
  { name: "NovaSerpent",    initials: "NS", game: "gi",  level: 57 },
  { name: "ElyseaCore",     initials: "EC", game: "hi3", level: 54 },
  { name: "PrismaticArc",   initials: "PA", game: "hsr", level: 52 },
  { name: "ZephyrBlade",    initials: "ZB", game: "zzz", level: 50 },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const gameAccentMap: Record<string, string> = {
  hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]  text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'  },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]  text-[#A855F7] border border-[rgba(168,85,247,0.3)]'  },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]  text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'  },
};

const statusDot: Record<string, string> = { online: 'bg-[#6DD18A]', away: 'bg-[#C8A96E]', offline: 'bg-[#3A3A4A]' };
const roleLabel: Record<string, { label: string; color: string }> = {
  owner:  { label: 'Owner',  color: 'text-[#F0D080]' },
  mod:    { label: 'Mod',    color: 'text-[#4ECDC4]' },
  member: { label: 'Member', color: 'text-[#5A5248]' },
};

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }           as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }           as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }           as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }    as React.CSSProperties;

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game]; if (!g) return null;
  return <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>{g.label}</span>;
}

// ─── INVITE MODAL ─────────────────────────────────────────────────────────────

function InviteModal({ group, onClose }: { group: typeof groupsData[0]; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [invited, setInvited] = useState<string[]>([]);
  const gc = gameAccentMap[group.game] ?? '#C8A96E';

  const alreadyMember = group.membersData.map(m => m.name);
  const available = allUsersData.filter(u =>
    !alreadyMember.includes(u.name) &&
    (u.name.toLowerCase().includes(query.toLowerCase()))
  );

  const toggle = (name: string) =>
    setInvited(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(5,8,16,0.85)] backdrop-blur-[4px]" />
      <div className="relative w-[460px] bg-[#0C1220] border border-[rgba(200,169,110,0.25)] p-6 z-10" style={clipWidget} onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: gc }} />
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-['Cinzel',serif] text-[0.95rem] font-semibold text-[#E8E0CC]">Invite ke Grup</div>
            <div className="text-[0.72rem] text-[#5A5248] mt-1">{group.name}</div>
          </div>
          <button onClick={onClose} className="text-[#5A5248] hover:text-[#E8E0CC] transition-colors bg-transparent border-none cursor-pointer text-[1.2rem] leading-none">✕</button>
        </div>
        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(200,169,110,0.15)] px-3 py-[8px] mb-4 focus-within:border-[#C8A96E] transition-colors" style={clipBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari username..." className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]" />
        </div>
        {invited.length > 0 && (
          <div className="flex flex-wrap gap-[5px] mb-4">
            {invited.map(name => (
              <span key={name} className="flex items-center gap-1 px-[10px] py-[3px] text-[0.72rem] font-semibold border cursor-pointer" style={{ color: gc, borderColor: `${gc}60`, background: `${gc}12`, ...clipBadge }} onClick={() => toggle(name)}>
                {name} <span className="opacity-60">✕</span>
              </span>
            ))}
          </div>
        )}
        <div className="max-h-[220px] overflow-y-auto pr-1 space-y-[4px] custom-scroll">
          {available.length === 0 ? (
            <div className="text-center py-6 text-[#5A5248] font-['Space_Mono',monospace] text-[0.75rem]">{query ? 'User tidak ditemukan.' : 'Semua user sudah menjadi member.'}</div>
          ) : available.map(u => {
            const ugc = gameAccentMap[u.game] ?? '#C8A96E';
            const isSelected = invited.includes(u.name);
            return (
              <div key={u.name} onClick={() => toggle(u.name)} className={`flex items-center gap-3 px-3 py-[10px] cursor-pointer transition-all duration-150 border ${isSelected ? 'border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.06)]' : 'border-transparent hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(200,169,110,0.1)]'}`} style={clipHex}>
                <div className="w-8 h-8 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] font-bold shrink-0" style={{ background: `${ugc}18`, borderColor: `${ugc}60`, color: ugc }}>{u.initials}</div>
                <div className="flex-1">
                  <div className="text-[0.82rem] text-[#E8E0CC] font-semibold">{u.name}</div>
                  <div className="text-[0.62rem] text-[#5A5248]">LV.{u.level} · {gameLabels[u.game]}</div>
                </div>
                <div className={`w-5 h-5 border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-[#C8A96E] bg-[rgba(200,169,110,0.2)]' : 'border-[rgba(200,169,110,0.2)]'}`} style={clipHexSm}>
                  {isSelected && <span className="text-[#C8A96E] text-[0.7rem]">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-5 pt-4 border-t border-[rgba(200,169,110,0.1)]">
          <button onClick={onClose} className="flex-1 py-[9px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.2)] text-[#9A8F78] bg-transparent hover:border-[rgba(200,169,110,0.4)] hover:text-[#E8E0CC] transition-all" style={clipBtn}>Batal</button>
          <button className={`flex-1 py-[9px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border-none transition-all ${invited.length > 0 ? 'text-[#050810] hover:brightness-110' : 'text-[#5A5248] cursor-not-allowed'}`} style={{ background: invited.length > 0 ? 'linear-gradient(135deg, #8B6A2E, #C8A96E)' : 'rgba(255,255,255,0.04)', ...clipBtn }}>
            Kirim Undangan {invited.length > 0 && `(${invited.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

function GroupDetailPanel({ group, onClose, onInvite }: { group: typeof groupsData[0]; onClose: () => void; onInvite: () => void; }) {
  const [memberSearch, setMemberSearch] = useState('');
  const gc = gameAccentMap[group.game] ?? '#C8A96E';
  const filtered = group.membersData.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()));
  const onlineCount = group.membersData.filter(m => m.status === 'online').length;

  return (
    <div className="w-[280px] shrink-0 bg-[#080E1A] border-l border-[rgba(200,169,110,0.12)] flex flex-col overflow-hidden" style={{ height: '100%' }}>
      <div className="px-4 py-4 border-b border-[rgba(200,169,110,0.12)] flex items-center justify-between shrink-0">
        <div className="font-['Cinzel',serif] text-[0.8rem] font-semibold text-[#E8E0CC]">Detail Grup</div>
        <button onClick={onClose} className="text-[#5A5248] hover:text-[#E8E0CC] transition-colors bg-transparent border-none cursor-pointer text-[0.9rem]">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="p-4 border-b border-[rgba(200,169,110,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-['Cinzel',serif] text-[0.85rem] font-bold shrink-0" style={{ background: `${gc}18`, borderColor: `${gc}80`, color: gc }}>{group.initials}</div>
            <div>
              <div className="font-['Cinzel',serif] text-[0.88rem] font-semibold text-[#E8E0CC]">{group.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <GameBadge game={group.game} />
                <span className="text-[0.6rem] text-[#5A5248] border border-[rgba(200,169,110,0.2)] px-[6px] py-[2px]" style={clipBadge}>{group.privacy === 'private' ? '🔒 Private' : '🌐 Public'}</span>
              </div>
            </div>
          </div>
          <p className="text-[0.72rem] text-[#5A5248] leading-[1.6] mb-3">{group.description}</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Members', val: group.members.toLocaleString(), color: gc },
              { label: 'Online',  val: group.online.toString(),        color: '#6DD18A' },
              { label: 'Threads', val: group.threads.toString(),       color: '#C8A96E' },
            ].map((s, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.08)] p-2 text-center" style={clipWidget}>
                <div className="font-['Space_Mono',monospace] text-[0.85rem] font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[0.55rem] uppercase tracking-[0.12em] text-[#5A5248] mt-[2px]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-[4px] mb-3">
            {group.tags.map((tag, i) => (
              <span key={i} className="px-[8px] py-[2px] text-[0.62rem] bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.12)] text-[#5A5248]" style={clipBadge}>#{tag}</span>
            ))}
          </div>
          <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">Dibuat: {group.createdAt}</div>
        </div>

        <div className="p-3 border-b border-[rgba(200,169,110,0.08)]">
          <button onClick={onInvite} className="w-full py-[8px] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#C8A96E] bg-transparent hover:bg-[rgba(200,169,110,0.08)] transition-all flex items-center justify-center gap-2" style={clipBtn}>
            <UsersIcon /> Invite Member
          </button>
        </div>

        <div className="p-4">
          <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-3">Anggota — {filtered.length}</div>
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.1)] px-3 py-[6px] mb-3 focus-within:border-[rgba(200,169,110,0.3)] transition-colors" style={clipBtn}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5.5" cy="5.5" r="3.5" stroke="#5A5248" strokeWidth="1.1"/>
              <line x1="8.5" y1="8.5" x2="11" y2="11" stroke="#5A5248" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Cari anggota..." className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.78rem] flex-1 placeholder-[#5A5248]" />
          </div>

          <div className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6DD18A] inline-block" /> Online — {onlineCount}
          </div>
          <div className="space-y-[2px] mb-4">
            {filtered.filter(m => m.status !== 'offline').map((m, i) => {
              const mgc = gameAccentMap[m.game] ?? '#C8A96E';
              const rl = roleLabel[m.role];
              return (
                <div key={i} className="flex items-center gap-[10px] px-2 py-[7px] cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors" style={clipHex}>
                  <div className="relative shrink-0">
                    <div className="w-[28px] h-[28px] rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.52rem] font-bold" style={{ background: `${mgc}18`, borderColor: `${mgc}60`, color: mgc }}>{m.initials}</div>
                    <span className={`absolute -bottom-[1px] -right-[1px] w-[7px] h-[7px] rounded-full border border-[#080E1A] ${statusDot[m.status]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.75rem] text-[#E8E0CC] truncate">{m.name}</div>
                  </div>
                  <span className={`text-[0.58rem] font-bold ${rl.color}`}>{rl.label}</span>
                </div>
              );
            })}
          </div>

          {filtered.filter(m => m.status === 'offline').length > 0 && (
            <>
              <div className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-[#5A5248] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3A3A4A] inline-block" /> Offline — {filtered.filter(m => m.status === 'offline').length}
              </div>
              <div className="space-y-[2px]">
                {filtered.filter(m => m.status === 'offline').map((m, i) => {
                  const mgc = gameAccentMap[m.game] ?? '#C8A96E';
                  const rl = roleLabel[m.role];
                  return (
                    <div key={i} className="flex items-center gap-[10px] px-2 py-[7px] cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors opacity-50" style={clipHex}>
                      <div className="relative shrink-0">
                        <div className="w-[28px] h-[28px] rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.52rem] font-bold" style={{ background: `${mgc}18`, borderColor: `${mgc}60`, color: mgc }}>{m.initials}</div>
                        <span className={`absolute -bottom-[1px] -right-[1px] w-[7px] h-[7px] rounded-full border border-[#080E1A] ${statusDot[m.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.75rem] text-[#E8E0CC] truncate">{m.name}</div>
                      </div>
                      <span className={`text-[0.58rem] font-bold ${rl.color}`}>{rl.label}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT AREA ────────────────────────────────────────────────────────────────

function ChatArea({ group, activeChannel, onToggleDetail }: { group: typeof groupsData[0]; activeChannel: string; onToggleDetail: () => void; }) {
  const [msg, setMsg] = useState('');
  const ch = group.channels.find(c => c.id === activeChannel);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(200,169,110,0.12)] bg-[rgba(5,8,16,0.6)] backdrop-blur-[6px] shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-['Space_Mono',monospace] text-[0.9rem] text-[#E8E0CC]">{ch?.label ?? '# channel'}</span>
          <span className="text-[#5A5248] text-[0.72rem]">·</span>
          <span className="text-[#5A5248] text-[0.72rem]">Diskusi {group.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[6px] text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">
            <span className="w-2 h-2 rounded-full bg-[#6DD18A] inline-block" />{group.online} online
          </div>
          <button onClick={onToggleDetail} className="flex items-center gap-[6px] px-3 py-[5px] font-['Rajdhani',sans-serif] text-[0.72rem] font-bold tracking-[0.08em] uppercase cursor-pointer border border-[rgba(200,169,110,0.2)] text-[#9A8F78] bg-transparent hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] transition-all" style={clipHexSm}>
            <InfoIcon small /> Detail Grup
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scroll">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.1)]" />
          <span className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-[#5A5248] font-['Space_Mono',monospace]">Hari ini</span>
          <div className="flex-1 h-[1px] bg-[rgba(200,169,110,0.1)]" />
        </div>
        {group.messages.map((m, i) => {
          const mgc = gameAccentMap[m.game] ?? '#C8A96E';
          const isMe = m.author === 'Trailblazer_01';
          return (
            <div key={i} className={`flex gap-3 group/msg ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.55rem] font-bold shrink-0 mt-1" style={{ background: `${mgc}18`, borderColor: `${mgc}60`, color: mgc }}>{m.initials}</div>
              <div className={`max-w-[68%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.72rem] font-bold" style={{ color: mgc }}>{m.author}</span>
                    <span className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">{m.time}</span>
                  </div>
                )}
                <div className={`px-4 py-[10px] text-[0.82rem] leading-[1.6] ${isMe ? 'bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.25)] text-[#E8E0CC]' : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(200,169,110,0.08)] text-[#C8C0B0]'}`} style={clipWidget}>
                  {m.text}
                </div>
                {m.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {m.reactions.map((r, ri) => (
                      <span key={ri} className="flex items-center gap-[3px] px-[8px] py-[2px] text-[0.65rem] bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.15)] cursor-pointer hover:bg-[rgba(200,169,110,0.12)] transition-all" style={clipBadge}>
                        {r.emoji} <span className="text-[#9A8F78] font-['Space_Mono',monospace]">{r.count}</span>
                      </span>
                    ))}
                  </div>
                )}
                {isMe && <span className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">{m.time}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-[rgba(200,169,110,0.12)] shrink-0">
        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(200,169,110,0.15)] px-3 py-[8px] focus-within:border-[rgba(200,169,110,0.4)] transition-colors" style={clipWidget}>
          <button className="text-[#5A5248] hover:text-[#C8A96E] transition-colors bg-transparent border-none cursor-pointer text-[0.9rem] shrink-0">＋</button>
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setMsg(''); }}
            placeholder={`Pesan di ${ch?.label ?? '#channel'}...`}
            className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button className="text-[#5A5248] hover:text-[#C8A96E] transition-colors bg-transparent border-none cursor-pointer text-[0.82rem]">😊</button>
            <button
              onClick={() => setMsg('')}
              className={`px-3 py-[4px] font-['Rajdhani',sans-serif] text-[0.72rem] font-bold tracking-[0.08em] uppercase cursor-pointer border-none transition-all ${msg.trim() ? 'text-[#050810] hover:brightness-110' : 'text-[#5A5248] cursor-default'}`}
              style={{ background: msg.trim() ? 'linear-gradient(135deg, #8B6A2E, #C8A96E)' : 'rgba(255,255,255,0.04)', ...clipBtn }}>
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GROUP SIDEBAR ────────────────────────────────────────────────────────────

function GroupSidebar({ group, activeChannel, onChannelSelect }: {
  group: typeof groupsData[0];
  activeChannel: string;
  onChannelSelect: (id: string) => void;
}) {
  const gc = gameAccentMap[group.game] ?? '#C8A96E';

  return (
    <div className="w-[220px] shrink-0 bg-[#0A1018] border-r border-[rgba(200,169,110,0.12)] flex flex-col overflow-hidden" style={{ height: '100%' }}>
      <div className="px-4 py-[14px] border-b border-[rgba(200,169,110,0.12)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] font-bold shrink-0" style={{ background: `${gc}18`, borderColor: `${gc}80`, color: gc }}>{group.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="font-['Cinzel',serif] text-[0.78rem] font-semibold text-[#E8E0CC] truncate">{group.name}</div>
            <div className="flex items-center gap-1 mt-[2px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#6DD18A] inline-block" />
              <span className="text-[0.6rem] text-[#5A5248]">{group.online} online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 py-3 px-3 overflow-hidden">
        <div className="text-[0.58rem] font-bold tracking-[0.16em] uppercase text-[#5A5248] px-2 mb-2">Channels</div>
        <div className="space-y-[2px]">
          {group.channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => onChannelSelect(ch.id)}
              className={`w-full flex items-center justify-between px-2 py-[7px] text-[0.78rem] cursor-pointer transition-all duration-150 border-none bg-transparent text-left font-['Rajdhani',sans-serif] font-semibold
                ${activeChannel === ch.id
                  ? 'bg-[rgba(200,169,110,0.1)] text-[#E8E0CC]'
                  : 'text-[#5A5248] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#9A8F78]'}`}
              style={clipHex}>
              <span className="truncate">{ch.label}</span>
              {ch.unread > 0 && (
                <span className="font-['Space_Mono',monospace] text-[0.58rem] px-[5px] py-[1px] bg-[rgba(200,169,110,0.15)] text-[#C8A96E] shrink-0 ml-1" style={clipBadge}>{ch.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GROUP RAIL ───────────────────────────────────────────────────────────────

function GroupRail({ groups, activeId, onSelect }: { groups: typeof groupsData; activeId: number; onSelect: (id: number) => void; }) {
  return (
    <div className="w-[68px] shrink-0 bg-[#070C14] border-r border-[rgba(200,169,110,0.1)] flex flex-col items-center py-3 gap-2 overflow-y-auto custom-scroll">
      {groups.map(g => {
        const gc = gameAccentMap[g.game] ?? '#C8A96E';
        const isActive = g.id === activeId;
        const totalUnread = g.channels.reduce((s, c) => s + c.unread, 0);
        return (
          <div key={g.id} className="relative group/grp" onClick={() => onSelect(g.id)}>
            <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1 rounded-r transition-all duration-200 ${isActive ? 'h-8 bg-[#C8A96E]' : 'h-2 bg-[#5A5248] opacity-0 group-hover/grp:opacity-100'}`} />
            <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] font-bold cursor-pointer transition-all duration-200 ${isActive ? 'rounded-xl' : 'hover:rounded-xl'}`}
              style={{ background: `${gc}18`, borderColor: isActive ? gc : `${gc}40`, color: gc }}>
              {g.initials}
            </div>
            {totalUnread > 0 && !isActive && (
              <div className="absolute -bottom-[2px] -right-[2px] min-w-[14px] h-[14px] rounded-full bg-[#E05C7A] flex items-center justify-center font-['Space_Mono',monospace] text-[0.5rem] text-white border border-[#070C14] px-[2px]">
                {totalUnread > 9 ? '9+' : totalUnread}
              </div>
            )}
            <div className="absolute left-[58px] top-1/2 -translate-y-1/2 bg-[#0C1220] border border-[rgba(200,169,110,0.2)] px-3 py-[6px] text-[0.72rem] text-[#E8E0CC] font-['Rajdhani',sans-serif] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover/grp:opacity-100 transition-opacity z-50" style={clipWidget}>
              {g.name}
            </div>
          </div>
        );
      })}
      <div className="w-8 h-[1px] bg-[rgba(200,169,110,0.15)] my-1" />
      <div
        className="w-11 h-11 rounded-full border-2 border-dashed border-[rgba(200,169,110,0.2)] flex items-center justify-center text-[#5A5248] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] cursor-pointer transition-all text-[1.2rem] hover:rounded-xl"
        title="Buat / Temukan Grup">
        +
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function GroupClient() {
  const searchParams = useSearchParams();
  const [activeGroupId, setActiveGroupId] = useState(groupsData[0].id);
  const [activeChannel, setActiveChannel] = useState(groupsData[0].channels[0].id);
  const [showDetail, setShowDetail] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const groupIdParam = searchParams.get('groupId');
    if (groupIdParam) {
      const groupId = parseInt(groupIdParam);
      const groupExists = groupsData.find(g => g.id === groupId);
      if (groupExists) {
        setActiveGroupId(groupId);
        const g = groupsData.find(x => x.id === groupId);
        if (g) setActiveChannel(g.channels[0].id);
      }
    }
  }, [searchParams]);

  const activeGroup = groupsData.find(g => g.id === activeGroupId) ?? groupsData[0];

  const handleGroupSelect = (id: number) => {
    setActiveGroupId(id);
    const g = groupsData.find(x => x.id === id);
    if (g) setActiveChannel(g.channels[0].id);
    setShowDetail(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
      }} />

      {/* ── MAIN NAV SIDEBAR ── */}
      <SidebarGroups />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 ml-[260px] flex flex-col overflow-hidden relative z-10 max-md:ml-0">

        {/* Topbar — dengan tombol back panah kiri */}
        <div className="flex items-center gap-4 px-8 py-4 border-b border-[rgba(200,169,110,0.15)] shrink-0 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}>
          
        {/* Tombol Back ke Discussion */}
<Link 
  href="/UserHoyo/discussion" 
  className="flex items-center gap-2 text-[#C8A96E] hover:text-[#EDD28A] transition-colors duration-200 font-['Rajdhani',sans-serif] text-[0.85rem] font-bold"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  <span className="hidden sm:inline">Back to Discussion</span>
</Link>

          {/* Separator */}
          <div className="w-px h-6 bg-[rgba(200,169,110,0.15)]" />

          {/* Title */}
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Hoyoverse Hub — Groups</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[1px] font-['Space_Mono',monospace]">
              {groupsData.filter(g => g.isJoined).length} grup diikuti
              <span className="mx-2 text-[#3A3530]">·</span>
              {activeGroup.name}
            </div>
          </div>
        </div>

        {/* Discord-like body */}
        <div className="flex flex-1 overflow-hidden">
          <GroupRail groups={groupsData} activeId={activeGroupId} onSelect={handleGroupSelect} />
          <GroupSidebar group={activeGroup} activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
          <ChatArea group={activeGroup} activeChannel={activeChannel} onToggleDetail={() => setShowDetail(p => !p)} />
          {showDetail && (
            <GroupDetailPanel
              group={activeGroup}
              onClose={() => setShowDetail(false)}
              onInvite={() => setShowInvite(true)}
            />
          )}
        </div>
      </main>

      {showInvite && <InviteModal group={activeGroup} onClose={() => setShowInvite(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space_Mono&display=swap');
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.15); border-radius: 2px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.3); }
      `}</style>
    </div>
  );
}

// ─── MISSING ICONS ────────────────────────────────────────────────────────────
const InfoIcon = ({ small }: { small?: boolean }) => (
  <svg width={small ? "13" : "16"} height={small ? "13" : "16"} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="0.7" fill="currentColor"/>
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

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail', gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};