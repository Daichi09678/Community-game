'use client';

import { useState, useRef } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

// ─── CLIP PATHS ───────────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }   as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }       as React.CSSProperties;
const clipCard   = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }   as React.CSSProperties;

// ─── GAME CONFIG ──────────────────────────────────────────────────────────────

const gameBadgeMap: Record<string, { label: string; className: string; color: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',   color: '#4ECDC4' },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]',  color: '#6DD18A' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]',   color: '#A855F7' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]',   color: '#E05C7A' },
};

// ─── BACKGROUND OPTIONS ───────────────────────────────────────────────────────

const bgOptions = [
  { id: 'default',   label: 'Astral Night',  style: { background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(123,79,166,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(78,205,196,0.1) 0%, transparent 50%), #050810' } },
  { id: 'xianzhou',  label: 'Xianzhou Glow', style: { background: 'radial-gradient(ellipse 70% 50% at 40% 30%, rgba(200,169,110,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 70% 70%, rgba(78,205,196,0.08) 0%, transparent 50%), #070910' } },
  { id: 'natlan',    label: 'Natlan Ember',  style: { background: 'radial-gradient(ellipse 80% 50% at 30% 40%, rgba(224,92,50,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(200,100,60,0.1) 0%, transparent 50%), #080608' } },
  { id: 'penacony',  label: 'Penacony Dream',style: { background: 'radial-gradient(ellipse 90% 60% at 60% 30%, rgba(180,120,255,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(100,80,200,0.1) 0%, transparent 50%), #060510' } },
  { id: 'fontaine',  label: 'Fontaine Blue', style: { background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(60,140,220,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(80,180,255,0.08) 0%, transparent 50%), #050A12' } },
  { id: 'hollow',    label: 'Hollow Static', style: { background: 'repeating-linear-gradient(0deg, rgba(168,85,247,0.03) 0px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, rgba(168,85,247,0.02) 0px, transparent 2px, transparent 40px), radial-gradient(ellipse 80% 60% at 50% 30%, rgba(168,85,247,0.12) 0%, transparent 60%), #050508' } },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

const achievements = [
  { id: 'A001', icon: '⬡', label: 'Trailblazer',   desc: 'Posted 10+ reports',      unlocked: true,  game: 'hsr' },
  { id: 'A002', icon: '★', label: 'Star Witness',   desc: 'Received 1000 total votes', unlocked: true, game: 'gi'  },
  { id: 'A003', icon: '◈', label: 'Lore Keeper',    desc: 'Tagged 50+ quests',       unlocked: true,  game: 'hsr' },
  { id: 'A004', icon: '⬟', label: 'Hollow Diver',   desc: 'ZZZ guide master',        unlocked: true,  game: 'zzz' },
  { id: 'A005', icon: '✦', label: 'Archon\'s Eye',  desc: '500+ upvotes on one post',unlocked: false, game: 'gi'  },
  { id: 'A006', icon: '◉', label: 'Signal Hunter',  desc: 'Find 5 hidden quests',    unlocked: false, game: 'zzz' },
];

// ─── RECENT REPORTS ───────────────────────────────────────────────────────────

const recentReports = [
  { id: 'MQ001', title: 'Where the Stairway Leads', game: 'hsr', votes: 521, type: 'Main Quest',    date: '2h ago',  status: 'complete' },
  { id: 'MQ005', title: 'Chasca Hangout — Winds of the Past', game: 'gi', votes: 298, type: 'Hangout', date: '1h ago', status: 'complete' },
  { id: 'SM003', title: 'Hollow Zero — District 7 Secret', game: 'zzz', votes: 334, type: 'Side Mission', date: '2h ago', status: 'complete' },
  { id: 'MQ003', title: 'Robin & The Harmony of Stars', game: 'hsr', votes: 489, type: 'Companion', date: '4h ago', status: 'complete' },
  { id: 'SM007', title: 'Xianzhou Rare Monster Hunt Chain', game: 'hsr', votes: 221, type: 'Exploration', date: '5h ago', status: 'complete' },
];

// ─── GAME STATS ───────────────────────────────────────────────────────────────

const gameStats: { game: GameKey; label: string; reports: number; votes: number }[] = [
  { game: 'hsr', label: 'Honkai: Star Rail', reports: 24, votes: 1631 },
  { game: 'gi',  label: 'Genshin Impact',    reports: 14, votes: 852  },
  { game: 'zzz', label: 'Zenless Zone Zero', reports: 8,  votes: 477  },
  { game: 'hi3', label: 'Honkai Impact 3rd', reports: 2,  votes: 92   },
];

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
        ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
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
    ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = (<>{active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}{children}</>);
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

const renderStars = (r: number) => '★'.repeat(r) + '☆'.repeat(5 - r);

// ─── EDITABLE FIELD ───────────────────────────────────────────────────────────

function EditableText({
  value, onChange, isEditing, className, placeholder, multiline,
}: {
  value: string; onChange: (v: string) => void; isEditing: boolean;
  className?: string; placeholder?: string; multiline?: boolean;
}) {
  if (!isEditing) return <span className={className}>{value || placeholder}</span>;
  if (multiline) return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.3)] outline-none px-2 py-1 resize-none w-full ${className}`}
    />
  );
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.3)] outline-none px-2 py-1 w-full ${className}`}
    />
  );
}

// ─── AVATAR EDITOR (with photo upload) ────────────────────────────────────────

function AvatarEditor({ initials, color, isEditing, onInitialsChange, onColorChange, photoUrl, onPhotoChange }: {
  initials: string; color: string; isEditing: boolean;
  onInitialsChange: (v: string) => void; onColorChange: (v: string) => void;
  photoUrl: string | null; onPhotoChange: (url: string | null) => void;
}) {
  const colors = ['#C8A96E', '#4ECDC4', '#6DD18A', '#A855F7', '#E05C7A', '#F59E0B', '#60A5FA'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative">
      {/* Outer hex ring */}
      <div className="w-28 h-28 relative">
        <svg viewBox="0 0 112 112" className="absolute inset-0 w-full h-full">
          <polygon points="56,4 104,28 104,84 56,108 8,84 8,28"
            fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
          <polygon points="56,10 98,32 98,80 56,102 14,80 14,32"
            fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
        </svg>
        {/* Avatar circle - either photo or initials */}
        <div className="absolute inset-4 rounded-full flex items-center justify-center font-['Cinzel',serif] text-[1.5rem] font-bold border-2 overflow-hidden"
          style={{ background: photoUrl ? `url(${photoUrl}) center/cover` : `radial-gradient(circle at 40% 40%, ${color}22, ${color}08)`, borderColor: color, color }}>
          {!photoUrl && (initials.slice(0, 2).toUpperCase() || 'TB')}
        </div>
        {/* Glow */}
        <div className="absolute inset-4 rounded-full pointer-events-none" style={{ boxShadow: `0 0 20px ${color}33` }} />
      </div>

      {/* Edit controls */}
      {isEditing && (
        <div className="absolute -right-2 -bottom-2">
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.3)] p-2" style={clipWidget}>
            {/* Photo upload section */}
            <div className="mb-2 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="block text-[0.65rem] text-[#C8A96E] border border-[rgba(200,169,110,0.3)] px-2 py-1 mb-1 cursor-pointer hover:bg-[rgba(200,169,110,0.1)] transition-all duration-200"
                style={clipBadge}
              >
                📷 Upload Photo
              </label>
              {photoUrl && (
                <button
                  onClick={removePhoto}
                  className="text-[0.6rem] text-[#E05C7A] border border-[rgba(224,92,122,0.3)] px-2 py-1 mb-2 cursor-pointer hover:bg-[rgba(224,92,122,0.1)] transition-all duration-200"
                  style={clipBadge}
                >
                  ✕ Remove Photo
                </button>
              )}
            </div>
            
            {/* Initials input (fallback) */}
            <input
              type="text"
              value={initials}
              maxLength={2}
              onChange={e => onInitialsChange(e.target.value)}
              placeholder="Initials"
              className="w-full bg-transparent border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-center text-[0.7rem] font-['Cinzel',serif] outline-none px-1 py-[2px] mb-2"
            />
            
            {/* Color picker */}
            <div className="flex gap-1 flex-wrap justify-center">
              {colors.map(c => (
                <button key={c} onClick={() => onColorChange(c)}
                  className="w-4 h-4 rounded-full border-none cursor-pointer transition-transform hover:scale-110"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BACKGROUND PICKER ────────────────────────────────────────────────────────

function BgPicker({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
      <WidgetTitle>Background Theme</WidgetTitle>
      <div className="grid grid-cols-3 gap-2">
        {bgOptions.map(bg => (
          <button key={bg.id} onClick={() => onChange(bg.id)}
            className={`relative h-14 border cursor-pointer transition-all duration-200 overflow-hidden text-[0.58rem] font-['Space_Mono',monospace] flex items-end pb-[5px] px-[5px]
              ${current === bg.id ? 'border-[#C8A96E] text-[#C8A96E]' : 'border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)]'}`}
            style={{ ...bg.style, clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
          >
            <span className="relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {bg.label}
            </span>
            {current === bg.id && (
              <span className="absolute top-1 right-1 text-[#C8A96E] text-[0.7rem]">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FAVORITE GAME BADGE SELECTOR ─────────────────────────────────────────────

function FavoriteGameSelector({ selected, onChange, isEditing }: {
  selected: GameKey[]; onChange: (v: GameKey[]) => void; isEditing: boolean;
}) {
  const games: GameKey[] = ['hsr', 'gi', 'zzz', 'hi3'];
  const toggle = (g: GameKey) => {
    if (selected.includes(g)) onChange(selected.filter(x => x !== g));
    else onChange([...selected, g]);
  };
  if (!isEditing) return (
    <div className="flex gap-2 flex-wrap">
      {selected.map(g => <GameBadge key={g} game={g} />)}
    </div>
  );
  return (
    <div className="flex gap-2 flex-wrap">
      {games.map(g => {
        const info = gameBadgeMap[g];
        const active = selected.includes(g);
        return (
          <button key={g} onClick={() => toggle(g)} style={clipBadge}
            className={`px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all border
              ${active ? info.className : 'bg-transparent border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)]'}`}>
            {active ? '✓ ' : '+ '}{info.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── PROFILE BANNER ───────────────────────────────────────────────────────────

function ProfileBanner({ bgId, isEditing, onBgChange }: {
  bgId: string; isEditing: boolean; onBgChange: (id: string) => void;
}) {
  const bg = bgOptions.find(b => b.id === bgId) || bgOptions[0];

  return (
    <div className="relative h-44 overflow-hidden border-b border-[rgba(200,169,110,0.15)]" style={bg.style}>
      {/* Hex grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexBanner" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#C8A96E" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexBanner)" />
      </svg>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              background: '#C8A96E', opacity: 0.3 + (i % 3) * 0.1,
              left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 18}%`,
              animation: `float-${i % 3} ${3 + i}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      {/* Version label */}
      <div className="absolute top-4 right-5 font-['Space_Mono',monospace] text-[0.6rem] text-[#5A5248]">
        v3.2 · Season Active
      </div>

      {/* Edit BG hint */}
      {isEditing && (
        <div className="absolute top-4 left-4">
          <div className="text-[0.6rem] font-['Space_Mono',monospace] text-[#C8A96E] bg-[rgba(5,8,16,0.6)] px-2 py-1 border border-[rgba(200,169,110,0.2)]" style={clipBadge}>
            ✎ Edit background below
          </div>
        </div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: 'linear-gradient(to bottom, transparent, #0C1220)' }} />
    </div>
  );
}

// ─── REPORT ROW ───────────────────────────────────────────────────────────────

function ReportRow({ report }: { report: typeof recentReports[0] }) {
  return (
    <div className="flex items-center gap-4 p-3 border-b border-[rgba(200,169,110,0.07)] hover:bg-[rgba(200,169,110,0.03)] transition-all duration-200 cursor-pointer group">
      <div className="font-['Space_Mono',monospace] text-[0.58rem] text-[#5A5248] shrink-0 w-12">{report.id}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.82rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-200 truncate font-['Rajdhani',sans-serif]">
          {report.title}
        </div>
        <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{report.type}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <GameBadge game={report.game} />
        <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {report.votes}</span>
        <span className="text-[#5A5248] text-[0.62rem] font-['Space_Mono',monospace]">{report.date}</span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const [isEditing, setIsEditing]       = useState(false);
  const [bgId, setBgId]                 = useState('default');
  const [initials, setInitials]         = useState('TB');
  const [avatarColor, setAvatarColor]   = useState('#C8A96E');
  const [avatarPhoto, setAvatarPhoto]   = useState<string | null>(null);
  const [username, setUsername]         = useState('Trailblazer_01');
  const [title, setTitle]               = useState('Astral Chronicler');
  const [bio, setBio]                   = useState('Dedicated lore hunter across the cosmos and Teyvat alike. Main: Honkai Star Rail & Genshin. I write detailed quest guides so no Trailblazer gets lost.');
  const [location, setLocation]         = useState('Xianzhou Luofu, Cloud Sea');
  const [favGames, setFavGames]         = useState<GameKey[]>(['hsr', 'gi']);

  const totalVotes   = gameStats.reduce((a, s) => a + s.votes, 0);
  const totalReports = gameStats.reduce((a, s) => a + s.reports, 0);
  const maxReports   = Math.max(...gameStats.map(s => s.reports));

  const currentBg = bgOptions.find(b => b.id === bgId) || bgOptions[0];

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Dynamic BG Gradient from selected theme */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-700" style={currentBg.style} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'rgba(5,8,16,0.7)' }} />

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="#" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
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
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports <NavBadge>1.2K</NavBadge></NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission-quest" active={false}><HexDotIcon /> Mission &amp; Quest <NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal <NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles <NavBadge>324</NavBadge></NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem active={true}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] font-bold shrink-0 transition-all duration-300 overflow-hidden"
              style={{ borderColor: avatarColor, color: avatarColor, background: avatarPhoto ? `url(${avatarPhoto}) center/cover` : `${avatarColor}15` }}>
              {!avatarPhoto && (initials.slice(0, 2).toUpperCase() || 'TB')}
            </div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{username}</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · {totalReports} reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">

        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">My Profile</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Manage your identity across the Hoyoverse Hub</div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)}
                  className="px-[14px] py-2 font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:border-[#C8A96E] hover:text-[#C8A96E] transition-all duration-200 bg-transparent"
                  style={clipBtn}>
                  ✕ Cancel
                </button>
                <button onClick={() => setIsEditing(false)}
                  className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
                  style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                  ✓ Save Profile
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
                style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                ✎ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          <div className="grid grid-cols-[1fr_300px] gap-6 max-[1100px]:grid-cols-1">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-5">

              {/* Profile Card */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipCard}>
                {/* Banner */}
                <ProfileBanner bgId={bgId} isEditing={isEditing} onBgChange={setBgId} />

                {/* Profile Info */}
                <div className="px-6 pb-6 relative">
                  {/* Avatar positioned over banner */}
                  <div className="flex items-end gap-5 -mt-14 mb-4">
                    <AvatarEditor
                      initials={initials} color={avatarColor} isEditing={isEditing}
                      onInitialsChange={setInitials} onColorChange={setAvatarColor}
                      photoUrl={avatarPhoto} onPhotoChange={setAvatarPhoto}
                    />
                    <div className="mb-2 flex-1">
                      {/* Username */}
                      <EditableText
                        value={username} onChange={setUsername} isEditing={isEditing}
                        placeholder="Your username"
                        className="font-['Cinzel',serif] text-[1.1rem] font-bold text-[#E8E0CC] block"
                      />
                      {/* Title */}
                      <EditableText
                        value={title} onChange={setTitle} isEditing={isEditing}
                        placeholder="Your title"
                        className={`text-[0.72rem] font-['Space_Mono',monospace] block mt-1 transition-colors`}
                        // color dynamic via inline trick
                      />
                      <style>{`.profil-title { color: ${avatarColor}; }`}</style>
                      {!isEditing && <div className="text-[0.72rem] font-['Space_Mono',monospace] mt-1" style={{ color: avatarColor }}>{title}</div>}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="5" r="2.5" stroke="#5A5248" strokeWidth="1"/>
                      <path d="M6 1 C3.5 1 1.5 3 1.5 5 C1.5 7.5 6 11 6 11 C6 11 10.5 7.5 10.5 5 C10.5 3 8.5 1 6 1Z" stroke="#5A5248" strokeWidth="1" fill="none"/>
                    </svg>
                    <EditableText
                      value={location} onChange={setLocation} isEditing={isEditing}
                      placeholder="Location"
                      className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]"
                    />
                  </div>

                  {/* Favorite Games */}
                  <div className="mb-4">
                    <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">
                      Favorite Games {isEditing && <span className="text-[#C8A96E]">(click to toggle)</span>}
                    </div>
                    <FavoriteGameSelector selected={favGames} onChange={setFavGames} isEditing={isEditing} />
                  </div>

                  {/* Bio */}
                  <div>
                    <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Bio</div>
                    <EditableText
                      value={bio} onChange={setBio} isEditing={isEditing}
                      placeholder="Write something about yourself..."
                      multiline
                      className="text-[0.8rem] text-[#9A8F78] leading-relaxed"
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.2)] to-transparent mt-5 mb-5" />

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Reports',  value: totalReports, color: '#C8A96E' },
                      { label: 'Votes',    value: totalVotes,   color: '#4ECDC4' },
                      { label: 'Rank',     value: '#12',        color: '#A855F7' },
                      { label: 'Joined',   value: '90d',        color: '#6DD18A' },
                    ].map((s, i) => (
                      <div key={i} className="text-center p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.07)]" style={clipBadge}>
                        <div className="font-['Space_Mono',monospace] text-[1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[0.58rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={clipCard}>
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <WidgetTitle>Recent Reports</WidgetTitle>
                  <span className="text-[0.72rem] text-[#C8A96E] cursor-pointer hover:text-[#F0D080] transition-colors duration-200 font-semibold">View all →</span>
                </div>
                <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.2)] to-transparent mx-5 mb-1" />
                {recentReports.map(r => <ReportRow key={r.id} report={r} />)}
              </div>

              {/* Background Picker (only in edit mode) */}
              {isEditing && (
                <BgPicker current={bgId} onChange={setBgId} />
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-5">

              {/* Achievements */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <WidgetTitle>Achievements</WidgetTitle>
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map(a => {
                    const gInfo = gameBadgeMap[a.game];
                    return (
                      <div key={a.id}
                        className={`p-3 border transition-all duration-200 cursor-default relative overflow-hidden
                          ${a.unlocked
                            ? 'border-[rgba(200,169,110,0.2)] bg-[rgba(200,169,110,0.04)] hover:border-[rgba(200,169,110,0.4)]'
                            : 'border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] opacity-50'}`}
                        style={clipBadge}
                      >
                        {a.unlocked && (
                          <div className="absolute top-0 right-0 w-8 h-8 opacity-10"
                            style={{ background: `radial-gradient(circle at 100% 0%, ${gInfo.color}, transparent)` }} />
                        )}
                        <div className="text-[1rem] mb-1" style={{ color: a.unlocked ? gInfo.color : '#5A5248' }}>{a.icon}</div>
                        <div className="text-[0.7rem] font-semibold font-['Rajdhani',sans-serif] text-[#E8E0CC] leading-tight">{a.label}</div>
                        <div className="text-[0.58rem] text-[#5A5248] mt-[2px] leading-tight">{a.desc}</div>
                        {a.unlocked && (
                          <div className="mt-[5px]">
                            <GameBadge game={a.game} />
                          </div>
                        )}
                        {!a.unlocked && (
                          <div className="mt-[5px] text-[0.58rem] text-[#5A5248] font-['Space_Mono',monospace]">🔒 Locked</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Game Breakdown */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <WidgetTitle>Game Breakdown</WidgetTitle>
                {gameStats.map(g => {
                  const info = gameBadgeMap[g.game];
                  const pct = Math.round((g.reports / maxReports) * 100);
                  return (
                    <div key={g.game} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-[6px]">
                        <div className="flex items-center gap-2">
                          <GameBadge game={g.game} />
                          <span className="text-[0.7rem] text-[#9A8F78]">{g.reports} reports</span>
                        </div>
                        <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {g.votes}</span>
                      </div>
                      <div className="h-[3px] bg-[rgba(255,255,255,0.05)] overflow-hidden">
                        <div className="h-full transition-all duration-700 ease-in-out"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${info.color}88, ${info.color})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contribution Heatmap */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <WidgetTitle>Activity — Last 12 Weeks</WidgetTitle>
                <div className="flex gap-[3px] flex-wrap">
                  {[...Array(84)].map((_, i) => {
                    const level = [0,0,0,1,0,2,0,1,3,0,0,2,1,0,3,4,2,0,1,0,0,2,1,3,0,1,0,0,3,2,1,0,2,0,4,1,0,2,3,0,1,0,2,1,0,3,2,1,0,4,2,0,1,3,0,2,1,0,0,3,2,1,4,0,2,3,1,0,2,4,3,1,2,0,3,2,1,4,2,3,1,0,2,3][i] || 0;
                    const opacity = level === 0 ? 0.05 : level === 1 ? 0.2 : level === 2 ? 0.45 : level === 3 ? 0.7 : 1;
                    return (
                      <div key={i}
                        className="w-[9px] h-[9px] transition-all duration-200 hover:scale-125 cursor-default"
                        style={{ background: `rgba(200,169,110,${opacity})`, clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}
                        title={`Day ${i + 1}: ${level} reports`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-[0.58rem] text-[#5A5248]">Less</span>
                  {[0.05, 0.2, 0.45, 0.7, 1].map((o, i) => (
                    <div key={i} className="w-[9px] h-[9px]"
                      style={{ background: `rgba(200,169,110,${o})`, clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }} />
                  ))}
                  <span className="text-[0.58rem] text-[#5A5248]">More</span>
                </div>
              </div>

              {/* Share Profile CTA */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute inset-0 opacity-5"
                  style={{ background: 'radial-gradient(ellipse at 80% 20%, #C8A96E, transparent 60%)' }} />
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-2">Share Your Profile</div>
                <p className="text-[0.72rem] text-[#5A5248] leading-relaxed mb-4">
                  Invite fellow Trailblazers to your guide collection.
                </p>
                <button
                  className="w-full py-[8px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer hover:brightness-110 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipHexSm }}>
                  ⬡ Copy Profile Link
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');

        @keyframes float-0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes float-1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        @keyframes float-2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-11px); } }
      `}</style>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const GridIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>;
const HexIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>;
const HexDotIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>;
const CalendarIcon= () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>;
const DiamondIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>;
const UsersIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PersonIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const InfoIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>;