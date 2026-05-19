import { NavGroupLabel, NavBadge, NavItem } from '@/components/common';
import { GridIcon, HexIcon, CalendarIcon, DiamondIcon, UsersIcon, StarIcon, PersonIcon, InfoIcon } from ".";

export function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
      {/* Header */}
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

      {/* Nav */}
      <nav className="flex-1 px-4 py-5">
        <NavGroupLabel>Main</NavGroupLabel>
        <NavItem active={true}><GridIcon /> Dashboard</NavItem>
        <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports<NavBadge>1.2K</NavBadge></NavItem>

        <NavGroupLabel>Category</NavGroupLabel>
        <NavItem href="/UserHoyo/mission&quest" active={false}><HexIcon /> Mission &amp; Quest<NavBadge>482</NavBadge></NavItem>
        <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal<NavBadge variant="new">New</NavBadge></NavItem>
        <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles<NavBadge>324</NavBadge></NavItem>

        <NavGroupLabel>Community</NavGroupLabel>
        <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
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
  );
}