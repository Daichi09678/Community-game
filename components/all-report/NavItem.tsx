export function NavItem({
  children,
  href,
  active,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  active: boolean;
  onClick?: () => void;
}) {
  const cls = `
    flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold tracking-[0.04em]
    transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    ${active
      ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]'
      : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'
    }
  `;
  const style: React.CSSProperties = {
    clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
  };

  const inner = (
    <>
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />
      )}
      {children}
    </>
  );

  if (href) {
    return <a href={href} className={cls} style={style}>{inner}</a>;
  }
  return <div className={cls} style={style} onClick={onClick}>{inner}</div>;
}