'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clipHex } from './clipStyles';

export function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

export function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
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
  badge?: string | number;
  isNew?: boolean;
  active?: boolean;
}

export function NavItem({ href, icon, label, badge, isNew, active }: NavItemProps) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : (href ? pathname === href : false);

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
      {badge !== undefined && badge !== null && badge !== 0 && (
        <NavBadge>{badge}</NavBadge>
      )}
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