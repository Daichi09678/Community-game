'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' } as React.CSSProperties;

// Icons
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

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="13" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M6 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

interface AdminSidebarProps {
  activePage?: string;
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const pathname = usePathname();
  
  const isActive = (pageId: string) => {
    if (activePage) return activePage === pageId;
    return pathname?.includes(pageId);
  };

  const navItemCls = (id: string) =>
    `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em] 
     transition-all duration-200 cursor-pointer mb-[2px] relative font-['Rajdhani',sans-serif]
     ${isActive(id)
       ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
       : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;

  const NavGroup = ({ label }: { label: string }) => (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {label}
    </div>
  );

  return (
    <aside
      className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto"
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
        <Link href="/HoyoAdmin/dashboard-admin" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
          </svg>
          HoyoAdmin
        </Link>
        <div
          className="mt-2 text-[0.6rem] font-['Space_Mono',monospace] tracking-[0.15em] px-2 py-[3px] border inline-block"
          style={{ ...clipBadge, color: '#E05C7A', borderColor: 'rgba(224,92,122,0.4)', background: 'rgba(224,92,122,0.08)' }}
        >
          ● ADMIN ACCESS
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <NavGroup label="Overview" />
        <Link href="/HoyoAdmin/dashboard-admin" className={navItemCls('dashboard')} style={clipHex}>
          {isActive('dashboard') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
          <span className="w-4 h-4 shrink-0"><GridIcon /></span>
          <span className="flex-1">Dashboard</span>
        </Link>

        <NavGroup label="Management" />
        <Link href="/HoyoAdmin/all-reports" className={navItemCls('all-reports')} style={clipHex}>
          {isActive('all-reports') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
          <span className="w-4 h-4 shrink-0"><HexIcon /></span>
          <span className="flex-1">All Reports</span>
        </Link>
        <Link href="/HoyoAdmin/grub-accept" className={navItemCls('grub-accept')} style={clipHex}>
          {isActive('grub-accept') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
          <span className="w-4 h-4 shrink-0"><CheckCircleIcon /></span>
          <span className="flex-1">Grub Accept</span>
        </Link>

        <NavGroup label="Account" />
        <Link href="/HoyoAdmin/profile" className={navItemCls('profile')} style={clipHex}>
          {isActive('profile') && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
          <span className="w-4 h-4 shrink-0"><PersonIcon /></span>
          <span className="flex-1">Admin Profile</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
        <Link href="/UserHoyo/dashboard" className="flex items-center gap-[10px] no-underline group">
          <div
            className="w-9 h-9 rounded-full border border-[#E05C7A] bg-[rgba(224,92,122,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] text-[#E05C7A] font-bold shrink-0"
          >
            AD
          </div>
          <div className="flex-1">
            <div className="text-[0.85rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors">
              Admin
            </div>
            <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">admin@hoyohub.io</div>
          </div>
          <button className="text-[#5A5248] hover:text-[#E05C7A] transition-colors">
            <LogoutIcon />
          </button>
        </Link>
      </div>
    </aside>
  );
}