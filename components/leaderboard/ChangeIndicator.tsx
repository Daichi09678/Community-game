export function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#5A5248]">—</span>;
  if (change > 0) return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#6DD18A]">▲{change}</span>;
  return <span className="font-['Space_Mono',monospace] text-[0.62rem] text-[#E05C7A]">▼{Math.abs(change)}</span>;
}