'use client';

export function SettingsRow({ label, desc, children, danger }: {
  label: string; desc?: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 border-b border-[rgba(200,169,110,0.06)] last:border-0 
      ${danger ? 'hover:bg-[rgba(224,92,122,0.02)]' : 'hover:bg-[rgba(200,169,110,0.02)]'} -mx-5 px-5 transition-all duration-200`}>
      <div className="flex-1">
        <div className={`text-[0.85rem] font-semibold font-['Rajdhani',sans-serif] ${danger ? 'text-[#E05C7A]' : 'text-[#E8E0CC]'}`}>{label}</div>
        {desc && <div className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px] leading-relaxed">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}