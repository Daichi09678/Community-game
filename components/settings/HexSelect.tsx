'use client';

import { clipBadge } from './clipStyles';

export function HexSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] cursor-pointer hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 appearance-none"
      style={clipBadge}
    >
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#0C1220]">{o.label}</option>)}
    </select>
  );
}