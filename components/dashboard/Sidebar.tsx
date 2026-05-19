'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1"/>
    <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1"/>
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

// ─── CLIP-PATH STYLE OBJECTS ─────────────────────────────────────────────────

const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;

// ─── NAV HELPERS ─────────────────────────────────────────────────────────────

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

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isNew?: boolean;
}

function NavItem({ href, icon, label, badge, isNew }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold
    tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    font-['Rajdhani',sans-serif]
    ${isActive
      ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
      : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;

  const inner = (
    <>
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />
      )}
      <span className="w-4 h-4 shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <NavBadge>{badge}</NavBadge>}
      {isNew && <NavBadge variant="new">New</NavBadge>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={clipHex}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} style={clipHex}>
      {inner}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
        <div className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="8"    x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="17.5" x2="14" y2="20"   stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="8"  y1="14"   x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="17.5" y1="14" x2="20"   y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
          </svg>
          Hoyoverse Hub
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        {/* MAIN */}
        <NavGroupLabel>Main</NavGroupLabel>
        <NavItem href="/UserHoyo/dashboard" icon={<GridIcon />} label="Dashboard" />
        <NavItem href="/UserHoyo/all-report" icon={<HexIcon />} label="All Reports" badge="1.2K" />

        {/* CATEGORY */}
        <NavGroupLabel>Category</NavGroupLabel>
        <NavItem href="/UserHoyo/mission&quest" icon={<HexDotIcon />} label="Mission & Quest" badge="482" />
        <NavItem href="/UserHoyo/event" icon={<CalendarIcon />} label="Event Seasonal" isNew />
        <NavItem href="/UserHoyo/puzzle" icon={<DiamondIcon />} label="Puzzle & Riddles" badge="324" />

        {/* COMMUNITY */}
        <NavGroupLabel>Community</NavGroupLabel>
        <NavItem href="/UserHoyo/discussion" icon={<UsersIcon />} label="Discussion" />
        <NavItem href="/UserHoyo/leaderboard" icon={<StarIcon />} label="Leaderboard" />
        <NavItem href="/UserHoyo/profile" icon={<PersonIcon />} label="My Profile" />
        <NavItem href="/UserHoyo/settings" icon={<InfoIcon />} label="Settings" />
      </nav>

      {/* User Footer */}
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

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </aside>
  );
}