import { clipHex } from '@/components/utils/styles';

export function NavItem({
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